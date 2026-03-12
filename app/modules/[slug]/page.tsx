import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getModuleBySlug, getModules } from "@/lib/modules";
import { getUserById } from "@/lib/users";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import ModuleDocumentZone from "@/components/ModuleDocumentZone";
import ModuleVideoZone from "@/components/ModuleVideoZone";
import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

async function getModuleDocument(slug: string): Promise<{ url: string; name: string } | null> {
  const redis = getRedis();
  if (redis) {
    const raw = await redis.get<string>(`document:${slug}`);
    if (!raw) return null;
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  }
  // Fallback local
  const docPath = path.join(process.cwd(), "data", "documents.json");
  if (!fs.existsSync(docPath)) return null;
  const docs = JSON.parse(fs.readFileSync(docPath, "utf-8"));
  return docs[slug] ?? null;
}

async function getModuleVideo(slug: string): Promise<string | null> {
  const redis = getRedis();
  if (redis) {
    return await redis.get<string>(`video:${slug}`);
  }
  // Fallback local
  const videoPath = path.join(process.cwd(), "data", "videos.json");
  if (!fs.existsSync(videoPath)) return null;
  const videos = JSON.parse(fs.readFileSync(videoPath, "utf-8"));
  return videos[slug] ?? null;
}

async function getModuleContent(slug: string): Promise<string | null> {
  const filePath = path.join(process.cwd(), "content", "modules", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

function processInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderMarkdown(content: string): string {
  const lines = content.split("\n");
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Video embed: VIDEO:: Titre | url
    if (line.startsWith("VIDEO:: ")) {
      const parts = line.slice(8).split(" | ");
      const title = parts[0]?.trim() || "Vidéo";
      let url = (parts[1] || "").trim();

      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      if (ytMatch) url = `https://www.youtube.com/embed/${ytMatch[1]}`;
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) url = `https://player.vimeo.com/video/${vimeoMatch[1]}`;

      if (!url || url === "#") {
        html.push(`<div class="video-block"><p class="video-block-title">${processInline(title)}</p><div class="video-placeholder-box">Lien vidéo à ajouter</div></div>`);
      } else {
        html.push(`<div class="video-block"><p class="video-block-title">${processInline(title)}</p><div class="video-wrapper"><iframe src="${url}" frameborder="0" allowfullscreen loading="lazy"></iframe></div></div>`);
      }
      i++; continue;
    }

    // PDF download: PDF:: Titre | chemin
    if (line.startsWith("PDF:: ")) {
      const parts = line.slice(6).split(" | ");
      const title = parts[0]?.trim() || "Document";
      const filePath = (parts[1] || "").trim();

      if (!filePath || filePath === "#") {
        html.push(`<div class="pdf-block pdf-block--placeholder"><span class="pdf-block-icon">↓</span><span class="pdf-block-title">${processInline(title)}</span><span class="pdf-block-badge">PDF à ajouter</span></div>`);
      } else {
        html.push(`<a href="${filePath}" download class="pdf-block pdf-block--active"><span class="pdf-block-icon">↓</span><span class="pdf-block-title">${processInline(title)}</span><span class="pdf-block-badge">Télécharger</span></a>`);
      }
      i++; continue;
    }

    // Blockquote : collecte toutes les lignes > consécutives
    if (line.startsWith(">")) {
      const bqLines: string[] = [];
      while (i < lines.length && (lines[i].startsWith(">") || lines[i].trim() === "")) {
        if (lines[i].startsWith(">")) {
          bqLines.push(lines[i].replace(/^>\s?/, ""));
        } else {
          // ligne vide entre deux lignes > : on continue seulement si la suivante est aussi >
          const next = lines.slice(i + 1).find((l) => l.trim() !== "");
          if (next && next.startsWith(">")) {
            bqLines.push("");
          } else {
            break;
          }
        }
        i++;
      }
      // Construit l'intérieur du blockquote
      const inner: string[] = [];
      for (const bLine of bqLines) {
        if (bLine.startsWith("▷ ") || bLine.startsWith("- ") || bLine.startsWith("* ")) {
          const text = bLine.replace(/^(▷ |- |\* )/, "");
          inner.push(`<li>${processInline(text)}</li>`);
        } else if (bLine.trim() === "") {
          inner.push("__BREAK__");
        } else {
          inner.push(`<p>${processInline(bLine)}</p>`);
        }
      }
      // Regroupe les <li> consécutifs en <ul>
      const joined = inner
        .join("\n")
        .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
        .replace(/__BREAK__/g, "");
      html.push(`<blockquote>${joined}</blockquote>`);
      continue;
    }

    // Titres
    if (line.startsWith("# "))       { html.push(`<h1>${processInline(line.slice(2))}</h1>`); i++; continue; }
    if (line.startsWith("## "))      { html.push(`<h2>${processInline(line.slice(3))}</h2>`); i++; continue; }
    if (line.startsWith("### "))     { html.push(`<h3>${processInline(line.slice(4))}</h3>`); i++; continue; }

    // Listes ▷ et - et 1.
    if (line.startsWith("▷ ") || line.startsWith("- ") || line.startsWith("* ") || /^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("▷ ") || lines[i].startsWith("- ") || lines[i].startsWith("* ") || /^\d+\. /.test(lines[i]))) {
        const text = lines[i].replace(/^(▷ |- |\* |\d+\. )/, "");
        items.push(`<li>${processInline(text)}</li>`);
        i++;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // Tableau
    if (line.startsWith("|")) {
      if (/^\|[-| ]+\|$/.test(line)) { i++; continue; }
      const cells = line.split("|").filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map((c) => c.trim());
      html.push(`<tr>${cells.map((c) => `<td>${processInline(c)}</td>`).join("")}</tr>`);
      i++;
      continue;
    }

    // Séparateur
    if (line.trim() === "---") { html.push("<hr>"); i++; continue; }

    // Ligne vide
    if (line.trim() === "") { i++; continue; }

    // Paragraphe
    html.push(`<p>${processInline(line)}</p>`);
    i++;
  }

  // Entoure les <tr> en <table>
  return html.join("\n")
    .replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, (m) => `<table>${m}</table>`);
}

