import { hackingFileName, boughtServerHackingTarget } from "targetServerName.js";

/** @param {import("..").NS } ns */

export async function main(ns) {
    let ram = 512;
    let i = 0;

    if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(boughtServerHackingTarget) 
        || !ns.hasRootAccess(boughtServerHackingTarget)) {        
        ns.tprint(`해킹 할 서버가 레벨 높거나 포트 안 열려서 서버 안 삼`);
        return;
    }

    while (i < ns.getPurchasedServerLimit()) {
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            let host = ns.purchaseServer("s-" + i, ram);
            let useableThreads = Math.floor(ram / ns.getScriptRam(hackingFileName));

            await ns.scp(hackingFileName, host);
            
            ns.exec(
                hackingFileName, host, useableThreads, 
                boughtServerHackingTarget, 
                (ns.getServerMaxMoney(boughtServerHackingTarget) * 0.50), 
                (ns.getServerMinSecurityLevel(boughtServerHackingTarget) + 20),
                useableThreads
            )  
            ++i;

        } else {
            ns.tprint(`👾서버 살 돈 없어서 대기중 / 1분 마다 구매 시도`);
            await ns.sleep(60000);
        }        
    }
}