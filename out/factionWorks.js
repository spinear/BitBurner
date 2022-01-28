import { factionWorksObj as fwo } from './settings';

/** @type import('.').NS */
let ns = null;

// 특정 오그먼트를 사면 그 팩션은 더 볼일이 없다!는 걸 전제로 함!
export async function main(_ns) {
    ns = _ns;
    let isAutomatic;
    if (ns.getHackingLevel() < 300) isAutomatic = false; else isAutomatic = true;

    const pickedFaction = selectFaction(ns);
    const workType = 'Hacking Contracts';

    if (pickedFaction === undefined)
        return;

    const unfocusBeforeReset = ns.args[0];
    if (unfocusBeforeReset) {
        ns.workForFaction(pickedFaction, workType, false);
        return;
    }

    if (isAutomatic) {
        // 딴 데서 일해도 매 루프마다 리셋하고 정해진 팩션에서 일 함
        ns.workForFaction(pickedFaction, workType, ns.isFocused());
    } else {
        // 딴 데서 일 할 땐 가만 냅두고 일 안 하는 중이면 정해진 팩션에서 일 함
        if (!ns.isBusy())
            ns.workForFaction(pickedFaction, workType, ns.isFocused());
        else
            ns.tprint(`ERROR 딴데서 일함?`);
    }
}

function selectFaction(_ns) {
    ns = _ns;
    let pickedFaction = fwo.factionList[0];
    let pickedAug = fwo.augList[0];
    // 정해놓은 augList(특정오그)랑 방금 get한 ownedAugs랑 비교 
    // 정해놓은 repCost(특정오그 가격)랑 방금 get한 FactionRep이랑 또 비교
    // 특정 오그를 가지고 있거나 그걸 살 rep을 가지고 있으면 다음 factionList
    let ownedAugs = ns.getOwnedAugmentations(true);
    fwo.augList.forEach((targetAug, i) => {
        ownedAugs.some(ownedAug => {
            if (ownedAug === targetAug
                || ns.getFactionRep(fwo.factionList[i]) > fwo.repCost[i]
                || ns.getFactionFavor(fwo.factionList[i]) > 149) {
                //ns.tprint(`INFO ${targetAug}은(는) 이미 먹었거나 REP(${fwo.repCost[i]})이 충분해 ${fwo.factionList[i]} 팩션은 재낌`);
                // 일치하는 오그를 찾았다면 다음 어레이는 아직 안 먹은 거로 가정하고 일단 +1로 쑤셔 넣음
                // 근데 그 후에 if에 안걸리면 여기 넣은게 맞는 거!
                pickedFaction = fwo.factionList[i + 1];
                pickedAug = fwo.augList[i + 1];
                return true;
            }
        });
    });

    if (pickedFaction === undefined) {
        ns.tprint(`ERROR 거시기 할 팩션이 없음`);
    } else {
        ns.tprint(`INFO ( ͠• ᴗ ͡•) ${pickedAug}은(는) 아직 안 먹었으므로 ${pickedFaction}으(로) 감!`);
    }
    return pickedFaction;
}
