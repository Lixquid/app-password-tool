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
        <div class="card">
            <div class="card-header">
                <ul class="nav nav-tabs card-header-tabs">
                    <li class="nav-item">
                        <router-link
                            to="/"
                            class="nav-link"
                            active-class="active"
                            >Home</router-link
                        >
                    </li>
                    <li class="nav-item">
                        <router-link
                            to="/about"
                            class="nav-link"
                            active-class="active"
                            >About</router-link
                        >
                    </li>
                </ul>
            </div>
            <div class="card-body">
                <router-view />
            </div>
        </div>
    </div>
</template>
