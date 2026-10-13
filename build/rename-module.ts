import fs from "fs";
import path from "path";
import prompts from "prompts";

const newModuleIdentifier: string | undefined = (
    await prompts({
        type: "text",
        name: "value",
        format: (v: string) => v.replace(/\W*$/, "").trim(),
        message:
            "Enter the identifier of your module. (Example: dfreds-convenient-effects)",
    })
).value;

const newModuleName: string | undefined = (
    await prompts({
        type: "text",
        name: "value",
        format: (v: string) => v.replace(/\W*$/, "").trim(),
        message:
            "Enter the title of your module. (Example: DFreds Convenient Effects)",
    })
).value;

const newModuleDescription: string =
    (
        await prompts({
            type: "text",
            name: "value",
            format: (v: string) => v.replace(/\W*$/, "").trim(),
            message:
                "Enter the description of your module. (Example: A FoundryVTT module template using TypeScript)",
        })
    ).value ?? "";

if (!newModuleIdentifier) {
    console.error("No module identifier entered.");
    process.exit(1);
}

if (!newModuleName) {
    console.error("No module name entered.");
    process.exit(1);
}

const dirToSearch = path.resolve(process.cwd());
const dirsToInclude = [".github", "src", "static"].map((dir) =>
    path.resolve(dirToSearch, dir),
);
const filesToInclude = [
    ".gitignore",
    "package.json",
    "package-lock.json",
    "README.md",
    "vite.config.ts",
].map((file) => path.resolve(dirToSearch, file));
const lockFilePath = path.resolve(
    dirToSearch,
    "static",
    "dfreds-module-template-ts.lock",
);

const filesInIncludedDirs = dirsToInclude
    .filter((dir) => fs.existsSync(dir))
    .flatMap((dir) =>
        fs
            .readdirSync(dir, { encoding: "utf-8", recursive: true })
            .map((file: string) => path.resolve(dir, file)),
    )
    .filter((filePath: string) => !fs.lstatSync(filePath).isDirectory());

const filesToReplaceStrings = [...filesInIncludedDirs, ...filesToInclude];

console.log(
    `Changing identifier name, and description in the following files:\n${filesToReplaceStrings.join("\n")}`,
);

try {
    for (const file of filesToReplaceStrings) {
        const fileData = fs.readFileSync(file, { encoding: "utf8" });
        const replaced = fileData
            .replace(/dfreds-module-template-ts/g, newModuleIdentifier)
            .replace(/DFreds Module Template TS/g, newModuleName)
            .replace(
                /A FoundryVTT module template using Typescript/g,
                newModuleDescription,
            );

        fs.writeFileSync(file, replaced);
    }

    // Rename the lock file
    fs.renameSync(
        lockFilePath,
        path.resolve(dirToSearch, "static", `${newModuleIdentifier}.lock`),
    );
} catch (error) {
    console.error(error);
    process.exit(1);
}
