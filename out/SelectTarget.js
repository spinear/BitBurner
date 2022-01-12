import { advHackingTarget } from "./settings.js";

/** @type import('.').NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;

    let myLvl = ns.getHackingLevel();
    let tmpTarget = '';
    let tmpTarget2 = '';
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

    ns.tprint(`WARN 타겟 서버 ${ns.peek(1)} 이(가) ${ns.peek(2)}로 바뀔꺼임!`);

     if (tmpPeek1 == tmpPeek2) {
        isSmushed = 'false';
    } else {
        ns.clearPort(1);
        await ns.writePort(1, tmpPeek2);
        isSmushed = 'true';
    }

    ns.clearPort(3);
    await ns.writePort(3, isSmushed);
}