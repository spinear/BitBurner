import { calcThreads, runLoopHack } from "./myFunc.js";
import { advHomeTarget, homeHackingTarget, initialThreads, loopHackFileName } from "./settings.js";

/** @type import(".").NS */
let ns = null;

export function main(_ns) {
	ns = _ns;

	let host = "home";

	for (let i = 0; i < homeHackingTarget.length; ++i) {
		let target = homeHackingTarget[i];

		// 해킹 파일 3개 중 1개로 쓰레드를 계산
		let calculatedThreads = calcThreads(ns, host, loopHackFileName.weaken);

		// 각 인스턴스 쓰레드 / 서버 번호에 따라 점점 커짐
		let singleTargetThreads = ((i + 1) * initialThreads);

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

// 조건 만족하면 스크립트 킬 하고 선택된 서버로 교체 하는 거 맹거야됨
function SelectTarget(_ns) {
	ns = _ns;

	let myLvl = ns.getHackingLevel();
	let seletedTarget = [];

	for (let i = 0; i < advHomeTarget.length; ++i) {
		let targetLvl = (ns.getServerRequiredHackingLevel(advHomeTarget[i]) * 4);
		if (myLvl > targetLvl) {
			seletedTarget[0] = true;
			seletedTarget[1] = advHomeTarget[i];
			killHackScripts(ns, "home");
			return seletedTarget;
		}
	}
}

function killHackScripts(_ns, target) {
	ns = _ns;

	if (target != "home") ns.killall();
	else {
		ns.scriptKill(loopHackFileName.weaken, target);
		ns.scriptKill(loopHackFileName.grow, target);
		ns.scriptKill(loopHackFileName.hack, target);
	}
}
