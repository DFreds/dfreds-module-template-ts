import fs from "fs";
import prompts from "prompts";

import { compilePack } from "@foundryvtt/foundryvtt-cli";

import { exitWithPackError, listPacks } from "./util/packs.ts";

const packs = listPacks().filter((pack) => fs.existsSync(pack.src));

if (packs.length === 0) {
    console.log("No packs to compile.");
    process.exit(0);
}

for (const pack of packs) {
    if (fs.existsSync(pack.dist)) {
        const proceed: boolean = (
            await prompts({
                type: "confirm",
                name: "value",
                initial: false,
                message: `"${pack.dist}" already exists and may have changes made in Foundry that were not unpacked. Overwrite it?`,
            })
        ).value;

        if (!proceed) {
            console.log(`Skipping "${pack.name}".`);
            continue;
        }
    }

    try {
        await compilePack(pack.src, pack.dist, { recursive: true, log: true });
    } catch (error) {
        exitWithPackError(pack.name, error);
    }
}
