/**
 * 龍珠盒腳本
 * 使用方法:
 * 將本腳本放於Special目錄下
 * 將道具接上道具腳本後放入
 * cm.dispose();
 * cm.openNpc(9010000, "龍珠盒");
 * 2025.09.22
 * By WindyBoy
 */

let reactorId = 9009000; // 反應物代碼
let destroyReactorDelay = 5000; // 指定時間(毫秒)後移除反應物
let itemIds = [
    // 收集的道具代碼 (只能填入9個)
    3994200,
    3994201,
    3994202,
    3994203,
    3994204,
    3994205,
    3994206,
    3994207,
    3994208,
];
let dropItems = [ // 掉落道具
    // 道具代碼, 道具數量, 機率 (10000=1%)
    [1302000, 1, 1000000],
    [1302001, 1, 1000000],
    [1302002, 1, 1000000],
    [1302003, 1, 1000000],
    [1302004, 1, 1000000],
    [1302005, 1, 1000000],
    [1302006, 1, 1000000],
    [1302007, 1, 1000000],
    [1302008, 1, 1000000],
    [1302009, 1, 1000000],
    [1302010, 1, 1000000],
    [3010000, 1, 100000],
    [3010001, 1, 100000],
    [3010002, 1, 100000],
    [3010003, 1, 100000],
    [3010004, 1, 100000],
    [3010005, 1, 100000],
    [3010006, 1, 100000],
    [4000007, 20, 1000000],
    [4000001, 10, 1000000],
    [4000002, 30, 1000000],
    [4000003, 11, 1000000],
    [4000004, 15, 1000000],
    [4000005, 26, 1000000],
    [4000006, 26, 1000000],
    [4000007, 26, 1000000],
    [4000008, 26, 1000000],
    [4000009, 26, 1000000],
    [4000010, 26, 1000000],
    [4000007, 20, 1000000],
    [4000001, 10, 1000000],
    [4000002, 30, 1000000],
    [4000003, 11, 1000000],
    [4000004, 15, 1000000],
    [4000005, 26, 1000000],
    [4000006, 26, 1000000],
    [4000007, 26, 1000000],
    [4000008, 26, 1000000],
    [4000009, 26, 1000000],
    [4000010, 26, 1000000],
    [4000007, 20, 1000000],
    [4000001, 10, 1000000],
    [4000002, 30, 1000000],
    [4000003, 11, 1000000],
    [4000004, 15, 1000000],
    [4000005, 26, 1000000],
    [4000006, 26, 1000000],
    [4000007, 26, 1000000],
    [4000008, 26, 1000000],
    [4000009, 26, 1000000],
    [4000010, 26, 1000000],
    [4000007, 20, 1000000],
    [4000001, 10, 1000000],
    [4000002, 30, 1000000],
    [4000003, 11, 1000000],
    [4000004, 15, 1000000],
    [4000005, 26, 1000000],
    [4000006, 26, 1000000],
    [4000007, 26, 1000000],
    [4000008, 26, 1000000],
    [4000009, 26, 1000000],
    [4000010, 26, 1000000],
    [4000007, 20, 1000000],
    [4000001, 10, 1000000],
    [4000002, 30, 1000000],
    [4000003, 11, 1000000],
    [4000004, 15, 1000000],
    [4000005, 26, 1000000],
    [4000006, 26, 1000000],
    [4000007, 26, 1000000],
    [4000008, 26, 1000000],
    [4000009, 26, 1000000],
    [4000010, 26, 1000000],
    [4000007, 20, 1000000],
    [4000001, 10, 1000000],
    [4000002, 30, 1000000],
    [4000003, 11, 1000000],
    [4000004, 15, 1000000],
    [4000005, 26, 1000000],
    [4000006, 26, 1000000],
    [4000007, 26, 1000000],
    [4000008, 26, 1000000],
    [4000009, 26, 1000000],
    [4000010, 26, 1000000],
    [4000007, 20, 1000000],
    [4000001, 10, 1000000],
    [4000002, 30, 1000000],
    [4000003, 11, 1000000],
    [4000004, 15, 1000000],
    [4000005, 26, 1000000],
    [4000006, 26, 1000000],
    [4000007, 26, 1000000],
    [4000008, 26, 1000000],
    [4000009, 26, 1000000],
    [4000010, 26, 1000000],
];

function start() {
    if (itemIds.length !== 9) {
        cm.getPlayer().dropMessage(1, "道具代碼填入長度錯誤!");
        cm.dispose();
        return;
    }

    let infoText = cm.getInfo();
    if (infoText == null || infoText === "open") {
        cm.sendDragonBallOpenAndUpdate(recalculateItemId());
    } else if (infoText === "summon") {
        if (!isAvailableToSummon()) {
            cm.getPlayer().dropMessage(1, "道具不足");
        } else {
            if (tryingToConsumeItem()) {
                summonDragon();
            } else {
                cm.getPlayer().dropMessage(1, "發生未知錯誤");
            }
        }
    }
    cm.dispose();

}

function summonDragon() {
    let reactor = cm.getReactor(reactorId);
    if (reactor != null) {
        reactor.setFacingDirection(1);
        reactor.setPosition(cm.getPlayer().getPosition());
        reactor.setState(0);
        reactor.setDelay(0);
        cm.getPlayer().getMap().spawnReactor(reactor);
        reactor.forceTrigger();
        reactor.forceHitReactor(10);
        reactor.delayedDestroyReactor(destroyReactorDelay);

        sortItem();

        let list = [];
        for (let i = 0; i < dropItems.length; i++) {
            if (isSuccess(dropItems[i][2])) {
                let item;
                let itemId = dropItems[i][0];
                if (itemId >= 2000000) {
                    item = cm.getNewItem(itemId, 0, dropItems[i][1]);
                } else {
                    item = cm.getEquipById(itemId);
                }
                list.push(item);

                if (list.length === 50) {
                    reactor.dropItem(cm.getPlayer(), list, 10, 90, destroyReactorDelay, destroyReactorDelay);
                    list = [];
                }
            }
        }
        if (list.length > 0) {
            reactor.dropItem(cm.getPlayer(), list, 10, 90, destroyReactorDelay, destroyReactorDelay);
        }
    } else {
        cm.getPlayer().dropMessage(1, "發生錯誤: 反應物不存在");

    }
}

function isAvailableToSummon() {
    let next = true;
    for (let i = 0; i < itemIds.length; i++) {
        let itemId = itemIds[i];
        if (cm.getPlayer().getItemQuantity(itemId, false) <= 0) {
            next = false;
            break;
        }
    }
    return next;
}

function tryingToConsumeItem() {
    for (let i = 0; i < itemIds.length; i++) {
        let itemId = itemIds[i];
        if (!cm.exchange(0, itemId, -1)) {
            return false;
        }
    }
    return true;
}

function recalculateItemId() {
    let localItemIds = [];
    for (let i = 0; i < itemIds.length; i++) {
        let itemId = itemIds[i];
        if (cm.getPlayer().getItemQuantity(itemId, false) <= 0) {
            localItemIds.push(0);
        } else {
            localItemIds.push(itemId);
        }
    }
    return localItemIds;
}

function sortItem() {
    dropItems.sort(function () {
        return (0.5 - Math.random());
    });
    dropItems.sort(function () {
        return (0.5 - Math.random());
    });
}

function isSuccess(chance) {
    return chance >= 1000000 || cm.getRandomValue(1, 1000000) <= chance;
}