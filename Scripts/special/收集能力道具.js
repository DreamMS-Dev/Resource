let status = -1, sel = -1, sel2 = -1;

let monsterCardUseIconRaw = true;
let collectedItemInfo = [
    [
        "一般卡牌",
        1, // 類型
        false, // 此類型加成是否帳號通用
        50, // 可放入道具數量
        [ // 可用道具代碼
            2381000, 2381001, 2381002, 2381003, 2381004, 2381005, 2381006, 2381007, 2381008, 2381009,
            2381010, 2381011, 2381012, 2381013, 2381014, 2381015, 2381016, 2381017, 2381018, 2381019,
            2381020, 2381021, 2381022, 2381023, 2381024, 2381025, 2381026, 2381027, 2381028, 2381029,
            2381030, 2381031, 2381032, 2381033, 2381034, 2381035, 2381036, 2381037, 2381038, 2381039,
            2381040, 2381041, 2381042, 2381043, 2381044, 2381045, 2381046, 2381047, 2381048, 2381049,
            2381050, 2381051, 2381052, 2381053, 2381054, 2381055, 2381056, 2381057, 2381058, 2381059,
            2381060, 2381061, 2381062, 2381063, 2381064, 2381065, 2381066, 2381067, 2381068, 2381069,
            2381070, 2381071, 2381072, 2381073, 2381074, 2381075, 2381076
        ]
    ],
    [
        "高級卡牌",
        2, // 類型
        false, // 此類型加成是否帳號通用
        30, // 可放入道具數量
        [ // 可用道具代碼
            2382000, 2382001, 2382002, 2382003, 2382004, 2382005, 2382006, 2382007, 2382008, 2382009,
            2382010, 2382011, 2382012, 2382013, 2382014, 2382015, 2382016, 2382017, 2382018, 2382019,
            2382020, 2382021, 2382022, 2382023, 2382024, 2382025, 2382026, 2382027, 2382028, 2382029,
            2382030, 2382031, 2382032, 2382033, 2382034, 2382035, 2382036, 2382037, 2382038, 2382039,
            2382040, 2382041, 2382042, 2382043, 2382044, 2382045, 2382046, 2382047, 2382048, 2382049,
            2382050, 2382051, 2382052, 2382053, 2382054, 2382055, 2382056, 2382057, 2382058, 2382059,
            2382060, 2382061, 2382062, 2382063, 2382064, 2382065, 2382066, 2382067, 2382068, 2382069,
            2382070, 2382071, 2382072, 2382073, 2382074, 2382075, 2382076, 2382077, 2382078, 2382079,
            2382080, 2382081, 2382082, 2382083, 2382084, 2382085, 2382086, 2382087, 2382092, 2382093,
            2382094, 2382095, 2382096
        ]
    ],
    [
        "BOSS卡牌",
        3, // 類型
        true, // 此類型加成是否帳號通用
        20, // 可放入道具數量
        [ // 可用道具代碼
            2388000, 2388001, 2388002, 2388003, 2388004, 2388005, 2388006, 2388007, 2388008, 2388009,
            2388010, 2388011, 2388012, 2388013, 2388014, 2388015, 2388016, 2388017, 2388018, 2388019,
            2388020, 2388021, 2388022, 2388023, 2388024, 2388025, 2388026, 2388029, 2388030, 2388031,
            2388032, 2388033, 2388034, 2388035, 2388036, 2388037, 2388038, 2388039, 2388040, 2388041,
            2388042, 2388043, 2388044, 2388046, 2388047, 2388048, 2388049, 2388050, 2388051, 2388055,
            2388067, 2388068, 2388069, 2388070
        ],
    ],
    [
        "特殊卡牌",
        4, // 類型
        true, // 此類型加成是否帳號通用
        3, // 可放入道具數量
        [ // 可用道具代碼
            2387000, 2387001, 2387002, 2387003, 2387004, 2387005, 2387006, 2387007, 2387008, 2387009,
            2387010, 2387011, 2387012, 2387013
        ],
    ]
]

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === 0) {
        if (status === 2) {
            sel2 = -1;
        } else if (status === 1) {
            sel = -1;
        }
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status === 0) {
        let message = "[收集道具系統]\r\n\r\n";
        message += getAllCollectedStatMessage();
        for (let i = 0; i < collectedItemInfo.length; i++) {
            let info = collectedItemInfo[i];
            message += "#L" + (info[1] - 1) + "##b" + info[0] + "#k(" + cmb.getCollectedStatItemList(info[2], info[1]).size() + "/" + info[3] + ")#l\r\n";
        }
        cm.sendSimple(message);
    } else if (status === 1) {
        if (mode === 1 && sel === -1) {
            sel = selection;
            if (collectedItemInfo[0][1] !== 1) {
                for (let i = 0; i < collectedItemInfo.length; i++) {
                    if ((collectedItemInfo[i][1] - 1) === selection) {
                        sel = i;
                        break;
                    }
                }
            }
        }
        let message = "[" + collectedItemInfo[sel][0] + "]\r\n\r\n";
        message += "帳號通用  : #r" + (collectedItemInfo[sel][2] ? "是" : "否") + "#k\r\n";
        message += "開放欄位  : #b" + collectedItemInfo[sel][3] + "格#k\r\n";
        message += "已使用欄位: #d" + cmb.getCollectedStatItemList(collectedItemInfo[sel][2], collectedItemInfo[sel][1]).size() + "格#k\r\n";
        message += getCollectedStatMessage(sel);
        message += "\r\n#b";
        message += "#L0#確認所有可用道具及效果(#r" + collectedItemInfo[sel][4].length + "#b個)#l#d\r\n";
        message += "#L1#確認剩餘可用道具及效果(#r" + (collectedItemInfo[sel][4].length - (cmb.getCollectedStatItemList(collectedItemInfo[sel][2], collectedItemInfo[sel][1]).size())) + "#d個)#k#l\r\n";
        message += "#L2#查看套用中道具(#r" + cmb.getCollectedStatItemList(collectedItemInfo[sel][2], collectedItemInfo[sel][1]).size() + "#k個)#l\r\n";
        message += "#L3#新增套用中道具#l\r\n";
        message += "#L4#拿出套用中道具#l\r\n";
        cm.sendSimple(message);
    } else if (status === 2) {
        if (mode === 1 && sel2 === -1) {
            sel2 = selection;
        }
        if (sel2 === 0) { // check all item info in script
            let message = "";
            let itemList = collectedItemInfo[sel][4];
            for (let i = 0; i < itemList.length; i++) {
                let itemId = itemList[i];
                if (cm.isCollectedStatItem(itemId)) {
                    message += getPicture(itemId) + "#t" + itemId + "# - " + getItemStatDescriptionByItemId(itemId);
                } else {
                    sendLackingItemMessage(itemId);
                }
            }

            if (message === "") {
                message = "目前未開放";
            }
            cm.sendNext(message);
            sel2 = -1;
            status = 0;
        } else if (sel2 === 1) { // check available item info in script
            let message = "";
            let itemList = collectedItemInfo[sel][4];
            let collectedStatItemList = cmb.getCollectedStatItemList(collectedItemInfo[sel][2], collectedItemInfo[sel][1]);
            for (let i = 0; i < itemList.length; i++) {
                let itemId = itemList[i];
                if (cm.isCollectedStatItem(itemId)) {
                    if (!collectedStatItemList.contains(itemId)) {
                        message += getPicture(itemId) + "#t" + itemId + "# - " + getItemStatDescriptionByItemId(itemId);
                    }
                } else {
                    sendLackingItemMessage(itemId);
                }
            }

            if (message === "") {
                message = "目前沒有剩餘可用道具了";
            }
            cm.sendNext(message);
            sel2 = -1;
            status = 0;
        } else if (sel2 === 2) { // check applying item
            let storedItemListSortByItemInfo = getStoredItemListSortByItemInfo(sel);
            let message = "";
            let success = false;
            for (let i = 0; i < storedItemListSortByItemInfo.length; i++) {
                let itemId = storedItemListSortByItemInfo[i];
                message += getPicture(itemId) + "#t" + itemId + "# - " + getItemStatDescriptionByItemId(itemId);
                success = true;
            }
            if (success) {
                cm.sendSimple(message);
            } else {
                cm.sendNext("目前沒有套用中的道具");
            }
            sel2 = -1;
            status = 0;
        } else if (sel2 === 3) { // store item
            if (cmb.getCollectedStatItemList(collectedItemInfo[sel][2], collectedItemInfo[sel][1]).size() >= collectedItemInfo[sel][3]) {
                cm.sendNext("可用欄位已滿");
                sel2 = -1;
                status = 0;
                return;
            }
            let collectedStatItemList = cmb.getCollectedStatItemList(collectedItemInfo[sel][2], collectedItemInfo[sel][1]);
            let listIsEmpty = collectedStatItemList.size() === 0;
            let itemInfo = collectedItemInfo[sel][4];
            let message = "請選擇要放入的道具 (" + collectedStatItemList.size() + "/" + collectedItemInfo[sel][3] + ")\r\n\r\n";
            let success = false;
            for (let i = 0; i < itemInfo.length; i++) {
                let itemId = itemInfo[i];
                if (cm.isCollectedStatItem(itemId)) {
                    if ((listIsEmpty || !collectedStatItemList.contains(itemId)) && cm.haveItem(itemId)) {
                        message += "#L" + itemId + "#" + getPicture(itemId) + "#t" + itemId + "# - " + getItemStatDescriptionByItemId(itemId);
                        success = true;
                    }
                } else {
                    sendLackingItemMessage(itemId);
                }
            }
            if (success) {
                cm.sendSimple(message);
            } else {
                cm.sendNext("目前沒有可放入的道具");
                sel2 = -1;
                status = 0;
            }
        } else if (sel2 === 4) { // take out item
            let storedItemListSortByItemInfo = getStoredItemListSortByItemInfo(sel);
            let message = "請選擇要拿出的道具 (" + cmb.getCollectedStatItemList(collectedItemInfo[sel][2], collectedItemInfo[sel][1]).size() + "/" + collectedItemInfo[sel][3] + ")\r\n\r\n";
            let success = false;
            for (let i = 0; i < storedItemListSortByItemInfo.length; i++) {
                let itemId = storedItemListSortByItemInfo[i];
                message += "#L" + itemId + "#" + getPicture(itemId) + "#t" + itemId + "# - " + getItemStatDescriptionByItemId(itemId);
                success = true;
            }
            if (success) {
                cm.sendSimple(message);
            } else {
                cm.sendNext("目前沒有套用中的道具");
                sel2 = -1;
                status = 0;
            }
        } else {
            cm.dispose();
        }

    } else if (status === 3) {
        if (sel2 === 3) { // store item
            if (cmb.getCollectedStatItemList(collectedItemInfo[sel][2], collectedItemInfo[sel][1]).size() >= collectedItemInfo[sel][3]) {
                cm.sendNext("可用欄位已滿");
                sel2 = -1;
                status = 0;
                return;
            }
            if (!cm.exchange(0, selection, -1)) {
                cm.sendNext("發生未知錯誤，放入道具失敗");
                cm.dispose();
                return;
            }
            cmb.addCollectedStatItem(collectedItemInfo[sel][2], collectedItemInfo[sel][1], selection);
            cm.getPlayer().updateStat();
            cm.getPlayer().updateCustomDamageCap();
            cm.sendNext("放入道具成功 (" + cmb.getCollectedStatItemList(collectedItemInfo[sel][2], collectedItemInfo[sel][1]).size() + "/" + collectedItemInfo[sel][3] + ")\r\n\r\n" + getPicture(selection) + "#t" + selection + "# - " + getItemStatDescriptionByItemId(selection));
            status = 1;
        } else if (sel2 === 4) { // take out item
            if (!cm.hasSpace((selection / 1000000), 1)) {
                cm.sendNext("請確認背包空間後再試一次");
                cm.dispose();
            } else if (!cm.canHold(selection, 1)) {
                cm.sendNext("請確認背包空間後再試一次");
                cm.dispose();
            } else if (!cmb.removeCollectedStatItem(collectedItemInfo[sel][2], collectedItemInfo[sel][1], selection)) { // contains condition - hasItem
                cm.sendNext("發生未知錯誤，取出道具失敗");
                cm.dispose();
            } else {
                cm.gainItem(selection, 1);
                cm.getPlayer().updateStat();
                cm.getPlayer().updateCustomDamageCap();
                cm.sendNext("取出道具成功 (" + cmb.getCollectedStatItemList(collectedItemInfo[sel][2], collectedItemInfo[sel][1]).size() + "/" + collectedItemInfo[sel][3] + ")\r\n\r\n" + getPicture(selection) + "#t" + selection + "# - " + getItemStatDescriptionByItemId(selection));
                status = 1;
            }
        }
    } else {
        cm.dispose();
    }
}

