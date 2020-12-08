<template>
    <p class="mb-5">
        Generate a password made up of letters, numbers, and symbols.
    </p>
    <div class="row">
        <label for="character--length" class="col-sm-4 col-form-label">
            Length
        </label>
        <div class="col">
            <input
                type="number"
                class="form-control"
                id="character--length"
                min="1"
                step="1"
                v-model="length"
            />
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div class="form-check my-3">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="character--upper"
                    v-model="upper"
                />
                <label class="form-check-label" for="character--upper">
                    Uppercase Letters (<code>A, B, C, ...</code>)
                </label>
            </div>
            <div class="form-check my-3">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="character--lower"
                    v-model="lower"
                />
                <label class="form-check-label" for="character--lower">
                    Lowercase Letters (<code>a, b, c, ...</code>)
                </label>
            </div>
            <div class="form-check my-3">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="character--numbers"
                    v-model="numbers"
                />
                <label class="form-check-label" for="character--numbers">
                    Numbers (<code>1, 2, 3, ...</code>)
                </label>
            </div>
        </div>
        <div class="col">
            <div class="form-check my-3">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="character--symbols"
                    v-model="symbols"
                />
                <label class="form-check-label" for="character--symbols">
                    Symbols (<code>!, ", $, ...</code>)
                </label>
            </div>
            <div class="form-check my-3">
                <input
                    class="form-check-input"
                    type="checkbox"
                    id="character--spaces"
                    v-model="spaces"
                />
                <label class="form-check-label" for="character--spaces">
                    Spaces (<code>&nbsp;</code>)
                </label>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col">
                <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="character--excludeambig"
                        v-model="excludeAmbiguous"
                    />
                    <label
                        class="form-check-label"
                        for="character--excludeambig"
                    >
                        Exclude Ambiguous Characters (<code
                            >l, i, I, !, 1, |, o, O, 0, Q</code
                        >)
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { generateDefinitionMixin } from "@/lib/componentEvents";
import { randomInt } from "@/lib/random";
import { computed, defineComponent, ref, watch } from "vue";

export default defineComponent({
    emits: generateDefinitionMixin,
    setup(_, { emit }) {
        const length = ref(10);
        const upper = ref(true);
        const lower = ref(true);
        const numbers = ref(true);
        const symbols = ref(false);
        const spaces = ref(false);

        const excludeAmbiguous = ref(false);

        const alphabet = computed(() => {
            let output = "";

            if (upper.value) {
                output += excludeAmbiguous.value
                    ? "ABCDEFGHJKLMNPRSTUVWXYZ"
                    : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            }
            if (lower.value) {
                output += excludeAmbiguous.value
                    ? "abcdefghjkmnpqrstuvwxyz"
                    : "abcdefghijklmnopqrstuvwxyz";
            }
            if (numbers.value) {
                output += excludeAmbiguous.value ? "23456789" : "0123456789";
            }
            if (symbols.value) {
                output += excludeAmbiguous.value
                    ? "\"#$%&'()*+,-./:;<=>?@[\\]^_`{}~"
                    : "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
            }
            if (spaces.value) {
                output += " ";
            }

            return output;
        });

        emit("displayOutput", true);
        emit("generateDefinition", () => {
            const output: string[] = [];

            for (let i = 0; i < length.value; i++) {
                output.push(alphabet.value[randomInt(alphabet.value.length)]);
            }

            return output.join("");
        });

        watch([length, alphabet], () => emit("generate"), { immediate: true });

        return {
            length,
            upper,
            lower,
            numbers,
            symbols,
            spaces,
            excludeAmbiguous
        };
    }
});
</script>
