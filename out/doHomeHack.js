import { calcThreads, runLoopHack } from "./myFunc.js";
import { advHomeTarget, loopHackFileName } from "./settings.js";

/** @type import(".").NS */
let ns = null;

export async function main(_ns) {
	ns = _ns;

	let host = "home";

	let isSmushed = await SelectTarget(ns);
	let target = ns.peek(2);

	let calculatedThreads = calcThreads(ns, host, loopHackFileName.weaken);

	if (isSmushed && ns.hasRootAccess(target)) {
		killHackScripts(ns, "home");
		await ns.sleep(500);
		runLoopHack(ns, loopHackFileName, host, calculatedThreads, target, 1);		
	}
	else
		ns.tprint('🎀홈 해킹 업뎃 안함. 할 필요 없거나 타겟 포트가 안 열렸거나');
}

export async function SelectTarget(_ns) {
	ns = _ns;

	let myLvl = ns.getHackingLevel();
	let tmpTarget = '';
	let isSmushed = false;

	for (let i = 0; i < advHomeTarget.length; ++i) {
		let targetLvl = ns.getServerRequiredHackingLevel(advHomeTarget[i]) * 4;

		if ((myLvl + 5) > targetLvl) {	
			tmpTarget = advHomeTarget[i];
		}
	}

	ns.clearPort(2);
	await ns.writePort(2, tmpTarget);

	let tmpPeek1 = ns.peek(1);
	let tmpPeek2 = ns.peek(2);

	ns.tprint(`ERROR 루프 후 포트 값 ${ns.peek(1)} ${ns.peek(2)}`);

	if (tmpPeek1 == tmpPeek2) {
		isSmushed = false;
		
	}		
	else {
		ns.clearPort(1);
		await ns.writePort(1, tmpPeek2);
		isSmushed = true;
	}
	
	ns.tprint(`ERROR 비교 후 포트 값 ${ns.peek(1)} ${ns.peek(2)}`);

	return isSmushed;
}

export function killHackScripts(_ns, target) {
	ns = _ns;

	if (target != "home") { 
		ns.killall();
	}
	else {
		ns.scriptKill(loopHackFileName.weaken, target);
		ns.scriptKill(loopHackFileName.grow, target);
		ns.scriptKill(loopHackFileName.hack, target);
	}
}