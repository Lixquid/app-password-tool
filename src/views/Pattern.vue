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
            <li>
                <code>u</code>: Upper-case letter (<code>A, B, C, ...</code>)
            </li>
            <li>
                <code>l</code>: Lower-case letter (<code>a, b, c, ...</code>)
            </li>
            <li><code>d</code>: Digit (<code>1, 2, 3, ...</code>)</li>
            <li><code>s</code>: Symbol (<code>!, ", $, ...</code>)</li>
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
import { randomChar } from "@/lib/random";
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
            for (let i = 0; i < pattern.value.length; i++) {
                const char = pattern.value[i];
                if (escaped) {
                    output.push(char);
                    escaped = false;
                    continue;
                }

                if (char === "\\") {
                    escaped = true;
                    continue;
                }

                if (quoted) {
                    if (char === '"') {
                        quoted = false;
                        continue;
                    } else {
                        output.push(char);
                        continue;
                    }
                }

                switch (char) {
                    case '"':
                        quoted = true;
                        continue;
                    case "u":
                        output.push(randomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ"));
                        continue;
                    case "l":
                        output.push(randomChar("abcdefghijklmnopqrstuvwxyz"));
                        continue;
                    case "d":
                        output.push(randomChar("0123456789"));
                        continue;
                    case "s":
                        output.push(
                            randomChar("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~")
                        );
                        continue;
                    default:
                        output.push(char);
                        continue;
                }
            }

            if (escaped) {
                output.push("\\");
            }

            return output.join("");
        });
        watch(pattern, () => emit("generate"), { immediate: true });

        return { pattern };
    }
});
</script>
