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

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const slug = formData.get("slug") as string | null;

  if (!file || !slug) {
    return NextResponse.json({ error: "Fichier ou slug manquant" }, { status: 400 });
  }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Seuls les fichiers PDF sont acceptés" }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  let fileUrl = "";

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Production : Vercel Blob
    const { put } = await import("@vercel/blob");
    const blob = await put(`documents/${slug}/${safeName}`, file, {
      access: "public",
      contentType: "application/pdf",
    });
    fileUrl = blob.url;
  } else {
    // Développement : système de fichiers local
    const { writeFile, mkdir } = await import("fs/promises");
    const dir = path.join(process.cwd(), "public", "documents", slug);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, safeName), Buffer.from(await file.arrayBuffer()));
    fileUrl = `/documents/${slug}/${safeName}`;
  }

  const docData = { url: fileUrl, name: file.name };

  const redis = getRedis();
  if (redis) {
    // Production : Upstash Redis
    await redis.set(`document:${slug}`, JSON.stringify(docData));
  } else {
    // Développement : fichier JSON local
    const { readFile, writeFile } = await import("fs/promises");
    const { existsSync } = await import("fs");
    const docPath = path.join(process.cwd(), "data", "documents.json");
    let docs: Record<string, { url: string; name: string }> = {};
    if (existsSync(docPath)) docs = JSON.parse(await readFile(docPath, "utf-8"));
    docs[slug] = docData;
    await writeFile(docPath, JSON.stringify(docs, null, 2));
  }

  return NextResponse.json({ success: true, url: fileUrl, name: file.name });
}
