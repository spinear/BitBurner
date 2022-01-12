import { advHackingTarget } from "./settings.js";

/** @type import(".").NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;

    let myLvl = ns.getHackingLevel();
    let tmpTarget = '';
    let isSmushed = 'false'

    for (let i = 0; i < advHackingTarget.length; ++i) {
        let targetLvl = ns.getServerRequiredHackingLevel(advHackingTarget[i]) * 4;

        if ((myLvl + 5) > targetLvl) {
            tmpTarget = advHackingTarget[i];
        }
    }

    // 선택 된 타겟에 루트 엑세스가 없으면 강제로 복귀
    if (!ns.hasRootAccess(tmpTarget)) {
        ns.tprint(`ERROR 💩 다음 타겟 포트 안열림!`);
        tmpTarget = ns.peek(1);
    }

    ns.clearPort(2);
    await ns.writePort(2, tmpTarget);

    let tmpPeek1 = ns.peek(1);
    let tmpPeek2 = ns.peek(2);

    ns.tprint(`WARN 루프 후 포트 값 ${ns.peek(1)} ${ns.peek(2)}`);

     if (tmpPeek1 == tmpPeek2) {
        isSmushed = 'false';
    } else {
        ns.clearPort(1);
        await ns.writePort(1, tmpPeek2);
        isSmushed = 'true';
    }

    ns.tprint(`WARN 비교 후 포트 값 ${ns.peek(1)} ${ns.peek(2)}`);

    ns.clearPort(3);
    await ns.writePort(3, isSmushed);
}