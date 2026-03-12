import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { Redis } from "@upstash/redis";

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

function toEmbedUrl(raw: string): string {
  const url = raw.trim();
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { slug, url } = await req.json();
  if (!slug) return NextResponse.json({ error: "Slug manquant" }, { status: 400 });

  const embedUrl = url?.trim() ? toEmbedUrl(url) : "";

  const redis = getRedis();
  if (redis) {
    // Production : Upstash Redis
    if (embedUrl) {
      await redis.set(`video:${slug}`, embedUrl);
    } else {
      await redis.del(`video:${slug}`);
    }
  } else {
    // Développement : fichier JSON local
    const { readFile, writeFile } = await import("fs/promises");
    const { existsSync } = await import("fs");
    const videosPath = path.join(process.cwd(), "data", "videos.json");
    let videos: Record<string, string> = {};
    if (existsSync(videosPath)) videos = JSON.parse(await readFile(videosPath, "utf-8"));
    if (embedUrl) {
      videos[slug] = embedUrl;
    } else {
      delete videos[slug];
    }
    await writeFile(videosPath, JSON.stringify(videos, null, 2));
  }

  return NextResponse.json({ success: true, embedUrl });
}
