<template>
    <p class="mb-5">
        Generate a password from a user-defined pattern.
    </p>
    <div class="my-4">
        <ul>
            <li>
                Any characters after a backslash <code>\</code> are used as-is.
            </li>
            <li>
                Any character inside double quotes <code>""</code> are used
                as-is.
            </li>
            <li><code>l</code>: Lowercase letter (<code>a-z</code>)</li>
            <li><code>u</code>: Uppercase letter (<code>A-Z</code>)</li>
            <li><code>a</code>: Any letter (<code>A-Z, a-z</code>)</li>
            <li><code>d</code>: Digit (<code>0-9</code>)</li>
            <li>
                <code>w</code>: Word character (Any letter or digit,
                <code>A-Z, a-z, 0-9</code>)
            </li>
            <li>
                <code>p</code>: Punctuation (Any symbol,
                <code>!, ", $, ...</code>)
            </li>
            <li><code>x</code>: Hexadecimal (<code>0-9, A-F</code>)</li>
            <li><code>.</code>: Any printable character</li>
            <li>
                <code>{x}</code>: Repeats the previous item the specified number
                of times.
            </li>
            <li>
                <code>{,x}</code>: Repeats the previous item a random number of
                times between 0 and the given number.
            </li>
            <li>
                <code>{x,y}</code>: Repeats the previous item a random number of
                times between the given range.
            </li>
            <li>
                <code>[xyz]</code>: A random character from the given
                characters. Repeating a character makes it more likely to
                appear.
            </li>
            <li>
                <code>[a-z]</code>: A random character in the specified range.
            </li>
        </ul>
    </div>
    <div class="row">
        <label for="pattern--pattern" class="col-sm-4 col-form-label">
            Pattern
        </label>
        <div class="col">
            <input
                type="text"
                class="form-control font-monospace"
                id="pattern--pattern"
                v-model="pattern"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { generateDefinitionMixin } from "@/lib/componentEvents";
import { randomChar, randomInt } from "@/lib/random";
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
    emits: generateDefinitionMixin,
    setup(_, { emit }) {
        const pattern = ref("");

        emit("displayOutput", true);
        emit("generateDefinition", () => {
            const output: string[] = [];

            let escaped = false;
            let quoted = false;
            let range = false;
            let generationBuffer = "";
            for (let i = 0; i < pattern.value.length; i++) {
                const char = pattern.value[i];

                if (range) {
                    if (escaped) {
                        generationBuffer += char;
                        escaped = false;
                        continue;
                    }

                    switch (char) {
                        case "\\":
                            escaped = true;
                            continue;
                        case "]":
                            range = false;
                            continue;
                        default: {
                            const match = pattern.value
                                .substr(i)
                                .match(/^([^\]\\])-([^\]\\])/);
                            if (match) {
                                let min = match[1].charCodeAt(0);
                                let max = match[2].charCodeAt(0);
                                if (max < min) {
                                    [min, max] = [max, min];
                                }
                                const b: string[] = [];
                                for (let j = min; j < max; j++) {
                                    b.push(String.fromCharCode(j));
                                }
                                generationBuffer += b.join("");
                            } else {
                                generationBuffer += char;
                            }

                            continue;
                        }
                    }
                }

                if (escaped) {
                    output.push(randomChar(generationBuffer));
                    generationBuffer = char;
                    escaped = false;
                    continue;
                }

                if (quoted) {
                    if (char === '"') {
                        quoted = false;
                    } else {
                        output.push(randomChar(generationBuffer));
                        generationBuffer = char;
                    }
                    continue;
                }

                switch (char) {
                    case "\\":
                        escaped = true;
                        continue;
                    case '"':
                        quoted = true;
                        continue;
                    case "[": {
                        output.push(randomChar(generationBuffer));
                        generationBuffer = "";
                        range = true;
                        continue;
                    }
                    case "{": {
                        const match = pattern.value
                            .substr(i)
                            .match(/^{((\d+)?,)?(\d+)}/);
                        // 1?: If set, minimum is specified
                        // 2?: Minimum bound
                        // 3!: Maximum bound
                        if (match) {
                            const max = parseInt(match[3]);
                            const min = !match[1]
                                ? max
                                : !match[2]
                                ? 0
                                : parseInt(match[2]);
                            const count = randomInt(max - min + 1) + min;
                            for (let j = 0; j < count; j++) {
                                output.push(randomChar(generationBuffer));
                            }
                            i += match[0].length - 1;
                            generationBuffer = "";
                        } else {
                            output.push(randomChar(generationBuffer));
                            generationBuffer = "{";
                        }
                        continue;
                    }
                    case "l":
                        output.push(randomChar(generationBuffer));
                        generationBuffer = "abcdefghijklmnopqrstuvwxyz";
                        continue;
                    case "u":
                        output.push(randomChar(generationBuffer));
                        generationBuffer = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                        continue;
                    case "a":
                        output.push(randomChar(generationBuffer));
                        generationBuffer =
                            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                        continue;
                    case "d":
                        output.push(randomChar(generationBuffer));
                        generationBuffer = "0123456789";
                        continue;
                    case "w":
                        output.push(randomChar(generationBuffer));
                        generationBuffer =
                            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        continue;
                    case "p":
                        output.push(randomChar(generationBuffer));
                        generationBuffer = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
                        continue;
                    case "x":
                        output.push(randomChar(generationBuffer));
                        generationBuffer = "0123456789ABCDEF";
                        continue;
                    case ".":
                        output.push(randomChar(generationBuffer));
                        generationBuffer =
                            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
                        continue;
                    default:
                        output.push(randomChar(generationBuffer));
                        generationBuffer = char;
                        continue;
                }
            }
            if (generationBuffer) {
                output.push(randomChar(generationBuffer));
            }

            return output.join("");
        });
        watch(pattern, () => emit("generate"), { immediate: true });

        return { pattern };
    }
});
</script>
