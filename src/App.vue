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
        <div class="alert alert-warning">
            <div class="row">
                <div class="col-auto d-flex align-items-center">
                    <span
                        class="fas fa-exclamation-triangle"
                        aria-hidden="true"
                    ></span>
                </div>
                <div class="col">
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
            <div class="card-body">
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
                        class="form-control"
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
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    setup() {
        const generateDefinition = ref<() => string>(() => "");
        const password = ref("");
        const displayOutput = ref(true);

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
            generate,
            copyToClipboard
        };
    }
});
</script>
