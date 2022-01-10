import { calcThreads, runLoopHack } from "./myFunc.js";
import { homeHackingTarget, initialThreads, loopHackFileName } from "./settings.js";

/** @param {import(".").NS } ns */

export function main(ns) {
	let host = "home";
	
	for (let i = 0; i < homeHackingTarget.length; ++i) {
		let target = homeHackingTarget[i];

		// 파일 1개로 집에 남은 쓰레드를 계산
		let singleFileThreads = calcThreads(ns, host, loopHackFileName.weaken);

		// 그걸로 파일 3개일 때 몇 쓰레드인지 계산
		let totalFileThreads = singleFileThreads.useableThreads * 3;
	
		// 이건 정해진 쓰레드
		let singleTargetThreads = ((i + 1) * initialThreads);

		// 애초에 쓰레드 계산 실패거나 정해진 쓰레드 7이 파일 1개 x 3개로 계산한 쓰레드보다 크면 실패
		if (singleTargetThreads > totalFileThreads || !singleFileThreads.isSucceed) { 
			ns.tprint('💩집에 램 모잘...'); 
			return;
		}

		// 이제 정해진 쓰레드를 파일 3개로 분리해야 됨
		let homeSingleThreads = {};
		homeSingleThreads.hack = Math.floor(singleTargetThreads * 0.1);
		if (homeSingleThreads.hack < 1) ++homeSingleThreads.hack;
		homeSingleThreads.weaken = Math.floor(singleTargetThreads * 0.2);
		if (homeSingleThreads.weaken < 1) ++homeSingleThreads.weaken;
		homeSingleThreads.grow = Math.floor(singleTargetThreads * 0.7);

		if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(target) && ns.hasRootAccess(target))
			//ns.exec(filename, host, threads, target, moneyThresh, securityThresh, threads);
			runLoopHack(ns, loopHackFileName, host, homeSingleThreads, target, (i + 1));
		else
			ns.tprint('💩레벨 낮엉');
	}
}

// TEST!!!dfgdfg
