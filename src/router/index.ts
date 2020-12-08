import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Analyze from "../views/Analyze.vue";
import Character from "../views/Character.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/character"
    },
    {
        path: "/character",
        name: "Character Generation",
        component: Character
    },
    // {
    //     path: "/pattern",
    //     name: "Pattern Generation",
    //     component: Pattern
    // },
    {
        path: "/analyze",
        name: "Password Analyzer",
        component: Analyze
    }
    // {
    //     path: "/dictionary",
    //     name: "Dictionary Generation",
    //     component: () => import(/* webpackChunkName: "dictionaryGeneration" */ "../views/Dictionary.vue")
    // }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;
