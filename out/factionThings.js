import { factionList, factionServers } from './settings';

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    let fl = factionList;
    let fs = factionServers;

    // 포루프에서 백도어를 깔고 어레이를 slice하는데 다 지우지 못했다면 무한 루프를 돈다
    while (fs.length > 0) {
        ns.print(fs);
        await ns.sleep(60000);
        for (let i of fs) {
            if (ns.hasRootAccess(i)) {
                await connectNbackdoor(ns, i);
                await ns.sleep(30000);
                fs = fs.slice(1);
                for (let j of fl) {
                    ns.joinFaction(j);
                }
            }
        }
    }
    ns.tprint(`INFO 🚪 빽도어 & 팩션 가입 끝... 아님 어쩔 수 엄꽁... 🚪`)
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
    ns.print(path);
    for (let s of path.slice(1)) {
        ns.connect(s);
    }
    await ns.installBackdoor();
    ns.connect('home');
}
