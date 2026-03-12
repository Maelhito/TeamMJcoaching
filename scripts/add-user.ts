#!/usr/bin/env tsx
/**
 * Script pour ajouter une cliente (sans mot de passe — elle le crée elle-même)
 * Usage: npm run add-user
 */

import fs from "fs";
import path from "path";
import readline from "readline";

interface User {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  role: "admin" | "client";
  enrolledModules: string[];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log("\n=== Ajouter une nouvelle cliente ===\n");
  console.log("La cliente recevra un lien vers /setup pour créer son mot de passe.\n");

  const name = await ask("Prénom et nom : ");
  const email = await ask("Email : ");
  const modules = await ask(
    "Modules accessibles (séparés par des virgules, ex: module-1,module-2) : "
  );

  const usersPath = path.join(process.cwd(), "data", "users.json");
  const users: User[] = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    console.error("\nErreur : Un compte avec cet email existe déjà.");
    rl.close();
    process.exit(1);
  }

  const newUser: User = {
    id: String(Date.now()),
    name,
    email,
    hashedPassword: "", // La cliente crée son mot de passe via /setup
    role: "client",
    enrolledModules: modules
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean),
  };

  users.push(newUser);
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  console.log(`\n✓ Cliente "${name}" ajoutée avec succès !`);
  console.log(`  Email   : ${email}`);
  console.log(`  Modules : ${newUser.enrolledModules.join(", ") || "aucun"}`);
  console.log(`\n→ Envoie-lui ce lien pour créer son mot de passe :`);
  console.log(`  http://localhost:3000/setup\n`);

  rl.close();
}

main().catch(console.error);
