import { NextResponse } from "next/server";

export interface Booking {
  id: number;
  artistSlug: string;
  date: string;
  time: string;
  venueName: string;
  contactName: string;
  contactEmail: string;
  venueCapacity: string;
  eventType: string;
  message: string;
  status: "pending" | "confirmed" | "declined";
  createdAt: string;
}

let nextId = 1;
const bookings: Booking[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  let filtered = bookings;
  if (slug) {
    filtered = bookings.filter((b) => b.artistSlug === slug);
  }

  return NextResponse.json(filtered);
}

export async function POST(request: Request) {
  const body = await request.json();

  const booking: Booking = {
    id: nextId++,
    artistSlug: body.artistSlug || "alex-rivera",
    date: body.date,
    time: body.time,
    venueName: body.venueName,
    contactName: body.contactName,
    contactEmail: body.contactEmail,
    venueCapacity: body.venueCapacity || "",
    eventType: body.eventType || "",
    message: body.message || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  bookings.push(booking);
  return NextResponse.json(booking, { status: 201 });
}
