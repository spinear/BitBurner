import { factionWorksObj as fwo } from './settings';

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    //if (ns.getServerMaxRam('home') < 512) return;
    fwo.factionList.forEach(flist => {
        const augs = ns.getAugmentationsFromFaction(flist);
        for (let aug of augs) {
            const repCost = ns.getAugmentationRepReq(aug);
            const moneyCost = ns.getAugmentationPrice(aug);
            if (ns.getFactionRep(flist) > repCost && ns.getServerMaxMoney('home') > moneyCost) {
                ns.purchaseAugmentation(aug);
            }
        }
    });
}