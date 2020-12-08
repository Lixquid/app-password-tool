<template>
    <div class="progress">
        <div
            class="progress-bar"
            role="progressbar"
            :aria-valuenow="strength + 1"
            aria-valuemin="1"
            aria-valuemax="5"
            :style="'width:' + ((strength + 1) / 5) * 100 + '%'"
            :class="color"
        >
            {{ text }}
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
    props: {
        strength: {
            type: Number,
            required: true
        }
    },
    setup(props) {
        const text = computed(() => {
            switch (props.strength) {
                case 0:
                    return "Extremely Weak";
                case 1:
                    return "Weak";
                case 2:
                    return "Moderate";
                case 3:
                    return "Strong";
                case 4:
                    return "Very Strong";
                default:
                    return "Unknown";
            }
        });
        const color = computed(() => {
            switch (props.strength) {
                case 0:
                case 1:
                    return "bg-danger";
                case 2:
                    return "bg-warning";
                case 3:
                case 4:
                    return "bg-success";
                default:
                    return "bg-primary";
            }
        });

        return { text, color };
    }
});
</script>
