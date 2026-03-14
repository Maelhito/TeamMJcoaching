import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware minimal — l'auth est gérée directement dans chaque page serveur.
// NextAuth dans le Edge Runtime cause des crashes sur Vercel si AUTH_SECRET
// n'est pas correctement initialisé.
export default function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
