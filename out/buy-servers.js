import { runLoopHack, calcThreads } from "./myFunc";
import { loopHackFileName } from "./settings";

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    let isSmushed = ns.peek(3);

    // 가진 돈에 맞는 서버를 선택
    let pickedRam = selectServerRam(ns);

    // 어느 램이든 서버를 살 수 있을 때
    if (pickedRam[1]) {
        // 서버가 이미 존재하는지 검사 후 존재하는 서버의 램을 get
        // 서버가 없으면 jserverRam = 0
        let doIhaveServers = false;
        let jServerRam = 0;
        let j = ns.scan('home');

        for (let i of j) {
            if (i === 's-0') {
                doIhaveServers = true;
                ns.clearPort(5);
                await ns.writePort(5, 'true');
                jServerRam = ns.getServerMaxRam(i);
                break;
            }
        }

        // 타겟이 바뀌면 무조건 서버 재구매
        if (isSmushed === 'true') {
            ns.tprint(`WARN 💻 서버 타겟 교체 -> ${ns.peek(2)} / ${pickedRam[0]} GB`);

            // 근데 지금 가진 서버보다 작으면 안됨!
            if (pickedRam[0] < jServerRam) {
                ns.tprint(`ERROR 💻 돈이 적음! 돈 생길때까지 루프 검사 할꺼임`);
                while (pickedRam[0] < jServerRam) {
                    pickedRam = selectServerRam(ns);
                    await ns.sleep(10000);
                    ns.tprint(`WARN 💻 돈 기둘리는 중...${pickedRam[0]} GB`);
                }
                ns.tprint(`INFO 💻 이제 돈 생긴듯? ${pickedRam[0]} GB`);
            }
            await installServer(ns, pickedRam);
            return;
        }

        // 서버가 이미 있는데 낮은 램으로 교체하는 거 방지
        if (doIhaveServers && pickedRam[0] <= jServerRam) {
            ns.tprint(`서버 냅둠 / 현재 서버: ${jServerRam} GB / 지금 고른 램: ${pickedRam[0]} GB`);
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

        await ns.scp(loopHackFileName.vWeaken, host);
        await ns.scp(loopHackFileName.vGrow, host);
        await ns.scp(loopHackFileName.vHack, host);

        let threadCalc = calcThreads(ns, host, loopHackFileName.vWeaken);
        runLoopHack(ns, loopHackFileName, host, threadCalc, boughtServerHackingTarget, 1);
        await ns.sleep(1500);
        ++i;
    }
    ns.tprint(`😎 서버 설치 완료`);
}

export function selectServerRam(_ns) {
    ns = _ns;
    let ram = 8;
    let pickedRam = [ram, false];

    // 루프를 돌면서 pickedRam[0]에 내가 살수 있는 램을 넣다가 내 돈이 모자르면 
    // 이전에 저장된 램이 내가 살 수 있는 램이므로 그걸 리턴
    for (let i = 0; i < 12; ++i) {
        // 큰 서버를 살때 돈이 다 털리는걸 막기 위해 몇 램부터 돈을 50퍼 남김
        let ratio = i > 8 ? 0.5 : 1;
        if (ns.getServerMoneyAvailable('home') * ratio < ns.getPurchasedServerCost(ram) * 25) {
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
