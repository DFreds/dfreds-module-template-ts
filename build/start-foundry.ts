import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";
import process from "process";
import prompts from "prompts";
import { promisify } from "util";
import foundryConfig from "../foundryconfig.json" with { type: "json" };

if (!foundryConfig.dataPath || !/\bData$/.test(foundryConfig.dataPath)) {
    console.error(
        `"${foundryConfig.dataPath}" does not look like a Foundry data folder.`,
    );
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

const fvttPath =
    foundryConfig.fvtt[fvttVersion as keyof typeof foundryConfig.fvtt];

if (!fvttPath) {
    console.error(`FoundryVTT version "${fvttVersion}" not found.`);
    process.exit(1);
}

const windowsExecPath = path.resolve(fvttPath, "Foundry Virtual Tabletop.exe");
const nodeEntryPoint = path.resolve(fvttPath, "resources", "app", "main.js");
const macApp = fvttPath;

const execAsync = promisify(exec);

const startFoundry = async () => {
    try {
        if (fs.existsSync(windowsExecPath)) {
            console.log(`Starting FoundryVTT from ${windowsExecPath}...`);
            console.log(
                "Make sure to close FoundryVTT instead of using Ctrl-C to stop it.",
            );

            const quotedPath = `"${windowsExecPath}"`;
            const { stdout, stderr } = await execAsync(quotedPath);

            console.log(`stdout: ${stdout}`);

            if (stderr) console.error(`stderr: ${stderr}`);
        } else if (fs.existsSync(nodeEntryPoint)) {
            console.log(`Starting FoundryVTT from ${nodeEntryPoint}...`);

            const { stdout, stderr } = await execAsync(
                `node ${nodeEntryPoint} --datapath=${foundryConfig.dataPath}`,
            );

            console.log(`stdout: ${stdout}`);

            if (stderr) console.error(`stderr: ${stderr}`);
        } else if (macApp.endsWith(".app")) {
            console.log(`Starting ${macApp}...`);
            const { stdout, stderr } = await execAsync(
                `open -a "${macApp}" --env=FOUNDRY_VTT_DATA_PATH="${foundryConfig.dataPath.substring(0, foundryConfig.dataPath.length - 5)}"`,
            );
            console.log(`stdout: ${stdout}`);

            if (stderr) console.error(`stderr: ${stderr}`);
        } else {
            console.error(
                `Cannot start FoundryVTT. "${fvttPath}" is not a valid Foundry path.`,
            );
            process.exit(1);
        }
    } catch (error) {
        console.error(error);
    }
};

startFoundry().catch(console.error);
