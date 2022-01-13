import { runLoopHack, calcThreads } from "./myFunc";
import { loopHackFileName } from "./settings";

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;

    let boughtServerHackingTarget = ns.peek(2);
    let isSmushed = ns.peek(3);
 
    let pickedRam = selectServerRam(ns);

    ns.tprint('고른 서버: ' + pickedRam + ' GB');

    if (isSmushed == 'true') {
        ns.exec('deleteServer.js', 'home');
        ns.tprint(`WARN 💻 타겟 바껴서 서버 재설치!`);
        await ns.sleep(500);

        let i = 0;
        while (i < ns.getPurchasedServerLimit()) {
            let host = ns.purchaseServer("s-" + i, pickedRam);

            await ns.scp(loopHackFileName.weaken, host);
            await ns.scp(loopHackFileName.grow, host);
            await ns.scp(loopHackFileName.hack, host);

            let threadCalc = calcThreads(ns, host, loopHackFileName.weaken);

            runLoopHack(ns, loopHackFileName, host, threadCalc, boughtServerHackingTarget, 1);
            ++i;
        }
    }
}

// 자동으로 서버 램 선택하는 거 맹그는 중!

export function selectServerRam(_ns) {
    ns = _ns;
    let ram = 8;
    let serverTotalCost = 0;
    let pickedRam = 8;

    for (let i = 0; i < 8; ++i) {
        serverTotalCost = ns.getPurchasedServerCost(ram) * 25;
        if (ns.getServerMoneyAvailable('home') < serverTotalCost) {
            return pickedRam;
        } else {
            pickedRam = ram;
        }
        ram = ram * 2;
    }
    return pickedRam;
    // 내 돈이 서버 25개 가격보다 적으면 
    // 어레이 -1값이 현찰박치기로 살 수 있는 서버인데
    // 이게 몇 램인지 알아야 되니깐 램을 저장해야 되나? 암튼 일케 해볼꺼임
}

// function checkCondition(_ns, boughtServerHackingTarget) {
//     ns = _ns;
//     if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(boughtServerHackingTarget) 
//         || !ns.hasRootAccess(boughtServerHackingTarget)) {        
//         ns.tprint(`해킹 할 서버가 레벨 높거나 포트 안 열려서 서버 안 삼`);
//         return false;
//     }
//     return true;
// }

