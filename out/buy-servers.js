import { runLoopHack, calcThreads } from "./myFunc";
import { loopHackFileName } from "./settings";

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;

    let isSmushed = ns.peek(3);
    let pickedRam = selectServerRam(ns);

    // pickedRam에서 totalCost가 기본값이 아니면
    if (pickedRam[1] != 0) {
        ns.tprint('고른 서버: ' + pickedRam[0] + ' GB');

        // 근데 타겟이 바꼈거나 다른 램을 살 수 있을때만
        if (isSmushed == 'true' || pickedRam[0] != ns.peek(5)) { 
            ns.tprint(`WARN 💻 서버 업글 가능!`);
            await installServer(ns, pickedRam);

        } else ns.tprint(`서버 냅둠`);
        
        // 다음 비교를 위해 램을 포트에 저장
        ns.clearPort(5);
        await ns.writePort(5, pickedRam[0]);

    } else ns.tprint(`초반이라 서버 살 돈이 없나봄`);
}

async function installServer(_ns, pickedRam) {
    ns = _ns;

    ns.exec('deleteServers.js', 'home');
    await ns.sleep(500);

    let boughtServerHackingTarget = ns.peek(2);
    let i = 0;

    ns.tprint(`서버 설치 중...`);

    while (i < ns.getPurchasedServerLimit()) {
        let host = ns.purchaseServer("s-" + i, pickedRam[0]);

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
    let ram = 16;
    let serverTotalCost = 0;
    let pickedRam = [16, 0];

    for (let i = 0; i < 9; ++i) {
        serverTotalCost = ns.getPurchasedServerCost(ram) * 25;

        if (ns.getServerMoneyAvailable('home') * 0.6 < serverTotalCost) {
            return pickedRam; // 맨 처음 루프에서 if에 걸리면 기본 값 [16, 0]을 리턴
        } else {
            pickedRam[0] = ram;
            pickedRam[1] = serverTotalCost; // 이건 순전히 최초 1회 비교용 변수
        }
        ram = ram * 2;
    }

    // 이전 램 보다 작으면 포트에 저장된 램으로 덮음
    if (pickedRam[0] <= ns.peek(5)) pickedRam[0] = ns.peek(5);
    return pickedRam;
}
