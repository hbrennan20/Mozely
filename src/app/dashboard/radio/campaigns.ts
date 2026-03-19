export const ukMusicBroadcasters = [
  "BBC Radio 1",
  "BBC Radio 1 Dance",
  "BBC Radio 1Xtra",
  "BBC Radio 2",
  "BBC Radio 3",
  "BBC Radio 4",
  "BBC Radio 4 Extra",
  "BBC Radio 5 Live",
  "BBC Radio 5 Sports Extra",
  "BBC Radio 6 Music",
  "BBC Asian Network",
  "BBC World Service",
  "BBC Introducing London",
  "BBC Introducing Manchester",
  "BBC Introducing Bristol",
  "BBC Introducing West Midlands",
  "BBC Introducing Liverpool",
  "BBC Introducing Yorkshire",
  "BBC Introducing in Scotland",
  "BBC Introducing in Wales",
  "BBC Radio Scotland",
  "BBC Radio nan Gaidheal",
  "BBC Radio Wales",
  "BBC Radio Cymru",
  "BBC Radio Ulster",
  "BBC Radio Foyle",
  "Capital UK",
  "Capital XTRA",
  "Capital Dance",
  "Heart UK",
  "Heart Dance",
  "Heart 80s",
  "Smooth Radio",
  "Smooth Chill",
  "Kiss",
  "Kisstory",
  "Kiss Fresh",
  "Magic Radio",
  "Magic Chilled",
  "Magic at the Musicals",
  "Absolute Radio",
  "Absolute Radio 10s",
  "Absolute Radio 20s",
  "Absolute Classic Rock",
  "Planet Rock",
  "Scala Radio",
  "Jazz FM",
  "Classic FM",
  "Greatest Hits Radio",
  "Hits Radio",
  "Hits Radio Pride",
  "Radio X",
  "Radio X 90s",
  "LBC",
  "talkSPORT",
  "talkRADIO",
  "Virgin Radio UK",
  "Virgin Radio Anthems",
  "Virgin Radio Chilled",
  "Times Radio",
  "Boom Radio",
  "Amazing Radio UK",
  "Reprezent Radio",
  "NTS Radio",
  "Rinse FM",
  "Mi-Soul Radio",
  "Centreforce Radio",
  "Kool FM",
  "Flex FM",
  "Select Radio",
  "Foundation FM",
  "Balamii",
  "Soho Radio",
  "Resonance FM",
  "No Signal",
  "Unity Radio",
  "Gaydio",
  "UCB 1",
  "Premier Christian Radio",
  "BFBS Radio",
];

export type Campaign = {
  id: number;
  name: string;
  target: number;
  reached: number;
  status: "draft" | "active";
  notes?: string;
  broadcasters: string[];
  startDate?: string;
};

export const initialCampaigns: Campaign[] = [
  {
    name: "Single: Midnight Lines",
    target: 24,
    reached: 11,
    broadcasters: ukMusicBroadcasters.slice(0, 24),
    startDate: "2026-03-10",
  },
  {
    name: "EP: Live at Blue Room",
    target: 18,
    reached: 6,
    broadcasters: ukMusicBroadcasters.slice(5, 23),
    startDate: "2026-03-22",
  },
].map((campaign, index) => ({
  id: index + 1,
  ...campaign,
  status: "active" as const,
}));

const STORAGE_KEY = "mozely.radio.campaigns";

export function readStoredCampaigns() {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed as Campaign[];
  } catch {
    return null;
  }
}

export function writeStoredCampaigns(campaigns: Campaign[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
}
