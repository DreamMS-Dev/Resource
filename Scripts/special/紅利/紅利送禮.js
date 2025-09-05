let status = -1, sel = -1;
let userName = null;
let userName2 = null;

let logName = "紅利送禮包_1"; // 辨識用Log名稱
//
let debug = true; // true = 維修中

// 點數名稱(顯示用)
let requestPointName = "紅利";
// 點數帳號Log名稱
let requestPointLogName = "紅利";
// 需要點數數量
let requestPoint = 100;

// 送出後自己也獲得一份禮物
let selfGetReward = false;
// 獎勵楓幣
let rewardMoney = 10;
// 獎勵Gash
let rewardCash = 20;
// 獎勵楓葉點數
let rewardMaplePoint = 30;
// 增加帳號Log值
let rewardAccountName = "紅利"; // 顯示名稱
let rewardAccountLogName = "紅利"; // log名稱
let rewardAccountLogValue = [50, 50]; // [最低, 最高]
// 獎勵道具
let rewardItemInfos = [
    // itemId, quantity, stats, hp, mp, pad/mad, pdd/mdd, speed, jump, periods (hour)
    [1302000, 1, 10, 20, 30, 40, 50, 60, 70, -1],
    [1302002, 2, 10, 20, 30, 40, 50, 60, 70, 12],
    [2000000, 20, 0, 0, 0, 0, 0, 0, 0, -1],
    [3010000, 1, 0, 0, 0, 0, 0, 0, 0, -1],
    [4000000, 5, 0, 0, 0, 0, 0, 0, 0, -1],
    [5000000, 1, 0, 0, 0, 0, 0, 0, 0, 48],
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
    if (debug) {
        cm.getPlayer().dropMessage(6, "status: " + status + " sel: " + sel + " userName:" + userName + " userName2:" + userName2);
    }
    if (mode === 1) {
        status++;
    } else if (mode === 0) {
        if (status === 1) {
            sel = -1;
        } else if (status === 2 || status === 3) {
            userName = null;
            userName2 = null;
        }
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status < 0) {
        cm.dispose();
    } else if (status === 0) {
        let availableCount = cm.getPlayer().getLogValue(logName, 0);
        let message = "#b[" + requestPointName + "送禮]\r\n\r\n";
        message += "#b目前" + requestPointName + ": #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue(requestPointLogName, 0)) + "\r\n";
        message += "花費" + cm.numberWithCommas(requestPoint) + requestPointName + "即可贈送他人以下禮物!\r\n\r\n";

        if (rewardCash > 0) {
            message += getCashName() + ": " + rewardCash + "\r\n"
        }
        if (rewardMaplePoint > 0) {
            message += getMaplePointName() + ": " + rewardMaplePoint + "\r\n"
        }
        if (rewardMoney > 0) {
            message += getMoneyName() + ": " + rewardMoney + "\r\n"
        }
        if (rewardAccountLogValue[0] > 0 && rewardAccountLogValue[1] > 0) {
            if (rewardAccountLogValue[0] === rewardAccountLogValue[1]) {
                message += rewardAccountName + ": " + rewardAccountLogValue[0] + "\r\n"
            } else {
                message += rewardAccountName + ": " + rewardAccountLogValue[0] + "到" + rewardAccountLogValue[1] + "\r\n"
            }
        } else if (rewardAccountLogValue[0] > 0) {
            message += rewardAccountName + ": " + rewardAccountLogValue[0] + "\r\n"
        }

        for (let i = 0; i < rewardItemInfos.length; i++) {
            message += getRewardItemInfo(rewardItemInfos[i]) + "\r\n";
        }
        message += "#L0#前往贈送#l\r\n";
        message += "#L1#確認我的禮物盒";
        if (availableCount > 0) {
            message += "#b(可領取#r" + availableCount + "#b次)#k"
        }
        message += "#l\r\n";
        cm.sendSimple(message);
    } else if (status === 1) {
        if (mode === 1) {
            sel = selection;
        }
        if (sel === 0) {
            if (cm.getPlayer().getAccLogValue(requestPointLogName, 0) < requestPoint) {
                cm.sendNext(requestPointName + "不足，至少需要#r" + cm.numberWithCommas(requestPoint));
                status = -1;
                sel = -1;
            } else {
                cm.sendGetText("請輸入要贈送的角色名稱");
            }
        } else if (sel === 1) {
            let availableCount = cm.getPlayer().getLogValue(logName, 0);
            if (cm.getPlayer().getLogValue(logName, 0) === 0) {
                cm.sendNext("禮物盒為空");
                status = -1;
                sel = -1;
            } else {
                if (!canHold()) {
                    cm.sendOk("請確認背包空間是否足夠");
                    cm.dispose();
                    return;
                } else if (!cm.getPlayer().canHoldMeso(rewardMoney)) {
                    cm.sendOk(getMoneyName() + "過多，無法領取");
                    cm.dispose();
                    return;
                }
                cm.sendYesNo("目前可領取#r" + availableCount + "#k次，是否要領取一次");
            }
        } else {
            cm.dispose();
        }
    } else if (status === 2) {
        if (sel === 0) {
            if (mode === 1) {
                userName = cm.getText();
                if (userName === "") {
                    cm.sendNext("必須輸入角色名稱");
                    status = -1;
                    sel = -1;
                    return;
                }
            }
            cm.sendGetText("請再次輸入要贈送的角色名稱(#b" + userName + "#k)");
        } else if (sel === 1) {
            if (!canHold()) {
                cm.sendOk("請確認背包空間是否足夠");
                cm.dispose();
                return;
            } else if (!cm.getPlayer().canHoldMeso(rewardMoney)) {
                cm.sendOk(getMoneyName() + "過多，無法領取");
                cm.dispose();
                return;
            } else if (cm.getPlayer().getLogValue(logName, 0) <= 0) {
                cm.sendOk("發生未知錯誤");
                cm.dispose();
                return;
            }
            cm.getPlayer().addLogValue(logName, -1);
            let message = "領取成功!\r\n\r\n";

            if (rewardCash > 0) {
                cm.getPlayer().modifyCSPoints(1, rewardCash);
                message += getCashName() + ": " + rewardCash + "\r\n"
            }

            if (rewardMaplePoint > 0) {
                cm.getPlayer().modifyCSPoints(2, rewardMaplePoint);
                message += getMaplePointName() + ": " + rewardMaplePoint + "\r\n"
            }

            if (rewardMoney > 0) {
                cm.gainMeso(rewardMoney);
                message += getMoneyName() + ": " + rewardMoney + "\r\n"
            }

            let rewardAccountLogValueResult = -1;
            if (rewardAccountLogValue[0] > 0 && rewardAccountLogValue[1] > 0) {
                rewardAccountLogValueResult = cm.getRandomValue(rewardAccountLogValue[0], rewardAccountLogValue[1]);
            } else if (rewardAccountLogValue[0] > 0) {
                rewardAccountLogValueResult = rewardAccountLogValue[0];
            }
            if (rewardAccountLogValueResult > 0) {
                gainLogValue(rewardAccountLogValueResult);
                message += rewardAccountName + ": " + rewardAccountLogValueResult + "\r\n"
            }

            for (let i = 0; i < rewardItemInfos.length; i++) {
                gainRewardItemInfo(rewardItemInfos[i])
                message += getRewardItemInfo(rewardItemInfos[i]) + "\r\n";
            }
            cm.sendNext(message);
            status = -1;
            sel = -1;
            cm.logFile(requestPointName + "送禮.txt", cm.getReadableTime() + " 帳號<" + cm.getClient().getAccountName() + ">角色<" + cm.getPlayer().getName() + "> 領取了'" + logName + "'，剩餘領取次數: " + cm.numberWithCommas(cm.getPlayer().getLogValue(logName, 0)), false);
        }
    } else if (status === 3) {
        if (sel === 0) {
            if (mode === 1) {
                userName2 = cm.getText();
            }
            if (userName !== userName2) {
                cm.sendOk("2次輸入的角色名稱不相同");
                status = -1;
                sel = -1;
                userName = null;
                userName2 = null;
                return;
            }
            let characterId = cm.getCharacterIdByName(userName2);
            if (characterId === -1) {
                cm.sendOk("角色名稱不存在(#r" + userName2 + "#k)");
                status = -1;
                sel = -1;
                userName = null;
                userName2 = null;
                return;
            } else if (characterId === cm.getPlayer().getId()) {
                cm.sendOk("不能贈送給自己");
                status = -1;
                sel = -1;
                userName = null;
                userName2 = null;
                return;
            }
            let accountId = cm.getAccountIdByCharacterId(characterId);
            if (accountId === cm.getPlayer().getAccountId()) {
                cm.sendOk("不能贈送給自己");
                status = -1;
                sel = -1;
                userName = null;
                userName2 = null;
                return;
            }
            cm.sendYesNo("是否確認要使用#r" + cm.numberWithCommas(requestPoint) + "#k" + requestPointName + "贈送給'#b" + userName2 + "#k'\r\n使用後將剩下#b" + cm.numberWithCommas((cm.getPlayer().getAccLogValue(requestPointLogName, 0) - requestPoint)) + "#k" + requestPointName);
        }
    } else if (status === 4) {
        if (sel === 0) {
            if (cm.getPlayer().getAccLogValue(requestPointLogName, 0) < requestPoint) {
                cm.sendOk("發生未知錯誤");
                cm.dispose();
                return;
            }
            let characterId = cm.getCharacterIdByName(userName2);
            if (characterId === -1) {
                cm.sendOk("發生未知錯誤2");
                cm.dispose();
                return;
            }
            cm.getPlayer().addAccLogValue(requestPointLogName, -requestPoint);

            let originalCount = cm.getCharacterLog(characterId, logName);
            if (originalCount === null) {
                originalCount = 0;
            } else {
                originalCount = parseInt(originalCount);
            }
            originalCount += 1;
            cm.setCharacterLog(characterId, logName, originalCount, null, null, -1);
            cm.logFile(requestPointName + "送禮.txt", cm.getReadableTime() + " 帳號<" + cm.getClient().getAccountName() + ">角色<" + cm.getPlayer().getName() + "> 贈送了'" + logName + "'給" + userName2 + "(" + characterId + ")，對方剩餘領取次數: " + cm.numberWithCommas(originalCount) + "，剩餘" + requestPointName + ": " + cm.numberWithCommas(cm.getPlayer().getAccLogValue(requestPointLogName, 0)), false);
            cm.sendNext("贈送給#b" + userName2 + "#r成功#k，剩餘" + requestPointName + ":" + cm.numberWithCommas(cm.getPlayer().getAccLogValue(requestPointLogName, 0)));
            if (selfGetReward) {
                characterId = cm.getPlayer().getId();
                originalCount = cm.getCharacterLog(characterId, logName);
                if (originalCount === null) {
                    originalCount = 0;
                } else {
                    originalCount = parseInt(originalCount);
                }
                cm.setCharacterLog(characterId, logName, originalCount, null, null, -1);
            }
            status = -1;
            sel = -1;
            userName = null;
            userName2 = null;
        }
    }
}

