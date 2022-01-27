/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    if (ns.getFactionRep(ns.args[0]) > 500000)
        ns.exec('installAugmentations.js', 'home');

}