import { factionList, factionServers } from './settings';

/** @type import('.').NS */
let ns = null;

// 각 팩션이 파는 특정 오그먼트 이름이 필요함. 특정 오그먼트를 사면 그 팩션은 더 이상 볼일이 없음!
// 특정 오그먼트를 구매할때까지 해킹 컨트렉트를 함
// 특정 오그먼트를 구매 한 팩션을 어레이에서 지우던가 if로 제끼던가 일케일케 함.
export async function main(_ns) {
    ns = _ns;

}