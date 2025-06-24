import * as Vite from "vite";
import checker from "vite-plugin-checker";
import esbuild from "esbuild";
import fs from "fs";
import packageJSON from "./package.json" with { type: "json" };
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { viteStaticCopy } from "vite-plugin-static-copy";

const PACKAGE_ID = "modules/dfreds-module-template-ts";

const config = Vite.defineConfig(({ command, mode }): Vite.UserConfig => {
    const buildMode =
        mode === "production"
            ? "production"
            : mode === "stage"
              ? "stage"
              : "development";
    const outDir = "dist";
    const plugins = [
        checker({ typescript: true }),
        tsconfigPaths({ loose: true }),
    ];

    console.log(`Build mode: ${buildMode}`);

    if (buildMode === "production") {
        plugins.push(
            minifyPlugin(),
            deleteLockFilePlugin(),
            ...viteStaticCopy({
                targets: [{ src: "README.md", dest: "." }],
            }),
        );
    } else if (buildMode === "stage") {
        plugins.push(
            minifyPlugin(),
            ...viteStaticCopy({
                targets: [{ src: "README.md", dest: "." }],
            }),
        );
    } else {
        plugins.push(
            handleHotUpdateForEnLang(outDir),
            handleHotUpdateForHandlebars(outDir),
        );
    }

    // Create dummy files for vite dev server
    if (command === "serve") {
        const message =
            "This file is for a running vite dev server and is not copied to a build";
        fs.writeFileSync("./index.html", `<h1>${message}</h1>\n`);
        if (!fs.existsSync("./styles")) fs.mkdirSync("./styles");
        fs.writeFileSync(
            "./styles/dfreds-module-template-ts.css",
            `/** ${message} */\n`,
        );
        fs.writeFileSync(
            "./dfreds-module-template-ts.mjs",
            `/** ${message} */\n\nwindow.global = window;\nimport "./src/ts/module.ts";\n`,
        );
        fs.writeFileSync("./vendor.mjs", `/** ${message} */\n`);
    }

    return {
        base:
            command === "build" ? "./" : `/modules/dfreds-module-template-ts/`,
        publicDir: "static",
        define: {
            BUILD_MODE: JSON.stringify(buildMode),
            fa: "foundry.applications",
            fav1: "foundry.appv1",
            fc: "foundry.canvas",
            fd: "foundry.documents",
            fh: "foundry.helpers",
            fu: "foundry.utils",
        },
        esbuild: { keepNames: true },
        build: {
            outDir,
            emptyOutDir: false,
            minify: false,
            sourcemap: buildMode === "development",
            lib: {
                name: "dfreds-module-template-ts",
                entry: "src/ts/module.ts",
                formats: ["es"],
                fileName: "module",
            },
            rollupOptions: {
                output: {
                    assetFileNames: ({ name }): string =>
                        name === "style.css"
                            ? "styles/dfreds-module-template-ts.css"
                            : name ?? "",
                    chunkFileNames: "[name].mjs",
                    entryFileNames: "dfreds-module-template-ts.mjs",
                    manualChunks: {
                        vendor: Object.keys(packageJSON.dependencies)
                            ? Object.keys(packageJSON.dependencies)
                            : [],
                    },
                },
                watch: { buildDelay: 100 },
            },
            target: "es2022",
        },
        server: {
            port: 30001,
            open: false,
            proxy: {
                "^(?!/modules/dfreds-module-template-ts/)":
                    "http://localhost:30000/",
                "/socket.io": {
                    target: "ws://localhost:30000",
                    ws: true,
                },
            },
        },
        plugins,
        css: {
            devSourcemap: buildMode === "development",
        },
    };
});

function minifyPlugin(): Vite.Plugin {
    return {
        name: "minify",
        renderChunk: {
            order: "post",
            async handler(code, chunk) {
                return chunk.fileName.endsWith(".mjs")
                    ? esbuild.transform(code, {
                          keepNames: true,
                          minifyIdentifiers: false,
                          minifySyntax: true,
                          minifyWhitespace: true,
                      })
                    : code;
            },
        },
    };
}

function deleteLockFilePlugin(): Vite.Plugin {
    return {
        name: "delete-lock-file-plugin",
        resolveId(source) {
            return source === "virtual-module" ? source : null;
        },
        writeBundle(outputOptions) {
            const outDir = outputOptions.dir ?? "";
            const lockFile = path.resolve(
                outDir,
                "dfreds-module-template-ts.lock",
            );
            fs.rmSync(lockFile);
        },
    };
}

function handleHotUpdateForEnLang(outDir: string): Vite.Plugin {
    return {
        name: "hmr-handler-en-lang",
        apply: "serve",
        handleHotUpdate(context) {
            if (context.file.startsWith(outDir)) return;
            if (!context.file.endsWith("en.json")) return;

            const basePath = context.file.slice(context.file.indexOf("lang/"));
            console.log(`Updating lang file at ${basePath}`);
            fs.promises
                .copyFile(context.file, `${outDir}/${basePath}`)
                .then(() => {
                    context.server.ws.send({
                        type: "custom",
                        event: "lang-update",
                        data: { path: `${PACKAGE_ID}/${basePath}` },
                    });
                });
        },
    };
}

function handleHotUpdateForHandlebars(outDir: string): Vite.Plugin {
    return {
        name: "hmr-handler-handlebars",
        apply: "serve",
        handleHotUpdate(context) {
            if (context.file.startsWith(outDir)) return;
            if (!context.file.endsWith(".hbs")) return;

            const basePath = context.file.slice(
                context.file.indexOf("templates/"),
            );
            console.log(`Updating template file at ${basePath}`);
            fs.promises
                .copyFile(context.file, `${outDir}/${basePath}`)
                .then(() => {
                    context.server.ws.send({
                        type: "custom",
                        event: "template-update",
                        data: { path: `${PACKAGE_ID}/${basePath}` },
                    });
                });
        },
    };
}

export default config;
