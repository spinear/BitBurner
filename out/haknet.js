/** @param {NS} ns **/

export async function main(ns) {
    let hola = 25;

    if (!ns.args[0]) {
        ns.tprint(`아규먼트로 개수 안 넣어서 디폴트 ${hola}개 삼!`);
    }

    if (ns.args[0] <= ns.hacknet.numNodes()) {
        ns.tprint(`이미 ${ns.hacknet.numNodes()}개 있음!`);
        hola = ns.hacknet.numNodes();
    }

    if (ns.args[0] > ns.hacknet.numNodes()) {
        ns.tprint(`${ns.hacknet.numNodes()}개에서 ${ns.args[0]}개로 증가할꺼임.`);
        hola = ns.args[0];
    }

    while (ns.hacknet.numNodes() < hola) {
        if (ns.hacknet.getPurchaseNodeCost() > ns.getServerMoneyAvailable("home")) {
            ns.tprint(`돈없엉!`);
            break;
        } else {
            ns.hacknet.purchaseNode();
            ns.tprint(`${ns.hacknet.numNodes()}개 삼!`);
        }
    }

    //업그래이드는 무조건 시도
    for (let i = 0; i < ns.hacknet.numNodes(); ++i) {
        ns.hacknet.upgradeLevel(i, 199);
        ns.hacknet.upgradeRam(i, 6);
        ns.hacknet.upgradeCore(i, 15);
    }
}