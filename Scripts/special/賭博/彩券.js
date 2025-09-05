/**
 * 需要搭配事件腳本'LotteryTicket'一起使用
 * 2024.12.08
 * By Windyboy
 */

let status = -1, sel, logDate;
let selectedNumbers = [];
let lotteryList = [];
let lotteryList_yesterday = [];
let yesterdayCharacterSelectedLotteryNumberList;
let characterSelectedLotteryNumberList;

let stopBetHour = 20; // 停止下注時間
let openHour = 21; // 時間若比現在早 -> 開獎, 比現在晚 -> 隔天才開獎
let logName = "彩券";
let reqMoney = 50000000;
let rewardMoney2 = 6000000;
let rewardMoney3 = 40000000;
let rewardMoney4 = 500000000;
let rewardMoney5 = 1680000000;
let minimumNumber = 1; // 樂透最低數字
let maximumNumber = 50;  // 樂透最高數字
let keepingDataMonth = 3; // 樂透號碼保留多少個月
let broadcastOnReward = true; // 領獎時廣播

function start() {
    startScriptDate = cm.getReadableDate();
    let eventManager = cm.getChannelServer(cm.getPlayer().getMap().getChannel()).getEventSM().getEventManager("LotteryTicket");
    if (eventManager == null) {
        cm.sendNext("目前尚未開放此系統");
        cm.dispose();
        return;
    }

    let yesterdayLotteryNumberInString = cm.getCacheLog(logName + "_" + getYesterdayDateInString(), cm.getPlayer().getMap().getWorld());
    let todayLotteryNumberInString = cm.getCacheLog(logName + "_" + getTodayDateInString(), cm.getPlayer().getMap().getWorld());
    if (yesterdayLotteryNumberInString == null || todayLotteryNumberInString == null) {
        cm.sendNext("此系統尚未初始化，請稍後再試");
        cm.dispose();
        return;
    }

    lotteryList_yesterday = convertStringToNumbers(yesterdayLotteryNumberInString);
    lotteryList = convertStringToNumbers(todayLotteryNumberInString);

    yesterdayCharacterSelectedLotteryNumberList = getYesterdayCharacterSelectedLotteryNumberList();
    characterSelectedLotteryNumberList = getCharacterSelectedLotteryNumberList();
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (startScriptDate !== cm.getReadableDate()) {
        cm.sendNext("由於跨天了，必須重新開啟腳本");
        cm.dispose();
        return;
    }
    if (mode === 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status === 0) {
        let message = "#d------------------------------------------------\r\n";
        message += "#b昨日樂透彩開獎號碼為:#r " + lotteryList_yesterday + "\r\n";
        if (yesterdayCharacterSelectedLotteryNumberList != null) {
            message += "#b昨日樂透彩投注號碼為:#r " + yesterdayCharacterSelectedLotteryNumberList + "\r\n";
        }
        message += "#b本次樂透彩開獎號碼為:#r " + (cm.getHourOfDay() >= openHour ? lotteryList : "尚未開獎") + "\r\n";

        if (cm.getPlayer().isGM() && cm.getHourOfDay() < openHour) {
            cm.getPlayer().yellowMessage("[GM提示] 樂透開獎號碼: " + lotteryList);
        }

        let tmpMsg = "";
        if (characterSelectedLotteryNumberList != null && characterSelectedLotteryNumberList.length > 0) {
            tmpMsg = characterSelectedLotteryNumberList;
        } else {
            tmpMsg = "無";
        }

        message += "#b本次樂透彩投注號碼為:#r " + tmpMsg + "\r\n";
        if (cm.getHourOfDay() >= openHour) {
            let success = 0;
            if (characterSelectedLotteryNumberList != null && characterSelectedLotteryNumberList.length > 0) {
                for (let i = 0; i < characterSelectedLotteryNumberList.length; i++) {
                    if (characterSelectedLotteryNumberList[i] === lotteryList[i]) {
                        success++;
                    }
                }
            }
            message += "#b本次樂透中獎號碼數量:#r " + success + "\r\n";
        }
        message += "#d------------------------------------------------\r\n";
        message += "#b這裡是大樂透簽彩中心,每天" + openHour + "點開獎 請在" + stopBetHour + "點前下注完畢!\r\n";
        message += "#b一天可下注多次，重複投注只會算做一次!\r\n";
        message += "#L0##d我要投注今日的樂透彩(" + reqMoney + "元/次)\r\n";

        message += "#L1##r我要領取今日開彩獎勵#l\r\n";
        message += "#L2##r我要領取昨日開彩獎勵#l\r\n";
        message += "\r\n\r\n";
        message += "#b\t\t\t中獎兩個字 獎金 #r" + numberToString(rewardMoney2) + " #b楓幣\r\n";
        message += "#b\t\t\t中獎三個字 獎金 #r" + numberToString(rewardMoney3) + " #b楓幣\r\n";
        message += "#b\t\t\t中獎四個字 獎金 #r" + numberToString(rewardMoney4) + " #b楓幣\r\n";
        message += "#b\t\t\t中獎五個字 獎金 #r" + numberToString(rewardMoney5) + " #b楓幣\r\n";
        cm.sendSimple(message);
    } else if (status === 1) {
        sel = selection;
        if (sel === 0) {
            if (cm.getPlayer().getMeso() < reqMoney) {
                cm.sendNext("身上的楓幣不足，至少需要" + reqMoney);
                cm.dispose();
                return;
            } else if (cm.getHourOfDay() >= stopBetHour) {
                cm.sendNext("超過" + stopBetHour + "點以後必須要隔天才能下注");
                cm.dispose();
                return;
            }
            logDate = getTodayDateInString();
            cm.sendSimple("請選擇要下注的第#b1#k個數字\r\n" + showSelectableNumber());
        } else if (sel === 1) {
            if (cm.getPlayer().getAccLog(logName + "_" + getTodayDateInString() + "_領取") != null) {
                cm.sendNext("已經領取過今日獎勵");
                cm.dispose();
                return;
            } else if (cm.getHourOfDay() < openHour) {
                cm.sendNext("今日尚未開獎");
                cm.dispose();
                return;
            }

            let todayLotteryNumberInString = cm.getCacheLog(logName + "_" + getTodayDateInString(), cm.getPlayer().getMap().getWorld());
            if (todayLotteryNumberInString == null) {
                cm.sendNext("此系統尚未初始化，請稍後再試");
                cm.dispose();
                return;
            }
            characterSelectedLotteryNumberList = getCharacterSelectedLotteryNumberList();
            lotteryList = convertStringToNumbers(todayLotteryNumberInString);

            if (characterSelectedLotteryNumberList != null && characterSelectedLotteryNumberList.length > 0) {
                let success = 0;
                for (let i = 0; i < characterSelectedLotteryNumberList.length; i++) {
                    if (characterSelectedLotteryNumberList[i] === lotteryList[i]) {
                        success++;
                    }
                }
                if (success >= 2) {
                    let localRewardMoney = 0;
                    switch (success) {
                        case 5:
                            localRewardMoney = rewardMoney5;
                            break;
                        case 4:
                            localRewardMoney = rewardMoney4;
                            break;
                        case 3:
                            localRewardMoney = rewardMoney3;
                            break;
                        case 2:
                            localRewardMoney = rewardMoney2;
                            break;
                    }
                    if (localRewardMoney <= 0) {
                        cm.sendNext("獎勵未設置，請稍後");
                        cm.dispose();
                        return;
                    }
                    if (!cm.getPlayer().canHoldMeso(localRewardMoney)) {
                        cm.sendNext("身上的楓幣加上獎勵楓幣" + numberToString(localRewardMoney) + "太多了，請整理後再來領獎");
                        cm.dispose();
                        return;
                    }
                    cm.getPlayer().setAccLog(logName + "_" + getTodayDateInString() + "_領取", 1, getFirstDayOfNextMonths(keepingDataMonth + 1));
                    cm.gainMeso(localRewardMoney);
                    cm.sendNext("已經成功領取了獎勵" + numberToString(localRewardMoney) + "楓幣");
                    if (broadcastOnReward) {
                        cm.broadcastGambleSpeakerWorld("[彩券系統] : 恭喜<" + cm.getPlayer().getName() + ">在彩券系統中了" + success + "個號碼", cm.getPlayer().getMap().getWorld(), -1);
                    }
                    cm.logFile("彩券/領獎.txt", cm.getReadableTime() + " " + cm.getClient().getSessionIP() + " " + cm.getPlayer().getName() + "(" + cm.getPlayer().getId() + ") 帳號:" + cm.getClient().getAccountName() + " 在彩券系統中了" + success + "個號碼，領取了" + numberToString(localRewardMoney) + "楓幣, 身上共有" + cm.getPlayer().getMeso(), false);
                } else if (success === 1) {
                    cm.sendNext("由於下注的值只有中1個，無法領取獎勵");
                } else {
                    cm.sendNext("由於下注的值沒有中，無法領取獎勵");
                }
                cm.dispose();
            } else {
                cm.sendNext("今日沒有下注");
                cm.dispose();

            }
        } else if (sel === 2) {
            if (cm.getPlayer().getAccLog(logName + "_" + getYesterdayDateInString() + "_領取") != null) {
                cm.sendNext("已經領取過昨日獎勵");
                cm.dispose();
                return;
            }

            let yesterdayLotteryNumberInString = cm.getCacheLog(logName + "_" + getYesterdayDateInString(), cm.getPlayer().getMap().getWorld());
            if (yesterdayLotteryNumberInString == null) {
                cm.sendNext("此系統尚未初始化，請稍後再試");
                cm.dispose();
                return;
            }

            lotteryList_yesterday = convertStringToNumbers(yesterdayLotteryNumberInString);
            yesterdayCharacterSelectedLotteryNumberList = getYesterdayCharacterSelectedLotteryNumberList();

            if (yesterdayCharacterSelectedLotteryNumberList != null && yesterdayCharacterSelectedLotteryNumberList.length > 0) {
                let success = 0;
                for (let i = 0; i < yesterdayCharacterSelectedLotteryNumberList.length; i++) {
                    if (yesterdayCharacterSelectedLotteryNumberList[i] === lotteryList_yesterday[i]) {
                        success++;
                    }
                }
                if (success >= 2) {
                    let localRewardMoney = 0;
                    switch (success) {
                        case 5:
                            localRewardMoney = rewardMoney5;
                            break;
                        case 4:
                            localRewardMoney = rewardMoney4;
                            break;
                        case 3:
                            localRewardMoney = rewardMoney3;
                            break;
                        case 2:
                            localRewardMoney = rewardMoney2;
                            break;
                    }
                    if (localRewardMoney <= 0) {
                        cm.sendNext("獎勵未設置，請稍後");
                        cm.dispose();
                        return;
                    }
                    if (!cm.getPlayer().canHoldMeso(localRewardMoney)) {
                        cm.sendNext("身上的楓幣加上獎勵楓幣" + numberToString(localRewardMoney) + "太多了，請整理後再來領獎");
                        cm.dispose();
                        return;
                    }
                    cm.getPlayer().setAccLog(logName + "_" + getYesterdayDateInString() + "_領取", 1, getFirstDayOfNextMonths(keepingDataMonth + 1));
                    cm.gainMeso(localRewardMoney);
                    cm.sendNext("已經成功領取了獎勵" + numberToString(localRewardMoney) + "楓幣");
                    if (broadcastOnReward) {
                        cm.broadcastGambleSpeakerWorld("[彩券系統] : 恭喜<" + cm.getPlayer().getName() + ">昨天在彩券系統中了" + success + "個號碼", cm.getPlayer().getMap().getWorld(), -1);
                    }
                    cm.logFile("彩券/領獎.txt", cm.getReadableTime() + " " + cm.getClient().getSessionIP() + " " + cm.getPlayer().getName() + "(" + cm.getPlayer().getId() + ") 帳號:" + cm.getClient().getAccountName() + " 昨天在彩券系統中了" + success + "個號碼，領取了" + numberToString(localRewardMoney) + "楓幣, 身上共有" + cm.getPlayer().getMeso(), false);
                } else if (success === 1) {
                    cm.sendNext("由於下注的值只有中1個，無法領取獎勵");
                } else {
                    cm.sendNext("由於下注的值沒有中，無法領取獎勵");
                }
                cm.dispose();
            } else {
                cm.sendNext("昨日沒有下注");
                cm.dispose();
            }
        }
    } else if (status === 2) {
        if (sel === 0) {
            if (selection < minimumNumber || selection > maximumNumber) {
                cm.sendNext("發生異常: " + selection);
                cm.dispose();
                return;
            }
            selectedNumbers.push(selection);
            cm.sendSimple("請選擇要下注的第#b2#k個數字\r\n目前:" + selectedNumbers[0] + "\r\n" + showSelectableNumber() + "\r\n#r#L100#自動選號#l#k");
        }
    } else if (status === 3) {
        if (sel === 0) {
            if (selection === 100) {
                selection = cm.getRandomValue(1, maximumNumber);
            } else if (selection <= 0 || selection > maximumNumber) {
                cm.sendNext("發生異常: " + selection);
                cm.dispose();
                return;
            }
            selectedNumbers.push(selection);
            cm.sendSimple("請選擇要下注的第#b3#k個數字\r\n目前:" + selectedNumbers[0] + " " + selectedNumbers[1] + "\r\n" + showSelectableNumber() + "\r\n#r#L100#自動選號#l#k");
        }
    } else if (status === 4) {
        if (sel === 0) {
            if (selection === 100) {
                selection = cm.getRandomValue(1, maximumNumber);
                while (hasId(selectedNumbers, selection)) {
                    selection = cm.getRandomValue(1, maximumNumber);
                }
            } else if (selection <= 0 || selection > maximumNumber) {
                cm.sendNext("發生異常: " + selection);
                cm.dispose();
                return;
            }
            selectedNumbers.push(selection);
            cm.sendSimple("請選擇要下注的第#b4#k個數字\r\n目前:" + selectedNumbers[0] + " " + selectedNumbers[1] + " " + selectedNumbers[2] + "\r\n" + showSelectableNumber() + "\r\n#r#L100#自動選號#l#k");
        }
    } else if (status === 5) {
        if (sel === 0) {
            if (selection === 100) {
                selection = cm.getRandomValue(1, maximumNumber);
                while (hasId(selectedNumbers, selection)) {
                    selection = cm.getRandomValue(1, maximumNumber);
                }
            } else if (selection <= 0 || selection > maximumNumber) {
                cm.sendNext("發生異常: " + selection);
                cm.dispose();
                return;
            }
            selectedNumbers.push(selection);
            cm.sendSimple("請選擇要下注的第#b5#k個數字\r\n目前:" + selectedNumbers[0] + " " + selectedNumbers[1] + " " + selectedNumbers[2] + " " + selectedNumbers[3] + "\r\n" + showSelectableNumber() + "\r\n#r#L100#自動選號#l#k");
        }
    } else if (status === 6) {
        if (sel === 0) {
            if (selection === 100) {
                selection = cm.getRandomValue(1, maximumNumber);
                while (hasId(selectedNumbers, selection)) {
                    selection = cm.getRandomValue(1, maximumNumber);
                }
            } else if (selection <= 0 || selection > maximumNumber) {
                cm.sendNext("發生異常: " + selection);
                cm.dispose();
                return;
            }
            selectedNumbers.push(selection);
            cm.sendYesNo("目前所選擇數字為: #r" + selectedNumbers[0] + " " + selectedNumbers[1] + " " + selectedNumbers[2] + " " + selectedNumbers[3] + " " + selectedNumbers[4] + "#k\r\n是否確認要下注?");
        }
    } else if (status === 7) {
        if (sel === 0) {
            if (cm.getPlayer().getMeso() < reqMoney) {
                cm.sendNext("身上的楓幣不足，至少需要" + reqMoney);
                cm.dispose();
                return;
            } else if (cm.getHourOfDay() >= stopBetHour) {
                cm.sendNext("超過" + stopBetHour + "點以後必須要隔天才能下注");
                cm.dispose();
                return;
            } else if (logDate !== getTodayDateInString()) {
                cm.sendNext("選擇時間過長，請重新下注");
                cm.dispose();
                return;
            }
            cm.gainMeso(-reqMoney);

            cm.getPlayer().setAccLog(logName + "_" + getTodayDateInString(), selectedNumbers[0] + ", " + selectedNumbers[1] + ", " + selectedNumbers[2] + ", " + selectedNumbers[3] + ", " + selectedNumbers[4], getFirstDayOfNextMonths(keepingDataMonth + 1));

            cm.logFile("彩券/下注.txt", cm.getReadableTime() + " " + cm.getClient().getSessionIP() + " " + cm.getPlayer().getName() + "(" + cm.getPlayer().getId() + ") 帳號:" + cm.getClient().getAccountName() + " 下注了 " + selectedNumbers[0] + " " + selectedNumbers[1] + " " + selectedNumbers[2] + " " + selectedNumbers[3] + " " + selectedNumbers[4], false);
            cm.sendNext("成功下注數字: #r" + selectedNumbers[0] + " " + selectedNumbers[1] + " " + selectedNumbers[2] + " " + selectedNumbers[3] + " " + selectedNumbers[4] + "#k\r\n祝您中獎");
            cm.dispose();
        }
    } else {
        cm.dispose();
    }
}

