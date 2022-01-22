/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
	ns = _ns;
	// 자체 루프 혹은 원샷 스크립트
	await init(ns);
	while (true) {
		// 서버를 안샀으면 프로그램 구매 안함
		if (ns.peek(5) === 'true') ns.exec('darkweb.js', 'home');

		ns.exec('nukeServers.js', 'home');
		await ns.sleep(500);

		ns.exec('factionJoin.js', 'home');
		await ns.sleep(2000); // 32GB 일 때를 대비해서 buy-server랑 동시에 실행 안되게 딜레이
		ns.exec('factionWorks.js', 'home');
		await ns.sleep(500);

		ns.exec('selectTarget.js', 'home');
		await ns.sleep(500);
		ns.exec('doHomeHack.js', 'home');
		await ns.sleep(500);
		ns.exec('doExtServerHack.js', 'home');
		await ns.sleep(1000);
		ns.exec('buy-servers.js', 'home');

		ns.print(`INFO 💰타겟이 가진 돈 ${ns.nFormat(ns.getServerMoneyAvailable(ns.peek(1)), '0.0a')} 💰`);
		ns.print(`INFO 🎉포트 1: ${ns.peek(1)} 포트 3: ${ns.peek(3)}`);

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
	ns.clearPort(5); // 서버 존재 여부 불린
	await ns.writePort(5, 'false');
}