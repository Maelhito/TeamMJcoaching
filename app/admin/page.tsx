import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminCalendrier from "@/components/AdminCalendrier";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if ((session.user as { role?: string }).role !== "admin") redirect("/dashboard");

  return (
    <div style={{ backgroundColor: "#0D0D0D", minHeight: "100vh", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#111", borderBottom: "1px solid #1a1a1a",
        padding: "20px 20px 16px",
      }}>
        <p style={{ fontSize: "0.65rem", color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4, fontFamily: "var(--font-body), system-ui" }}>
          Administration
        </p>
        <h1 className="font-title" style={{ fontSize: "2rem", color: "#F5F5F0", letterSpacing: "0.06em" }}>
          TABLEAU DE BORD
        </h1>
      </div>

      <div className="mx-auto" style={{ maxWidth: 480, padding: "20px 16px" }}>

        {/* Calendrier section */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ display: "inline-block", width: 3, height: 18, backgroundColor: "#B22222", borderRadius: 2 }} />
          <h2 className="font-title" style={{ fontSize: "1.3rem", color: "#F5F5F0", letterSpacing: "0.05em" }}>
            ÉVÉNEMENTS
          </h2>
        </div>

        <AdminCalendrier />
      </div>
    </div>
  );
}
