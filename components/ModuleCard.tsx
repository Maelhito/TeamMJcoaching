import Link from "next/link";
import { Module, Tag } from "@/lib/modules";

const tagStyles: Record<Tag["color"], { bg: string; text: string }> = {
  green:  { bg: "rgba(46,125,50,0.18)",  text: "#66bb6a" },
  orange: { bg: "rgba(230,81,0,0.18)",   text: "#ffa040" },
  blue:   { bg: "rgba(21,101,192,0.18)", text: "#64b5f6" },
  red:    { bg: "rgba(178,34,34,0.18)",  text: "#ef5350" },
};

export default function ModuleCard({ module, index }: { module: Module; index: number }) {
  return (
    <Link href={`/modules/${module.slug}`} className="block">
      <div
        className="module-card"
        style={{
          backgroundColor: "#111111",
          border: "1px solid #1e1e1e",
          borderRadius: 18,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 16px",
          margin: "0 16px",
        }}
      >
        {/* Emoji bubble */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            backgroundColor: "#1a1a1a",
            border: "1px solid #232323",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.4rem",
            flexShrink: 0,
          }}
        >
          {module.emoji ?? "📄"}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-body" style={{ fontSize: "0.68rem", color: "#555", marginBottom: 3, letterSpacing: "0.04em" }}>
            MODULE {String(index + 1).padStart(2, "0")}
            {module.duration ? ` · ${module.duration}` : ""}
          </p>

          <h3
            className="font-body font-bold leading-snug"
            style={{ fontSize: "0.88rem", color: "#F5F5F0", marginBottom: 8 }}
          >
            {module.title}
          </h3>

          {module.tags && module.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {module.tags.map((tag) => {
                const s = tagStyles[tag.color];
                return (
                  <span
                    key={tag.label}
                    className="font-body font-semibold"
                    style={{
                      fontSize: "0.68rem",
                      padding: "3px 10px",
                      backgroundColor: s.bg,
                      color: s.text,
                      borderRadius: 99,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {tag.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Arrow */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: "#B22222",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
