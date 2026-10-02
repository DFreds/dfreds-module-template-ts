import fs from "fs";
import path from "path";

export const srcPacksRoot = path.join(process.cwd(), "src", "packs");
export const staticPacksRoot = path.join(process.cwd(), "static", "packs");

export function listImmediateSubdirs(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => path.join(dir, e.name));
}

export function directoryContainsJson(dir: string): boolean {
    return fs.readdirSync(dir, { recursive: true, encoding: "utf8" }).some((f) => f.toLowerCase().endsWith(".json"));
}