export async function generateStaticParams() {
  const modules = getModules();
  return modules.map((m) => ({ slug: m.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ModulePage({ params }: PageProps) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const moduleData = getModuleBySlug(slug);
  if (!moduleData) notFound();

  const user = getUserById(session.user.id!);
  const hasAccess = user?.role === "admin" || user?.enrolledModules.includes(slug);
  if (!hasAccess) redirect("/dashboard");

  const rawContent = await getModuleContent(slug);
  const htmlContent = rawContent ? renderMarkdown(rawContent) : "";

  const isAdmin = user?.role === "admin";
  const [moduleDoc, moduleVideo] = await Promise.all([
    getModuleDocument(slug),
    getModuleVideo(slug),
  ]);

  return (
    <div style={{ backgroundColor: "#0D0D0D", minHeight: "100vh", paddingBottom: 80 }}>
      <AppHeader back backHref="/dashboard" />

      {/* Module banner */}
      <div style={{ padding: "16px 12px 0" }}>
      <div
        style={{
          background: "linear-gradient(160deg, #8B0000 0%, #B22222 100%)",
          padding: "24px 20px 28px",
          borderRadius: 20,
          maxWidth: 520,
          margin: "0 auto",
        }}
      >
        <div className="flex items-start gap-4">
          <div>
            <p className="font-body text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
              {moduleData.category}{moduleData.duration ? ` · ${moduleData.duration}` : ""}
            </p>
            <h1
              className="font-title text-white leading-none"
              style={{ fontSize: "1.7rem", letterSpacing: "0.02em" }}
            >
              {moduleData.title.toUpperCase()}
            </h1>
            <p className="font-body text-xs mt-2" style={{ color: "rgba(255,255,255,0.55)" }}>
              {moduleData.description}
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Content */}
      <div className="mx-auto px-4 pt-4" style={{ maxWidth: 480 }}>
        <div
          style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: 18, padding: "20px 20px 24px" }}
        >
          <article className="prose-module" style={{ color: "#F5F5F0" }} dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>

        {/* Zone vidéo */}
        {(isAdmin || moduleVideo) && (
          <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: 18, padding: "16px 20px", marginTop: 12 }}>
            <ModuleVideoZone slug={slug} isAdmin={isAdmin} initialUrl={moduleVideo} />
          </div>
        )}

        {/* Zone document PDF */}
        {(isAdmin || moduleDoc) && (
          <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: 18, padding: "16px 20px", marginTop: 12 }}>
            <ModuleDocumentZone slug={slug} isAdmin={isAdmin} existingFile={moduleDoc} />
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
