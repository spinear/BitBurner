import { factionWorksObj as fwo } from './settings';

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    // factionServer에만 백도어를 깔고 factionList는 무조건 조인함
    // 백도어를 이미 깔았는지 팩션에 가입되어있는지 알 수가 없으므로 루프마다 실행함
    for (let i of fwo.factionServers) {
        if (ns.hasRootAccess(i)) await connectNbackdoor(ns, i);
    }
    fwo.factionList.forEach(j => ns.joinFaction(j));
}

// Stole from https://github.com/jaguilar/bitburner_scripts/blob/master/augment.js
function dfsToServer(_ns, target) {
    ns = _ns;
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
