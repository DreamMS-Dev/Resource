/**
 * 白金蘋果腳本
 * 使用方法:
 * 將本腳本放於Special目錄下
 * 將白金蘋果接上道具腳本後放入
 * cm.dispose();
 * cm.openNpc(9010000, "白金蘋果");
 * 2025.04.11
 * By WindyBoy
 */

let title = "白金蘋果"; // 上方文字
let itemId = 4000000; // 抽獎消耗道具代碼
let quantity = 1; // 抽獎消耗道具數量
let rewardIds = [3010000, 3010001, 3010002, 4000010, 4000001, 4000002, 4000003, 4000004, 4000005]; // 獎池

function start() {
    let player = cm.getPlayer();
    let infoText = cm.getInfo();
    if (infoText == null || infoText !== "incubate") {
        cm.sendPlatinumAppleOpenAndUpdate(title, cm.getItemQuantity(itemId), 0, false, 0);
    } else {
        let rewardItemId = fetchReward();
        if (!player.canHold(rewardItemId, 1)) {
            player.dropMessage(1, "背包已滿");
            cm.dispose();
            return;
        } else if (!player.haveItem(itemId, quantity)) {
            player.dropMessage(1, "發生未知錯誤");
            cm.dispose();
            return;
        }
        cm.gainItem(itemId, -quantity);
        cm.sendPlatinumAppleOpenAndUpdate(title, cm.getItemQuantity(itemId), 1, true, rewardItemId);
        cm.gainItem(rewardItemId, 1, false);
        cm.dispose();
    }
}

function fetchReward() {
    return rewardIds[cm.getRandomValue(0, rewardIds.length - 1)];
}