function canHold() {
    let allItemIds = [];
    let allItemQuantities = [];

    for (let i = 0; i < rewardItemInfos.length; i++) {
        let itemId = rewardItemInfos[i][0];
        let quantity = rewardItemInfos[i][1];
        let index = allItemIds.indexOf(itemId);
        if (index !== -1) {
            allItemQuantities[index] += quantity;
        } else {
            allItemIds.push(itemId);
            allItemQuantities.push(quantity);
        }
    }
    return cm.getPlayer().canHoldAll(allItemIds, allItemQuantities, true);
}

function gainLogValue(value) {
    if (cm.getPlayer().getAccLogValue(rewardAccountLogName) < 0) {
        cm.getPlayer().setAccLogValue(rewardAccountLogName, 0);
    }
    cm.getPlayer().addAccLogValue(rewardAccountLogName, value);
}

function gainRewardItemInfo(info) {
    let itemId = info[0];
    let quantity = info[1];
    let stats = info[2];
    let hp = info[3];
    let mp = info[4];
    let padAndMad = info[5];
    let pddAndMdd = info[6];
    let speed = info[7];
    let jump = info[8];
    let period = info[9];
    if (itemId >= 2000000) {
        if (period === -1) {
            cm.gainItem(itemId, quantity);
        } else {
            cm.gainItemHour(itemId, quantity, period);
        }
    } else {
        for (let i = 0; i < quantity; i++) {
            let equip = cm.getEquipById(itemId);
            if (stats > 0) {
                equip.setStr(stats);
                equip.setDex(stats);
                equip.setInt(stats);
                equip.setLuk(stats);
            }
            if (hp > 0) {
                equip.setHp(stats);
            }
            if (mp > 0) {
                equip.setMp(stats);
            }
            if (padAndMad > 0) {
                equip.setWatk(stats);
                equip.setMatk(stats);
            }
            if (pddAndMdd > 0) {
                equip.setWdef(stats);
                equip.setMdef(stats);
            }
            if (speed > 0) {
                equip.setSpeed(stats);
            }
            if (jump > 0) {
                equip.setJump(stats);
            }
            if (period > 0) {
                equip.setExpiration(cm.getCurrentTime() + (period * 60 * 60 * 1000));
            }
            cm.addByItem(equip);
        }
    }
}

