import { loopHackFileName } from "./settings";

/** @type import(".").NS */
let ns = null;

export function killHackScripts(_ns, target) {
    ns = _ns;
    if (target != 'home') {
        ns.killall(target);
    }
    else {
        ns.scriptKill(loopHackFileName.vWeaken, target);
        ns.scriptKill(loopHackFileName.vGrow, target);
        ns.scriptKill(loopHackFileName.vHack, target);
        ns.scriptKill('share.js', target);
    }
}

export function runLoopHack(_ns, loopHackFileName, host, threadCalc, target, instanceNum) {
    ns = _ns;
    ns.exec(loopHackFileName.vWeaken, host, threadCalc.vWeaken, target, instanceNum);
    ns.exec(loopHackFileName.vGrow, host, threadCalc.vGrow, target, instanceNum);
    ns.exec(loopHackFileName.vHack, host, threadCalc.vHack, target, instanceNum);
}

export function letsShare(_ns, useableShare) {
    ns = _ns;
    ns.exec('share.js', 'home', useableShare);
    //ns.tprint('INFO ' + ns.getSharePower());
}

//쓰레드 계산 
export function calcThreads(_ns, host, filename) {
    ns = _ns;
    let maxRam = ns.getServerMaxRam(host)

    // 이건 '내 컴'의 레시오임! 'home' 빼먹으면 망함!
    // 싱귤레러티 API가 실행 된 채로 쓰레드 계산이 들어가서
    // buy-server + deleteServer 공간만 있으면 됨.
    let ratio =
        host === 'home' && maxRam <= 32 ? 0.8
            : host === 'home' && maxRam <= 512 ? 0.875
                : host === 'home' && maxRam >= 1024 ? 0.5 // 이때부턴 share()를 쓰기 위해 더 비움
                    : 1;

    maxRam *= ratio;
    let usedRam = ns.getServerUsedRam(host);
    let jsRam = ns.getScriptRam(filename);
    let useableShare = 0;
    let isSucceed = false;

    let useableThreads = Math.floor((maxRam - usedRam) / jsRam);
    let remainingRam = Math.floor(maxRam - usedRam);

    if (useableThreads > 3) isSucceed = true;
    else isSucceed = false;

    let [hackRatio, weakenRatio, growRatio] = [0, 0, 0];
    let tmpHackingLvl = ns.getHackingLevel();

    // 레벨에 따라 해킹 파일 쓰레드 조절
    [hackRatio, weakenRatio, growRatio] =
        tmpHackingLvl <= 800 ? [0.2, 0.3, 0.5]
            : tmpHackingLvl <= 2000 ? [0.125, 0.175, 0.7]
                : tmpHackingLvl <= 3000 ? [0.015, 0.185, 0.8]
                    : [0.01, 0.15, 0.84]

    let vHack = Math.max(Math.floor(useableThreads * hackRatio), 1);
    let vWeaken = Math.max(Math.floor(useableThreads * weakenRatio), 1);
    let vGrow = Math.max(Math.floor(useableThreads * growRatio), 1);

    // 쉐어 계산 
    if (ratio === 0.5) {
        let shareRam = ns.getServerMaxRam(host) * 0.4;
        let shareFileRam = ns.getScriptRam('share.js');
        useableShare = Math.floor(shareRam / shareFileRam);
        letsShare(ns, useableShare);
    }

    const useableThreadsObj = {
        maxRam: maxRam,
        usedRam: usedRam,
        remainingRam: remainingRam,
        useableThreads: useableThreads,
        vHack: vHack,
        vWeaken: vWeaken,
        vGrow: vGrow,
        isSucceed: isSucceed,
        useableShare: useableShare,
    }
    return useableThreadsObj;
}