function getCollectedStatItemMessageInternal(maxDamage, damageRate, summonDamageRate, str, dex, int_, luk, strRate, dexRate, intRate, lukRate, expRate, dropRate, moneyRate, minusFishingInterval, noReflectDamage, diseaseControl, newLine) {
    let message = "";

    if (maxDamage > 0) {
        message += "額外最高傷害: " + markValue(cm.numberWithCommas(maxDamage)) + (newLine ? "\r\n" : "");
    }
    if (damageRate > 0) {
        message += "額外傷害倍率: " + markValue(damageRate) + "%" + (newLine ? "\r\n" : "");
    }
    if (summonDamageRate > 0) {
        message += "額外召喚獸傷害倍率: " + markValue(summonDamageRate) + "%" + (newLine ? "\r\n" : "");
    }
    if (expRate > 0) {
        message += "額外經驗倍率: " + markValue(expRate) + "%" + (newLine ? "\r\n" : "");
    }
    if (dropRate > 0) {
        message += "額外掉寶倍率: " + markValue(dropRate) + "%" + (newLine ? "\r\n" : "");
    }
    if (moneyRate > 0) {
        message += "額外金錢倍率: " + markValue(moneyRate) + "%" + (newLine ? "\r\n" : "");
    }
    if (strRate > 0 && strRate === dexRate && dexRate === intRate && intRate === lukRate) {
        message += "額外全屬倍率: " + markValue(strRate) + "%" + (newLine ? "\r\n" : "");
    } else {
        if (strRate > 0) {
            message += "額外力量倍率: " + markValue(strRate) + "%" + (newLine ? "\r\n" : "");
        }
        if (dexRate > 0) {
            message += "額外敏捷倍率: " + markValue(dexRate) + "%" + (newLine ? "\r\n" : "");
        }
        if (intRate > 0) {
            message += "額外智力倍率: " + markValue(intRate) + "%" + (newLine ? "\r\n" : "");
        }
        if (lukRate > 0) {
            message += "額外幸運倍率: " + markValue(lukRate) + "%" + (newLine ? "\r\n" : "");
        }
    }

    if (str > 0 && str === dex && dex === int_ && int_ === luk) {
        message += "額外全屬: " + markValue(str) + (newLine ? "\r\n" : "");
    } else {
        if (str > 0) {
            message += "額外力量: " + markValue(str) + (newLine ? "\r\n" : "");
        }
        if (dex > 0) {
            message += "額外敏捷: " + markValue(dex) + (newLine ? "\r\n" : "");
        }
        if (int_ > 0) {
            message += "額外智力: " + markValue(int_) + (newLine ? "\r\n" : "");
        }
        if (luk > 0) {
            message += "額外幸運: " + markValue(luk) + (newLine ? "\r\n" : "");
        }
    }
    if (minusFishingInterval > 0) {
        message += "釣魚減少毫秒: " + markValue(cm.numberWithCommas(minusFishingInterval)) + (newLine ? "\r\n" : "");
    }
    if (diseaseControl) {
        message += "無視負面狀態: 是" + (newLine ? "\r\n" : "");
    }
    if (noReflectDamage) {
        message += "無視傷害反射: 是" + (newLine ? "\r\n" : "");
    }
    return message;
}

