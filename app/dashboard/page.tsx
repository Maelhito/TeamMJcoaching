import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getModules } from "@/lib/modules";
import { getUserById } from "@/lib/users";
import NotionCard from "@/components/NotionCard";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = getUserById(session.user.id!);
  const allModules = getModules();

  const modules =
    user?.role === "admin"
      ? allModules
      : allModules.filter((m) => user?.enrolledModules.includes(m.slug));

  const firstName = session.user.name?.split(" ")[0] ?? "";

  return (
    <div style={{ backgroundColor: "#0D0D0D", minHeight: "100vh", paddingBottom: 90 }}>
      <AppHeader />

      <div className="mx-auto" style={{ maxWidth: 480 }}>

        {/* Greeting */}
        <div style={{ padding: "20px 16px 6px" }}>
          <p className="font-body text-sm" style={{ color: "#555" }}>
            Bonjour,{" "}
            <span style={{ color: "#F5F5F0", fontWeight: 700 }}>{firstName}</span>
          </p>
        </div>

        {/* Section title */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px 16px" }}>
          <span style={{ display: "inline-block", width: 3, height: 18, backgroundColor: "#B22222", borderRadius: 2, flexShrink: 0 }} />
          <h2
            className="font-title"
            style={{ fontSize: "1.45rem", color: "#F5F5F0", lineHeight: 1, letterSpacing: "0.04em" }}
          >
            MES MODULES
          </h2>
          <span className="font-body" style={{ marginLeft: "auto", fontSize: "0.72rem", color: "#333" }}>
            {modules.length} module{modules.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* List */}
        {modules.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 16px 16px" }}>
            {modules.map((module, i) => (
              <NotionCard key={module.slug} module={module} index={i} />
            ))}
          </div>
        ) : (
          <div
            style={{
              margin: "0 16px",
              backgroundColor: "#111",
              border: "1px solid #1a1a1a",
              borderRadius: 12,
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <p className="font-body" style={{ fontWeight: 700, fontSize: "0.9rem", color: "#F5F5F0" }}>
              Aucun module pour l&apos;instant
            </p>
            <p className="font-body" style={{ fontSize: "0.8rem", color: "#555", marginTop: 4 }}>
              Tes modules apparaîtront ici au fur et à mesure.
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