function getRewardItemInfo(info) {
    let itemId = info[0];
    let quantity = info[1];
    let stats = info[2];
    let hp = info[3];
    let mp = info[4];
    let padAndMad = info[5];
    let pddAndMdd = info[6];
    let speed = info[7];
    let jump = info[8];
    let period = info[9];

    let message = "#v" + itemId + "##t" + itemId + "#";
    if (itemId < 2000000) {
        if (quantity > 1) {
            message += "x" + quantity;
        }
        if (stats > 0) {
            message += " 四屬+" + stats;
        }
        if (hp > 0) {
            message += " HP+" + hp;
        }
        if (mp > 0) {
            message += " MP+" + mp;
        }
        if (padAndMad > 0) {
            message += " 攻擊+" + padAndMad;
        }
        if (pddAndMdd > 0) {
            message += " 防禦+" + pddAndMdd;
        }
        if (speed > 0) {
            message += " 移動+" + speed;
        }
        if (jump > 0) {
            message += " 跳躍+" + jump;
        }
    } else {
        message += "x" + quantity;
    }
    if (period !== -1) {
        message += "(" + getTimeInString(period) + ")";
    }

    message += "#l";
    return message;
}

function getTimeInString(hour) {
    if (hour % 24 === 0) {
        return (hour / 24) + "天";
    } else {
        return hour + "小時";
    }
}

function getCashName() {
    return "Gash";
}

function getMaplePointName() {
    return "楓葉點數";
}

function getMoneyName() {
    return "楓幣";
}
