<template>
    <p class="mb-5">
        Analyze an existing password's strength.
    </p>
    <div class="input-group">
        <input
            :type="show ? 'text' : 'password'"
            class="form-control"
            placeholder="hunter2"
            aria-label="Input password"
            v-model="password"
        />
        <button
            class="btn btn-secondary"
            :class="{ active: show }"
            type="button"
            @click.passive="show = !show"
        >
            Show
        </button>
    </div>
</template>

<script lang="ts">
import { generateDefinitionMixin } from "@/lib/componentEvents";
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
    emits: generateDefinitionMixin,
    setup(_, { emit }) {
        const password = ref("");
        const show = ref(false);

        emit("displayOutput", false);
        emit("generateDefinition", () => {
            return password.value;
        });
        watch(password, () => emit("generate"), { immediate: true });

        return { password, show };
    }
});
</script>