function getItemStatDescriptionByItemId(itemId) {
    let msg = "";
    if (cm.isCollectedStatItem(itemId)) {
        msg += getCollectedStatItemMessageInternal(
            cm.getCollectedStatItemMaxDamage(itemId),
            cm.getCollectedStatItemDamageRate(itemId),
            cm.getCollectedStatItemSummonDamageRate(itemId),
            cm.getCollectedStatItemStr(itemId),
            cm.getCollectedStatItemDex(itemId),
            cm.getCollectedStatItemInt(itemId),
            cm.getCollectedStatItemLuk(itemId),
            cm.getCollectedStatItemStrRate(itemId),
            cm.getCollectedStatItemDexRate(itemId),
            cm.getCollectedStatItemIntRate(itemId),
            cm.getCollectedStatItemLukRate(itemId),
            cm.getCollectedStatItemExpRate(itemId),
            cm.getCollectedStatItemDropRate(itemId),
            cm.getCollectedStatItemMoneyRate(itemId),
            cm.getCollectedStatItemMinusFishingInterval(itemId),
            cm.isCollectedStatItemDiseaseControl(itemId),
            cm.isCollectedStatItemNoReflectDamage(itemId),
            true
        );
    }
    return msg;
}

function getAllCollectedStatMessage() {
    let maxDamage = 0;
    let damageRate = 0;
    let summonDamageRate = 0;
    let str = 0;
    let dex = 0;
    let int_ = 0;
    let luk = 0;
    let strRate = 0;
    let dexRate = 0;
    let intRate = 0;
    let lukRate = 0;
    let expRate = 0;
    let dropRate = 0;
    let moneyRate = 0;
    let minusFishingInterval = 0;
    let noReflectDamage = false;
    let diseaseControl = false;
    let message = "";
    for (let i = 0; i < collectedItemInfo.length; i++) {
        let type = collectedItemInfo[i][1];
        let account = collectedItemInfo[i][2];
        let itemList = collectedItemInfo[i][4];
        let collectedStatItemList = cmb.getCollectedStatItemList(account, type);
        if (!collectedStatItemList.isEmpty()) {
            for (let j = 0; j < itemList.length; j++) {
                let itemId = itemList[j];
                if (cm.isCollectedStatItem(itemId)) {
                    if (collectedStatItemList.contains(itemId)) {
                        maxDamage += cm.getCollectedStatItemMaxDamage(itemId);
                        damageRate += cm.getCollectedStatItemDamageRate(itemId);
                        summonDamageRate += cm.getCollectedStatItemSummonDamageRate(itemId);
                        str += cm.getCollectedStatItemStr(itemId);
                        dex += cm.getCollectedStatItemDex(itemId);
                        int_ += cm.getCollectedStatItemInt(itemId);
                        luk += cm.getCollectedStatItemLuk(itemId);
                        strRate += cm.getCollectedStatItemStrRate(itemId);
                        dexRate += cm.getCollectedStatItemDexRate(itemId);
                        intRate += cm.getCollectedStatItemIntRate(itemId);
                        lukRate += cm.getCollectedStatItemLukRate(itemId);
                        expRate += cm.getCollectedStatItemExpRate(itemId);
                        dropRate += cm.getCollectedStatItemDropRate(itemId);
                        moneyRate += cm.getCollectedStatItemMoneyRate(itemId);
                        minusFishingInterval += cm.getCollectedStatItemMinusFishingInterval(itemId)
                        if (cm.isCollectedStatItemDiseaseControl(itemId)) {
                            noReflectDamage = true;
                        }
                        if (cm.isCollectedStatItemNoReflectDamage(itemId)) {
                            diseaseControl = true;
                        }
                    }
                } else {
                    sendLackingItemMessage(itemId);
                }
            }
        }
    }
    message += getCollectedStatItemMessageInternal(maxDamage, damageRate, summonDamageRate, str, dex, int_, luk, strRate, dexRate, intRate, lukRate, expRate, dropRate, moneyRate, minusFishingInterval, noReflectDamage, diseaseControl, true);
    return message;
}

