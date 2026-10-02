class HandlebarHelpers {
    register(): void {
        this.#registerUppercase();
    }

    #registerUppercase(): void {
        Handlebars.registerHelper("uppercase", (text: string) => text.toUpperCase());
    }
}

export { HandlebarHelpers };
