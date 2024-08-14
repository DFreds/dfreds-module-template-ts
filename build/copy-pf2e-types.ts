import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
// @ts-expect-error Expect error when the `foundryconfig.example.json` was not copied
import { pf2eRepoPath } from "../foundryconfig.json";

const sourceDataPath = path.resolve(pf2eRepoPath, "types", "foundry");
const destinationDataPath = path.resolve(process.cwd(), "types", "foundry");

const sourceRepoPathStats = fs.lstatSync(sourceDataPath, {
    throwIfNoEntry: false,
});
if (!sourceRepoPathStats?.isDirectory()) {
    console.error(`No folder found at ${sourceDataPath}`);
    process.exit(1);
}

console.log(`Cleaning ${destinationDataPath}`);
fsExtra.removeSync(destinationDataPath);

console.log(`Copying ${sourceDataPath} to ${destinationDataPath}.`);
fs.mkdirSync(destinationDataPath, { recursive: true });
fsExtra.copySync(sourceDataPath, destinationDataPath);
