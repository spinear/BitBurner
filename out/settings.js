/** @param {NS} ns **/

export const loopHackFileName = {
    weaken: "weaken.js",
    grow: "grow.js",
    hack: "hack.js"
};

// 상점 해킹 타겟
export const defHackingTarget = "phantasy";

// 구매 서버 해킹 타겟
export const boughtServerHackingTarget = "phantasy";
export const boughtServerRam = 128;

// 홈에서 돌아갈 해킹 타겟 /homehack/hh01.js ~
export const initialThreads = 24; // 1번 파일 시작 쓰레드값

export const homeHackingTarget = [
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

export let advHomeTarget = [
    "n00dles", "harakiri-sushi", "phantasy", "omega-net", "alpha-ent", "global-pharm"
];