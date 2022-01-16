import { advHackingTarget } from "./settings.js";

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;

    let myLvl = ns.getHackingLevel();
    let tmpTarget = '';
    let tmpTarget2 = '';
    let isSmushed = 'false'
    let j = 0;

    // 순서대로 정렬된 어레이에서 내 레벨이 높은 타겟만 변수에 넣으며 루프를 돌면 루프 후 저장 된 변수가 내 최대 레벨
    // 상점은 거기서 -1 값을 씀.
    for (let i of advHackingTarget) {
        let targetLvl = ns.getServerRequiredHackingLevel(i) * 4;

        if ((myLvl + 5) > targetLvl) {
            tmpTarget = i;
            tmpTarget2 = advHackingTarget[Math.max((j - 1), 0)];
        }
        ++j;
    }

    // ❌❌❌ 여기 걸린 상태에서 재실행하면 port 값이 null이라 실행 불가
    if (!ns.hasRootAccess(tmpTarget)) {
        ns.tprint(`ERROR 💩 다음 타겟 ${tmpTarget} 포트 안 열림!
        지금 스크립트 멈추면 포트 열기 전까지 스크립트 작동 안 함!!!💩`);
        isSmushed = 'false';
        ns.clearPort(3);
        await ns.writePort(3, isSmushed);
        return;
    }

    // 난장판 임시 변수와 선택된 변수 물물교환
    ns.clearPort(2);
    await ns.writePort(2, tmpTarget);
    ns.clearPort(4);
    await ns.writePort(4, tmpTarget2);

    // 이전 루프(port 1)와 지금 루프(port 2)의 타겟이 같으면 변한게 없으므로 false
    if (ns.peek(1) == ns.peek(2)) {
        ns.tprint(`현재 타겟 ${ns.peek(1)} & ${ns.peek(4)}`);
        isSmushed = 'false';
    } else {
        ns.tprint(`INFO 타겟 ${ns.peek(1)}이(가) ${ns.peek(2)}로 바뀔꺼임!`);

        // 다음 루프 때 비교를 위해 port 1에 복사
        ns.clearPort(1);
        await ns.writePort(1, ns.peek(2));
        isSmushed = 'true';
    }

    ns.clearPort(3);
    await ns.writePort(3, isSmushed);
}