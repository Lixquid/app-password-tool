<template>
    <div class="container mx-auto my-5">
        <h1 class="my-5">
            Password Tool
            <a
                href="https://lixquid.com"
                class="btn btn-outline-primary float-end"
            >
                lixquid.com
            </a>
        </h1>
        <div class="alert alert-warning" v-if="!secureCryptoAvailable">
            <div class="row">
                <div class="col-auto d-flex align-items-center">
                    <span
                        class="fas fa-exclamation-triangle"
                        aria-hidden="true"
                    ></span>
                </div>
                <div class="col">
                    <h4>Warning: Insecure Random Generation</h4>
                    Your browser does not support generating cryptographically
                    secure random values. Make sure you don't use any values
                    generated for anything important! (<a
                        href="https://blog.cloudflare.com/why-randomness-matters/"
                        >Click here to find out why this is important.</a
                    >)
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <ul class="nav nav-tabs card-header-tabs">
                    <li class="nav-item">
                        <router-link
                            to="/character"
                            class="nav-link"
                            active-class="active"
                            >Character Generation</router-link
                        >
                    </li>
                    <li class="nav-item">
                        <router-link
                            to="/analyze"
                            class="nav-link"
                            active-class="active"
                            >Analyze</router-link
                        >
                    </li>
                </ul>
            </div>
            <div class="card-body mb-5">
                <router-view
                    @display-output="displayOutput = $event"
                    @generate-definition="generateDefinition = $event"
                    @generate="generate"
                />
            </div>
            <div class="card-body border-top" v-if="displayOutput">
                <button
                    type="button"
                    class="btn btn-secondary mb-2"
                    @click.passive="generate"
                >
                    <span class="fas fa-sync mr-3" />
                    Regenerate
                </button>
                <div class="input-group">
                    <input
                        type="text"
                        class="form-control font-monospace"
                        readonly
                        :value="password"
                    />
                    <button
                        class="btn btn-secondary"
                        type="button"
                        @click.passive="copyToClipboard"
                        title="Copy to Clipboard"
                    >
                        <span class="fas fa-copy" aria-hidden="true" />
                        <span class="sr-only">Copy to Clipboard</span>
                    </button>
                </div>
            </div>
            <div class="card-body border-top">
                <h3>Analysis</h3>
                <div class="row">
                    <div class="col-md-4 col-form-label">
                        Strength
                    </div>
                    <div class="col">
                        <strength-meter :strength="analysis.score" />
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-4 col-form-label">
                        Estimated Guesses
                    </div>
                    <div class="col">
                        <input
                            class="form-control"
                            type="text"
                            readonly
                            :value="analysis.guesses"
                        />
                    </div>
                </div>
                <div
                    class="alert alert-warning mt-3"
                    v-if="analysis.feedback.warning"
                >
                    <div class="row">
                        <div class="col-auto d-flex align-items-center">
                            <span
                                class="fas fa-exclamation-triangle"
                                aria-hidden="true"
                            ></span>
                        </div>
                        <div class="col">
                            <h4>Warning</h4>
                            {{ analysis.feedback.warning }}
                        </div>
                    </div>
                </div>
                <div
                    class="alert alert-info mt-3"
                    v-if="analysis.feedback.suggestions?.length"
                >
                    <div class="row">
                        <div class="col-auto d-flex align-items-center">
                            <span
                                class="far fa-lightbulb"
                                aria-hidden="true"
                            ></span>
                        </div>
                        <div class="col">
                            <h4>Suggestions</h4>
                            <ul class="mb-0">
                                <li
                                    v-for="(v, i) in analysis.feedback
                                        .suggestions"
                                    :key="i"
                                >
                                    {{ v }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-4 col-form-label">
                        Throttled Crack Time
                    </div>
                    <div class="col">
                        <input
                            class="form-control"
                            type="text"
                            readonly
                            :value="
                                analysis.crack_times_display
                                    .online_throttling_100_per_hour
                            "
                        />
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-4 col-form-label">
                        Online Crack Time
                    </div>
                    <div class="col">
                        <input
                            class="form-control"
                            type="text"
                            readonly
                            :value="
                                analysis.crack_times_display
                                    .online_no_throttling_10_per_second
                            "
                        />
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-4 col-form-label">
                        Strong Hash Crack Time
                    </div>
                    <div class="col">
                        <input
                            class="form-control"
                            type="text"
                            readonly
                            :value="
                                analysis.crack_times_display
                                    .offline_slow_hashing_1e4_per_second
                            "
                        />
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-4 col-form-label">
                        Weak Hash Crack Time
                    </div>
                    <div class="col">
                        <input
                            class="form-control"
                            type="text"
                            readonly
                            :value="
                                analysis.crack_times_display
                                    .offline_fast_hashing_1e10_per_second
                            "
                        />
                    </div>
                </div>
                <small class="float-end text-muted mt-3">
                    Analysis provided by
                    <a href="https://github.com/dropbox/zxcvbn">zxcvbn</a>.
                </small>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import StrengthMeter from "@/components/StrengthMeter.vue";
import zxcvbn from "zxcvbn";

export default defineComponent({
    components: {
        StrengthMeter
    },
    setup() {
        const generateDefinition = ref<() => string>(() => "");
        const password = ref("");
        const displayOutput = ref(true);

        const secureCryptoAvailable = computed(
            () => !!window.crypto?.getRandomValues
        );
        const analysis = computed(() => zxcvbn(password.value));

        function generate() {
            password.value = generateDefinition.value();
        }

        function copyToClipboard() {
            // TODO: Copy to clipboard
        }

        return {
            generateDefinition,
            password,
            displayOutput,
            secureCryptoAvailable,
            analysis,
            generate,
            copyToClipboard
        };
    }
});
</script>
