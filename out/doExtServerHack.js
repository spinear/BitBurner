import { loopHackFileName, serverList } from "./settings";
import { calcThreads, killHackScripts, runLoopHack } from "./myFunc";

/** @param {import(".").NS } ns */

export async function main(ns) {
    let hackingFileCopiedServers = [];

    let target = ns.peek(4);
    let isSmushed = ns.peek(3);

    if (isSmushed == "true") {
        for (let host of serverList) {
            killHackScripts(ns, host);
        }
    }

    // 여긴 일반 상점 대상이므로 isSmushed랑 상관없이 매 루프마다 실행해야 함! 
    // 단지 isSmushed === true면 스크립트 교체를 위해 다 지우는 게 추가 됐을 뿐!
    // 뉴크 후 파일 업로드
    let j = 0;
    for (let host of serverList) {
        let threadCalc = calcThreads(ns, host, loopHackFileName.vWeaken);

        // 파일을 업로드 '할(host)' 서버의 쓰레드와 루트 엑세스를 검사
        if (threadCalc.isSucceed && ns.hasRootAccess(host)) {
            await ns.scp(loopHackFileName.vWeaken, host);
            await ns.scp(loopHackFileName.vGrow, host);
            await ns.scp(loopHackFileName.vHack, host);
            hackingFileCopiedServers[j] = host;
            ++j;
        }
    }
    await ns.sleep(500);
    // 성공한 서버만 루프 해킹 실행
    for (let host of hackingFileCopiedServers) {
        let threadCalc = calcThreads(ns, host, loopHackFileName.vWeaken);

        // 이건 해킹 '할(target)' 서버의 루트 엑세스를 검사하는 거임.
        if (ns.hasRootAccess(target)) {
            runLoopHack(ns, loopHackFileName, host, threadCalc, target, 1);
            ns.tprint(`INFO 😎 스크립트 발싸!: ${host} / ${threadCalc.useableThreads} threads`);
        } else {
            ns.tprint(`ERROR 해킹 타겟 포트 안 열림 ${host}`);
        }
    }
}
