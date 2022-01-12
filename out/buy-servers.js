import { runLoopHack, calcThreads } from "./myFunc";
import { boughtServerHackingTarget, boughtServerRam, loopHackFileName } from "./settings";

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;

    let ram = boughtServerRam;
    let i = 0;

    if(!checkCondition(ns)) return;

    while (i < ns.getPurchasedServerLimit()) {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            let host = ns.purchaseServer("s-" + i, ram);

            await ns.scp(loopHackFileName.weaken, host);
            await ns.scp(loopHackFileName.grow, host);
            await ns.scp(loopHackFileName.hack, host);

            let threadCalc = calcThreads(ns, host, loopHackFileName.weaken);
            
            runLoopHack(ns, loopHackFileName, host, threadCalc, boughtServerHackingTarget, 1);         
            ++i;
        } else {
            ns.tprint(`👾서버 살 돈 없어서 대기중 / 1분 마다 구매 시도`);
            await ns.sleep(60000);
        }        
    }
}

function checkCondition(_ns) {
    ns = _ns;
    if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(boughtServerHackingTarget) 
        || !ns.hasRootAccess(boughtServerHackingTarget)) {        
        ns.tprint(`해킹 할 서버가 레벨 높거나 포트 안 열려서 서버 안 삼`);
        return false;
    }
    return true;
}

// 자동으로 서버 램 선택하는 거 맹그는 중!

export function calcPSRamCost(_ns) {
    let ram = 8;
    let serverCostArray = [];
    let serverTotalCost = 0;
    let pickedCost = 0;

    for (let i = 0; i < 8; ++i) {
        serverCostArray[i] = ns.getPurchasedServerCost(ram);
        serverTotalCost = serverCostArray[i] * 25;
        ns.tprint(serverCostArray[i] + " " + ram + " " + ns.nFormat(serverTotalCost, '0.0a'));
        ram = ram * 2;
    }
    // 내 돈이 서버 25개 가격보다 적으면 
    // 어레이 -1값이 현찰박치기로 살 수 있는 서버인데
    // 이게 몇 램인지 알아야 되니깐 램을 저장해야 되나? 암튼 일케 해볼꺼임
}