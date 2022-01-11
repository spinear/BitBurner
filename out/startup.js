/** @param {import(".").NS } ns */

export async function main(ns) {
	ns.tail();
 	ns.clearPort(1); // 임시 타겟
	ns.clearPort(2); // 조건 부 타겟
	ns.clearPort(3); // 스트링 불린

	while(true) {
		ns.exec("nukeServers.js", "home");
		await ns.sleep(200);

		ns.exec("SelectTarget.js", "home");
		await ns.sleep(300);
		ns.print(`WARN 🎉포트 1: ${ns.peek(1)} 포트 2: ${ns.peek(2)} 포트 3: ${ns.peek(3)}`);

		ns.exec("doHomeHack.js", "home");
		await ns.sleep(1000);
		ns.print(`INFO 🎉doExtServerHack 실행대기`);
		await ns.sleep(2000);

		ns.exec("doExtServerHack.js", "home");
		await ns.sleep(1000);
		ns.print(`INFO 🎉nukeServers && doHomeHack 실행대기`);
		await ns.sleep(60000);
	}	
}

