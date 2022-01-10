import { p0servers } from "./serverList";
import { loopHackFileName, defHackingTarget } from "./settings";
import { calcThreads, runLoopHack } from "./myFunc";

/** @param {import(".").NS } ns */

export async function main(ns) {
    let hackingFileCopiedServers = [];
    let j = 0;
 
    // 뉴크 후 파일 업로드
    for (let i = 0; i < p0servers.length; ++i) {
        let host = p0servers[i];
        let threadCalc = calcThreads(ns, host, loopHackFileName.weaken);

        // 파일을 업로드 할 서버의 루트 엑세스를 검사
        if (threadCalc.isSucceed && ns.hasRootAccess(host)) { 
            await ns.scp(loopHackFileName.weaken, host);
            await ns.scp(loopHackFileName.grow, host);
            await ns.scp(loopHackFileName.hack, host);
            hackingFileCopiedServers[j] = host;
            ++j;
        }
    }

    // 파일이 업로드 된 서버만 루프 해킹 실행
    for (let i = 0; i < hackingFileCopiedServers.length; ++i) { 
        let host = hackingFileCopiedServers[i];
        let threadCalc = calcThreads(ns, host, loopHackFileName.weaken);

        // 해킹 할 서버의 루트 엑세스를 검사
        if (threadCalc.isSucceed && ns.hasRootAccess(defHackingTarget)) {
            runLoopHack(ns, loopHackFileName, host, threadCalc, defHackingTarget, 1);
            ns.tprint(`INFO 😎 스크립트 발싸!: ${host} / ${threadCalc.useableThreads} threads`);
        } else {
            ns.tprint(`WARN 해킹 타겟 레벨 높거나 포트 안 열림`);
        }
    }
}
