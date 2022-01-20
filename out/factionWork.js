import { augList, factionList } from './settings';

/** @type import('.').NS */
let ns = null;

// 특정 오그먼트를 사면 그 팩션은 더 이상 볼일이 없음! 을 전제로 했음.
// 특정 오그먼트를 구매할때까지 해킹 컨트렉트를 함

// getOwnedAug로 받은 어레이랑 내가 만든 오그 어레이랑 비교해서 오그를 이미 가지고 있는지 체크
// 근데 해당 오그가 어느 팩션인지 매치 시켜야 됨. (어레이 두개 맹거? 어레이 안에 어레이 맹거?)
// 그래서 이미 가지고 있는 오그랑 매치되는 팩션은 자동 컨트렉트에서 제외되게 이케이케...
export async function main(_ns) {
    ns = _ns;
    ns.tail();

    let pickedFaction = doIHaveAugs(ns);
    if (pickedFaction === '') {
        ns.print(`검사 할 수 있는 모든 오그먼트를 가지고 계신듯?`);
        return;
    } else {
        ns.workForFaction(pickedFaction, 'Hacking Contracts', ns.isFocused());
    }
}

function doIHaveAugs(_ns) {
    let myAugs = ns.getOwnedAugmentations(true);
    ns.tprint('INFO ' + myAugs);
    let pickedFaction = '';

    // 정해놓은 augList중 1개랑 방금 get한 myAugs 어레이랑 비교
    for (let i = 0; i < augList.length; i++) {
        for (let j of myAugs) {
            if (j === augList[i]) {
                ns.print(`INFO ${j}은(는) 이미 먹은 오그라 ${factionList[i]} 팩션은 재낌`);
                break;
            }
            else {
                ns.print(`INFO ${augList[i]}은(는) 아직 안 먹었으므로 ${factionList[i]}으(로) 감!`);
                pickedFaction = factionList[i];
                return pickedFaction;
            }
        }
    }
    return pickedFaction;
}
