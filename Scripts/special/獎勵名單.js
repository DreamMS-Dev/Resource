// 常用道具
// Welcome Back 戒指: 1112127 / 精靈墜飾: 1122017
// 紫色蘋果: 2022179 / 獵人的幸運: 2450000
// 金寶箱: 4280000 / 金鑰匙: 5490000
// 銀寶箱: 4280001 / 銀鑰匙: 5490001
// 10萬元楓幣: 5200000 / 50萬元楓幣: 5200001 / 100萬元楓幣: 5200002
// 經驗值加倍全日券: 5210000

let status = -1;
let addNewRewardType = false;
let debug = false; // NPC是否只給管理員使用

let autoResetLogDaily = true; // 是否每日自動重置領取Log (每日可領取)
let logApplyAccount = true; // 使否使用帳號Log做為領取限制，否為角色Log
let title = "<每日推文>\r\n"; // 顯示文字用標題
let logName = "每日推文"; // 領取限制用Log名稱

// 全服可領取次數限制
let requestTotalRewardCountLimit = false;
let totalRewardCountLimitLogName = "全服推文次數"; // 伺服器紀錄次數用Log名稱
let totalRewardCountLimit = 100; // 全服可領取次數限制

// 腳本內帳號名稱清單限制
let requestCheckAccountName = false; // 是否要可用限制帳號名稱
let availableAccountNames = []; // 可用的帳號名稱

// 腳本內角色名稱清單限制
let requestCheckCharacterName = false; // 是否要可用限制角色清單
let availableCharacterNames = []; // 可用的角色名稱清單

let requestApplySystemRewardListName = true; // 是否要套用伺服器獎勵清單 (可用來修改為新手獎勵或等級獎勵)
let systemRewardListName = "每日推文2"; // 使用的伺服器獎勵清單名稱
let systemRewardListRemove = true; // 使用伺服器獎勵清單時，領取成功後是否從清單內移除本筆資料，用做每日推文時一定要開啟
let systemRewardListAccountLimit = true; // 伺服器獎勵清單是否使用帳號名稱來登記，否的話為角色名稱
let systemRewardListIgnoreCase = true; // 填入為帳號名稱或角色名稱時，將大小寫視為相同
//
let requestApplyNewAccountLimit = false; // 領取帳號限制編號 (防止新帳號領取)
let requestNewAccountLimitId = 0; // 領取帳號編號限制 (超過此編號後不給領取)
//
let requestMaximumMoneyLimit = 2147483647; // 如果有楓幣獎勵，背包內最終楓幣上限
//
let requestLevel = 10; // 最低等級限制 (0 = 無)
//
let rewardBroadcast = false; // 領取後廣播
let rewardBroadcastType = 6; // 廣播類型，5為紅色 6為藍色
let rewardBroadcastMessage = "[每日推文] : %s已完成每日推文，獎勵領取成功!"; // 領取後廣播文字 (%s代表角色名稱)
//
let rewardCash = 0; // 獎勵GASH (0 = 不領)
let rewardMaplePoint = 0; // 獎勵楓點 (0 = 不領)
let rewardMoney = 0; // 獎勵楓幣 (0 = 不領)

// 帳號Log獎勵
let rewardAccountLog = false; // 是否獎勵帳號Log
let rewardAccountLogName = "紅利"; // 獎勵帳號Log名稱
let rewardAccountLogDisplayName = "紅利"; // 顯示用獎勵Log名稱
let rewardAccountLogValueRange = [10, 100]; // 帳號Log獲得範圍值

// 多選一道具
let rewardMultiSelectOneItems = [
    // 道具代碼, 道具數量, 道具小時 (-1為永久)
    [1302000, 1, 24],
    [2000000, 1, -1],
];

// 一般獎勵道具 (寵物必須填入天數，否則死亡)
let rewardItems = [
    // 道具代碼, 道具數量, 道具小時 (-1為永久)
    [1302001, 1, 24],
    [2000001, 1, -1],
];

// 素質裝備
let statEquips = [
    // 道具代碼, 全屬性, 物理/魔法攻擊, 道具小時 (-1為永久)
    [1302002, 10, 20, 24],
    [1302003, 5, 10, -1],
];

