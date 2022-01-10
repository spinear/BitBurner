/** @type import(".").NS */
let ns = null;

export function runLoopHack(_ns, loopHackFileName, host, threadCalc, target, numInstances) {
    ns = _ns;
    ns.exec(loopHackFileName.weaken, host, threadCalc.weaken, target, numInstances);
    ns.exec(loopHackFileName.grow, host, threadCalc.grow, target, numInstances);
    ns.exec(loopHackFileName.hack, host, threadCalc.hack, target, numInstances);
}

//쓰레드 계산 
export function calcThreads(_ns, host, filename) {
    ns = _ns;
    let maxRam = ns.getServerMaxRam(host);
    let usedRam = ns.getServerUsedRam(host);
    let jsRam = ns.getScriptRam(filename);
    let isSucceed = false;

    let useableThreads = Math.floor((maxRam - usedRam) / jsRam);
    let remainingRam = maxRam - usedRam;

    if (useableThreads > 2) isSucceed = true;
    else isSucceed = false;

    let hack = Math.floor(useableThreads * 0.2);
    if (hack < 1) ++hack;
    let weaken = Math.floor(useableThreads * 0.2);
    if (weaken < 1) ++weaken;
    let grow = Math.floor(useableThreads * 0.6);

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