function getCharacterSelectedLotteryNumberList() {
    let log = cm.getPlayer().getAccLog(logName + "_" + getTodayDateInString());
    if (log === null) {
        return null;
    }
    return convertStringToNumbers(log);
}

function getYesterdayCharacterSelectedLotteryNumberList() {
    let log = cm.getPlayer().getAccLog(logName + "_" + getYesterdayDateInString());
    if (log === null) {
        return null;
    }
    return convertStringToNumbers(log);
}

function showSelectableNumber() {
    let message = "";
    for (let i = 1; i <= maximumNumber; i++) {
        if (!hasId(selectedNumbers, i)) {
            message += "#L" + i + "##b" + i + "\t";
        }
    }
    return message;
}

function numberToString(num) {
    if (num >= 100000000) {
        return parseInt(num / 100000000) + "億";
    } else if (num >= 10000000) {
        return parseInt(num / 10000000) + "千萬";
    } else if (num >= 1000000) {
        return parseInt(num / 1000000) + "百萬";
    }
    return num;
}

function getYesterdayDateInString() {
    return getDateStr(-1);
}

function getTodayDateInString() {
    return getDateStr(0);
}

function getDateStr(adjustDayCount) {
    let date1 = new Date();
    date1.setDate(date1.getDate() + adjustDayCount);
    let year = date1.getFullYear();
    let month = date1.getMonth() + 1;
    let date = date1.getDate();
    return year + "-" + month + "-" + date;
}

function convertStringToNumbers(inputString) {
    if (inputString == null) {
        return null;
    }
    let result = [];
    let split = inputString.split(',');
    for (let i = 0; i < split.length; i++) {
        result.push(Number(split[i].trim()));
    }
    return result;
}

function getFirstDayOfNextMonths(monthsToAdd) {
    let now = new Date();
    let targetMonth = now.getMonth() + monthsToAdd;
    let targetDate = new Date(now.getFullYear(), targetMonth, 1);
    return targetDate.getTime();
}

function hasId(array, id) {
    if (array.length <= 0) {
        return false;
    }
    for (let i = 0; i < array.length; i++) {
        if (array[i] === id) {
            return true;
        }
    }
    return false;
}