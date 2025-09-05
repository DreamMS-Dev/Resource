let status = -1, sel = -1, input = -1;
let debug = true;
let logName = "紅利購買道具_其它";

let itemInfos = [
    [2340000, 30], // 頭盔智力
    [2049100, 30], // 混沌卷軸
    [2049116, 30], // 驚訝混沌卷軸
    [2049302, 100], // 星卷 
    [5570000, 500], // 黃金鐵鎚
    [5520001, 500], // 白金剪刀
    [2070029, 300], // 魔標
];   

function start() {
    if (debug && !cm.getPlayer().isGM()) {
        cm.sendNext("維修中");
        cm.dispose();
        return;
    }
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status < 0) {
        cm.dispose();
    } else if (status === 0) {
        let message = "#b[購買道具]\r\n";
        message += "#b目前紅利: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "\r\n\r\n";
        for (let i = 0; i < itemInfos.length; i++) {
            let itemId = itemInfos[i][0];
            let price = itemInfos[i][1];
            message += "#L" + i + "##v" + itemId + "##t" + itemId + "# - " + cm.numberWithCommas(price) + "紅利#l\r\n";
        }
        cm.sendSimple(message);
    } else if (status === 1) {
        sel = selection;
        let itemId = itemInfos[sel][0];
        let price = itemInfos[sel][1];
        let point = cm.getPlayer().getAccLogValue("紅利", 0);
        let maximum = parseInt(point / price);
		if (itemId == 2070029 || itemId == 2070029) {
			maximum = 1;
		}
        if (cm.getPlayer().getAccLogValue("紅利", 0) < price) {
            cm.sendNext("紅利不足");
            input = -1;
            sel = -1;
            status = -1;
            return;
        }
        cm.sendGetNumber("目前紅利: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "\r\n\r\n請輸入要購買#v" + itemId + "##t" + itemId + "#的數量(最多#r" + maximum + "#k個)", 1, 1, maximum);
    } else if (status === 2) {
        input = selection;
        let itemId = itemInfos[sel][0];
        let price = itemInfos[sel][1] * input;
        if (!cm.canHold(itemId, (itemId === 2070029 ? 1200 : itemId === 2070029 ? 1200 : input))) {
            cm.sendNext("背包已滿。");
            cm.dispose();
            return;
        } else if (cm.getPlayer().getAccLogValue("紅利", 0) < price) {
            cm.sendNext("紅利不足");
            input = -1;
            sel = -1;
            status = -1;
            return;
        }
        cm.sendYesNo("是否確認要購買" + (itemId === 2070029 ? 1200 : itemId === 2070029 ? 1200 : input) + "個#v" + itemId + ":##t" + itemId + ":#，需要花費" + cm.numberWithCommas(price) + "紅利");
    } else if (status === 3) {
        let itemId = itemInfos[sel][0];
        let price = itemInfos[sel][1] * input;
        if (!cm.canHold(itemId, input)) {
            cm.sendNext("背包已滿。");
            cm.dispose();
            return;
        } else if (cm.getPlayer().getAccLogValue("紅利", 0) < price) {
            cm.sendNext("紅利不足");
            input = -1;
            sel = -1;
            status = -1;
        } else {
            cm.getPlayer().addAccLogValue("紅利", -price);
            cm.getPlayer().addAccLogValue(getLogName(itemId), 1);
            cm.gainItem(itemId, (itemId === 2070029 ? 1200 : itemId === 2070029 ? 1200 : input));

            cm.sendNext("購買" + (itemId === 2070029 ? 1200 : itemId === 2070029 ? 1200 : input) + "個#v" + itemId + ":##t" + itemId + ":#成功");

            cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[購買其他] : 帳號<" + cm.getClient().getAccountName() + ">角色<" + cm.getPlayer().getName() + "> 購買了" + (itemId === 2070029 ? 1200 : itemId === 2070029 ? 1200 : input) + "個" + cm.getItemName(itemId) + "，目前共有" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "紅利");
            cm.logFile("購買其他.txt", cm.getReadableTime() + " 帳號<" + cm.getClient().getAccountName() + ">角色<" + cm.getPlayer().getName() + "> 購買了" + (itemId === 2070029 ? 1200 : itemId === 2070029 ? 1200 : input) + "個" + cm.getItemName(itemId) + "，目前共有" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "紅利", false);
            input = -1;
            sel = -1;
            status = -1;
        }
    }
}

function getLogName(itemId) {
    return logName + "_" + itemId;
}
