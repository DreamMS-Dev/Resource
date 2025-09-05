/*
2024.12.11
By Windyboy
 */

let status = -1, sel = -1, sel2 = -1, sel3 = -1, sel4 = -1;
let world;

let licensePlateServerLogName = "車牌競標資訊_";

let licensePlateLogName = "車牌所有權_";
let licensePlateBasePrice = 50; // 車牌底價
let licensePlates = [
    // id, sample
    ["ABC123", "[圖片]ABC123"],
    ["CBA321", "[圖片]CBA321"],
    ["AAA111", "[圖片]AAA111"],
];

let licensePlateBidEndYear = 2024; // 競標結束年份
let licensePlateBidEndMonth = 12; // 競標結束月份
let licensePlateBidEndDate = 12; // 競標結束日期

let pointLogName = "累積贊助點數";
let tokenItemId = 2000000;
let tokenItemPrice = 460;

function start() {
    world = cm.getPlayer().getMap().getWorld();
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }

    if (status <= -1) {
        cm.dispose();
    } else if (status === 0) {
        let msg = "歡迎光臨\r\n\r\n";
        msg += "#L0#抽車#l\r\n";
        msg += "#L1#競標車牌#l\r\n";
        msg += "#L2#購買#v" + tokenItemId + "##t" + tokenItemId + "# (目前可購買#r" + (getDonatePoint() === 0 ? 0 : parseInt(getDonatePoint() / tokenItemPrice)) + "#k個)#l";
        cm.sendSimple(msg);
    } else if (status === 1) {
        if (mode === 1) {
            sel = selection;
        }
        switch (sel) {
            case 0:
                extractCar();
                return;
            case 1:
                bidLicensePlate(sel);
                break;
            case 2:
                buyToken(sel);
                break;
        }
    } else if (status === 2) {
        if (mode === 1) {
            sel2 = selection;
        }
        switch (sel) {
            case 1:
                bidLicensePlate(sel2);
                break;
            case 2:
                buyToken(sel2);
                break;
        }
    } else if (status === 3) {
        if (mode === 1) {
            sel3 = selection;
        }
        switch (sel) {
            case 1:
                bidLicensePlate(sel3);
                break;
            case 2:
                buyToken(sel3);
                break;
        }
    } else if (status === 4) {
        if (mode === 1) {
            sel4 = selection;
        }
        switch (sel) {
            case 1:
                bidLicensePlate(sel4);
                break;
        }
    } else {
        cm.dispose();
    }
}

function extractCar() {
    cm.dispose();
    cm.openNpc(9010000, "抽車");
}

