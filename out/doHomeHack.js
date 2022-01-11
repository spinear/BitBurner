import { calcThreads, killHackScripts, runLoopHack } from "./myFunc.js";
import { loopHackFileName } from "./settings.js";

/** @type import(".").NS */
let ns = null;

export async function main(_ns) {
	ns = _ns;

	let host = "home";

	let target = ns.peek(2);
	let isSmushed = ns.peek(3);

	if (isSmushed == "true" && ns.hasRootAccess(target)) {
		killHackScripts(ns, "home");
		let calculatedThreads = calcThreads(ns, host, loopHackFileName.weaken);
		runLoopHack(ns, loopHackFileName, host, calculatedThreads, target, 1);		
	}
	else
		ns.tprint('🎀홈 해킹 업뎃 안함. 할 필요 없거나 타겟 포트가 안 열렸거나');
}

