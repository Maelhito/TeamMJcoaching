"use client";

import { useState } from "react";

interface Props {
  slug: string;
  isAdmin: boolean;
  initialUrl?: string | null;
}

export default function ModuleVideoZone({ slug, isAdmin, initialUrl }: Props) {
  const [embedUrl, setEmbedUrl] = useState(initialUrl ?? "");
  const [inputValue, setInputValue] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, url: inputValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setEmbedUrl(data.embedUrl ?? "");
      setEditing(false);
      setInputValue("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") { setEditing(false); setInputValue(""); }
  }

  // Cliente sans vidéo : rien
  if (!isAdmin && !embedUrl) return null;

  return (
    <div>
      {embedUrl && !editing ? (
        /* Player vidéo */
        <div>
          <div style={{
            position: "relative", paddingBottom: "56.25%",
            borderRadius: 12, overflow: "hidden", backgroundColor: "#000",
          }}>
            <iframe
              src={embedUrl}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          {isAdmin && (
            <button
              onClick={() => { setEditing(true); setInputValue(""); }}
              style={{
                marginTop: 8, background: "none",
                border: "1px solid #2a2a2a", borderRadius: 10,
                color: "#555", fontSize: "0.75rem",
                padding: "7px 14px", cursor: "pointer",
              }}
            >
              Modifier le lien vidéo
            </button>
          )}
        </div>
      ) : isAdmin ? (
        /* Champ admin pour coller le lien */
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ fontSize: "0.78rem", color: "rgba(245,245,240,0.4)", margin: 0 }}>
            Lien YouTube ou Vimeo
          </p>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://www.youtube.com/watch?v=..."
            autoFocus
            style={{
              width: "100%", padding: "12px 14px", borderRadius: 10,
              backgroundColor: "#1a1a1a", border: "1.5px solid #2a2a2a",
              color: "#F5F5F0", fontSize: "0.85rem", outline: "none",
              fontFamily: "inherit",
            }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleSave}
              disabled={saving || !inputValue.trim()}
              style={{
                flex: 1, padding: "10px", borderRadius: 10,
                fontWeight: 700, fontSize: "0.85rem",
                backgroundColor: "#B22222", color: "white", border: "none",
                cursor: saving || !inputValue.trim() ? "not-allowed" : "pointer",
                opacity: !inputValue.trim() ? 0.5 : 1,
              }}
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            {editing && (
              <button
                onClick={() => { setEditing(false); setInputValue(""); }}
                style={{
                  padding: "10px 16px", borderRadius: 10,
                  background: "none", border: "1px solid #2a2a2a",
                  color: "#555", fontSize: "0.85rem", cursor: "pointer",
                }}
              >
                Annuler
              </button>
            )}
          </div>
          {error && <p style={{ color: "#B22222", fontSize: "0.8rem", margin: 0 }}>{error}</p>}
        </div>
      ) : null}
    </div>
  );
}
