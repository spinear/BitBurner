/** @param {import(".").NS } ns */

export async function main(ns) {
	while(true) {
		ns.exec("nukeServers.js", "home");
		await ns.sleep(500);

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