function start() {
    if (debug && !cm.getPlayer().isGM()) {
        cm.sendNext("目前維修中");
        cm.dispose();
        return;
    } else if (requestApplySystemRewardListName && cm.getCustomRewardIdByName(systemRewardListName) === -1) {
        if (!cm.getPlayer().isGM()) {
            cm.sendNext("目前維修中");
            cm.dispose();
            return;
        } else {
            cm.sendYesNo("獎勵名單[" + systemRewardListName + "]不存在，是否要新增本獎勵名單類型?");
            addNewRewardType = true;
            return;
        }
    } else if (totalRewardCountLimit <= 0 && requestTotalRewardCountLimit) { // 伺服器總共只能領取0次以下時自動關閉系統
        requestTotalRewardCountLimit = false;
    }
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === 0) {
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status === 0) {

        if (addNewRewardType) {
            let newType = cm.addCustomRewardType(systemRewardListName);
            cm.sendNext("新增獎勵名單[#r" + systemRewardListName + "#k]成功! 編號: #b" + newType + "#k\r\n重新開啟腳本後即可使用本腳本");
            cm.dispose();
            return;
        }

        let msg = "#k#r" + title + "#k\r\n";
        if (requestLevel > 0) {
            msg += "#b等級限制:#r " + requestLevel + "等#k\r\n";
        }
        if (rewardCash > 0) {
            msg += "#b" + getCashName() + ": #k#r" + cm.numberWithCommas(rewardCash) + "點#k\r\n"
        }
        if (rewardMaplePoint > 0) {
            msg += "#b" + getMaplePointName() + ": #k#r" + cm.numberWithCommas(rewardMaplePoint) + "點#k\r\n"
        }
        if (rewardMoney > 0) {
            msg += "#r" + getMoneyName() + ": #r" + cm.numberWithCommas(rewardMoney) + "#d\r\n"
        }
        if (rewardAccountLog) {
            if (rewardAccountLogValueRange[0] === rewardAccountLogValueRange[1]) {
                msg += "#b" + rewardAccountLogDisplayName + ":#r" + cm.numberWithCommas(rewardAccountLogValueRange[0]) + "\r\n"
            } else {
                msg += "#b" + rewardAccountLogDisplayName + ":#r" + cm.numberWithCommas(rewardAccountLogValueRange[0]) + "點 → " + cm.numberWithCommas(rewardAccountLogValueRange[1]) + "點#k#r(隨機獲得)#k\r\n"
            }
        }
        if (rewardItems.length > 0) {
            for (let i = 0; i < rewardItems.length; i++) {
                let itemId = rewardItems[i][0];
                let itemQuantity = rewardItems[i][1];
                let itemHour = rewardItems[i][2];
                msg += "#b#v" + itemId + ":##b#t" + itemId + "##k #rx" + cm.numberWithCommas(itemQuantity) + "個#k";
                if (itemHour > 0) {
                    msg += "(期限" + getTimeInString(itemHour) + ")";
                }
                msg += "\r\n";
            }
        }

        if (statEquips.length > 0) {
            for (let i = 0; i < statEquips.length; i++) {
                let itemId = statEquips[i][0];
                let itemStat = statEquips[i][1];
                let itemPadMad = statEquips[i][2];
                let itemHour = statEquips[i][3];
                msg += "#b#v" + itemId + "##b#t" + itemId + "##k#r 四屬性+" + itemStat + " 攻擊+" + itemPadMad;
                if (itemHour > 0) {
                    msg += "(" + getTimeInString(itemHour) + ")";
                }
                msg += "\r\n";
            }
        }
        if (rewardMultiSelectOneItems.length > 0) {
            msg += "------------------以下擇一-----------------\r\n";
            for (let i = 0; i < rewardMultiSelectOneItems.length; i++) {
                let itemId = rewardMultiSelectOneItems[i][0];
                let itemQuantity = rewardMultiSelectOneItems[i][1];
                let itemHour = rewardMultiSelectOneItems[i][2];
                msg += "#b#i" + itemId + "##r#t" + itemId + "##d" + cm.numberWithCommas(itemQuantity) + "個";
                if (itemHour > 0) {
                    msg += "(" + getTimeInString(itemHour) + ")";
                }
                msg += "\r\n";
            }
        }
        if (requestTotalRewardCountLimit) {
            msg += "\r\n#k全服只能#e領取#r" + cm.numberWithCommas(totalRewardCountLimit) + "#k次#n (目前:" + cm.numberWithCommas(cm.getCacheLogValue(totalRewardCountLimitLogName, 0)) + "/" + cm.numberWithCommas(totalRewardCountLimit) + ")\r\n";
        }
        cm.sendYesNo(msg);
    } else if (status === 1) {
        if (cm.getPlayer().getLevel() < requestLevel) {
            cm.sendNext("只有" + requestLevel + "等以後的角色可以領取");
            cm.dispose();
            return;
        } else if ((rewardMoney + cm.getPlayer().getMeso()) > requestMaximumMoneyLimit) {
            cm.sendNext("身上的錢太多了，領取之後為" + cm.numberWithCommas(rewardMoney + cm.getPlayer().getMeso()) + ", 不能超過 " + cm.numberWithCommas(requestMaximumMoneyLimit));
            cm.dispose();
            return;
        } else if (logApplyAccount && cm.getPlayer().getAccLogValue(logName) > 0) {
            if (autoResetLogDaily) {
                cm.sendNext("本帳號今日已領取過了");
            } else {
                cm.sendNext("本帳號已領取過了");
            }
            cm.dispose();
            return;
        } else if (!logApplyAccount && cm.getPlayer().getLogValue(logName) > 0) {
            if (autoResetLogDaily) {
                cm.sendNext("本角色今日已領取過了");
            } else {
                cm.sendNext("本角色已領取過了");
            }
            cm.dispose();
            return;
        } else if (requestApplyNewAccountLimit && cm.getClient().getAccID() > requestNewAccountLimitId) {
            cm.sendOk("本帳號沒有領取資格");
            cm.dispose();
            return;
        }

        if (requestApplySystemRewardListName && !cm.hasCustomReward(systemRewardListName, systemRewardListAccountLimit, systemRewardListIgnoreCase)) {
            cm.sendOk("你不在" + (systemRewardListAccountLimit ? "帳號" : "角色") + "名單內");
            cm.dispose();
            return;
        }

        if (requestCheckAccountName) {
            let next = false;
            let accountName = cm.getClient().getAccountName();
            for (let i = 0; i < availableAccountNames.length; i++) {
                let name = availableAccountNames[i];
                if (name.equalsIgnoreCase(accountName) || name === accountName) {
                    next = true;
                    break;
                }
            }
            if (!next) {
                cm.sendOk("你不在可用的帳號名單內");
                cm.dispose();
                return;
            }
        }

        if (requestCheckCharacterName) {
            let next = false;
            let characterName = cm.getPlayer().getName();
            for (let i = 0; i < availableCharacterNames.length; i++) {
                let name = availableCharacterNames[i];
                if (name.equalsIgnoreCase(characterName) || name === characterName) {
                    next = true;
                    break;
                }
            }
            if (!next) {
                cm.sendOk("你不在可用的角色名單內");
                cm.dispose();
                return;
            }
        }

        if (rewardMultiSelectOneItems.length > 0) {
            let msg = "請選擇道具\r\n";
            for (let i = 0; i < rewardMultiSelectOneItems.length; i++) {
                let itemId = rewardMultiSelectOneItems[i][0];
                let itemQuantity = rewardMultiSelectOneItems[i][1];
                let itemHour = rewardMultiSelectOneItems[i][2];
                msg += "#L" + i + "##d#v" + itemId + "##r#t" + itemId + "##d" + itemQuantity + "個";
                if (itemHour > 0) {
                    msg += "(" + getTimeInString(itemHour) + ")";
                }
                msg += "\r\n";
            }
            cm.sendSimple(msg);
        } else {
            cm.sendYesNo("請問是否確定要領取獎勵?");
        }

    } else if (status === 2) {

        let allItemIds = [];
        let allItemQuantities = [];

        for (let i = 0; i < statEquips.length; i++) {
            updateItems(statEquips[i][0], 1, allItemIds, allItemQuantities);
        }

        for (let i = 0; i < rewardItems.length; i++) {
            updateItems(rewardItems[i][0], rewardItems[i][1], allItemIds, allItemQuantities);
        }

        if (rewardMultiSelectOneItems.length > 0) {
            updateItems(rewardMultiSelectOneItems[selection][0], rewardMultiSelectOneItems[selection][1], allItemIds, allItemQuantities);
        }

        if (!cm.getPlayer().canHoldAll(allItemIds, allItemQuantities, true)) {
            cm.sendOk("背包已滿");
            cm.dispose();
            return;
        }

        if (requestTotalRewardCountLimit) {
            if (cm.getCacheLogValue(totalRewardCountLimitLogName) >= totalRewardCountLimit) {
                cm.sendOk("全伺服器獎勵已經被領完了");
                cm.dispose();
                return;
            }
            cm.addCacheLog(totalRewardCountLimitLogName, 1);
        }

        if (rewardMultiSelectOneItems.length > 0) {
            let itemId = rewardMultiSelectOneItems[selection][0];
            let itemQuantity = rewardMultiSelectOneItems[selection][1];
            let itemHour = rewardMultiSelectOneItems[selection][2];
            if (itemHour > 0) {
                cm.gainItemHour(itemId, itemQuantity, itemHour);
            } else {
                cm.gainItem(itemId, itemQuantity);
            }
        }

        if (rewardMaplePoint > 0) {
            cm.getPlayer().gainCash(2, rewardMaplePoint);
        }
        if (rewardCash > 0) {
            cm.getPlayer().gainCash(1, rewardCash);
        }
        if (rewardMoney > 0) {
            cm.gainMeso(rewardMoney);
        }
        if (rewardAccountLog > 0) {
            let num;
            if (rewardAccountLogValueRange[0] !== rewardAccountLogValueRange[1]) {
                num = cm.getRandomValue(rewardAccountLogValueRange[0], rewardAccountLogValueRange[1]);
            } else {
                num = rewardAccountLogValueRange[0];
            }
            cm.dropMessage(6, rewardAccountLogDisplayName + "獲得" + num);
            cm.getPlayer().addAccLogValue(rewardAccountLogName, num);
        }
        //
        if (statEquips.length > 0) {
            for (let i = 0; i < statEquips.length; i++) {
                let itemId = statEquips[i][0];
                let itemStat = statEquips[i][1];
                let itemPadMad = statEquips[i][2];
                let itemHour = statEquips[i][3];
                gainStatItem(itemId, itemStat, itemPadMad, itemHour);
            }
        }
        //
        if (rewardItems.length > 0) {
            for (let i = 0; i < rewardItems.length; i++) {
                let itemId = rewardItems[i][0];
                let itemQuantity = rewardItems[i][1];
                let itemHour = rewardItems[i][2];
                if (itemHour > 0) {
                    cm.gainItemHour(itemId, itemQuantity, itemHour);
                } else {
                    cm.gainItem(itemId, itemQuantity);
                }
            }
        }
        cm.sendNext("獎勵已經放入背包內");
        if (rewardBroadcast) {
            cm.worldMessage(rewardBroadcastType, rewardBroadcastMessage.replace("%s", cm.getPlayer().getName()));
        }
        if (autoResetLogDaily) {
            if (logApplyAccount) {
                cm.getPlayer().addAccDailyLogValue(logName, 1);
            } else {
                cm.getPlayer().addDailyLogValue(logName, 1);
            }
        } else {
            if (logApplyAccount) {
                cm.getPlayer().addAccLogValue(logName, 1);
            } else {
                cm.getPlayer().addLogValue(logName, 1);
            }
        }
        if (systemRewardListRemove && requestApplySystemRewardListName) {
            cm.removeCustomRewardList(systemRewardListName, systemRewardListAccountLimit, systemRewardListIgnoreCase);
        }
        cm.dispose();
    } else {
        cm.dispose();
    }
}

function gainStatItem(itemId, stat, padMad, itemHour) {
    let ii = cm.getItemInformationProvider();
    let equip = ii.randomizeStats(ii.getEquipById(itemId));
    if (stat > -1) {
        equip.setStr(stat);
    }
    if (stat > -1) {
        equip.setLuk(stat);
    }
    if (stat > -1) {
        equip.setDex(stat);
    }
    if (stat > -1) {
        equip.setInt(stat);
    }
    if (padMad > -1) {
        equip.setMatk(padMad);
    }
    if (padMad > -1) {
        equip.setWatk(padMad);
    }
    if (itemHour > 0) {
        equip.setExpiration((cm.getCurrentTimeMillis() + (itemHour * 60 * 60 * 1000)));
    }
    cm.addByItem(equip);
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

function updateItems(itemId, itemQuantity, allItemIds, allItemQuantities) {
    let index = allItemIds.indexOf(itemId);
    if (index !== -1) {
        allItemQuantities[index] += itemQuantity;
    } else {
        allItemIds.push(itemId);
        allItemQuantities.push(itemQuantity);
    }
}