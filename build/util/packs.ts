import fs from "fs";
import path from "path";

interface PackPaths {
    name: string;
    src: string;
    dist: string;
}

export function listPacks(): PackPaths[] {
    const moduleJson = JSON.parse(fs.readFileSync("static/module.json", "utf8")) as {
        packs: { name: string; path: string }[];
    };
    return moduleJson.packs.map((pack) => ({
        name: pack.name,
        src: path.resolve("src", pack.path),
        dist: path.resolve("dist", pack.path),
    }));
}

export function exitWithPackError(name: string, error: unknown): never {
    console.error(`Failed on pack "${name}": ${error instanceof Error ? error.message : error}`);
    console.error("If Foundry has this pack open, close the world (or Foundry) and try again.");
    process.exit(1);
}
