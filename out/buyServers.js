import { runLoopHack, calcThreads } from "./myFunc";
import { loopHackFileName } from "./settings";

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;
    const isSmushed = ns.peek(3);

    // 가진 돈에 맞는 서버를 선택
    let pickedRam = selectServerRam(ns);

    // 어느 램이든 서버를 살 수 있을 때
    if (pickedRam.bool) {
        // 서버가 이미 존재하는지 검사 후 존재하는 서버의 램을 get
        // 서버가 없으면 jserverRam = 0
        let doIhaveServers = false;
        let existingServerRam = 0;

        const j = ns.scan('home');
        for (const i of j) {
            // 15번 서버가 있으면 다 있다고 대충 대충 가정함.
            if (i === 's-15') {
                doIhaveServers = true;
                existingServerRam = ns.getServerMaxRam(i);
                ns.clearPort(5);
                await ns.writePort(5, 'true'); // startup에서 실행 조건을 위해 넣은것!
                break;
            }
        }

        // 타겟이 바뀌면 무조건 서버 재구매
        if (isSmushed === 'true') {
            ns.tprint(`WARN 💻 서버 타겟 교체 -> ${ns.peek(2)} / ${pickedRam.ram} GB`);

            // 근데 지금 가진 서버보다 작으면 안됨!
            if (pickedRam.ram < existingServerRam) {
                ns.tprint(`ERROR 💻 돈이 적음! 돈 생길때까지 루프 검사 할꺼임`);
                while (pickedRam.ram < existingServerRam) {
                    pickedRam = selectServerRam(ns);
                    await ns.sleep(20000);
                    ns.tprint(`WARN 💻 ${existingServerRam} GB 될 때까지 돈 기둘리는 중... 현재 ${pickedRam.ram} GB `);
                }
                ns.tprint(`INFO 💻 이제 돈 생긴듯? ${pickedRam.ram} GB`);
            }
            await installServer(ns, pickedRam);
            return;
        }

        // 서버가 이미 있는데 낮은 램으로 교체하는 거 방지
        if (doIhaveServers && pickedRam.ram <= existingServerRam) {
            ns.tprint(`서버 냅둠 / 현재 서버: ${existingServerRam} GB / 지금 고른 램: ${pickedRam.ram} GB`);
            return;
        }

        // 이전 램 보다 클 땐 그냥 삼. 서버가 없으면 existenceServerRam === 0이니깐 어차피 삼
        if (pickedRam.ram > existingServerRam) {
            ns.tprint(`WARN 💻 서버 업글: ${existingServerRam} GB -> ${pickedRam.ram} GB`);
            await installServer(ns, pickedRam);
            return;
        }
    } else
        ns.tprint(`서버 살 돈이 없썽!`);
}

async function installServer(_ns, pickedRam) {
    ns = _ns;
    deleteServers(ns);
    await ns.sleep(500);

    let boughtServerHackingTarget = ns.peek(2);
    let i = 0;

    ns.tprint(`서버 설치 중...`);

    while (i < ns.getPurchasedServerLimit()) {
        let host = ns.purchaseServer('s-' + i, pickedRam.ram);

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
    let pickedRam = {
        ram: 8,
        bool: false
    };

    // 루프를 돌면서 pickedRam.ram에 내가 살수 있는 램을 넣다가 내 돈이 모자르면 
    // 이전에 저장된 램이 내가 살 수 있는 램이므로 그걸 리턴
    for (let i = 0; i < 12; ++i) {
        // 큰 서버를 살때 돈이 다 털리는걸 막기 위해 몇 램부터 돈을 50퍼 남김
        let ratio = i > 8 ? 0.5 : 1;
        if (ns.getServerMoneyAvailable('home') * ratio < ns.getPurchasedServerCost(ram) * 25) {
            // 맨 처음 루프에서 if에 걸리면 기본 값을 리턴
            return pickedRam;
        } else {
            pickedRam.ram = ram;
            pickedRam.bool = true;
        }
        ram = ram * 2;
    }
    return pickedRam; // 루프 끝나고 리턴 빼먹으면 클남!!!
}

export function deleteServers(_ns) {
    ns = _ns;
    const pserv = ns.getPurchasedServers();
    pserv.forEach(i => {
        ns.killall(i);
        ns.deleteServer(i);
    });
    ns.tprint(`서버 다 지움`);
}