function bidLicensePlate(selection) {
    if (status === 1) {
        let msg = "本次競標結束時間: #r" + licensePlateBidEndMonth + "月" + licensePlateBidEndDate + "號0點0分0秒#k\r\n\r\n";
        msg += "請選擇要投標的車牌\r\n\r\n";
        for (let i = 0; i < licensePlates.length; i++) {
            let bidLogInfo = cm.getCacheMapleLog(licensePlateServerLogName + licensePlates[i][0], world);
            let bidder = (bidLogInfo == null ? "無" : bidLogInfo.getValue());
            let bidPrice = (bidLogInfo == null ? licensePlateBasePrice : parseInt(bidLogInfo.getValue3().split("&&&&&")[0]));
            let bidTime = (bidLogInfo == null ? "無" : bidLogInfo.getValue3().split("&&&&&")[1]);

            msg += "#L" + i + "#" + licensePlates[i][1] + "\r\n";
            if (bidLogInfo != null) {
                msg += "競標者  : " + bidder + "\r\n";
                msg += "競標價  : " + bidPrice + "\r\n";
                msg += "競標時間: " + bidTime + "\r\n";
            }
            msg += "#l\r\n";
        }
        cm.sendSimple(msg);
    } else if (status === 2) {
        let bidLogInfo = cm.getCacheMapleLog(licensePlateServerLogName + licensePlates[sel2][0], world);
        let bidder = (bidLogInfo == null ? "無" : bidLogInfo.getValue());
        let bidPrice = (bidLogInfo == null ? licensePlateBasePrice : parseInt(bidLogInfo.getValue3().split("&&&&&")[0]));
        let bidTime = (bidLogInfo == null ? "無" : bidLogInfo.getValue3().split("&&&&&")[1]);
        let myPrice = cm.getPlayer().getAccLogValue(licensePlateLogName + licensePlates[sel2][0], 0);
        let sameAccount = false;
        if (bidLogInfo != null && myPrice > 0) {
            let accountName = cm.getClient().getAccountName();
            let bidderAccountName = bidLogInfo.getValue2();
            sameAccount = bidderAccountName.equals(accountName);
            if (!sameAccount) {
                if (cm.canHold(tokenItemId, myPrice)) {
                    cm.gainItem(tokenItemId, myPrice);
                    cm.getPlayer().setAccLog(licensePlateLogName + licensePlates[sel2][0], "0", getFirstDayOfNextMonths(7));
                    cm.sendNext("已經領回上次競標的" + myPrice + "個#v" + tokenItemId + "##t" + tokenItemId + "#");
                    cm.logFile("競標/車牌-" + licensePlates[sel2][0] + ".txt", cm.getReadableTime() + " " + cm.getClient().getSessionIP() + " " + cm.getPlayer().getName() + "(" + cm.getPlayer().getId() + ") 帳號:" + cm.getClient().getAccountName() + " 領回了 " + myPrice + " 個 " + tokenItemId, false);
                } else {
                    cm.sendNext("必須領回上次競標的" + myPrice + "個#v" + tokenItemId + "##t" + tokenItemId + "#才能下注，但是背包放不下了。");
                    cm.logFile("競標/車牌-" + licensePlates[sel2][0] + ".txt", cm.getReadableTime() + " " + cm.getClient().getSessionIP() + " " + cm.getPlayer().getName() + "(" + cm.getPlayer().getId() + ") 帳號:" + cm.getClient().getAccountName() + " 背包空間不足領回失敗 " + myPrice + " 個 " + tokenItemId, false);
                }
                cm.dispose();
                return;
            }
        }

        let quantity = cm.getItemQuantity(tokenItemId);
        let msg = "\r\n";
        msg += "投標車牌  : #r" + licensePlates[sel2][0] + "#k\r\n";
        msg += "目前競標者: " + bidder + " \r\n";
        if (bidLogInfo == null) {
            msg += "本次起標價: " + cm.numberWithCommas(bidPrice) + "\r\n";
        } else {
            msg += "目前競標價: " + cm.numberWithCommas(bidPrice) + "\r\n";
        }
        msg += "競標時間  : " + bidTime + "\r\n\r\n";
        if (quantity <= 0) {
            cm.sendNext(msg);
            status = -1;
            sel = -1;
            sel2 = -1;
        } else {
            msg += "可下標數量: #b" + quantity + "#k\r\n\r\n";
            if (sameAccount) {
                msg += "#r#e競標者為本人情況下，再次下注不退上次下注的數量(#b" + bidPrice + "#r個)";
            }
            cm.sendGetNumber(msg, 0, bidPrice + 1, quantity);
        }
    } else if (status === 3) {
        if (isAfterLicensePlateBidEnd(licensePlateBidEndYear, licensePlateBidEndMonth, licensePlateBidEndDate)) {
            cm.sendNext("競標已結束，下次請早");
            cm.dispose();
            return;
        }
        cm.sendYesNo("是否確認要下標#r" + sel3 + "#k個到" + licensePlates[sel2][0]);
    } else if (status === 4) {
        if (isAfterLicensePlateBidEnd(licensePlateBidEndYear, licensePlateBidEndMonth, licensePlateBidEndDate)) {
            cm.sendNext("競標已結束，下次請早");
            cm.dispose();
            return;
        }
        let bidLogInfo = cm.getCacheMapleLog(licensePlateServerLogName + licensePlates[sel2][0], world);
        let bidder = (bidLogInfo == null ? "無" : bidLogInfo.getValue());
        let bidPrice = (bidLogInfo == null ? licensePlateBasePrice : parseInt(bidLogInfo.getValue3().split("&&&&&")[0]));

        if (!cm.haveItem(tokenItemId, sel3)) {
            cm.dispose();
            return;
        } else if (sel3 <= bidPrice) {
            cm.sendNext("目前最高出價為 #r" + cm.numberWithCommas(bidPrice) + "#k 下次請早");
            cm.dispose();
            return;
        }

        if (bidLogInfo != null) {
            let lastBidder = cm.getChr(bidder);
            if (lastBidder != null && lastBidder.getId() !== cm.getPlayer().getId()) {
                lastBidder.yellowMessage("下標的車牌[" + licensePlates[sel2][0] + "]被" + cm.getPlayer().getName() + "標走了");
            }
        }

        cm.gainItem(tokenItemId, -sel3);

        let expiration = getFirstDayOfNextMonths(7);
        cm.getPlayer().setAccLog(licensePlateLogName + licensePlates[sel2][0], sel3.toString(), expiration);
        cm.setCacheLog(licensePlateServerLogName + licensePlates[sel2][0], cm.getPlayer().getName(), cm.getClient().getAccountName(), sel3 + "&&&&&" + getCurrentTime(), expiration, world);

        cm.sendNext("競標成功!下標了#r" + sel3 + "#k個到#b" + licensePlates[sel2][0] + "#k");
        cm.logFile("競標/車牌-" + licensePlates[sel2][0] + ".txt", cm.getReadableTime() + " " + cm.getClient().getSessionIP() + " " + cm.getPlayer().getName() + "(" + cm.getPlayer().getId() + ") 帳號:" + cm.getClient().getAccountName() + " 下注了 " + sel3 + " 個 " + tokenItemId + " (上次競標者為" + bidder + ")", false);
        cm.dispose();
    }
}

