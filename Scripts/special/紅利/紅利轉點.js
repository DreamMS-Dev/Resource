let status = -1, sel = -1, sel2 = -1;
let userName = null;
//
let debug = true; // true = 維修中
//
let maxOperateNumber = 1000000;
let rate = 1; // 紅利比值
//
let displayPeriodPoint = true; // 顯示期間
let periodPointRate = 1; // 期間紅利比值

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
        cm.getPlayer().dropMessage(6, "status: " + status + " sel: " + sel + " sel2: " + sel2 + " userName:" + userName);
    }
    if (mode === 1) {
        status++;
    } else if (mode === 0) {
        if (status === 1) {
            sel = -1;
        } else if (status === 2) {
            userName = null;
        }
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status < 0) {
        cm.dispose();
    } else if (status === 0) {
        let pay = cm.getPlayer().getHyPay(1);
        let message = "#b[轉點系統]\r\n\r\n";
        if (displayPeriodPoint) {
            message += "#b本次期間贊助: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("期間贊助", 0)) + "\r\n";
        }
        message += "#b目前累積贊助: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("累積贊助", 0)) + "\r\n";
        message += "#b本月累積贊助: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("月累積贊助", 0)) + "\r\n";
        message += "#b本週累積贊助: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("週累積贊助", 0)) + "\r\n";
        message += "#b本日累積贊助: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("日累積贊助", 0)) + "\r\n";
        message += "---------------------------\r\n";
        if (displayPeriodPoint) {
            message += "#b本次期間紅利: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("期間紅利", 0)) + "\r\n";
        }
        message += "#b目前累積紅利: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("累積紅利", 0)) + "\r\n";
        message += "#b本月累積紅利: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("月累積紅利", 0)) + "\r\n";
        message += "#b本週累積紅利: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("週累積紅利", 0)) + "\r\n";
        message += "#b本日累積紅利: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("日累積紅利", 0)) + "\r\n";
        message += "---------------------------\r\n";
        message += "#b目前紅利    : #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "\r\n";
        message += "#b可轉換的金額: #d" + cm.numberWithCommas(pay) + "\r\n";
        if (rate !== 1) {
            message += "#b可轉換的紅利: #d" + cm.numberWithCommas(pay * rate) + "\r\n";
        }
        message += "---------------------------\r\n";
        message += "#b紅利比值    : #d" + rate + "\r\n";
        if (displayPeriodPoint && rate !== periodPointRate) {
            message += "#b期間紅利比值    : #d" + periodPointRate + "\r\n";
        }
        if (cm.getPlayer().isGM()) {
            message += "---------------------------\r\n";
            message += "#L0#轉換紅利#l\r\n";
            message += "\r\n---------------------------\r\n";
            message += "#L10##b查看#k其他角色贊助及紅利資訊#l\r\n";
            message += "#L11##b修改#k其他角色可轉換金額#l\r\n";
            message += "#L12##r重置#k其他角色可轉換金額#l\r\n";
            message += "#L13##b修改#k其他角色的#d目前紅利#l\r\n";
            message += "#L14##r重置#k其他角色的#d目前紅利#l\r\n";
            message += "#L15##b修改#k其他角色的#b期間贊助#l\r\n";
            message += "#L16##r重置#k其他角色的#b期間贊助#k#l\r\n";
            message += "#L17##b修改#k其他角色的#d期間紅利#l\r\n";
            message += "#L18##r重置#k其他角色的#d期間紅利#k#l\r\n";
            message += "#L19##r重置#k其他角色所有#b贊助#k#l\r\n";
            message += "#L20##r重置#k其他角色所有#d紅利#k#l\r\n";
            message += "\r\n---------------------------\r\n";
            message += "#L100##b增加#k自己可轉換金額#l\r\n";
            message += "#L101##r重置#k自己可轉換金額#l\r\n";
            message += "#L102##r重置#k自己所有贊助#l\r\n";
            message += "#L103##r重置#k自己所有紅利#l\r\n";
            message += "#L104##r重置#k自己的期間贊助#l\r\n";
            message += "#L105##r重置#k自己的期間紅利#l\r\n";
            message += "\r\n---------------------------\r\n";
            message += "#L1000##r重置#k#e全伺服器#n#r期間贊助#k和#r紅利#l\r\n";
            message += "#L1001##r重置#k#e全伺服器#n#r期間贊助#l\r\n";
            message += "#L1002##r重置#k#e全伺服器#n#r期間紅利#l\r\n";
            cm.sendSimple(message);
        } else {
            if (pay <= 0) {
                cm.sendNext(message);
                cm.dispose();
            } else {
                cm.sendYesNo(message);
            }
        }
    } else if (status === 1) {
        if (cm.getPlayer().isGM()) {
            if (mode === 1 && sel === -1) {
                sel = selection;
            }
            switch (sel) {
                case 0:
                    givePoint();
                    break;
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                    cm.sendGetText("請輸入角色名稱");
                    break;
                case 100:
                    cm.sendGetNumber("請輸入要增加的可轉換金額(目前為" + cm.numberWithCommas(cm.getHyPay(1)) + ")", 1, 1, maxOperateNumber);
                    break;
                case 101:
                    cm.getPlayer().addPay(-cm.getHyPay(1));
                    cm.sendNext("重置自己可轉換金額完成");
                    status = -1;
                    sel = -1;
                    break;
                case 102:
                    cm.getPlayer().addAccLogValue("期間贊助", -cm.getPlayer().getAccLogValue("期間贊助", 0));
                    cm.getPlayer().addAccLogValue("累積贊助", -cm.getPlayer().getAccLogValue("累積贊助", 0));
                    cm.getPlayer().addAccMonthlyLogValue("月累積贊助", -cm.getPlayer().getAccLogValue("月累積贊助", 0));
                    cm.getPlayer().addAccWeeklyLogValue("週累積贊助", -cm.getPlayer().getAccLogValue("週累積贊助", 0));
                    cm.getPlayer().addAccDailyLogValue("日累積贊助", -cm.getPlayer().getAccLogValue("日累積贊助", 0));
                    cm.sendNext("重置自己所有贊助完成");
                    status = -1;
                    sel = -1;
                    break;
                case 103:
                    cm.getPlayer().addAccLogValue("期間紅利", -cm.getPlayer().getAccLogValue("期間紅利", 0));
                    cm.getPlayer().addAccLogValue("累積紅利", -cm.getPlayer().getAccLogValue("累積紅利", 0));
                    cm.getPlayer().addAccMonthlyLogValue("月累積紅利", -cm.getPlayer().getAccLogValue("月累積紅利", 0));
                    cm.getPlayer().addAccWeeklyLogValue("週累積紅利", -cm.getPlayer().getAccLogValue("週累積紅利", 0));
                    cm.getPlayer().addAccDailyLogValue("日累積紅利", -cm.getPlayer().getAccLogValue("日累積紅利", 0));
                    cm.getPlayer().addAccLogValue("紅利", -cm.getPlayer().getAccLogValue("紅利", 0));
                    cm.sendNext("重置自己所有紅利完成");
                    status = -1;
                    sel = -1;
                    break;
                case 104:
                    cm.getPlayer().addAccLogValue("期間贊助", -cm.getPlayer().getAccLogValue("期間贊助", 0));
                    cm.sendNext("重置自己期間贊助完成");
                    status = -1;
                    sel = -1;
                    break;
                case 105:
                    cm.getPlayer().addAccLogValue("期間紅利", -cm.getPlayer().getAccLogValue("期間紅利", 0));
                    cm.sendNext("重置自己期間紅利完成");
                    status = -1;
                    sel = -1;
                    break;
                case 1000:
                    cm.sendYesNo("是否確認重置#r全伺服器期間贊助和期間紅利");
                    break;
                case 1001:
                    cm.sendYesNo("是否確認重置#r全伺服器期間贊助");
                    break;
                case 1002:
                    cm.sendYesNo("是否確認重置#r全伺服器期間紅利");
                    break;
            }
        } else {
            givePoint();
        }
    } else if (status === 2) {
        if (sel >= 10 && sel <= 99) {
            if (mode === 1) {
                userName = cm.getText();
            }
            let userId = cm.getCharacterIdByName(userName);
            let accountId = cm.getAccountIdByChrName(userName);
            if (userId === -1 || accountId === -1) {
                cm.sendNext("角色`" + userName + "`不存在");
                sel = -1;
                status = -1;
                userName = null;
                return;
            }
            let accountName = cm.getCharacterAccountNameByCharacterId(userId);
            let user = cm.getChr(userName);
            if (user == null) {
                user = cm.getOnlineCharacterByAccountId(accountId);
            }
            if (user != null) {
                userName = user.getName();
            }
            let msg;
            let hpPay = 0;
            let periodDonate = 0;
            let periodPoint = 0;
            switch (sel) {
                case 10:
                    let pay = getHyPay(user, accountName);
                    msg = "[" + userName + "資訊如下]\r\n";
                    if (displayPeriodPoint) {
                        msg += "#b本次期間贊助: #d" + cm.numberWithCommas(getAccountLog(user, "期間贊助", accountId)) + "\r\n";
                    }
                    msg += "#b目前累積贊助: #d" + cm.numberWithCommas(getAccountLog(user, "累積贊助", accountId)) + "\r\n";
                    msg += "#b本月累積贊助: #d" + cm.numberWithCommas(getAccountLog(user, "月累積贊助", accountId)) + "\r\n";
                    msg += "#b本週累積贊助: #d" + cm.numberWithCommas(getAccountLog(user, "週累積贊助", accountId)) + "\r\n";
                    msg += "#b本日累積贊助: #d" + cm.numberWithCommas(getAccountLog(user, "日累積贊助", accountId)) + "\r\n";
                    msg += "\r\n---------------------------\r\n\r\n";
                    if (displayPeriodPoint) {
                        msg += "#b本次期間紅利: #d" + cm.numberWithCommas(getAccountLog(user, "期間紅利", accountId)) + "\r\n";
                    }
                    msg += "#b目前累積紅利: #d" + cm.numberWithCommas(getAccountLog(user, "累積紅利", accountId)) + "\r\n";
                    msg += "#b本月累積紅利: #d" + cm.numberWithCommas(getAccountLog(user, "月累積紅利", accountId)) + "\r\n";
                    msg += "#b本週累積紅利: #d" + cm.numberWithCommas(getAccountLog(user, "週累積紅利", accountId)) + "\r\n";
                    msg += "#b本日累積紅利: #d" + cm.numberWithCommas(getAccountLog(user, "日累積紅利", accountId)) + "\r\n";
                    msg += "\r\n---------------------------\r\n\r\n";
                    msg += "#b目前紅利    : #d" + cm.numberWithCommas(getAccountLog(user, "紅利", accountId)) + "\r\n";
                    msg += "#b可轉換的金額: #d" + cm.numberWithCommas(pay) + "\r\n";
                    cm.sendNext(msg);
                    userName = null;
                    status = -1;
                    sel = -1;
                    break;
                case 11: // 修改其他角色可轉換金額
                    hpPay = getHyPay(user, accountName);
                    msg = "修改角色可轉換金額\r\n";
                    msg += "角色: #r" + userName + "#k\r\n";
                    msg += "帳號: #b" + accountName + "#k\r\n";
                    msg += "該角色可轉換金額目前為" + cm.numberWithCommas(hpPay) + "\r\n";
                    msg += "請輸入新的可轉換金額";
                    cm.sendGetNumber(msg, 1, 0, maxOperateNumber);
                    break;
                case 12: // 重置其他角色可轉換金額
                    hpPay = getHyPay(user, accountName);
                    if (hpPay <= 0) {
                        cm.sendNext("角色'#r" + userName + "'#k目前可轉換金額為0，無法重置");
                        userName = null;
                        status = -1;
                        sel = -1;
                        return;
                    }
                    msg = "是否確認要重置\r\n";
                    msg += "角色: #r" + userName + "#k\r\n";
                    msg += "帳號: #b" + accountName + "#k\r\n";
                    msg += "的#b可轉換金額#k，該角色可轉換金額目前為" + cm.numberWithCommas(hpPay);
                    cm.sendYesNo(msg);
                    break;
                case 13: // 修改其他角色的目前紅利
                    if (user === null) {
                        cm.sendNext("角色'#r" + userName + "'#k不在線上");
                        userName = null;
                        status = -1;
                        sel = -1;
                        return;
                    }
                    msg = "修改角色目前紅利\r\n";
                    msg += "角色: #r" + userName + "#k\r\n";
                    msg += "帳號: #b" + accountName + "#k\r\n";
                    msg += "該角色目前紅利為" + cm.numberWithCommas(getAccountLog(user, "紅利", accountId)) + "\r\n";
                    msg += "請輸入新的紅利";
                    cm.sendGetNumber(msg, 1, 0, maxOperateNumber);
                    break;
                case 14: // 重置其他角色的目前紅利
                    periodPoint = getAccountLog(user, "紅利", accountId);
                    if (periodPoint <= 0) {
                        cm.sendNext("角色'#r" + userName + "'#k目前期間紅利為0，無法重置");
                        userName = null;
                        status = -1;
                        sel = -1;
                        return;
                    }
                    msg = "是否確認要重置\r\n";
                    msg += "角色: #r" + userName + "#k\r\n";
                    msg += "帳號: #b" + accountName + "#k\r\n";
                    msg += "的#b期間紅利#k，該角色期間紅利目前為" + cm.numberWithCommas(periodPoint);
                    cm.sendYesNo(msg);
                    break;
                case 15: // 修改其他角色的期間贊助
                    if (user === null) {
                        cm.sendNext("角色'#r" + userName + "'#k不在線上");
                        userName = null;
                        status = -1;
                        sel = -1;
                        return;
                    }
                    msg = "修改角色期間贊助\r\n";
                    msg += "角色: #r" + userName + "#k\r\n";
                    msg += "帳號: #b" + accountName + "#k\r\n";
                    msg += "該角色目前期間贊助為" + cm.numberWithCommas(getAccountLog(user, "期間贊助", accountId)) + "\r\n";
                    msg += "請輸入新的期間贊助";
                    cm.sendGetNumber(msg, 1, 0, maxOperateNumber);
                    break;
                case 16: // 重置其他角色的期間贊助
                    periodDonate = getAccountLog(user, "期間贊助", accountId);
                    if (periodDonate <= 0) {
                        cm.sendNext("角色'#r" + userName + "'#k目前期間贊助為0，無法重置");
                        userName = null;
                        status = -1;
                        sel = -1;
                        return;
                    }
                    msg = "是否確認要重置\r\n";
                    msg += "角色: #r" + userName + "#k\r\n";
                    msg += "帳號: #b" + accountName + "#k\r\n";
                    msg += "的#b期間贊助#k，該角色期間贊助目前為" + cm.numberWithCommas(periodDonate);
                    cm.sendYesNo(msg);
                    break;
                case 17: // 修改其他角色期間紅利
                    if (user === null) {
                        cm.sendNext("角色'#r" + userName + "'#k不在線上");
                        userName = null;
                        status = -1;
                        sel = -1;
                        return;
                    }
                    msg = "修改角色期間紅利\r\n";
                    msg += "角色: #r" + userName + "#k\r\n";
                    msg += "帳號: #b" + accountName + "#k\r\n";
                    msg += "該角色目前期間紅利為" + cm.numberWithCommas(getAccountLog(user, "期間紅利", accountId)) + "\r\n";
                    msg += "請輸入新的期間紅利";
                    cm.sendGetNumber(msg, 1, 0, maxOperateNumber);
                    break;
                case 18: // 重置其他角色期間紅利
                    periodPoint = getAccountLog(user, "期間紅利", accountId);
                    if (periodPoint <= 0) {
                        cm.sendNext("角色'#r" + userName + "'#k目前期間紅利為0，無法重置");
                        userName = null;
                        status = -1;
                        sel = -1;
                        return;
                    }
                    msg = "是否確認要重置\r\n";
                    msg += "角色: #r" + userName + "#k\r\n";
                    msg += "帳號: #b" + accountName + "#k\r\n";
                    msg += "的#b期間紅利#k，該角色期間紅利目前為" + cm.numberWithCommas(periodPoint);
                    cm.sendYesNo(msg);
                    break;
                case 19: // 重置其他角色所有贊助
                    msg = "是否確認要重置\r\n";
                    msg += "角色: #r" + userName + "#k\r\n";
                    msg += "帳號: #b" + accountName + "#k\r\n";
                    msg += "的#b所有贊助(不包含紅利)#k";
                    msg += "該角色目前贊助資訊為下\r\n";
                    if (displayPeriodPoint) {
                        msg += "#b本次期間贊助: #d" + cm.numberWithCommas(getAccountLog(user, "期間贊助", accountId)) + "\r\n";
                    }
                    msg += "#b目前累積贊助: #d" + cm.numberWithCommas(getAccountLog(user, "累積贊助", accountId)) + "\r\n";
                    msg += "#b本月累積贊助: #d" + cm.numberWithCommas(getAccountLog(user, "月累積贊助", accountId)) + "\r\n";
                    msg += "#b本週累積贊助: #d" + cm.numberWithCommas(getAccountLog(user, "週累積贊助", accountId)) + "\r\n";
                    msg += "#b本日累積贊助: #d" + cm.numberWithCommas(getAccountLog(user, "日累積贊助", accountId)) + "\r\n";
                    cm.sendYesNo(msg);
                    break;
                case 20: // 重置其他角色所有紅利
                    msg = "是否確認要重置\r\n";
                    msg += "角色: #r" + userName + "#k\r\n";
                    msg += "帳號: #b" + accountName + "#k\r\n";
                    msg += "的#b所有紅利(不包含贊助)#k，該角色目前紅利資訊為下\r\n";
                    if (displayPeriodPoint) {
                        msg += "#b本次期間紅利: #d" + cm.numberWithCommas(getAccountLog(user, "期間紅利", accountId)) + "\r\n";
                    }
                    msg += "#b目前累積紅利: #d" + cm.numberWithCommas(getAccountLog(user, "累積紅利", accountId)) + "\r\n";
                    msg += "#b本月累積紅利: #d" + cm.numberWithCommas(getAccountLog(user, "月累積紅利", accountId)) + "\r\n";
                    msg += "#b本週累積紅利: #d" + cm.numberWithCommas(getAccountLog(user, "週累積紅利", accountId)) + "\r\n";
                    msg += "#b本日累積紅利: #d" + cm.numberWithCommas(getAccountLog(user, "日累積紅利", accountId)) + "\r\n";
                    msg += "#b目前紅利    : #d" + cm.numberWithCommas(getAccountLog(user, "紅利", accountId)) + "\r\n";
                    cm.sendYesNo(msg);
                    break;
            }
        } else if (sel === 100) {
            cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 為自己增加了" + cm.numberWithCommas(selection) + "可轉換金額");
            cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 為自己增加了" + cm.numberWithCommas(selection) + "可轉換金額", false);
            cm.getPlayer().addPay(selection);
            userName = null;
            status = -1;
            sel = -1;
            cm.sendNext("已增加可轉換金額: " + cm.numberWithCommas(selection));
        } else if (sel === 1000) {
            cm.removeAccountLog(-1, "期間贊助");
            cm.removeAccountLog(-1, "期間紅利");
            cm.sendNext("重置#r伺服器期間贊助和期間紅利#k完成");
            cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 已重置伺服器期間贊助和期間紅利");
            cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 已重置伺服器期間贊助和期間紅利", false);
            userName = null;
            status = -1;
            sel = -1;
        } else if (sel === 1001) {
            cm.removeAccountLog(-1, "期間贊助");
            cm.sendNext("重置#r伺服器期間贊助#k完成");
            cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 已重置伺服器期間贊助");
            cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 已重置伺服器期間贊助", false);
            userName = null;
            status = -1;
            sel = -1;
        } else if (sel === 1002) {
            cm.removeAccountLog(-1, "期間紅利");
            cm.sendNext("重置#r伺服器期間紅利#k完成");
            cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 已重置伺服器期間紅利");
            cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 已重置伺服器期間紅利", false);
            userName = null;
            status = -1;
            sel = -1;
        }
    } else if (status === 3) {
        if (sel >= 10 && sel <= 99) {
            let userId = cm.getCharacterIdByName(userName);
            let accountId = cm.getAccountIdByChrName(userName);
            if (userId === -1 || accountId === -1) {
                cm.sendNext("角色`" + userName + "`不存在");
                sel = -1;
                status = -1;
                userName = null;
                return;
            }
            let accountName = cm.getCharacterAccountNameByCharacterId(userId);
            let user = cm.getChr(userName);
            if (user == null) {
                user = cm.getOnlineCharacterByAccountId(accountId);
            }
            if (user != null) {
                userName = user.getName();
            }
            switch (sel) {
                case 11: // 修改其他角色可轉換金額
                    if (mode === 1) {
                        sel2 = selection;
                    }
                    cm.sendYesNo("是否確認將角色'#b" + userName + "#k'可轉換金額修改為#r" + cm.numberWithCommas(sel2));
                    break;
                case 12: // 重置其他角色可轉換金額
                    updateHyPay(user, accountName, 0);
                    cm.sendNext("角色'#r" + userName + "#k'#b可轉換金額#k重置完成");
                    cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">可轉換金額重置");
                    cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">可轉換金額重置", false);
                    status = -1;
                    sel = -1;
                    userName = null;
                    break;
                case 13: // 修改其他角色的目前紅利
                    if (mode === 1) {
                        sel2 = selection;
                    }
                    cm.sendYesNo("是否確認將角色'#b" + userName + "#k'目前紅利修改為#r" + cm.numberWithCommas(sel2));
                    break;
                case 14: // 重置其他角色的目前紅利
                    cm.removeAccountLog(accountId, "紅利");
                    cm.sendNext("角色'#r" + userName + "#k'#b目前紅利#k重置完成");
                    cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">目前紅利重置");
                    cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">目前紅利重置", false);
                    status = -1;
                    sel = -1;
                    userName = null;
                    break;
                case 15: // 修改其他角色的期間贊助
                    if (mode === 1) {
                        sel2 = selection;
                    }
                    cm.sendYesNo("是否確認將角色'#b" + userName + "#k'期間贊助修改為#r" + cm.numberWithCommas(sel2));
                    break;
                case 16: // 重置其他角色的期間贊助
                    cm.removeAccountLog(accountId, "期間贊助");
                    cm.sendNext("角色'#r" + userName + "#k'重設角色#b期間贊助#k完成");
                    cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">期間贊助重置");
                    cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">期間贊助重置", false);
                    status = -1;
                    sel = -1;
                    userName = null;
                    break;
                case 17: // 修改其他角色期間紅利
                    if (mode === 1) {
                        sel2 = selection;
                    }
                    cm.sendYesNo("是否確認將角色'#b" + userName + "#k'期間紅利修改為#r" + cm.numberWithCommas(sel2));
                    break;
                case 18: // 重置其他角色的期間紅利
                    cm.removeAccountLog(accountId, "期間紅利");
                    cm.sendNext("角色'#r" + userName + "#k'重設角色#b期間紅利#k完成");
                    cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">期間紅利重置");
                    cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">期間紅利重置", false);
                    status = -1;
                    sel = -1;
                    userName = null;
                    break;
                case 19: // 重置其他角色所有贊助
                    cm.removeAccountLog(accountId, "期間贊助");
                    cm.removeAccountLog(accountId, "累積贊助");
                    cm.removeAccountLog(accountId, "月累積贊助");
                    cm.removeAccountLog(accountId, "週累積贊助");
                    cm.removeAccountLog(accountId, "日累積贊助");
                    cm.sendNext("角色'#r" + userName + "#k'重設角色#b所有贊助#k完成");
                    cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">所有贊助重置");
                    cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">所有贊助重置", false);
                    status = -1;
                    sel = -1;
                    userName = null;
                    break;
                case 20: // 重置其他角色所有紅利
                    cm.removeAccountLog(accountId, "期間紅利");
                    cm.removeAccountLog(accountId, "累積紅利");
                    cm.removeAccountLog(accountId, "月累積紅利");
                    cm.removeAccountLog(accountId, "週累積紅利");
                    cm.removeAccountLog(accountId, "日累積紅利");
                    cm.removeAccountLog(accountId, "紅利");
                    cm.sendNext("角色'#r" + userName + "'#k重設角色#b所有紅利#k完成");
                    cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">所有紅利重置");
                    cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">所有紅利重置", false);
                    status = -1;
                    sel = -1;
                    userName = null;
                    break;
            }
        }
    } else if (status === 4) {
        if (sel >= 10 && sel <= 99) {
            let userId = cm.getCharacterIdByName(userName);
            let accountId = cm.getAccountIdByChrName(userName);
            if (userId === -1 || accountId === -1) {
                cm.sendNext("角色`" + userName + "`不存在");
                sel = -1;
                status = -1;
                userName = null;
                return;
            }
            let accountName = cm.getCharacterAccountNameByCharacterId(userId);
            let user = cm.getChr(userName);
            if (user == null) {
                user = cm.getOnlineCharacterByAccountId(accountId);
            }
            if (user != null) {
                userName = user.getName();
            }
            switch (sel){
                case 11: // 修改其他角色可轉換金額
                    cm.sendNext("角色'#r" + userName + "#k'#b可轉換金額#k修改完成: " + cm.numberWithCommas(sel2));
                    updateHyPay(user, accountName, sel2);
                    cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">可轉換金額修改為: " + cm.numberWithCommas(sel2));
                    cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">可轉換金額修改為: " + cm.numberWithCommas(sel2), false);
                    status = -1;
                    sel = -1;
                    sel2 = -1;
                    userName = null;
                    break;
                case 13: // 修改其他角色目前紅利
                    cm.sendNext("角色'#r" + userName + "#k'#b目前紅利#k修改完成: " + cm.numberWithCommas(sel2));
                    user.setAccLogValue("紅利", sel2);
                    cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">目前紅利修改為: " + cm.numberWithCommas(sel2));
                    cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">目前紅利修改為: " + cm.numberWithCommas(sel2), false);
                    status = -1;
                    sel = -1;
                    sel2 = -1;
                    userName = null;
                    break;
                case 15: // 修改其他角色期間贊助
                    cm.sendNext("角色'#r" + userName + "#k'#b期間贊助#k修改完成: " + cm.numberWithCommas(sel2));
                    user.setAccLogValue("期間贊助", sel2);
                    cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">期間贊助修改為: " + cm.numberWithCommas(sel2));
                    cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">期間贊助修改為: " + cm.numberWithCommas(sel2), false);
                    status = -1;
                    sel = -1;
                    sel2 = -1;
                    userName = null;
                    break;
                case 17: // 修改其他角色期間紅利
                    cm.sendNext("角色'#r" + userName + "#k'#b期間紅利#k修改完成: " + cm.numberWithCommas(sel2));
                    user.setAccLogValue("期間紅利", sel2);
                    cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">期間紅利修改為: " + cm.numberWithCommas(sel2));
                    cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 管理員<" + cm.getPlayer().getName() + "> 已將帳號<" + accountName + ">角色<" + userName + ">期間紅利修改為: " + cm.numberWithCommas(sel2), false);
                    status = -1;
                    sel = -1;
                    sel2 = -1;
                    userName = null;
                    break;
            }
        }
    }
}

