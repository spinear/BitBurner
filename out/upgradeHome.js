/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    if (ns.getServerMoneyAvailable('home') * 0.75 > ns.getUpgradeHomeRamCost())
        ns.upgradeHomeRam();
    if (ns.getServerMoneyAvailable('home') * 0.75 > ns.getUpgradeHomeCoresCost())
        ns.upgradeHomeCores();
}