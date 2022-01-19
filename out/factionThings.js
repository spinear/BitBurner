/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    let factionServers = [
        "CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"
    ];
    let factionList = [
        "CyberSec", "NiteSec", "The Black Hand", "BitRunners"
    ];

    while (factionServers.length > 0) {
        await ns.sleep(60000);
        for (let i of factionServers) {
            if (ns.hasRootAccess(i)) {
                await connectNbackdoor(ns, i);
                await ns.sleep(30000);
                factionServers = factionServers.slice(1);
                for (let j of factionList) {
                    ns.joinFaction(j);
                }
            }
        }
    }
    ns.tprint(`INFO 🚪 BACKDOORED 🚪`)
}

// Stole from https://github.com/jaguilar/bitburner_scripts/blob/master/augment.js
function dfsToServer(ns, target) {
    function dfsToServerHelper(current, stack) {
        let parent = stack.length > 0 ? stack[stack.length - 1] : null;
        stack.push(current);

        if (current == target) {
            return stack;
        }

        let neighbors = ns.scan(current);
        for (let n of neighbors) {
            // Don't add the parent back onto the stack.
            if (n == parent)
                continue;
            let res = dfsToServerHelper(n, stack);
            if (res)
                return res;
        }
        stack.pop();
        return null;
    }
    return dfsToServerHelper("home", []);
}

async function connectNbackdoor(_ns, server) {
    ns = _ns;
    let path = dfsToServer(ns, server);

    if (!path) {
        throw new Error("no path to " + server);
    }
    ns.tprint(path);
    for (let s of path.slice(1)) {
        ns.connect(s);
    }
    await ns.installBackdoor();
    ns.connect('home');
}
