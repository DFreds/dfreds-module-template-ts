import { MODULE_ID } from "../constants.ts";
import { Listener } from "./index.ts";
import { libWrapper } from "@static/lib/shim.ts";

const Setup: Listener = {
    listen(): void {
        Hooks.once("setup", () => {
            if (BUILD_MODE === "development") {
                // Setup debug mode
                CONFIG.debug.hooks = true;
            }

            // Various libWrapper examples

            libWrapper.register(
                MODULE_ID,
                "Canvas.prototype._onDrop",
                function (this: any, wrapped: AnyFunction, ...args: any) {
                    console.log(this);
                    wrapped(...args);
                },
            );
            libWrapper.register(
                MODULE_ID,
                "Application.prototype.bringToTop",
                function (this: Application, wrapped: () => void) {
                    wrapped();
                },
            );
            libWrapper.register(
                MODULE_ID,
                "Application.prototype.minimize",
                function (this: Application, wrapped: () => Promise<boolean>) {
                    const r = wrapped();
                    r.then(() => console.log("yay"));
                    return r;
                },
            );
            libWrapper.register(
                MODULE_ID,
                "Token.prototype._canDrag",
                function (this: any, wrapped: AnyFunction, ...args: any) {
                    return wrapped(...args);
                },
                "WRAPPER",
            );
            libWrapper.register(
                MODULE_ID,
                "Token.prototype._onDragLeftStart",
                async function (
                    this: Token,
                    wrapped: (event: any) => any,
                    event: Event,
                ) {
                    const result = wrapped(event);
                    return result;
                },
                "WRAPPER",
            );
            // Playlist overrides
            libWrapper.register(
                MODULE_ID,
                "Playlist.prototype._onSoundStart",
                onSoundStartWrapper,
                "WRAPPER",
            );
        });
    },
};

async function onSoundStartWrapper(
    this: Playlist,
    wrapped: (sound: PlaylistSound<null>) => void,
    sound: PlaylistSound<null>,
): Promise<void> {
    wrapped(sound);
}

export { Setup };
