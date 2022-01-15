/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
	ns = _ns;
	await init(ns);

	let tmpLVL = 0;

	while (true) {
		if (tmpLVL != ns.getHackingLevel()) {
			ns.exec('nukeServers.js', 'home');
			await ns.sleep(500);

			ns.exec('SelectTarget.js', 'home');
			await ns.sleep(500);

			ns.exec('doHomeHack.js', 'home');
			await ns.sleep(1000);

			ns.exec('doExtServerHack.js', 'home');
			await ns.sleep(1000);

			ns.exec('buy-servers.js', 'home');
		}
		ns.print(`INFO 💰타겟이 가진 돈 ${ns.nFormat(ns.getServerMoneyAvailable(ns.peek(1)), '0.0a')} 💰`);
		ns.print(`INFO 🎉포트 1: ${ns.peek(1)} 포트 2: ${ns.peek(2)} 포트 3: ${ns.peek(3)} 포트 5: ${ns.peek(5)}`);
		tmpLVL = ns.getHackingLevel();
		await ns.sleep(60000);
	}
}

async function init(_ns) {
	ns = _ns;
	ns.tail();
	ns.clearPort(1); // 비교에 쓸 임시 타겟
	ns.clearPort(2); // 조건 부 타겟
	ns.clearPort(3); // 스트링 불린
	ns.clearPort(4); // 조건 부 타겟의 -1 서버로 상점이 씀
	ns.clearPort(5); // 구매 서버 램 임시 저장
	await ns.writePort(5, 0);
}

