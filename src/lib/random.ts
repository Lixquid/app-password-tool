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
