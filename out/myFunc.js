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
    let maxRam = ns.getServerMaxRam(host);
    let usedRam = ns.getServerUsedRam(host);
    let jsRam = ns.getScriptRam(filename);
    let isSucceed = false;

    let useableThreads = Math.floor((maxRam - usedRam) / jsRam);
    let rawThreads = Math.floor(maxRam / jsRam);
     
    if (useableThreads > 2) isSucceed = true;
    else isSucceed = false;

    // TODO: 계산해서 쓰레드 분배하는 거 만들기
    let hack = Math.floor(useableThreads * 0.05);
    if (hack < 1) ++hack;
    let weaken = Math.floor(useableThreads * 0.15);
    if (weaken < 1) ++weaken;
    let grow = Math.floor(useableThreads * 0.8);

    const useableThreadsObj = {
        maxRam: maxRam,
        usedRam: usedRam,
        rawThreads: rawThreads,
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

	if (target != "home") { 
		ns.killall(target);
	}
	else {
		ns.scriptKill(loopHackFileName.weaken, target);
		ns.scriptKill(loopHackFileName.grow, target);
		ns.scriptKill(loopHackFileName.hack, target);
	}
}

