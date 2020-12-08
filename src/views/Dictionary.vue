<template>
    <p class="mb-5">
        Generate a password made up of english words.
    </p>
    <div class="row">
        <label for="dictionary--count" class="col-sm-4 col-form-label">
            Word Count
        </label>
        <div class="col">
            <input
                type="number"
                class="form-control"
                id="dictionary--count"
                min="1"
                step="1"
                v-model="count"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { generateDefinitionMixin } from "@/lib/componentEvents";
import { defineComponent, ref, watch } from "vue";
import words from "@/lib/top3000englishwords.json";
import { randomInt } from "@/lib/random";

export default defineComponent({
    emits: generateDefinitionMixin,
    setup(_, { emit }) {
        const count = ref(4);

        emit("displayOutput", true);
        emit("generateDefinition", () => {
            const output: string[] = [];

            for (let i = 0; i < count.value; i++) {
                output.push(words[randomInt(words.length)]);
            }

            return output.join(" ");
        });
        watch(count, () => emit("generate"), { immediate: true });

        return { count };
    }
});
</script>
