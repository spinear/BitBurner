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