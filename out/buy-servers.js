import { runLoopHack, calcThreads } from "./myFunc";
import { loopHackFileName } from "./settings";

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;

    let isSmushed = ns.peek(3);
    let pickedRam = selectServerRam(ns);
    
    if (pickedRam[1] != 0 ) {
        ns.tprint('고른 서버: ' + pickedRam[0] + ' GB');
        
        // if (pickedRam[0] != ns.getServerMaxRam('s-1')) { 
        //     ns.tprint(`WARN 💻 새 램 낄수 있어서 서버 재설치! ${ns.getServerMaxRam('s-1')}`);
        //     await installServer(ns, pickedRam);
        //     return;            
        // }

        if (isSmushed == 'true') {
            ns.tprint(`WARN 💻 타겟 바껴서 서버 재설치!`);
            await installServer(ns, pickedRam);            
        } else {
            ns.tprint(`타겟 안바껴서 서버 냅둠`);
        }
    } else {
        ns.tprint(`초반이라 서버 살 돈이 없나봄`);
    }
}

async function installServer(_ns, pickedRam) {
    ns = _ns;
    
    ns.exec('deleteServers.js', 'home');
    await ns.sleep(500);

    let boughtServerHackingTarget = ns.peek(2);
    let i = 0;
    while (i < ns.getPurchasedServerLimit()) {
        let host = ns.purchaseServer("s-" + i, pickedRam[0]);

        await ns.scp(loopHackFileName.weaken, host);
        await ns.scp(loopHackFileName.grow, host);
        await ns.scp(loopHackFileName.hack, host);

        let threadCalc = calcThreads(ns, host, loopHackFileName.weaken);

        runLoopHack(ns, loopHackFileName, host, threadCalc, boughtServerHackingTarget, 1);
        ++i;
    }
}
// 자동으로 서버 램 선택하는 거 맹그는 중!

export function selectServerRam(_ns) {
    ns = _ns;
    let ram = 16;
    let serverTotalCost = 0;
    let pickedRam = [16, 0];

    for (let i = 0; i < 8; ++i) {
        serverTotalCost = ns.getPurchasedServerCost(ram) * 25;
        if (ns.getServerMoneyAvailable('home') < serverTotalCost) {
            return pickedRam;
        } else {
            pickedRam[0] = ram;
            pickedRam[1] = serverTotalCost;
        }
        ram = ram * 2;
    }
    return pickedRam;
}
