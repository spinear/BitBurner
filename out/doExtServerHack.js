import { loopHackFileName, serverList } from "./settings";
import { calcThreads, killHackScripts, runLoopHack } from "./myFunc";

/** @param {import(".").NS } ns */

export async function main(ns) {
    let hackingFileCopiedServers = [];

    let target = ns.peek(4);
    let isSmushed = ns.peek(3);

    if (isSmushed == "true") {
        for (let i of serverList) {
            let host = i;
            killHackScripts(ns, host);
        }
    }

    // 뉴크 후 파일 업로드
    let j = 0;
    for (let host of serverList) {
        let threadCalc = calcThreads(ns, host, loopHackFileName.weaken);

        // 파일을 업로드 할 서버의 쓰레드와 루트 엑세스를 검사
        if (threadCalc.isSucceed && ns.hasRootAccess(host)) {
            await ns.scp(loopHackFileName.weaken, host);
            await ns.scp(loopHackFileName.grow, host);
            await ns.scp(loopHackFileName.hack, host);
            hackingFileCopiedServers[j] = host;
            ++j;
        }
    }

    // 성공한 서버만 루프 해킹 실행
    for (let host of hackingFileCopiedServers) {
        let threadCalc = calcThreads(ns, host, loopHackFileName.weaken);

        // 해킹 할 서버의 루트 엑세스를 검사
        if (ns.hasRootAccess(target)) {
            runLoopHack(ns, loopHackFileName, host, threadCalc, target, 1);
            ns.tprint(`INFO 😎 스크립트 발싸!: ${host} / ${threadCalc.useableThreads} threads`);
        } else {
            ns.tprint(`ERROR 해킹 타겟 포트 안 열림 ${host}`);
        }
    }
}
