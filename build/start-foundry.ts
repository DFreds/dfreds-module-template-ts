import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import process from "process";
import prompts from "prompts";
import foundryConfig from "../foundryconfig.json" with { type: "json" };

if (!foundryConfig.dataPath || !/\bData$/.test(foundryConfig.dataPath)) {
    console.error(`"${foundryConfig.dataPath}" does not look like a Foundry data folder.`);
    process.exit(1);
}

const fvttVersion = (
    await prompts({
        type: "select",
        name: "value",
        message: "Select the FoundryVTT version you want to use.",
        choices: Object.keys(foundryConfig.fvtt).map((version) => ({
            title: version,
            value: version,
        })),
    })
).value as string;

const fvttPath = foundryConfig.fvtt[fvttVersion as keyof typeof foundryConfig.fvtt];

if (!fvttPath) {
    console.error(`FoundryVTT version "${fvttVersion}" not found.`);
    process.exit(1);
}

const execPath = path.resolve(fvttPath, "App", "Foundry Virtual Tabletop.exe");
const nodeEntryPoint = path.resolve(fvttPath, "main.js");
const oldNodeEntryPoint = path.resolve(fvttPath, "resources", "app", "main.js");

const dataPathArg = `--dataPath=${path.dirname(foundryConfig.dataPath)}`;

let command: string;
let args: string[];

if (fs.existsSync(execPath)) {
    console.log(`Starting FoundryVTT from ${execPath}...`);
    console.log("Make sure to close FoundryVTT instead of using Ctrl-C to stop it.");
    command = execPath;
    args = [dataPathArg];
} else if (fs.existsSync(nodeEntryPoint)) {
    console.log(`Starting FoundryVTT from ${nodeEntryPoint}...`);
    console.log(`Likely available at http://localhost:30000. Ctrl-C to stop.`);
    command = process.execPath;
    args = [nodeEntryPoint, dataPathArg];
} else if (fs.existsSync(oldNodeEntryPoint)) {
    console.log(`Starting FoundryVTT from ${oldNodeEntryPoint}...`);
    command = process.execPath;
    args = [oldNodeEntryPoint, dataPathArg];
} else {
    console.error(
        `Cannot start FoundryVTT. "${nodeEntryPoint}" and "${execPath}" and "${oldNodeEntryPoint}" do not exist.`,
    );
    process.exit(1);
}

const foundry = spawn(command, args, { stdio: "inherit" });

foundry.on("error", (error) => {
    console.error(error);
    process.exitCode = 1;
});

foundry.on("exit", (code) => {
    process.exitCode = code ?? 0;
});
