import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:MM
  type: "Coaching Individuel" | "Atelier" | "Coaching de Groupe";
  description?: string;
}

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

async function readEvents(): Promise<CalendarEvent[]> {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.get<CalendarEvent[] | string>("events");
    if (!raw) return [];
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  }
  const { readFile } = await import("fs/promises");
  const { existsSync } = await import("fs");
  const p = path.join(process.cwd(), "data", "events.json");
  if (!existsSync(p)) return [];
  return JSON.parse(await readFile(p, "utf-8")) as CalendarEvent[];
}

async function writeEvents(events: CalendarEvent[]): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set("events", JSON.stringify(events));
    return;
  }
  const { writeFile } = await import("fs/promises");
  const p = path.join(process.cwd(), "data", "events.json");
  await writeFile(p, JSON.stringify(events, null, 2));
}

export async function GET() {
  const events = await readEvents();
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { title, date, time, type, description } = await req.json();
  if (!title || !date || !time || !type) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
  }

  const events = await readEvents();
  const newEvent: CalendarEvent = {
    id: randomUUID(),
    title,
    date,
    time,
    type,
    description: description ?? "",
  };
  events.push(newEvent);
  await writeEvents(events);

  return NextResponse.json(newEvent, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

  const events = await readEvents();
  await writeEvents(events.filter((e) => e.id !== id));

  return NextResponse.json({ success: true });
}
