"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function SetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Le mot de passe doit faire au moins 8 caractères."); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    const res = await fetch("/api/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Une erreur est survenue."); return; }
    router.push("/login?setup=done");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0D0D0D", display: "flex", flexDirection: "column" }}>
      <div style={{ backgroundColor: "#B22222", padding: "40px 24px 60px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 90, height: 90, borderRadius: 22, backgroundColor: "#0D0D0D", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <Image src="/logo.jpeg" alt="Time To Move" width={90} height={90} style={{ objectFit: "cover" }} priority />
        </div>
        <p className="font-title tracking-widest" style={{ fontSize: "0.75rem", color: "rgba(245,245,240,0.7)" }}>
          TIME TO MOVE
        </p>
      </div>

      <div className="flex-1 flex flex-col mx-auto w-full" style={{ maxWidth: 420, marginTop: -28, padding: "0 16px 32px" }}>
        <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: 20, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

          <div>
            <h1 className="font-title" style={{ fontSize: "1.8rem", color: "#F5F5F0", letterSpacing: "0.03em" }}>BIENVENUE !</h1>
            <p className="font-body text-sm" style={{ color: "#555" }}>Crée ton mot de passe pour accéder à ton espace</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Ton email", type: "email", value: email, set: setEmail, placeholder: "ton@email.com" },
              { label: "Choisis un mot de passe", type: "password", value: password, set: setPassword, placeholder: "8 caractères minimum" },
              { label: "Confirme ton mot de passe", type: "password", value: confirm, set: setConfirm, placeholder: "••••••••" },
            ].map(({ label, type, value, set, placeholder }) => (
              <div key={label}>
                <label className="font-body block text-xs font-semibold mb-2" style={{ color: "#444", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</label>
                <input type={type} value={value} onChange={(e) => set(e.target.value)} required style={inputStyle} placeholder={placeholder} />
              </div>
            ))}

            {error && (
              <p className="font-body text-sm text-center px-3 py-2" style={{ backgroundColor: "#1a0a0a", border: "1px solid #3a1a1a", color: "#B22222", borderRadius: 8 }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="font-body font-bold text-white w-full py-4 mt-1 transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#B22222", borderRadius: 12, fontFamily: "var(--font-bebas), sans-serif", letterSpacing: "0.08em", fontSize: "1.05rem" }}>
              {loading ? "Enregistrement..." : "CRÉER MON MOT DE PASSE"}
            </button>
          </form>

          <p className="font-body text-center text-xs" style={{ color: "#333" }}>
            Déjà un compte ?{" "}
            <a href="/login" className="font-semibold" style={{ color: "#B22222" }}>Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  );
}
