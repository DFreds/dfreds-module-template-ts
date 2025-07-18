import type Module from "@client/packages/module.d.mts";

interface ThisModule extends Module {
    api: ThisApi;
}

interface ThisApi {
    test(): void;
}

export { type ThisModule, type ThisApi };
