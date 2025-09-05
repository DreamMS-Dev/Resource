let status = -1, sel = -1;
//
let debug = true; // true = 維修中
//
let rate = 10; // 紅利轉Gash比值

function start() {
    if (debug && !cm.getPlayer().isGM()) {
        cm.sendNext("維修中");
        cm.dispose();
        return;
    }
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (debug) {
        cm.getPlayer().dropMessage(6, "status: " + status + " sel: " + sel);
    }
    if (mode === 1) {
        status++;
    } else if (mode === 0) {
        if (status === 1) {
            sel = -1;
        }
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status < 0) {
        cm.dispose();
    } else if (status === 0) {
        let message = "\r\n#b[紅利轉Gash系統]\r\n\r\n";
        let point = cm.getPlayer().getAccLogValue("紅利", 0);
        message += "#b目前紅利    : #d" + cm.numberWithCommas(point) + "\r\n";
        message += "#b目前" + getCashName() + "    : #d" + cm.numberWithCommas(cm.getCash(1)) + "\r\n";
        message += "#b" + getCashName() + "比值    : #d" + rate + "\r\n";
        if (point <= 0) {
            cm.dispose();
            cm.sendNext("目前沒有紅利，無法轉換")
        } else {
            message += "\r\n請輸入要使用的紅利數量:\r\n\r\n";
            cm.sendGetNumber(message, 1, 1, point);
        }
    } else if (status === 1) {
        let point = cm.getPlayer().getAccLogValue("紅利", 0);
        if (mode === 1 && sel === -1) {
            sel = selection;
        }
        let message = "#d是否確認要將\r\n";
        message += "#r" + cm.numberWithCommas(sel) + "紅利#d\r\n";
        message += "轉換為\r\n";
        message += "#b" + cm.numberWithCommas(sel * rate) + getCashName() + "#d\r\n\r\n";
        message += "完成轉換後\r\n";
        message += "剩餘紅利為: #b" + cm.numberWithCommas(point - sel) + "#d\r\n";
        message += "總共" + getCashName() + "為: #r" + cm.numberWithCommas((cm.getCash(1) + (sel * rate))) + "#d\r\n";
        cm.sendYesNo(message);
    } else if (status === 2) {
        let point = cm.getPlayer().getAccLogValue("紅利", 0);
        let message = "#r最終#d確認是否要將\r\n";
        message += "#r" + cm.numberWithCommas(sel) + "紅利#d\r\n";
        message += "轉換為\r\n";
        message += "#b" + cm.numberWithCommas(sel * rate) + getCashName() + "#d\r\n\r\n";
        message += "完成轉換後\r\n";
        message += "剩餘紅利為: #b" + cm.numberWithCommas(point - sel) + "#d\r\n";
        message += "總共" + getCashName() + "為: #r" + cm.numberWithCommas((cm.getCash(1) + (sel * rate))) + "#d\r\n";
        cm.sendYesNo(message);
    } else if (status === 3) {
        let point = cm.getPlayer().getAccLogValue("紅利", 0);
        if (sel < 0 || sel > point) {
            cm.sendNext("發生未知錯誤")
            cm.dispose();
            return;
        }
        cm.getPlayer().addAccLogValue("紅利", -sel);
        cm.gainCash(1, sel * rate);
        let message = "完成轉換!\r\n";
        message += "目前紅利為: #r" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "#d\r\n";
        message += "目前" + getCashName() + "為: #r" + cm.numberWithCommas(cm.getCash(1)) + "#d\r\n\r\n";
        message += "轉換了" + cm.numberWithCommas(sel) + "紅利為" + cm.numberWithCommas(sel * rate) + getCashName() + "\r\n";
        cm.sendNext(message);
        cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[紅利轉" + getCashName() + "] : 帳號<" + cm.getClient().getAccountName() + "> 角色<" + cm.getPlayer().getName() + "> 轉換了" + cm.numberWithCommas(sel) + "紅利為" + cm.numberWithCommas(sel * rate) + getCashName() + " 總紅利為: " + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + " 總" + getCashName() + "為: " + cm.numberWithCommas(cm.getCash(1)));
        cm.logFile("紅利轉" + getCashName() + ".txt", cm.getReadableTime() + " 帳號<" + cm.getClient().getAccountName() + "> 角色<" + cm.getPlayer().getName() + "> 轉換了" + cm.numberWithCommas(sel) + "紅利為" + cm.numberWithCommas(sel * rate) + getCashName() + " 總紅利為: " + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + " 總" + getCashName() + "為: " + cm.numberWithCommas(cm.getCash(1)), false);
        status = -1;
        sel = -1;
    }
}

function getCashName() {
    return "Gash";
}