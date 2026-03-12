import fs from "fs";
import path from "path";

export interface User {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  role: "admin" | "client";
  enrolledModules: string[];
}

export function getUsers(): User[] {
  const filePath = path.join(process.cwd(), "data", "users.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as User[];
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email === email);
}
