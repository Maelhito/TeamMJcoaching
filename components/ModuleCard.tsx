import Link from "next/link";
import { Module, Tag } from "@/lib/modules";

const tagStyles: Record<Tag["color"], { bg: string; text: string }> = {
  green:  { bg: "#e8f5e9", text: "#2e7d32" },
  orange: { bg: "#fff3e0", text: "#e65100" },
  blue:   { bg: "#e3f2fd", text: "#1565c0" },
  red:    { bg: "#fdecea", text: "#B22222" },
};

export default function ModuleCard({ module, index }: { module: Module; index: number }) {
  return (
    <Link href={`/modules/${module.slug}`} className="block">
      <div
        className="bg-white flex items-center gap-4 px-4 py-4 active:scale-95 transition-transform"
        style={{
          borderRadius: 18,
          boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
          margin: "0 16px",
        }}
      >
        {/* Emoji bubble */}
        <div
          className="flex-shrink-0 flex items-center justify-center text-2xl"
          style={{ width: 52, height: 52, borderRadius: 14, backgroundColor: "#f4f4f4" }}
        >
          {module.emoji ?? "📄"}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-body text-xs mb-0.5" style={{ color: "#aaa" }}>
            Module {index + 1}
            {module.duration ? ` · ${module.duration}` : ""}
          </p>

          <h3 className="font-body font-bold text-sm leading-snug mb-2" style={{ color: "#0d0d0d" }}>
            {module.title}
          </h3>

          {module.tags && module.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {module.tags.map((tag) => {
                const s = tagStyles[tag.color];
                return (
                  <span
                    key={tag.label}
                    className="font-body font-semibold text-xs px-2.5 py-0.5"
                    style={{ backgroundColor: s.bg, color: s.text, borderRadius: 99 }}
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
          className="flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
          style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: "#B22222" }}
        >
          →
        </div>
      </div>
    </Link>
  );
}
