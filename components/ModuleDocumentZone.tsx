"use client";

import { useState, useRef } from "react";

interface Props {
  slug: string;
  isAdmin: boolean;
  existingFile?: { url: string; name: string } | null;
}

export default function ModuleDocumentZone({ slug, isAdmin, existingFile }: Props) {
  const [doc, setDoc] = useState<{ url: string; name: string } | null>(existingFile ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("slug", slug);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'upload");
      setDoc({ url: data.url, name: data.name });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (!isAdmin && !doc) return null;

  return (
    <div style={{ marginTop: 12 }}>
      {doc ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <a
            href={doc.url}
            download={doc.name}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 16px", borderRadius: 12,
              backgroundColor: "#1a1a1a", border: "1.5px solid #B22222",
              textDecoration: "none",
            }}
          >
            <span style={{ fontSize: "1.2rem", color: "#B22222", fontWeight: 700, lineHeight: 1 }}>↓</span>
            <span style={{ flex: 1, fontSize: "0.88rem", fontWeight: 600, color: "#F5F5F0", lineHeight: 1.4 }}>
              {doc.name.replace(/\.pdf$/i, "")}
            </span>
            <span style={{
              fontSize: "0.72rem", fontWeight: 700, padding: "4px 10px",
              borderRadius: 6, backgroundColor: "#B22222", color: "white",
              flexShrink: 0,
            }}>
              Télécharger
            </span>
          </a>

          {isAdmin && (
            <button
              onClick={() => inputRef.current?.click()}
              style={{
                background: "none", border: "1px solid #2a2a2a", borderRadius: 10,
                color: "#555", fontSize: "0.75rem", padding: "7px 14px",
                cursor: "pointer", textAlign: "left",
              }}
            >
              Remplacer le fichier PDF
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "16px", borderRadius: 12, width: "100%",
            backgroundColor: "#111", border: "1.5px dashed #B22222",
            color: uploading ? "#555" : "#F5F5F0",
            cursor: uploading ? "wait" : "pointer",
          }}
        >
          <span style={{ fontSize: "1.3rem", color: "#B22222", lineHeight: 1 }}>
            {uploading ? "⏳" : "+"}
          </span>
          <span style={{ flex: 1, fontSize: "0.88rem", fontWeight: 600, textAlign: "left" }}>
            {uploading ? "Upload en cours…" : "Ajouter un document PDF"}
          </span>
          <span style={{
            fontSize: "0.72rem", fontWeight: 700, padding: "4px 10px",
            borderRadius: 6, backgroundColor: "#1a1a1a", color: "#555",
            border: "1px solid #2a2a2a", flexShrink: 0,
          }}>
            Parcourir
          </span>
        </button>
      )}

      {error && (
        <p style={{ color: "#B22222", fontSize: "0.8rem", marginTop: 6 }}>{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
