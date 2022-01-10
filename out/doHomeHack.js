import { calcThreads, runLoopHack } from "./myFunc.js";
import { homeHackingTarget, initialThreads, loopHackFileName } from "./settings.js";

/** @param {import(".").NS } ns */

export function main(ns) {
	let host = "home";
	
	for (let i = 0; i < homeHackingTarget.length; ++i) {
		let target = homeHackingTarget[i];

		// 해킹 파일 3개 중 1개로 쓰레드를 계산
		let calculatedThreads = calcThreads(ns, host, loopHackFileName.weaken);		
	
		// 각 인스턴스 쓰레드 / 서버 번호에 따라 점점 커짐
		let singleTargetThreads = ((i + 1) * initialThreads);

		// TODO : Analyze 넣어서 계산 해보기
		let homeSingleThreads = {};
		homeSingleThreads.hack = Math.floor(singleTargetThreads * 0.2);
		if (homeSingleThreads.hack < 1) ++homeSingleThreads.hack;
		homeSingleThreads.weaken = Math.floor(singleTargetThreads * 0.2);
		if (homeSingleThreads.weaken < 1) ++homeSingleThreads.weaken;
		homeSingleThreads.grow = Math.floor(singleTargetThreads * 0.6);

		let homeTotalThreads = 
			homeSingleThreads.hack + homeSingleThreads.weaken + homeSingleThreads.grow;

		if (homeTotalThreads > calculatedThreads.useableThreads 
			|| singleTargetThreads > calculatedThreads 
			|| !calculatedThreads.isSucceed) {
			ns.tprint('💩집에 램 모잘러...'); 
			return;
		}

		if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(target) && ns.hasRootAccess(target))
			runLoopHack(ns, loopHackFileName, host, homeSingleThreads, target, (i + 1));
		else
			ns.tprint('💩레벨 낮엉');
	}
}