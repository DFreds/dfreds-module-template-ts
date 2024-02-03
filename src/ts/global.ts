declare global {
    namespace globalThis {
        let game: Game<
            Actor<null>,
            Actors<Actor<null>>,
            ChatMessage,
            Combat,
            Item<null>,
            Macro,
            Scene,
            User
        >;
        let ui: FoundryUI<
            ActorDirectory<Actor<null>>,
            ItemDirectory<Item<null>>,
            ChatLog,
            CompendiumDirectory,
            CombatTracker<Combat | null>,
            Hotbar
        >;

        let libWrapper: LibWrapper;

        type AnyFunction = (...args: any) => any;
    }
}
