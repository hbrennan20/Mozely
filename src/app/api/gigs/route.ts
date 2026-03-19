import { NextResponse } from "next/server";

export type GigStatus = "confirmed" | "pending" | "inquiry" | "completed";

export interface Gig {
  id: number;
  venue: string;
  date: string;
  time: string;
  location: string;
  fee: string;
  status: GigStatus;
  type: string;
  notes: string;
  lng: number;
  lat: number;
}

let nextId = 100;

const gigs: Gig[] = [
  {
    id: 1,
    venue: "Ronnie Scott's",
    date: "Mar 15, 2026",
    time: "9:00 PM",
    location: "London, UK",
    fee: "£1,200",
    status: "confirmed",
    type: "Jazz Club",
    notes: "Full band setup. Soundcheck at 5 PM.",
    lng: -0.1318,
    lat: 51.5134,
  },
  {
    id: 2,
    venue: "The Jazz Cafe",
    date: "Mar 22, 2026",
    time: "8:30 PM",
    location: "London, UK",
    fee: "£800",
    status: "confirmed",
    type: "Jazz Club",
    notes: "Solo performance. Camden Town.",
    lng: -0.1427,
    lat: 51.5414,
  },
  {
    id: 3,
    venue: "KOKO",
    date: "Apr 2, 2026",
    time: "7:00 PM",
    location: "London, UK",
    fee: "£950",
    status: "pending",
    type: "Live Music Venue",
    notes: "Awaiting contract from venue.",
    lng: -0.1393,
    lat: 51.5341,
  },
  {
    id: 4,
    venue: "Field Day Festival",
    date: "Apr 18, 2026",
    time: "3:00 PM",
    location: "London, UK",
    fee: "£3,500",
    status: "inquiry",
    type: "Festival",
    notes: "Mozely sent inquiry. Waiting for response.",
    lng: -0.0553,
    lat: 51.5472,
  },
  {
    id: 5,
    venue: "PizzaExpress Live",
    date: "Feb 28, 2026",
    time: "8:00 PM",
    location: "London, UK",
    fee: "£1,000",
    status: "completed",
    type: "Jazz Club",
    notes: "Great show. Venue wants to rebook.",
    lng: -0.1246,
    lat: 51.5099,
  },
  {
    id: 6,
    venue: "Southbank Centre",
    date: "Feb 14, 2026",
    time: "5:00 PM",
    location: "London, UK",
    fee: "£2,000",
    status: "completed",
    type: "Concert Hall",
    notes: "Paid in full.",
    lng: -0.1167,
    lat: 51.5069,
  },
  {
    id: 7,
    venue: "The Vortex Jazz Club",
    date: "May 1, 2026",
    time: "9:00 PM",
    location: "London, UK",
    fee: "£1,100",
    status: "confirmed",
    type: "Jazz Club",
    notes: "European tour kickoff. Trio format.",
    lng: -0.0756,
    lat: 51.5461,
  },
  {
    id: 8,
    venue: "XOYO",
    date: "May 3, 2026",
    time: "8:30 PM",
    location: "London, UK",
    fee: "£950",
    status: "confirmed",
    type: "Live Music Venue",
    notes: "Sold out. Shoreditch.",
    lng: -0.0876,
    lat: 51.5256,
  },
  {
    id: 9,
    venue: "O2 Academy Brixton",
    date: "May 5, 2026",
    time: "9:30 PM",
    location: "London, UK",
    fee: "£900",
    status: "confirmed",
    type: "Live Music Venue",
    notes: "Two sets. Local rhythm section provided.",
    lng: -0.1146,
    lat: 51.4656,
  },
  {
    id: 10,
    venue: "The Garage",
    date: "May 7, 2026",
    time: "8:00 PM",
    location: "London, UK",
    fee: "£1,000",
    status: "confirmed",
    type: "Live Music Venue",
    notes: "Record label showcase. Press attending.",
    lng: -0.1038,
    lat: 51.5473,
  },
  {
    id: 11,
    venue: "Village Underground",
    date: "May 9, 2026",
    time: "9:00 PM",
    location: "London, UK",
    fee: "£1,200",
    status: "confirmed",
    type: "Live Music Venue",
    notes: "Full band. Soundcheck at 4 PM.",
    lng: -0.0791,
    lat: 51.5242,
  },
  {
    id: 12,
    venue: "EartH",
    date: "May 11, 2026",
    time: "10:00 PM",
    location: "London, UK",
    fee: "£850",
    status: "pending",
    type: "Live Music Venue",
    notes: "Contract under review by Mozely.",
    lng: -0.0544,
    lat: 51.5472,
  },
  {
    id: 13,
    venue: "Alexandra Palace",
    date: "May 15, 2026",
    time: "4:00 PM",
    location: "London, UK",
    fee: "£3,000",
    status: "inquiry",
    type: "Festival",
    notes: "Mozely submitted application. Major venue opportunity.",
    lng: -0.1296,
    lat: 51.5942,
  },
  {
    id: 14,
    venue: "Royal Albert Hall",
    date: "May 18, 2026",
    time: "7:00 PM",
    location: "London, UK",
    fee: "£4,500",
    status: "inquiry",
    type: "Concert Hall",
    notes: "Dream gig. Mozely negotiating with booker.",
    lng: -0.1774,
    lat: 51.5009,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let filtered = gigs;

  if (status) {
    const statuses = status.split(",") as GigStatus[];
    filtered = gigs.filter((g) => statuses.includes(g.status));
  }

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newGig: Gig = {
    id: nextId++,
    venue: body.venue || "Untitled Venue",
    date: body.date || "",
    time: body.time || "",
    location: body.location || "",
    fee: body.fee || "",
    status: body.status || "pending",
    type: body.type || "Venue",
    notes: body.notes || "",
    lng: body.lng ?? -0.1276,
    lat: body.lat ?? 51.5074,
  };
  gigs.push(newGig);
  return NextResponse.json(newGig, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));
  const index = gigs.findIndex((g) => g.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Gig not found" }, { status: 404 });
  }
  const [removed] = gigs.splice(index, 1);
  return NextResponse.json(removed);
}
