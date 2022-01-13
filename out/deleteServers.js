/** @param {NS} ns **/

export async function main(ns) {
    let pserv = ns.getPurchasedServers();

    for( let i = 0; i < pserv.length; ++i ) {
        let serv = pserv[i];
        ns.killall(serv);
        ns.deleteServer(serv);
    }
    ns.tprint(`서버 다 지움`);
}