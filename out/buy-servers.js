import { runLoopHack, calcThreads } from "./myFunc";
import { loopHackFileName } from "./settings";

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    let isSmushed = ns.peek(3);
    let pickedRam = selectServerRam(ns);

    // 어느 램이든 서버를 살 수 있을 때
    if (pickedRam[1]) {

        // 서버가 이미 존재하는지 검사 후 램 get
        // 서버가 없으면 jserverRam = 0      
        let doIhaveServers = false;
        let jServerRam = 0;
        let j = ns.scan('home');

        for (let i of j) {
            if (i === 's-0') {
                doIhaveServers = true;
                jServerRam = ns.getServerMaxRam(i);
                break;
            }
        }

        // 서버가 있던 말건 램이 적던 말던 타겟이 바뀌면 타겟 교체
        // 왜냐면 한번 놓치면 다시 못하기 때문에!
        // ❌❌❌근데 true일때 돈이 없어서 못사면 다음 true까지 못바꾸는 거. 
        if (isSmushed === 'true') {
            ns.tprint(`WARN 💻 서버 타겟 교체 -> ${ns.peek(2)} / ${pickedRam[0]} GB`);
            await installServer(ns, pickedRam);
            return;
        }

        // 서버가 이미 있는데 낮은 램으로 교체하는 거 방지
        // 스크립트 껐다 켰을 때 무조건 서버 다시 사는 거 방지
        if (doIhaveServers && pickedRam[0] <= jServerRam) {
            ns.tprint(`서버 냅둠 / 현재 서버: ${jServerRam} GB 지금 고른 램: ${pickedRam[0]} GB`);
            return;
        }

        // 이전 램 보다 클 때
        if (pickedRam[0] > jServerRam) {
            ns.tprint(`WARN 💻 서버 업글: ${jServerRam} GB -> ${pickedRam[0]} GB`);
            await installServer(ns, pickedRam);
            return;
        }
    } else
        ns.tprint(`서버 살 돈이 없썽!`);
}

async function installServer(_ns, pickedRam) {
    ns = _ns;

    ns.exec('deleteServers.js', 'home');
    await ns.sleep(500);

    let boughtServerHackingTarget = ns.peek(2);
    let i = 0;

    ns.tprint(`서버 설치 중...`);

    while (i < ns.getPurchasedServerLimit()) {
        let host = ns.purchaseServer('s-' + i, pickedRam[0]);

        await ns.scp(loopHackFileName.weaken, host);
        await ns.scp(loopHackFileName.grow, host);
        await ns.scp(loopHackFileName.hack, host);

        let threadCalc = calcThreads(ns, host, loopHackFileName.weaken);
        runLoopHack(ns, loopHackFileName, host, threadCalc, boughtServerHackingTarget, 1);
        await ns.sleep(1500);
        ++i;
    }
    ns.tprint(`😎 서버 설치 완료`);
}

export function selectServerRam(_ns) {
    ns = _ns;
    let ram = 8;
    let pickedRam = [ram, false]; // 최초값 port 5 = null

    for (let i = 0; i < 10; ++i) {
        if (ns.getServerMoneyAvailable('home') < ns.getPurchasedServerCost(ram) * 25) {
            // 맨 처음 루프에서 if에 걸리면 기본 값을 리턴
            return pickedRam;
        } else {
            pickedRam[0] = ram;
            pickedRam[1] = true;
        }
        ram = ram * 2;
    }
    return pickedRam; // 루프 끝나고 리턴 빼먹으면 클남!!!
}
