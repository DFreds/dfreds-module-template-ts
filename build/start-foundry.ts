import fs from "fs-extra";
import path from "path";
import process from "process";
import prompts from "prompts";
import { dataPath, fvtt } from "../foundryconfig.json";
import { exec } from "child_process";
import { promisify } from "util";

const fvttVersion = (
    await prompts({
        type: "select",
        name: "value",
        message: "Select the FoundryVTT version you want to use.",
        choices: Object.keys(fvtt).map((version) => ({
            title: version,
            value: version,
        })),
    })
).value as string;

const fvttPath = fvtt[fvttVersion];

if (!fvttPath) {
    console.error(`FoundryVTT version "${fvttVersion}" not found.`);
    process.exit(1);
}

if (!dataPath || !/\bData$/.test(dataPath)) {
    console.error(`"${dataPath}" does not look like a Foundry data folder.`);
    process.exit(1);
}

const execPath = path.resolve(fvttPath, "Foundry Virtual Tabletop.exe");
const nodeEntryPoint = path.resolve(fvttPath, "resources", "app", "main.js");

const execAsync = promisify(exec);

const startFoundry = async () => {
    try {
        if (fs.existsSync(execPath)) {
            console.log(`Starting FoundryVTT from ${execPath}...`);
            console.log(
                "Make sure to close FoundryVTT instead of using Ctrl-C to stop it.",
            );

            const quotedPath = `"${execPath}"`;
            const { stdout, stderr } = await execAsync(quotedPath);

            console.log(`stdout: ${stdout}`);

            if (stderr) console.error(`stderr: ${stderr}`);
        } else if (fs.existsSync(nodeEntryPoint)) {
            console.log(`Starting FoundryVTT from ${nodeEntryPoint}...`);

            const { stdout, stderr } = await execAsync(
                `node ${nodeEntryPoint} --datapath=${dataPath}`,
            );

            console.log(`stdout: ${stdout}`);

            if (stderr) console.error(`stderr: ${stderr}`);
        } else {
            console.error(
                `Cannot start FoundryVTT. "${nodeEntryPoint}" or "${execPath}" do not exist.`,
            );
            process.exit(1);
        }
    } catch (error) {
        console.error(error);
    }
};

startFoundry().catch(console.error);
