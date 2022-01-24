import { factionWorksObj as fwo } from './settings';

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    fwo.factionList.forEach(flist => {
        const augs = ns.getAugmentationsFromFaction(flist);
        augs.forEach(aug => {
            const repCost = ns.getAugmentationRepReq(aug);
            const moneyCost = ns.getAugmentationPrice(aug);
            if (ns.getFactionRep(flist) > repCost
                && ns.getServerMoneyAvailable('home') * 0.5 > moneyCost) {
                ns.purchaseAugmentation(flist, aug);
            }
        });
    });
}