/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    ns.travelToCity('Chongqing');
}