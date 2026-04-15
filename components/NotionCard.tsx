import Link from "next/link";
import { Module } from "@/lib/modules";

export default function NotionCard({ module, index }: { module: Module; index: number }) {
  return (
    <Link href={`/modules/${module.slug}`} className="block group">
      <div
        className="module-card"
        style={{
          backgroundColor: "#111111",
          borderRadius: 14,
          border: "1px solid #1e1e1e",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 14,
        }}
      >
        {/* Number */}
        <span
          className="font-title flex-shrink-0"
          style={{
            fontSize: "1.35rem",
            color: "#B22222",
            lineHeight: 1,
            minWidth: 28,
            letterSpacing: "0.02em",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            className="font-body font-bold"
            style={{
              fontSize: "0.87rem",
              color: "#F5F5F0",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {module.title}
          </p>

          {(module.category || module.duration) && (
            <p
              className="font-body"
              style={{ fontSize: "0.70rem", color: "#555", marginTop: 3 }}
            >
              {[module.category, module.duration].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        {/* Arrow */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            backgroundColor: "rgba(178,34,34,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="#B22222" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
