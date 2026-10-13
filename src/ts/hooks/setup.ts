import type { ApplicationV2 } from "@client/applications/api/_module.mjs";
import { MODULE_ID } from "../constants.ts";
import { log } from "../logger.ts";
import { Listener } from "./index.ts";
import { libWrapper } from "@static/lib/shim.ts";
import type Token from "@client/canvas/placeables/token.d.mts";

const Setup: Listener = {
    listen(): void {
        Hooks.once("setup", () => {
            if (BUILD_MODE === "development") {
                CONFIG.debug.hooks = true;
            }

            // Various libWrapper examples

            libWrapper.register(
                MODULE_ID,
                "foundry.applications.api.ApplicationV2.prototype.bringToFront",
                function (this: ApplicationV2, wrapped: () => void) {
                    log("Application brought to front");
                    wrapped();
                },
                "WRAPPER",
            );
            libWrapper.register(
                MODULE_ID,
                "foundry.applications.api.ApplicationV2.prototype.minimize",
                async function (this: ApplicationV2, wrapped: () => Promise<void>) {
                    await wrapped();
                    log("Application minimized");
                },
                "WRAPPER",
            );
            libWrapper.register(
                MODULE_ID,
                "foundry.canvas.placeables.Token.prototype._onDragLeftStart",
                async function (this: Token, wrapped: (event: any) => any, event: Event) {
                    const result = wrapped(event);
                    log(`Token dragged, auto generated UUID: ${crypto.randomUUID()}`);
                    return result;
                },
                "WRAPPER",
            );
            // Playlist overrides
            libWrapper.register(MODULE_ID, "Playlist.prototype._onSoundStart", onSoundStartWrapper, "WRAPPER");
        });
    },
};

async function onSoundStartWrapper(
    this: Playlist,
    wrapped: (sound: PlaylistSound<null>) => void,
    sound: PlaylistSound<null>,
): Promise<void> {
    log("Sound started");
    wrapped(sound);
}

export { Setup };
