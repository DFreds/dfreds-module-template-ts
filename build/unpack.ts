import fs from "fs";

import { extractPack } from "@foundryvtt/foundryvtt-cli";

import { exitWithPackError, listPacks } from "./util/packs.ts";

const packs = listPacks().filter((pack) => fs.existsSync(pack.dist));

if (packs.length === 0) {
    console.log("No packs to unpack.");
    process.exit(0);
}

for (const pack of packs) {
    try {
        await extractPack(pack.dist, pack.src, { clean: true, omitVolatile: true, log: true });
    } catch (error) {
        exitWithPackError(pack.name, error);
    }
}
