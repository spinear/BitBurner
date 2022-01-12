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
}
