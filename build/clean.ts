import fs from "fs";
import path from "path";

const outDir = path.resolve(process.cwd(), "dist");
fs.mkdirSync(outDir, { recursive: true });

const entriesExceptLivePacks = fs.readdirSync(outDir).filter((entry) => entry !== "packs");
for (const entry of entriesExceptLivePacks) {
    fs.rmSync(path.join(outDir, entry), { recursive: true, force: true });
}
