/**
 * Generates a random integer between 0 (inclusive) and `max` (exclusive).
 * @param max The exclusive maximum to generate.
 * @returns A random integer.
 */
export function randomInt(max: number): number {
    if (crypto?.getRandomValues) {
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        return Math.floor((arr[0] / 0x1_0000_0000) * max);
    } else {
        return Math.floor(Math.random() * max);
    }
}

/**
 * Generates a random character from a sample string.
 * @param sample The string to get a random character from.
 * @returns A random character from `sample`.
 */
export function randomChar(sample: string): string {
    return sample[randomInt(sample.length)];
}
