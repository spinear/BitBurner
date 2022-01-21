import { advHackingTarget } from "./settings.js";

/** @param {import(".").NS } ns */

export async function main(ns) {
    let myLvl = ns.getHackingLevel();
    let tmpTarget = '';
    let tmpTarget2 = '';
    let isSmushed = 'false'
    let j = 0;

    // 이거슨 정해놓은 어레이에서 내 레벨에 맞는 타겟을 고르는 거시다

    // 순서대로 정렬된 어레이에서 내 레벨이 높은 타겟만 변수에 넣으며 루프를 돌면 루프 후 저장 된 변수가 내 최대 레벨 타겟
    // 상점은 거기서 -1 값을 씀.
    for (let i of advHackingTarget) {
        // 내 레벨이 타겟레벨의 4배일 때 해킹 타겟으로 잡을꺼
        let targetLvl = ns.getServerRequiredHackingLevel(i) * 4;

        if ((myLvl + 5) > targetLvl) {
            tmpTarget = i;
            tmpTarget2 = advHackingTarget[Math.max((j - 1), 0)];
        }

        if (!ns.hasRootAccess(tmpTarget)) {
            ns.tprint(`ERROR 💩 다음 타겟 ${tmpTarget} 포트 안 열림!`);
            tmpTarget = advHackingTarget[Math.max((j - 1), 0)];
            tmpTarget2 = advHackingTarget[Math.max((j - 2), 0)];
            ns.tprint(`ERROR 💩 이전 타겟 ${tmpTarget}으(로) 복구!`);
            if (ns.peek(1) === 'NULL PORT DATA') {
                ns.clearPort(1);
                await ns.writePort(1, tmpTarget);
            }
            break;
        }
        ++j;
    }

    // 이 스크립트는 원샷이므로 변수값 보존을 위해 포트를 씀
    ns.clearPort(2);
    await ns.writePort(2, tmpTarget);
    ns.clearPort(4);
    await ns.writePort(4, tmpTarget2);

    // 이전 루프(port 1)와 지금 루프(port 2)의 타겟이 같으면 변한게 없으므로 false
    if (ns.peek(1) === ns.peek(2)) {
        ns.tprint(`현재 타겟 ${ns.peek(1)} & ${ns.peek(4)}`);
        isSmushed = 'false';
    } else {
        ns.tprint(`INFO 타겟 ${ns.peek(1)}이(가) ${ns.peek(2)}로 바뀔꺼임!`);
        ns.clearPort(1);    // 다음 루프 때 비교를 위해 port 1에 복사
        await ns.writePort(1, ns.peek(2));
        isSmushed = 'true';
    }

    ns.clearPort(3);
    await ns.writePort(3, isSmushed);
}