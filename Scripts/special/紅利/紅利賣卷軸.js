let status = -1, sel = -1, input = -1;
let debug = true;
let logName = "紅利購買道具_10%卷軸";

let itemInfos = [
    [2040026, 20], // 頭盔智力
    [2040031, 20], // 頭盔敏捷
    [2040329, 20], // 耳環敏捷
    [2040302, 20], // 耳環智力
    [2040331, 20], // 耳環幸運
    [2040412, 20], // 上衣幸運
    [2040419, 20], // 上衣力量
    [2040612, 20], // 褲裙敏捷
    [2040534, 20], // 套服力量
    [2040502, 20], // 套服敏捷
    [2040514, 20], // 套服智力
    [2040517, 20], // 套服幸運
    [2040705, 20], // 鞋子跳躍
    [2041014, 20], // 披風力量
    [2041020, 20], // 披風敏捷
    [2041017, 20], // 披風智力
    [2041023, 20], // 披風幸運
    [2040816, 20], // 手套魔力
    [2040805, 20], // 手套攻擊
    [2040915, 20], // 盾牌攻擊
    [2040920, 20], // 盾牌魔力
    [2043002, 20], // 單手劍攻擊
    [2044002, 20], // 雙手劍攻擊
    [2043102, 20], // 單手斧攻擊
    [2044102, 20], // 雙手斧攻擊
    [2043202, 20], // 單手棍攻擊
    [2044202, 20], // 雙手棍攻擊
    [2044402, 20], // 矛攻擊
    [2044302, 20], // 槍攻擊
    [2043702, 20], // 短杖魔力
    [2043802, 20], // 長杖魔力
    [2044502, 20], // 弓攻擊
    [2044602, 20], // 弩攻擊
    [2043302, 20], // 短劍攻擊
    [2044702, 20], // 拳套攻擊
    [2044902, 20], // 火槍攻擊
    [2044802, 20], // 指虎攻擊
    [2043402, 20]// 雙刀攻擊
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
        let message = "#b[購買10%卷軸]\r\n";
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
        if (!cm.canHold(itemId, input)) {
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
        cm.sendYesNo("是否確認要購買" + input + "個#v" + itemId + ":##t" + itemId + ":#，需要花費" + cm.numberWithCommas(price) + "紅利");
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
            cm.gainItem(itemId, input);

            cm.sendNext("購買" + input + "個#v" + itemId + ":##t" + itemId + ":#成功");

            cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[購買卷軸] : 帳號<" + cm.getClient().getAccountName() + ">角色<" + cm.getPlayer().getName() + "> 購買了" + input + "個" + cm.getItemName(itemId) + "，目前共有" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "紅利");
            cm.logFile("購買卷軸.txt", cm.getReadableTime() + " 帳號<" + cm.getClient().getAccountName() + ">角色<" + cm.getPlayer().getName() + "> 購買了" + input + "個" + cm.getItemName(itemId) + "，目前共有" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "紅利", false);
            input = -1;
            sel = -1;
            status = -1;
        }
    }
}

function getLogName(itemId) {
    return logName + "_" + itemId;
}
