import { NextResponse } from "next/server";
import { format, parseISO } from "date-fns";

const DISCOVERY_EVENTS = "https://app.ticketmaster.com/discovery/v2/events.json";

type TmVenue = {
  name?: string;
  city?: { name?: string };
  state?: { name?: string; stateCode?: string };
  country?: { name?: string; countryCode?: string };
  location?: { latitude?: string; longitude?: string };
};

type TmEvent = {
  id?: string;
  name?: string;
  url?: string;
  dates?: {
    start?: { localDate?: string; localTime?: string };
    timezone?: string;
  };
  classifications?: Array<{
    segment?: { name?: string };
    genre?: { name?: string };
  }>;
  priceRanges?: Array<{
    type?: string;
    currency?: string;
    min?: number;
    max?: number;
  }>;
  _embedded?: { venues?: TmVenue[] };
  info?: string;
};

function formatTime12h(localTime: string | undefined): string {
  if (!localTime) return "TBA";
  const parts = localTime.split(":");
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  if (Number.isNaN(h)) return "TBA";
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  const mm = Number.isNaN(m) ? "00" : String(m).padStart(2, "0");
  return `${hour12}:${mm} ${period}`;
}

function formatFee(priceRanges: TmEvent["priceRanges"]): string {
  const pr = priceRanges?.[0];
  if (!pr || (pr.min == null && pr.max == null)) return "See Ticketmaster";
  const cur = pr.currency ?? "";
  if (pr.min != null && pr.max != null) {
    if (pr.min === pr.max) return `${cur} ${pr.min}`;
    return `${cur} ${pr.min}–${pr.max}`;
  }
  if (pr.min != null) return `${cur} ${pr.min}+`;
  return `${cur} ${pr.max}`;
}

function mapEvent(event: TmEvent) {
  const venue = event._embedded?.venues?.[0];
  const city = venue?.city?.name;
  const state = venue?.state?.stateCode ?? venue?.state?.name;
  const country = venue?.country?.countryCode ?? venue?.country?.name;
  const location = [city, state, country].filter(Boolean).join(", ") || "TBA";

  const localDate = event.dates?.start?.localDate ?? "";
  const localTime = event.dates?.start?.localTime;

  let dateDisplay = localDate;
  try {
    if (localDate) dateDisplay = format(parseISO(localDate), "MMM d, yyyy");
  } catch {
    /* keep raw */
  }

  const loc = venue?.location;
  const lat = loc?.latitude != null ? parseFloat(String(loc.latitude)) : null;
  const lng = loc?.longitude != null ? parseFloat(String(loc.longitude)) : null;

  const primary = event.classifications?.find((c) => c.segment || c.genre);
  const typeLabel =
    primary?.genre?.name ?? primary?.segment?.name ?? "Live music";

  return {
    id: event.id ?? "",
    name: event.name ?? "Event",
    venue: venue?.name ?? "Venue TBA",
    dateDisplay,
    /** `YYYY-MM-DD` for `<input type="date" />` */
    dateIso: localDate,
    timeDisplay: formatTime12h(localTime),
    /** `HH:mm` for `<input type="time" />` */
    timeInput: localTime ? localTime.slice(0, 5) : "",
    location,
    fee: formatFee(event.priceRanges),
    latitude: Number.isFinite(lat) ? lat : null,
    longitude: Number.isFinite(lng) ? lng : null,
    ticketUrl: event.url ?? null,
    type: typeLabel,
    notes: event.info
      ? event.info.slice(0, 500) + (event.info.length > 500 ? "…" : "")
      : "",
  };
}

/**
 * Proxies [Ticketmaster Discovery Event Search](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#search-events-v2).
 * Requires `TICKETMASTER_API_KEY` in server env (never expose to the client).
 */
export async function GET(request: Request) {
  const apiKey = process.env.TICKETMASTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      configured: false as const,
      message:
        "Add TICKETMASTER_API_KEY to .env.local to search live events (get a key from developer.ticketmaster.com).",
      events: [] as ReturnType<typeof mapEvent>[],
    });
  }

  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.trim() ?? "";

  if (!keyword) {
    return NextResponse.json({
      configured: true as const,
      message: "Enter a keyword to search Ticketmaster events.",
      events: [] as ReturnType<typeof mapEvent>[],
    });
  }

  const size = Math.min(Math.max(Number(searchParams.get("size") || "10") || 10, 1), 50);
  const page = searchParams.get("page") ?? "0";
  const countryCode = searchParams.get("countryCode")?.trim();
  const city = searchParams.get("city")?.trim();
  const classificationName = searchParams.get("classificationName")?.trim() || "music";

  const params = new URLSearchParams({
    apikey: apiKey,
    keyword,
    size: String(size),
    page,
    sort: "date,asc",
    classificationName,
  });

  if (countryCode) params.set("countryCode", countryCode);
  if (city) params.set("city", city);

  let res: Response;
  try {
    res = await fetch(`${DISCOVERY_EVENTS}?${params.toString()}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
  } catch (e) {
    return NextResponse.json(
      {
        configured: true as const,
        error: e instanceof Error ? e.message : "Network error calling Ticketmaster",
        events: [] as ReturnType<typeof mapEvent>[],
      },
      { status: 502 }
    );
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const errBody = await res.json();
      detail =
        (errBody as { fault?: { faultstring?: string } })?.fault?.faultstring ??
        JSON.stringify(errBody).slice(0, 200);
    } catch {
      detail = (await res.text()).slice(0, 200);
    }
    return NextResponse.json(
      {
        configured: true as const,
        error: `Ticketmaster returned ${res.status}: ${detail}`,
        events: [] as ReturnType<typeof mapEvent>[],
      },
      { status: 502 }
    );
  }

  const data = (await res.json()) as {
    _embedded?: { events?: TmEvent[] };
    page?: { totalElements?: number; size?: number; number?: number };
  };
  const raw = data._embedded?.events ?? [];
  const events = raw.map(mapEvent);

  return NextResponse.json({
    configured: true as const,
    events,
    totalElements: data.page?.totalElements,
  });
}
