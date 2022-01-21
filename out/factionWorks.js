import { factionList, augList, repCost } from './settings';

/** @type import('.').NS */
let ns = null;

// 특정 오그먼트를 구입하면 그 팩션은 더 이상 볼일이 없다!는 걸 전제로 함!
export async function main(_ns) {
    ns = _ns;
    let pickedFaction = selectFaction(ns);
    if (pickedFaction === '') {
        ns.tprint(`거시기 할 팩션이 없음`);
        return;
    } else {
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
    let pickedFaction = '';
    let pickedAug = '';
    ns.getFactionRep

    // 정해놓은 augList(특정오그)랑 방금 get한 ownedAugs랑 비교 
    // 정해놓은 repCost(특정오그 가격)랑 방금 get한 FactionRep이랑 또 비교
    // 특정 오그를 가지고 있거나 그걸 살 rep을 가지고 있으면 다음 factionList
    for (let i = 0; i < augList.length; i++) {
        for (let ownedAug of ownedAugs) {
            if (ownedAug === augList[i] || ns.getFactionRep(factionList[i]) > repCost[i]) {
                ns.tprint(`INFO ${ownedAug}은(는) 이미 먹었거나 레퓨테이션(${repCost[i]})이 충분해 ${factionList[i]} 팩션은 재낌`);
                // 일치하는 오그를 찾았다면 다음 어레이 값이 아직 안 먹은걸테니 일단 넣고 다음 augList 루프
                // 그 후에 if에 안걸리면 여기 넣은게 맞는거!
                pickedFaction = factionList[i + 1];
                pickedAug = augList[i + 1];
                break;
            }
        }
    }
    if (pickedFaction === null || pickedFaction === '') {
        pickedFaction = '';
        pickedAug = '';
    }
    ns.tprint(`INFO ${pickedAug}은(는) 아직 안 먹었으므로 ${pickedFaction}으(로) 감!`);
    return pickedFaction;
}
