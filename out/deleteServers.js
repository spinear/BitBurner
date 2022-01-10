/** @param {NS} ns **/

export async function main(ns) {
    var pserv = ns.getPurchasedServers();

    for( var i = 0; i < pserv.length; ++i ) {
        var serv = pserv[i];
        ns.killall(serv);
        ns.deleteServer(serv);
    }
    ns.tprint(`다 지움`);
}