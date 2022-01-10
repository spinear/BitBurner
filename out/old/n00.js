/** @param {NS} ns **/

export async function main(ns) {
    let target = ns.args[0];
    let moneyThresh = ns.args[1];
    let securityThresh = ns.args[2];
    let threadsOption = ns.args[3];
    
    while(true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);

        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target);
            
        } else {
            await ns.hack(target, { threads: threadsOption });
        }
    }
}