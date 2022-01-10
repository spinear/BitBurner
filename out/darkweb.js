/** @param {NS} ns **/
export async function main(ns) {
	while (true) {
		darkweb(ns);
		await ns.sleep(60000);
	}
}

function darkweb(ns) {
	//ns.purchaseTor();
	ns.purchaseProgram("AutoLink.exe");
	ns.purchaseProgram("brutessh.exe");
	ns.purchaseProgram("ServerProfiler.exe");
	ns.purchaseProgram("ftpcrack.exe");
	ns.purchaseProgram("deepscanv1.exe");
	ns.purchaseProgram("relaysmtp.exe");
	ns.purchaseProgram("httpworm.exe");
	ns.purchaseProgram("deepscanv2.exe");
	ns.purchaseProgram("sqlinject.exe");
}