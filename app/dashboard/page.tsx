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

        {/* Greeting — paddingTop pour laisser place au logo qui déborde */}
        <div style={{ padding: "80px 20px 0", textAlign: "center" }}>
          <p
            className="font-body"
            style={{
              fontSize: "0.7rem",
              color: "#555",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Bonjour
          </p>
          <h2
            className="font-title"
            style={{
              fontSize: "2.6rem",
              color: "#F5F5F0",
              letterSpacing: "0.06em",
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            {firstName.toUpperCase()}
          </h2>
          <p
            className="font-body"
            style={{
              fontSize: "0.78rem",
              color: "#444",
              letterSpacing: "0.04em",
            }}
          >
            Prête à te dépasser aujourd&apos;hui ?
          </p>
        </div>

        {/* Séparateur */}
        <div style={{ height: 1, backgroundColor: "#1a1a1a", margin: "24px 20px 20px" }} />

        {/* Section title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 20px 16px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: 20,
              backgroundColor: "#B22222",
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
          <h3
            className="font-title"
            style={{
              fontSize: "1.3rem",
              color: "#F5F5F0",
              lineHeight: 1,
              letterSpacing: "0.05em",
            }}
          >
            MES MODULES
          </h3>
          <span
            className="font-body font-semibold"
            style={{
              marginLeft: "auto",
              fontSize: "0.68rem",
              color: "#333",
              backgroundColor: "#161616",
              border: "1px solid #222",
              borderRadius: 99,
              padding: "3px 10px",
              letterSpacing: "0.04em",
            }}
          >
            {modules.length}
          </span>
        </div>

        {/* Module list */}
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
              borderRadius: 14,
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <p
              className="font-title"
              style={{ fontSize: "1.2rem", color: "#333", letterSpacing: "0.06em" }}
            >
              AUCUN MODULE
            </p>
            <p
              className="font-body"
              style={{ fontSize: "0.78rem", color: "#444", marginTop: 8 }}
            >
              Tes modules apparaîtront ici au fur et à mesure.
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
