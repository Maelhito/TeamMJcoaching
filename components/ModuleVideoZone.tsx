"use client";

import { useState } from "react";

export interface VideoItem {
  id: string;
  title?: string;
  url: string; // embed URL, "" if not set
}

interface Props {
  slug: string;
  isAdmin: boolean;
  videos: VideoItem[];
}

function VideoPlayer({ url }: { url: string }) {
  return (
    <div style={{
      position: "relative", paddingBottom: "56.25%",
      borderRadius: 12, overflow: "hidden", backgroundColor: "#000",
    }}>
      <iframe
        src={url}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

function VideoEditForm({
  slug, videoId, onSave,
}: {
  slug: string;
  videoId: string;
  onSave: (embedUrl: string) => void;
}) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, url: value, videoId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      onSave(data.embedUrl ?? "");
      setValue("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && value.trim() && handleSave()}
        placeholder="https://www.youtube.com/watch?v=..."
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 10,
          backgroundColor: "#1a1a1a", border: "1.5px solid #2a2a2a",
          color: "#F5F5F0", fontSize: "0.82rem", outline: "none", fontFamily: "inherit",
        }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleSave}
          disabled={saving || !value.trim()}
          style={{
            flex: 1, padding: "8px", borderRadius: 10, fontWeight: 700, fontSize: "0.82rem",
            backgroundColor: "#B22222", color: "white", border: "none",
            cursor: saving || !value.trim() ? "not-allowed" : "pointer",
            opacity: !value.trim() ? 0.5 : 1,
          }}
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
      {error && <p style={{ color: "#B22222", fontSize: "0.78rem", margin: 0 }}>{error}</p>}
    </div>
  );
}

export default function ModuleVideoZone({ slug, isAdmin, videos }: Props) {
  const [localVideos, setLocalVideos] = useState<VideoItem[]>(videos);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Nothing to show for non-admin with no videos
  if (!isAdmin && localVideos.every((v) => !v.url)) return null;
  if (!isAdmin && localVideos.length === 0) return null;

  // Single video without title (legacy / single-video modules)
  const isMulti = localVideos.length > 1 || localVideos.some((v) => v.title);

  function handleSaved(videoId: string, embedUrl: string) {
    setLocalVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, url: embedUrl } : v))
    );
    setEditingId(null);
  }

  if (!isMulti) {
    // Single-video display (legacy)
    const video = localVideos[0] ?? { id: slug, url: "" };
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {video.url ? (
          <>
            <VideoPlayer url={video.url} />
            {isAdmin && (
              <button
                onClick={() => setEditingId(editingId === video.id ? null : video.id)}
                style={{
                  background: "none", border: "1px solid #2a2a2a", borderRadius: 10,
                  color: "#555", fontSize: "0.75rem", padding: "7px 14px", cursor: "pointer",
                }}
              >
                Modifier le lien vidéo
              </button>
            )}
            {isAdmin && editingId === video.id && (
              <VideoEditForm
                slug={slug}
                videoId={video.id}
                onSave={(url) => handleSaved(video.id, url)}
              />
            )}
          </>
        ) : isAdmin ? (
          <>
            <p style={{ fontSize: "0.78rem", color: "rgba(245,245,240,0.4)", margin: 0 }}>
              Lien YouTube ou Vimeo
            </p>
            <VideoEditForm
              slug={slug}
              videoId={video.id}
              onSave={(url) => handleSaved(video.id, url)}
            />
          </>
        ) : null}
      </div>
    );
  }

  // Multi-video display (module-3 and similar)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <p
        className="font-body"
        style={{
          fontSize: "0.72rem", fontWeight: 700, color: "rgba(245,245,240,0.4)",
          textTransform: "uppercase", letterSpacing: "0.08em", margin: 0,
        }}
      >
        {localVideos.length} vidéo{localVideos.length > 1 ? "s" : ""} disponible{localVideos.length > 1 ? "s" : ""}
      </p>

      {localVideos.map((video, i) => (
        <div key={video.id}>
          {/* Title */}
          {video.title && (
            <p
              className="font-body"
              style={{
                fontSize: "0.8rem", fontWeight: 700, color: "#F5F5F0",
                marginBottom: 10, lineHeight: 1.4,
              }}
            >
              <span style={{ color: "#B22222", marginRight: 6 }}>{String(i + 1).padStart(2, "0")}.</span>
              {video.title}
            </p>
          )}

          {/* Player or placeholder */}
          {video.url ? (
            <VideoPlayer url={video.url} />
          ) : (
            <div style={{
              backgroundColor: "#1a1a1a", border: "1.5px dashed #2a2a2a",
              borderRadius: 12, padding: "28px 20px", textAlign: "center",
              color: "#555", fontSize: "0.8rem",
            }}>
              Vidéo à venir
            </div>
          )}

          {/* Admin edit */}
          {isAdmin && (
            <div style={{ marginTop: 6 }}>
              <button
                onClick={() => setEditingId(editingId === video.id ? null : video.id)}
                style={{
                  background: "none", border: "1px solid #2a2a2a", borderRadius: 8,
                  color: "#555", fontSize: "0.72rem", padding: "5px 12px", cursor: "pointer",
                }}
              >
                {editingId === video.id ? "Annuler" : video.url ? "Modifier le lien" : "Ajouter le lien"}
              </button>
              {editingId === video.id && (
                <VideoEditForm
                  slug={slug}
                  videoId={video.id}
                  onSave={(url) => handleSaved(video.id, url)}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
