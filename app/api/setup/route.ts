import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Données invalides. Le mot de passe doit faire au moins 8 caractères." },
      { status: 400 }
    );
  }

  const usersPath = path.join(process.cwd(), "data", "users.json");
  const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

  const userIndex = users.findIndex(
    (u: { email: string; hashedPassword: string }) => u.email === email
  );

  if (userIndex === -1) {
    return NextResponse.json(
      { error: "Aucun compte trouvé avec cet email. Contacte ta coach." },
      { status: 404 }
    );
  }

  if (users[userIndex].hashedPassword !== "") {
    return NextResponse.json(
      { error: "Un mot de passe est déjà défini. Connecte-toi normalement ou contacte ta coach." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users[userIndex].hashedPassword = hashedPassword;

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  return NextResponse.json({ success: true });
}