function buyToken(selection) {
    if (status === 1) {
        if (getDonatePoint() <= 0) {
            cm.sendNext("餘額不足");
            sel = -1;
            status = -1;
        } else {
            cm.sendGetNumber("目前#b累積贊助點數#k為" + cm.numberWithCommas(getDonatePoint()) + "#r#k\r\n\r\n請輸入要購買的數量", 1, 1, (parseInt(getDonatePoint() / tokenItemPrice)));
        }
    } else if (status === 2) {
        if (getDonatePoint() < selection * tokenItemPrice) {
            cm.dispose();
            return;
        }
        cm.sendYesNo("是否確認要使用#b累積贊助點數#r" + cm.numberWithCommas(selection * tokenItemPrice) + "#k來購買#r" + selection + "#k個#v" + tokenItemId + "##t" + tokenItemId + "#?");
    } else if (status === 3) {
        if (getDonatePoint() < selection * tokenItemPrice) {
            cm.dispose();
            return;
        } else if (!cm.canHold(tokenItemId, sel2)) {
            cm.sendNext("背包空間不足");
            cm.dispose();
            return;
        }
        addDonatePoint(-tokenItemPrice * sel2);
        cm.gainItem(tokenItemId, sel2);
        cm.sendNext("兌換成功!獲得" + sel2 + "個#v" + tokenItemId + "##t" + tokenItemId + "#");
        status = -1;
        sel = -1;
        sel2 = -1;
        sel3 = -1;
    }
}

function addDonatePoint(value) {
    return cm.getPlayer().addAccLogValue(pointLogName, value);
}

function getDonatePoint() {
    return cm.getPlayer().getAccLogValue(pointLogName, 0);
}

function isAfterLicensePlateBidEnd() {
    let now = new Date();
    let currentTimestamp = now.getTime();

    let bidEndDate = new Date(licensePlateBidEndYear, licensePlateBidEndMonth - 1, licensePlateBidEndDate);
    let bidEndTimestamp = bidEndDate.getTime();

    return currentTimestamp > bidEndTimestamp;
}

function getFirstDayOfNextMonths(monthsToAdd) {
    let now = new Date();
    let targetMonth = now.getMonth() + monthsToAdd;
    let targetDate = new Date(now.getFullYear(), targetMonth, 1);
    return targetDate.getTime();
}

function getDate() {
    let date = new Date();
    return date.getDate();
}

function getMonth() {
    let date = new Date();
    return date.getMonth() + 1;
}

function getCurrentTime() {
    let date = new Date();
    let MM = date.getMonth() + 1;
    let dd = date.getDate();
    let HH = date.getHours();
    let mm = date.getMinutes();
    let ss = date.getSeconds();
    return `${MM}月${dd}日${HH}點${mm}分${ss}秒`;
}