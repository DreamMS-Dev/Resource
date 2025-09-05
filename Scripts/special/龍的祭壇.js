/**
 * 龍的祭壇腳本
 * 使用方法:
 * 將本腳本放於Special目錄下
 * 將蛋接上道具腳本後放入
 * cm.dispose();
 * cm.openNpc(9010000, "龍的祭壇");
 * 2025.03.16
 * By WindyBoy
 */

let itemId1 = 2000000; // 蛋的代碼
let minimumQuantity1 = 8; // 最低需求數量
let rewardIds1 = [3010000, 3010001, 3010002, 4000000, 4000001, 4000002, 4000003, 4000004, 4000005]; // 獎池1
let itemId2 = 2000001; // 蛋的代碼
let minimumQuantity2 = 50; // 最低需求數量
let rewardIds2 = [3010003, 3010004, 3010005, 4000006, 4000007, 4000008, 4000009, 4000010, 4000011]; // 獎池2
let itemId3 = 2000002; // 蛋的代碼
let minimumQuantity3 = 100; // 最低需求數量
let rewardIds3 = [3010006, 3010007, 3010008, 4000012, 4000013, 4000014, 4000015, 4000016, 4000017]; // 獎池3

function start() {
    let player = cm.getPlayer();
    let index = cm.getInfo();
    if (index == null || (index !== "0" && index !== "1" && index !== "2")) {
        cm.openOrUpdateBlueDragonWindow(cm.getItemQuantity(itemId1), minimumQuantity1, cm.getItemQuantity(itemId2), minimumQuantity2, cm.getItemQuantity(itemId3), minimumQuantity3);
    } else {
        index = parseInt(index);
        let id1 = fetchReward(index);
        let id2 = fetchReward(index);
        let id3 = fetchReward(index);
        let id4 = fetchReward(index);
        let id5 = fetchReward(index);
        let id6 = fetchReward(index);
        let id7 = fetchReward(index);
        let id8 = fetchReward(index);

        let allItemIds = [id1, id2, id3, id4, id5, id6, id7, id8];
        let allItemQuantities = [1, 1, 1, 1, 1, 1, 1, 1];
        if (!player.canHoldAll(allItemIds, allItemQuantities, true)) {
            player.dropMessage(1, "背包已滿");
            cm.dispose();
            return;
        }

        switch (index) {
            case 0:
                if (!player.haveItem(itemId1, minimumQuantity1)) {
                    player.dropMessage(1, "發生未知錯誤");
                    cm.dispose();
                    return;
                }
                cm.gainItem(itemId1, -minimumQuantity1);
                break;
            case 1:
                if (!player.haveItem(itemId2, minimumQuantity2)) {
                    player.dropMessage(1, "發生未知錯誤");
                    cm.dispose();
                    return;
                }
                cm.gainItem(itemId2, -minimumQuantity2);
                break;
            case 2:
                if (!player.haveItem(itemId3, minimumQuantity3)) {
                    player.dropMessage(1, "發生未知錯誤");
                    cm.dispose();
                    return;
                }
                cm.gainItem(itemId3, -minimumQuantity3);
                break;
        }
        cm.openOrUpdateBlueDragonWindow(cm.getItemQuantity(itemId1), minimumQuantity1, cm.getItemQuantity(itemId2), minimumQuantity2, cm.getItemQuantity(itemId3), minimumQuantity3);

        cm.openBlueDragon(index, id1, id2, id3, id4, id5, id6, id7, id8);

        cm.gainItem(id1, 1, false);
        cm.gainItem(id2, 1, false);
        cm.gainItem(id3, 1, false);
        cm.gainItem(id4, 1, false);
        cm.gainItem(id5, 1, false);
        cm.gainItem(id6, 1, false);
        cm.gainItem(id7, 1, false);
        cm.gainItem(id8, 1, false);
        cm.dispose();
    }
}

function fetchReward(index) {
    let rewards = [];
    switch (index) {
        case 0:
            rewards = rewardIds1;
            break;
        case 1:
            rewards = rewardIds2;
            break;
        case 2:
            rewards = rewardIds3;
            break;
        default:
            return 1302000;
    }
    return rewards[cm.getRandomValue(0, rewards.length - 1)];
}