function getCollectedStatMessage(sel) {
    let type = collectedItemInfo[sel][1];
    let account = collectedItemInfo[sel][2];
    let itemList = collectedItemInfo[sel][4];
    let message = "";
    let collectedStatItemList = cmb.getCollectedStatItemList(account, type);
    if (!collectedStatItemList.isEmpty()) {

        let maxDamage = 0;
        let damageRate = 0;
        let summonDamageRate = 0;
        let str = 0;
        let dex = 0;
        let int_ = 0;
        let luk = 0;
        let strRate = 0;
        let dexRate = 0;
        let intRate = 0;
        let lukRate = 0;
        let expRate = 0;
        let dropRate = 0;
        let moneyRate = 0;
        let minusFishingInterval = 0;
        let noReflectDamage = false;
        let diseaseControl = false;

        for (let i = 0; i < itemList.length; i++) {
            let itemId = itemList[i];
            if (cm.isCollectedStatItem(itemId)) {
                if (collectedStatItemList.contains(itemId)) {
                    maxDamage += cm.getCollectedStatItemMaxDamage(itemId);
                    damageRate += cm.getCollectedStatItemDamageRate(itemId);
                    summonDamageRate += cm.getCollectedStatItemSummonDamageRate(itemId);
                    str += cm.getCollectedStatItemStr(itemId);
                    dex += cm.getCollectedStatItemDex(itemId);
                    int_ += cm.getCollectedStatItemInt(itemId);
                    luk += cm.getCollectedStatItemLuk(itemId);
                    strRate += cm.getCollectedStatItemStrRate(itemId);
                    dexRate += cm.getCollectedStatItemDexRate(itemId);
                    intRate += cm.getCollectedStatItemIntRate(itemId);
                    lukRate += cm.getCollectedStatItemLukRate(itemId);
                    expRate += cm.getCollectedStatItemExpRate(itemId);
                    dropRate += cm.getCollectedStatItemDropRate(itemId);
                    moneyRate += cm.getCollectedStatItemMoneyRate(itemId);
                    minusFishingInterval += cm.getCollectedStatItemMinusFishingInterval(itemId)
                    if (cm.isCollectedStatItemDiseaseControl(itemId)) {
                        noReflectDamage = true;
                    }
                    if (cm.isCollectedStatItemNoReflectDamage(itemId)) {
                        diseaseControl = true;
                    }
                }
            } else {
                sendLackingItemMessage(itemId);
            }
        }
        message += getCollectedStatItemMessageInternal(maxDamage, damageRate, summonDamageRate, str, dex, int_, luk, strRate, dexRate, intRate, lukRate, expRate, dropRate, moneyRate, minusFishingInterval, noReflectDamage, diseaseControl, true);
    }
    return message;
}

function getStoredItemListSortByItemInfo(sel) {
    let resultItemList = [];
    let collectedStatItemList = cmb.getCollectedStatItemList(collectedItemInfo[sel][2], collectedItemInfo[sel][1]);
    if (!collectedStatItemList.isEmpty()) {
        let itemList = collectedItemInfo[sel][4];
        for (let i = 0; i < itemList.length; i++) {
            let itemId = itemList[i];
            if (cm.isCollectedStatItem(itemId)) {
                if (collectedStatItemList.contains(itemId)) {
                    resultItemList.push(itemId);
                }
            } else {
                sendLackingItemMessage(itemId);
            }
        }
    }
    return resultItemList;
}

function getPicture(id) {
    if (parseInt(id / 10000) === 238 && monsterCardUseIconRaw) {
        return "#fItem/Consume/0238.img/0" + id + "/info/iconRaw#";
    } else {
        return "#v" + id + "#";
    }
}

function sendLackingItemMessage(itemId) {
    if (cm.getPlayer().isGM()) {
        cm.getPlayer().dropMessage(6, "[提示] 發現未設置收集能力道具編號: " + itemId);
    }
}

function markValue(val) {
    return (val > 0 ? "#b" + val + "#k" : val);
}
