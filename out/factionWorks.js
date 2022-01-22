import { factionWorksObj as fwo } from './settings';

/** @type import('.').NS */
let ns = null;

// 특정 오그먼트를 사면 그 팩션은 더 볼일이 없다!는 걸 전제로 함!
export async function main(_ns) {
    ns = _ns;
    // 1 = 자동 아님 수동
    let isAutomatic = 1;
    let pickedFaction = selectFaction(ns);

    if (isAutomatic == 1) {
        // 1이면 딴 데서 일해도 매 루프마다 리셋하고 정해진 팩션에서 일 함
        ns.workForFaction(pickedFaction, 'Hacking Contracts', ns.isFocused());
    } else {
        // any면 딴 데서 일 할 땐 가만 냅두고 일 안 하는 중이면 정해진 팩션에서 일 함
        if (!ns.isBusy())
            ns.workForFaction(pickedFaction, 'Hacking Contracts', ns.isFocused());
        else
            ns.tprint(`ERROR 딴데서 일함?`);
    }
}


function selectFaction(_ns) {
    ns = _ns;
    let ownedAugs = ns.getOwnedAugmentations(true);
    //ns.tprint('INFO ' + ownedAugs);
    let pickedFaction;
    let pickedAug;

    // 정해놓은 augList(특정오그)랑 방금 get한 ownedAugs랑 비교 
    // 정해놓은 repCost(특정오그 가격)랑 방금 get한 FactionRep이랑 또 비교
    // 특정 오그를 가지고 있거나 그걸 살 rep을 가지고 있으면 다음 factionList
    for (let i = 0; i < fwo.augList.length; i++) {
        for (let ownedAug of ownedAugs) {
            if (ownedAug === fwo.augList[i] || ns.getFactionRep(fwo.factionList[i]) > fwo.repCost[i]) {
                ns.tprint(`INFO ${ownedAug}은(는) 이미 먹었거나 REP(${fwo.repCost[i]})이 충분해 ${fwo.factionList[i]} 팩션은 재낌`);
                // 일치하는 오그를 찾았다면 다음 어레이는 아직 안 먹은 거로 가정하고 일단 +1로 쑤셔 넣음
                // 근데 그 후에 if에 안걸리면 여기 넣은게 맞는 거!
                pickedFaction = fwo.factionList[i + 1];
                pickedAug = fwo.augList[i + 1];
                break;
            }
        }
    }
    // 어레이 값이 없으면 어케 되는지 아직 모름
    if (pickedFaction === null || pickedFaction === undefined) {
        ns.tprint(`ERROR 거시기 할 팩션이 없음`);
        return;
    }
    ns.tprint(`INFO ${pickedAug}은(는) 아직 안 먹었으므로 ${pickedFaction}으(로) 감!`);
    return pickedFaction;
}
