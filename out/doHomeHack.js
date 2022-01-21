import { calcThreads, killHackScripts, runLoopHack } from "./myFunc.js";
import { loopHackFileName } from "./settings.js";

/** @type import(".").NS */
let ns = null;
let host = 'home';

export async function main(_ns) {
	ns = _ns;
	let isSmushed = ns.peek(3);
	let calcedThreads = calcThreads(ns, host, loopHackFileName.vWeaken);

	if (isSmushed == 'true') {
		ns.tprint(`집에 타겟 변경으로 스크립트 재실행!`)
		restartHomeScript(ns);
		return;
	}

	if ((calcedThreads.remainingRam / calcedThreads.maxRam * 100) > 30) {
		ns.tprint(`집에 램 증가로 스크립트 재실행!`)
		restartHomeScript(ns);
		return;
	}
}

function restartHomeScript(_ns) {
	ns = _ns;
	let target = ns.peek(2);
	killHackScripts(ns, 'home');
	let calcedThreads = calcThreads(ns, host, loopHackFileName.vWeaken);
	runLoopHack(ns, loopHackFileName, host, calcedThreads, target, 1);
}