import { MODULE_ID } from "./constants.ts";

class Settings {
    // Settings keys
    #SAMPLE = "sample";

    register(): void {
        game.settings.register(MODULE_ID, this.#SAMPLE, {
            name: "ModuleTemplate.Settings.SampleSetting.Name",
            hint: "ModuleTemplate.Settings.SampleSetting.Hint",
            scope: "world",
            config: true,
            default: true,
            type: Boolean,
        });
    }

    get sample(): boolean {
        return game.settings.get(MODULE_ID, this.#SAMPLE) as boolean;
    }

    async setSample(value: boolean): Promise<unknown> {
        return game.settings.set(MODULE_ID, this.#SAMPLE, value);
    }
}

export { Settings };
