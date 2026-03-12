"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const inputStyle: React.CSSProperties = {
  backgroundColor: "#1F1F1F",
  border: "1.5px solid #2A2A2A",
  borderRadius: 12,
  padding: "14px 16px",
  fontSize: "0.9rem",
  outline: "none",
  color: "#F5F5F0",
  width: "100%",
  fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSetup = searchParams.get("setup") === "done";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0D0D0D", display: "flex", flexDirection: "column" }}>
      {/* Top banner rouge */}
      <div style={{ backgroundColor: "#B22222", padding: "40px 24px 60px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 90, height: 90, borderRadius: 22, backgroundColor: "#0D0D0D", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <Image src="/logo.jpeg" alt="Time To Move" width={90} height={90} style={{ objectFit: "cover" }} priority />
        </div>
        <p className="font-title tracking-widest" style={{ fontSize: "0.75rem", color: "rgba(245,245,240,0.7)" }}>
          TIME TO MOVE
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col mx-auto w-full" style={{ maxWidth: 420, marginTop: -28, padding: "0 16px 32px" }}>
        <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: 20, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

          <div>
            <h1 className="font-title" style={{ fontSize: "1.8rem", color: "#F5F5F0", letterSpacing: "0.03em" }}>BON RETOUR !</h1>
            <p className="font-body text-sm" style={{ color: "#555" }}>Connecte-toi à ton espace</p>
          </div>

          {justSetup && (
            <div className="font-body text-sm text-center px-4 py-2.5 font-medium" style={{ backgroundColor: "#0a1a0a", border: "1px solid #1a3a1a", color: "#4CAF50", borderRadius: 10 }}>
              Mot de passe créé — tu peux te connecter.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label className="font-body block text-xs font-semibold mb-2" style={{ color: "#444", textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} placeholder="ton@email.com" />
            </div>
            <div>
              <label className="font-body block text-xs font-semibold mb-2" style={{ color: "#444", textTransform: "uppercase", letterSpacing: "0.08em" }}>Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} placeholder="••••••••" />
            </div>

            {error && (
              <p className="font-body text-sm text-center px-3 py-2" style={{ backgroundColor: "#1a0a0a", border: "1px solid #3a1a1a", color: "#B22222", borderRadius: 8 }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="font-body font-bold text-white w-full py-4 mt-1 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#B22222", borderRadius: 12, fontFamily: "var(--font-bebas), sans-serif", letterSpacing: "0.08em", fontSize: "1.05rem" }}>
              {loading ? "Connexion..." : "SE CONNECTER"}
            </button>
          </form>

          <p className="font-body text-center text-xs" style={{ color: "#333" }}>
            Première connexion ?{" "}
            <a href="/setup" className="font-semibold" style={{ color: "#B22222" }}>Crée ton mot de passe</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
