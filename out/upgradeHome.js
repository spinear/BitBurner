/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    if (ns.getServerMoneyAvailable('home') > ns.getUpgradeHomeRamCost())
        ns.upgradeHomeRam();
    if (ns.getServerMoneyAvailable('home') > ns.getUpgradeHomeCoresCost())
        ns.upgradeHomeCores();
}