import { loopHackFileName } from "./settings";

/** @type import(".").NS */
let ns = null;

export function runLoopHack(_ns, loopHackFileName, host, threadCalc, target, instanceNum) {
    ns = _ns;
    ns.exec(loopHackFileName.weaken, host, threadCalc.weaken, target, instanceNum);
    ns.exec(loopHackFileName.grow, host, threadCalc.grow, target, instanceNum);
    ns.exec(loopHackFileName.hack, host, threadCalc.hack, target, instanceNum);
}

//쓰레드 계산 
export function calcThreads(_ns, host, filename) {
    ns = _ns;
    let maxRam = ns.getServerMaxRam(host)
    let ratio =
        host === 'home' && maxRam <= 32 ? 0.4
            : host === 'home' && maxRam <= 64 ? 0.7
                : host === 'home' && maxRam <= 128 ? 0.85
                    : host === 'home' && maxRam > 128 ? 0.9
                        : 1;
    maxRam = maxRam * ratio;
    let usedRam = ns.getServerUsedRam(host);
    let jsRam = ns.getScriptRam(filename);
    let isSucceed = false;

    let useableThreads = Math.floor((maxRam - usedRam) / jsRam);
    let remainingRam = Math.floor(maxRam - usedRam);

    if (useableThreads > 3) isSucceed = true;
    else isSucceed = false;

    let [hackRatio, weakenRatio, growRatio] = [0, 0, 0];
    let tmpHackingLvl = ns.getHackingLevel();

    [hackRatio, weakenRatio, growRatio] =
        tmpHackingLvl <= 800 ? [0.2, 0.3, 0.5]
            : tmpHackingLvl <= 2000 ? [0.125, 0.175, 0.7]
                : [0.015, 0.185, 0.8];

    let hack = Math.floor(useableThreads * hackRatio);
    if (hack < 1) ++hack;
    let weaken = Math.floor(useableThreads * weakenRatio);
    if (weaken < 1) ++weaken;
    let grow = Math.floor(useableThreads * growRatio);

    const useableThreadsObj = {
        maxRam: maxRam,
        usedRam: usedRam,
        remainingRam: remainingRam,
        useableThreads: useableThreads,
        hack: hack,
        weaken: weaken,
        grow: grow,
        isSucceed: isSucceed
    }
    return useableThreadsObj;
}

export function killHackScripts(_ns, target) {
    ns = _ns;

    if (target != 'home') {
        ns.killall(target);
    }
    else {
        ns.scriptKill(loopHackFileName.weaken, target);
        ns.scriptKill(loopHackFileName.grow, target);
        ns.scriptKill(loopHackFileName.hack, target);
    }
}

