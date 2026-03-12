import fs from "fs";
import path from "path";

export interface Tag {
  label: string;
  color: "green" | "orange" | "blue" | "red";
}

export interface Module {
  slug: string;
  title: string;
  description: string;
  category: string;
  order: number;
  duration?: string;
  type: "video" | "document" | "mixed";
  emoji?: string;
  coverImage?: string;
  tags?: Tag[];
}

export interface ModuleMeta {
  modules: Module[];
}

export function getModules(): Module[] {
  const filePath = path.join(process.cwd(), "content", "modules", "index.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw) as ModuleMeta;
  return data.modules.sort((a, b) => a.order - b.order);
}

export function getModuleBySlug(slug: string): Module | undefined {
  return getModules().find((m) => m.slug === slug);
}

export function getCategories(): string[] {
  const modules = getModules();
  return [...new Set(modules.map((m) => m.category))];
}
