/**
 * UI需要登入器配合才能使用
 * 2025.08.28
 * 2025.09.05
 * Windyboy
 */
let status = -1;
let sendUIPacket = true; // 是否發送給客戶端UI封包

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === 0) {
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status <= -1) {
        cm.dispose();
    } else if (status === 0) {
        let fieldBattleRankStatus = cm.getPlayer().getMap().getFieldBattleRanking() != null;
        let message = "地圖排行系統\r\n";
        message += "#L0#" + (fieldBattleRankStatus ? "#r關閉" : "#b開啟") + "地圖排行#l\r\n";
        message += "#L1#確認地圖排行資訊#l\r\n";
        cm.sendSimple(message);
    } else if (status === 1) {
        if (selection === 0) {
            let map = cm.getPlayer().getMap();
            let fieldBattleRankStatus = map.getFieldBattleRanking() != null;
            if (fieldBattleRankStatus) {
                map.stopFieldBattleRanking();
                cm.sendNext("#r關閉成功!");
            } else {
                map.startFieldBattleRanking(sendUIPacket);
                cm.sendNext("#b開啟成功!");
            }
            status = -1;
        } else if (selection === 1) {
            let fieldBattleRank = cm.getPlayer().getMap().getFieldBattleRanking();
            if (fieldBattleRank == null) {
                cm.sendNext("關閉中，沒有任何資訊");
                status = -1;
            } else {
                let number = 1;
                let message = "\r\n";
                let rankings = fieldBattleRank.getRankings().entrySet();
                if (rankings.size() === 0) {
                    cm.sendNext("目前沒有任何資訊");
                    status = -1;
                } else {
                    let iterator = rankings.iterator();
                    while (iterator.hasNext()) {
                        let rankingInfo = iterator.next();
                        let characterId = rankingInfo.getKey();
                        let damage = rankingInfo.getValue();
                        message += number + "." + cm.getCharacterNameById(characterId) + "(" + characterId + ") 傷害: " + cm.numberWithCommas(damage) + "\r\n";
                        number++;
                    }
                    cm.sendNext(message);
                    status = -1;
                }
            }
        } else {
            cm.dispose();
        }
    }
}