/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    for (let i = 0; i < 30; ++i) {
        ns.commitCrime('Homicide');
        await ns.sleep(5000);
    }
}