import { homeHackingTarget } from "targetServerName.js";
//import * as myf from "myFunc.js";

/** @param {import("..").NS } ns */

export async function main(ns) {
	let host = "home";
	let initialThreads = 40;	// 1번 파일 시작 쓰레드값
	let mt = 0.5; 				// moneyThresh 에 곱하는 값
	let st = 20;

	ns.exec("nukeServers.js", "home");

	await ns.sleep(750);

	for (let i = 0; i < homeHackingTarget.length; ++i) {

		let target = homeHackingTarget[i];
		let filename = '/homehack/hh0' + (i + 1) + '.js';

		//let threadCalc = myf.calcThreads(ns, host, filename);

		const moneyThresh = ns.getServerMaxMoney(target) * mt;
		const securityThresh = ns.getServerMinSecurityLevel(target) + st;

		let threads = ((i + 1) * initialThreads);

		// arg 0 : 해킹 타겟 서버 이름 // arg 1 : 머니 트레숄드
		// arg 2 : 보안레벨 트레숄드 // arg 3 : hack() 쓰레드 계산용

		if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(target)
			&& ns.hasRootAccess(target))
			ns.exec(filename, host, threads,
				target, moneyThresh, securityThresh, threads);
		else
			ns.tprint('레벨 낮엉');
	}
}