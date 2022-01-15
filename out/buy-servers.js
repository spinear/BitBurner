import { runLoopHack, calcThreads } from "./myFunc";
import { loopHackFileName } from "./settings";

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    let isSmushed = ns.peek(3);
    let pickedRam = selectServerRam(ns);

    // 어느 램이든 서버를 살 수 있을 때
    if (pickedRam[1]) {

        // 타겟이 바꼈을 때
        if (isSmushed == 'true' && pickedRam[0] >= ns.peek(5)) {
            ns.tprint(`WARN 💻 서버 타겟 교체!`);
            await installServer(ns, pickedRam);
            return;
        }

        // 이전 램 보다 클 때
        if (pickedRam[0] > ns.peek(5)) {
            ns.tprint(`고른 서버: ${pickedRam[0]} GB`);

            // 이 때만 포트 저장함
            ns.clearPort(5);
            await ns.writePort(5, pickedRam[0]);

            ns.tprint(`WARN 💻 서버 업글 가능!`);
            await installServer(ns, pickedRam);
            return;
        } else
            ns.tprint(`INFO 서버 냅둠 / 전: ${ns.peek(5)} GB 후: ${pickedRam[0]} GB`);
    } else
        ns.tprint(`서버 살 돈이 없썽!`);
}

async function installServer(_ns, pickedRam) {
    ns = _ns;

    ns.exec('deleteServers.js', 'home');
    await ns.sleep(500);

    let boughtServerHackingTarget = ns.peek(2);
    let i = 0;

    ns.tprint(`서버 설치 중...`);

    while (i < ns.getPurchasedServerLimit()) {
        let host = ns.purchaseServer('s-' + i, pickedRam[0]);

        await ns.scp(loopHackFileName.weaken, host);
        await ns.scp(loopHackFileName.grow, host);
        await ns.scp(loopHackFileName.hack, host);

        let threadCalc = calcThreads(ns, host, loopHackFileName.weaken);

        runLoopHack(ns, loopHackFileName, host, threadCalc, boughtServerHackingTarget, 1);

        await ns.sleep(1500);
        ++i;
    }

    ns.tprint(`😎 서버 설치 완료`);
}

export function selectServerRam(_ns) {
    ns = _ns;
    let ram = 8;
    let pickedRam = [ram, false]; // 최초값 port 5 = null

    for (let i = 0; i < 9; ++i) {
        if (ns.getServerMoneyAvailable('home') < ns.getPurchasedServerCost(ram) * 25) {
            // 맨 처음 루프에서 if에 걸리면 기본 값을 리턴
            return pickedRam;
        } else {
            pickedRam[0] = ram;
            pickedRam[1] = true;
        }
        ram = ram * 2;
    }
    return pickedRam; // 루프 끝나고 리턴 빼먹으면 클남!!!
}
