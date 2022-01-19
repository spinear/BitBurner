import { calcThreads, killHackScripts, runLoopHack } from "./myFunc.js";
import { loopHackFileName } from "./settings.js";

/** @type import(".").NS */
let ns = null;

export async function main(_ns) {
	ns = _ns;

	let host = "home";
	let target = ns.peek(2);
	let isSmushed = ns.peek(3);

	let calcedThreads = calcThreads(ns, host, loopHackFileName.weaken);

	if (isSmushed == 'true') {
		killHackScripts(ns, 'home');
		calcedThreads = calcThreads(ns, host, loopHackFileName.weaken);
		runLoopHack(ns, loopHackFileName, host, calcedThreads, target, 1);
		return;
	}

	if ((calcedThreads.remainingRam / calcedThreads.maxRam * 100) > 50) {
		ns.tprint(`집에 램 증가로 스크립트 재실행!`)
		killHackScripts(ns, 'home');
		calcedThreads = calcThreads(ns, host, loopHackFileName.weaken);
		runLoopHack(ns, loopHackFileName, host, calcedThreads, target, 1);
		return;
	}
}
