import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
// @ts-expect-error Expect error when the `foundryconfig.example.json` was not copied
import { pf2eRepoPath } from "../foundryconfig.json";

const destinationDataPath = path.resolve(process.cwd(), "types");

console.log(`Copying ${pf2eRepoPath} to ${destinationDataPath}.`);

const pf2eRepoPathStats = fs.lstatSync(pf2eRepoPath, {
    throwIfNoEntry: false,
});
if (!pf2eRepoPathStats?.isDirectory()) {
    console.error(`No folder found at ${pf2eRepoPath}`);
    process.exit(1);
}

if (!fs.existsSync(destinationDataPath)) {
    fs.mkdirSync(destinationDataPath, { recursive: true });
}

fsExtra.copySync(pf2eRepoPath, destinationDataPath);