function givePoint() {
    let pay = cm.getPlayer().getHyPay(1);
    if (pay <= 0) {
        cm.sendNext("沒有可轉換的點數");
        status = -1;
        sel = -1;
    } else {
        let result = pay * rate;
        cm.getPlayer().addPay(-pay);
        cm.getPlayer().addAccLogValue("期間贊助", pay);
        cm.getPlayer().addAccLogValue("累積贊助", pay);
        cm.getPlayer().addAccMonthlyLogValue("月累積贊助", pay);
        cm.getPlayer().addAccWeeklyLogValue("週累積贊助", pay);
        cm.getPlayer().addAccDailyLogValue("日累積贊助", pay);
        //
        cm.getPlayer().addAccLogValue("期間紅利", result);
        cm.getPlayer().addAccLogValue("累積紅利", result);
        cm.getPlayer().addAccMonthlyLogValue("月累積紅利", result);
        cm.getPlayer().addAccWeeklyLogValue("週累積紅利", result);
        cm.getPlayer().addAccDailyLogValue("日累積紅利", result);
        //
        cm.getPlayer().addAccLogValue("紅利", result);
        cm.sendNext("#d已將[#r" + cm.numberWithCommas(pay) + "#d]轉換為#b" + cm.numberWithCommas(result) + "#d紅利，目前共有" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "紅利");
        cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[轉點系統] : 帳號<" + cm.getClient().getAccountName() + ">角色<" + cm.getPlayer().getName() + "> 將" + cm.numberWithCommas(pay) + "金額轉換成了" + cm.numberWithCommas(result) + "紅利，目前共有" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "紅利");
        cm.logFile("轉點紀錄.txt", cm.getReadableTime() + " 帳號<" + cm.getClient().getAccountName() + ">角色<" + cm.getPlayer().getName() + "> 將" + cm.numberWithCommas(pay) + "金額轉成了" + cm.numberWithCommas(result) + "紅利，目前共有" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "紅利及" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("累積贊助", 0)) + "累積贊助", false);
        status = -1;
        sel = -1;
    }
}

function getAccountLog(user, logName, accountId) {
    let value = 0;
    if (user != null) {
        value = user.getAccLogValue(logName, 0);
    } else {
        let listResult = cm.selectSQL("SELECT value FROM accounts_log WHERE accid = ? AND `key` = ?", accountId, logName);
        if (listResult.size() > 0) {
            let mapResult = listResult.get(0);
            value = parseInt(mapResult.get("value"));
        }
    }
    return value;
}

function getHyPay(user, accountName) {
    let pay = 0;
    if (user != null) {
        pay = user.getHyPay(1);
    } else {
        let listResult = cm.selectSQL("SELECT pay FROM hypay WHERE accname = ?", accountName); // List<Map<String, Object>>
        if (listResult.size() > 0) {
            let mapResult = listResult.get(0);
            pay = parseInt(mapResult.get("pay"));
        }
    }
    return pay;
}

function updateHyPay(user, accountName, newPay) {
    cm.executeSQL("UPDATE hypay SET pay = ? WHERE accname = ?", newPay, accountName);
}