import fs from "fs";
import path from "path";
import process from "process";
import prompts from "prompts";
import foundryConfig from "../foundryconfig.json" with { type: "json" };
import moduleJSON from "../static/module.json" with { type: "json" };

if (!foundryConfig.dataPath || !/\bData$/.test(foundryConfig.dataPath)) {
    console.error(
        `"${foundryConfig.dataPath}" does not look like a Foundry data folder.`,
    );
    process.exit(1);
}

const dataPathStats = fs.lstatSync(foundryConfig.dataPath, {
    throwIfNoEntry: false,
});

if (!dataPathStats?.isDirectory()) {
    console.error(`No folder found at "${foundryConfig.dataPath}"`);
    process.exit(1);
}

const symlinkPath = path.resolve(
    foundryConfig.dataPath,
    "modules",
    moduleJSON.id,
);
const symlinkStats = fs.lstatSync(symlinkPath, { throwIfNoEntry: false });

if (symlinkStats) {
    const atPath = symlinkStats.isDirectory()
        ? "folder"
        : symlinkStats.isSymbolicLink()
          ? "symlink"
          : "file";
    const proceed: boolean = (
        await prompts({
            type: "confirm",
            name: "value",
            initial: false,
            message: `A "${moduleJSON.id}" ${atPath} already exists in the "modules" subfolder. Replace with new symlink?`,
        })
    ).value;

    if (!proceed) {
        console.log("Aborting.");
        process.exit();
    }
}

try {
    if (symlinkStats?.isDirectory()) {
        fs.rmSync(symlinkPath, { recursive: true, force: true });
    } else if (symlinkStats) {
        fs.unlinkSync(symlinkPath);
    }
    fs.symlinkSync(path.resolve(process.cwd(), "dist"), symlinkPath);
} catch (error) {
    if (error instanceof Error) {
        console.error(
            `An error was encountered trying to create a symlink: ${error.message}`,
        );
        process.exit(1);
    }
}

console.log(`Symlink successfully created at "${symlinkPath}"!`);
