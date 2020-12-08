function Event<T extends unknown[]>(): (...args: T) => void {
    return (null as unknown) as (...args: T) => void;
}

export const generateDefinitionMixin = {
    generateDefinition: Event<[() => string]>(),
    generate: Event(),
    displayOutput: Event<[boolean]>()
};
