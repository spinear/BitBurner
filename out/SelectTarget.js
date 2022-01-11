import {
    advHomeTarget
} from "./settings.js";

/** @type import(".").NS */
let ns = null;

export async function main(_ns) {
    ns = _ns;

    let myLvl = ns.getHackingLevel();
    let tmpTarget = '';
    let isSmushed = 'false'

    for (let i = 0; i < advHomeTarget.length; ++i) {
        let targetLvl = ns.getServerRequiredHackingLevel(advHomeTarget[i]) * 4;

        // 여기 예외처리 추가 해야함. 하다 실패함!
        if ((myLvl + 5) > targetLvl) {
            tmpTarget = advHomeTarget[i];
        }
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