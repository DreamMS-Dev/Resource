let status = -1, sel = -1;
let debug = true;
let logName = "紅利購買道具_楓葉之心";

let price = 6000;

// 1122034(劍士)
// 1122035(法師)
// 1122036(弓箭手)
// 1122037(盜賊)
// 1122038(海盜)

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
        let message = "#b[購買#t1122034#]\r\n";
        message += "#b目前紅利: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "\r\n\r\n";
        message += "#L1122034##v1122034:##t1122034:#(劍士) - " + cm.numberWithCommas(price) + "紅利#l\r\n";
        message += "#L1122035##v1122035:##t1122035:#(法師) - " + cm.numberWithCommas(price) + "紅利#l\r\n";
        message += "#L1122036##v1122036:##t1122036:#(弓手) - " + cm.numberWithCommas(price) + "紅利#l\r\n";
        message += "#L1122037##v1122037:##t1122037:#(盜賊) - " + cm.numberWithCommas(price) + "紅利#l\r\n";
        message += "#L1122038##v1122038:##t1122038:#(海盜) - " + cm.numberWithCommas(price) + "紅利#l\r\n";

        cm.sendSimple(message);
    } else if (status === 1) {
        sel = selection;
        if (!cm.canHold(sel, 1)) {
            cm.sendNext("背包已滿。");
            cm.dispose();
            return;
        } else if (cm.getPlayer().getAccLogValue("紅利", 0) < price) {
            cm.sendNext("紅利不足");
            sel = -1;
            status = -1;
        }
        cm.sendYesNo("是否確認要購買#v" + sel + ":##t" + sel + ":#，需要花費" + cm.numberWithCommas(price) + "紅利");
    } else if (status === 2) {
         if (!cm.canHold(sel, 1)) {
            cm.sendNext("背包已滿。");
            cm.dispose();
            return;
        } else if (cm.getPlayer().getAccLogValue("紅利", 0) < price) {
            cm.sendNext("紅利不足");
            sel = -1;
            status = -1;
        } else {
            cm.getPlayer().addAccLogValue("紅利", -price);
            cm.getPlayer().addAccLogValue(getLogName(sel), 1);
			cm.gainItem(sel, 1);
			
            cm.sendNext("購買#v" + sel + ":##t" + sel + ":#成功");
			
            cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[購買楓葉之心] : 帳號<" + cm.getClient().getAccountName() + ">角色<" + cm.getPlayer().getName() + "> 購買了" + sel + "，目前共有" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "紅利");
            cm.logFile("購買楓葉之心.txt", cm.getReadableTime() + " 帳號<" + cm.getClient().getAccountName() + ">角色<" + cm.getPlayer().getName() + "> 購買了" + sel + "，目前共有" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "紅利", false);
            sel = -1;
            status = -1;
        }
    }
}

function getLogName(itemId) {
    return logName + "_" + itemId;
}
