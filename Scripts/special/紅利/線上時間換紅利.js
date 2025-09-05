let status = -1;

let debug = true;
// 是否套用可兌換分鐘，否為套用總累積分鐘
let applyConsumablePlay = true;
// 兌換比率，60 = 60分鐘:1帳號Log值
let ratio = 115 ;
// 增加帳號Log值
let rewardAccountName = "紅利"; // 顯示名稱
let rewardAccountLogName = "紅利"; // log名稱

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
        let playTime = getAccountPlayTime();
        let message = "#b[在線時間換" + rewardAccountName + "]\r\n\r\n";
        message += "#b目前#d可兌換分鐘: #r" + cm.numberWithCommas(playTime) + "#k\r\n";
        message += "#b目前#d" + rewardAccountName + "#b: #r" + cm.numberWithCommas(cm.getPlayer().getAccLogValue(rewardAccountLogName, 0)) + "\r\n";
        message += "#b兌換比率: #r" + ratio + "#d分鐘#b:#r1#d" + rewardAccountName + "#b\r\n";
        let available = parseInt(Math.floor(playTime / ratio));
        if (available <= 0) {
            cm.sendNext(message);
        } else {
            message += "#b可兌換#r" + cm.numberWithCommas(available) + "#d" + rewardAccountName + " #b(將剩餘#r" + cm.numberWithCommas(playTime - parseInt(available * ratio)) + "#d可兌換分鐘數)\r\n";
            message += "#b是否要兌換?";
            cm.sendYesNo(message);
        }
    } else if (status === 1) {
        let consumablePlayTime = getAccountPlayTime();
        let available = parseInt(Math.floor(consumablePlayTime / ratio));
        if (available <= 0) {
            cm.sendNext("#b可兌換分鐘數#r不足");
            status = -1;
            return;
        }
        let leftTime = consumablePlayTime - parseInt(available * ratio);
        cm.getPlayer().setAccountConsumablePlayTime(leftTime);
        cm.getPlayer().addAccLogValue(rewardAccountLogName, available);
        cm.sendNext("#b已經將#r" + cm.numberWithCommas(available * ratio) + "分鐘兌換成#r" + cm.numberWithCommas(available) + "#d" + rewardAccountName + "#b，剩餘可兌換分鐘數: #r" + getAccountPlayTime() + "\r\n#b目前#d" + rewardAccountName + "#b: #r" + cm.numberWithCommas(cm.getPlayer().getAccLogValue(rewardAccountLogName, 0)));
        cm.logFile("線上時間換紅利.txt", cm.getReadableTime() + " 帳號<" + cm.getClient().getAccountName() + ">角色<" + cm.getPlayer().getName() + "> 將" + cm.numberWithCommas(available * ratio) + "分鐘兌換成" + cm.numberWithCommas(available) + rewardAccountName + "，剩餘可兌換分鐘數: " + getAccountPlayTime() + " 目前" + rewardAccountName + ": " + cm.numberWithCommas(cm.getPlayer().getAccLogValue(rewardAccountLogName, 0)), false);
        status = -1;
    }
}

function getAccountPlayTime() {
    if (applyConsumablePlay) {
        return cm.getPlayer().getAccountConsumablePlayTime();
    } else {
        return cm.getPlayer().getAccountTotalPlayTime();
    }
}