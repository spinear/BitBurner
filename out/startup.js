/** @param {import(".").NS } ns */

export async function main(ns) {
	ns.tail();
	ns.clearPort(1); // 임시 타겟
	ns.clearPort(2); // 조건 부 타겟
	ns.clearPort(3); // 스트링 불린
	let tmpLVL = 0;

	while (true) {

		if (tmpLVL != ns.getHackingLevel()) {
			ns.exec("nukeServers.js", "home");
			await ns.sleep(500);

			ns.exec("SelectTarget.js", "home");
			ns.print(`INFO 🎉포트 1: ${ns.peek(1)} 포트 2: ${ns.peek(2)} 포트 3: ${ns.peek(3)}`);
			await ns.sleep(500);

			ns.exec("doHomeHack.js", "home");
			ns.print(`INFO 🎉doExtServerHack 실행대기`);
			await ns.sleep(1000);

			ns.exec("doExtServerHack.js", "home");
			ns.print(`INFO 💰타겟이 가진 돈 ${ns.nFormat(ns.getServerMoneyAvailable(ns.peek(1)), '0.0a')} 💰`);
			ns.print(`INFO 🎉nukeServers && doHomeHack 실행대기`);
		}

		tmpLVL = ns.getHackingLevel();
		await ns.sleep(60000);
	}
}

