"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0D0D0D",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        /* Subtle grid + radial glows */
        backgroundImage: `
          radial-gradient(ellipse at 15% 85%, rgba(178,34,34,0.10) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 15%, rgba(178,34,34,0.06) 0%, transparent 50%),
          linear-gradient(rgba(178,34,34,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(178,34,34,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 100% 100%, 44px 44px, 44px 44px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 360 }}>

        {/* Logo + Marque */}
        <div
          className="animate-fade-in-up"
          style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 44 }}
        >
          <div
            className="animate-scale-in"
            style={{
              width: 90,
              height: 90,
              borderRadius: 22,
              overflow: "hidden",
              boxShadow:
                "0 0 0 2px rgba(255,255,255,0.12), 0 0 0 5px rgba(178,34,34,0.22), 0 12px 32px rgba(0,0,0,0.6)",
              marginBottom: 20,
            }}
          >
            <Image
              src="/logo.jpeg"
              alt="Time To Move"
              width={90}
              height={90}
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <h1
            className="font-title animate-fade-in-up delay-100"
            style={{
              fontSize: "2.4rem",
              color: "#F5F5F0",
              letterSpacing: "0.1em",
              lineHeight: 1,
              marginBottom: 6,
            }}
          >
            TIME TO MOVE
          </h1>

          <p
            className="font-body animate-fade-in-up delay-200"
            style={{
              fontSize: "0.7rem",
              color: "#555",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Team MJ Coaching
          </p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="animate-fade-in-up delay-300"
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <div>
            <label
              htmlFor="email"
              className="font-body"
              style={{
                display: "block",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "#666",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              id="email"
              className="input-field"
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoCapitalize="none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="font-body"
              style={{
                display: "block",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "#666",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Mot de passe
            </label>
            <input
              id="password"
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p
              className="font-body animate-fade-in"
              style={{
                fontSize: "0.82rem",
                color: "#ef5350",
                textAlign: "center",
                padding: "8px 12px",
                backgroundColor: "rgba(239,83,80,0.08)",
                borderRadius: 8,
                border: "1px solid rgba(239,83,80,0.15)",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "CONNEXION…" : "SE CONNECTER"}
          </button>
        </form>

        {/* Footer discret */}
        <p
          className="font-body animate-fade-in-up delay-400"
          style={{
            fontSize: "0.65rem",
            color: "#333",
            textAlign: "center",
            marginTop: 32,
            letterSpacing: "0.05em",
          }}
        >
          #TIMETOMOVE · Accès réservé aux membres
        </p>
      </div>
    </div>
  );
}
