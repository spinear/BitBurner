/** @param {NS} ns **/

export const loopHackFileName = {
    weaken: "weaken.js",
    grow: "grow.js",
    hack: "hack.js"
};

// 상점 해킹 타겟
export let defHackingTarget = "harakiri-sushi";

// 구매 서버 해킹 타겟
export let boughtServerHackingTarget = "phantasy";
export let boughtServerRam = 16;

// 홈에서 돌아갈 해킹 타겟 /homehack/hh01.js ~
export let initialThreads = 16; // 1번 파일 시작 쓰레드값
export let homeHackingTarget = [
    "n00dles",
    "joesguns",
    "harakiri-sushi",
    "phantasy",
    "omega-net",
    "unitalife",
    "alpha-ent",
    "lexo-corp",
    "zb-institute",
    "nova-med", 
    //"zeus-med", 
    //"global-pharm",
    //"deltaone",
    //"b-and-a"
];