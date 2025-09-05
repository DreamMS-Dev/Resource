/**
 * Additional Set Stat
 * By Windy Boy
 * 2025/03/05
 */

let status = -1, sel = -1, sel2 = -1;

let setInfos = [
    // { name: "顯示名稱", type: 儲存空間編號, account: 儲存套組是否帳號通用, set: [道具代碼, 道具代碼, 道具代碼] },
    {name: "菇菇傘", type: 1, account: false, set: [4000009, 4000012, 4000015]},
    {name: "蝸牛殼", type: 2, account: false, set: [4000000, 4000016, 4000019]},
    {name: "烏龜殼", type: 3, account: true, set: [4000000, 4000016, 4000019, 4000045]},
    {name: "垃圾區", type: 4, account: false, set: [4000001, 4000002]}
];

function start() {
    if (cm.getPlayer().isGM()) {
        checkAndShowLackingSetStat();
    }
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
        let message = "[收集套組道具]\r\n\r\n";
        message += getAllCollectedStatSetMessage();
        for (let i = 0; i < setInfos.length; i++) {
            let setInfo = setInfos[i];
            message += "#L" + i + "##b" + setInfo.name + "#k(" + cmb.getCollectedStatSetItemList(setInfo.account, setInfo.type).size() + "/" + setInfo.set.length + ")#l\r\n";
        }
        cm.sendSimple(message);
    } else if (status === 1) {
        if (mode === 1 && sel === -1) {
            sel = selection;
        }
        let collectedStatSetItemList = cmb.getCollectedStatSetItemList(setInfos[sel].account, setInfos[sel].type);
        let message = "[" + setInfos[sel].name + "]\r\n\r\n";
        message += "帳號通用  : #r" + (setInfos[sel].account ? "是" : "否") + "#k\r\n";
        message += "套用效果  : #r" + (!cm.getCollectedSetStatInfo(collectedStatSetItemList).isEmpty() ? "是" : "否") + "#k\r\n";

        message += getCollectedStatSetMessage(sel);

        let newCollectedStatSetItemList = cm.getNewLinkedList();
        newCollectedStatSetItemList.addAll(collectedStatSetItemList);
        for (let i = 0; i < setInfos[sel].set.length; i++) {
            let itemId = setInfos[sel].set[i];
            let number = newCollectedStatSetItemList.contains(itemId) ? 1 : 0;
            if (number === 1) {
                message += "#L" + (1000 + i) + "#";
            } else {
                message += "#L" + i + "#";
            }
            message += "#v" + itemId + "# " + markValue(number) + "/1#l\r\n";
            if (number === 1) {
                let iterator = newCollectedStatSetItemList.iterator();
                while (iterator.hasNext()) {
                    if (iterator.next() === itemId) {
                        iterator.remove();
                        break;
                    }
                }
            }
        }
        cm.sendSimple(message);
    } else if (status === 2) {
        if (mode === 1 && sel2 === -1) {
            sel2 = selection;
        }
        if (sel2 < 1000) { // store item
            let itemId = setInfos[sel].set[sel2];
            if (cm.haveItem(itemId, 1)) {
                cm.sendYesNo("是否確認要#r放入#b#v" + itemId + "##t" + itemId + "#");
            } else {
                cm.sendNext("背包沒有可放入的#r#v" + itemId + "##t" + itemId + "#");
                sel2 = -1;
                status = 0;
            }
        } else { // take out item
            let itemId = setInfos[sel].set[sel2 - 1000];
            if (cm.canHold(itemId)) {
                cm.sendYesNo("是否確認要#r拿出#b#v" + itemId + "##t" + itemId + "#");
            } else {
                cm.sendNext("背包已滿，無法拿出");
                sel2 = -1;
                status = 0;
            }
        }
    } else if (status === 3) {
        if (sel2 < 1000) { // store item
            let itemId = setInfos[sel].set[sel2];
            if (!cm.exchange(0, itemId, -1)) {
                cm.sendNext("發生未知錯誤，放入道具失敗");
                cm.dispose();
                return;
            }
            cmb.addCollectedStatSetItem(setInfos[sel].account, setInfos[sel].type, itemId);
            cm.getPlayer().updateStat();
            cm.getPlayer().updateCustomDamageCap();
            cm.sendNext("放入道具成功 " + getPicture(itemId) + "#t" + itemId + "#");
            status = 0;
            sel2 = -1;
        } else { // take out item
            let itemId = setInfos[sel].set[sel2 - 1000];
            if (!cm.hasSpace((itemId / 1000000), 1)) {
                cm.sendNext("請確認背包空間後再試一次");
                cm.dispose();
            } else if (!cm.canHold(itemId, 1)) {
                cm.sendNext("請確認背包空間後再試一次");
                cm.dispose();
            } else if (!cmb.removeCollectedStatSetItem(setInfos[sel].account, setInfos[sel].type, itemId)) { // contains condition - hasItem
                cm.sendNext("發生未知錯誤，取出道具失敗");
                cm.dispose();
            } else {
                cm.gainItem(itemId, 1);
                cm.getPlayer().updateStat();
                cm.getPlayer().updateCustomDamageCap();
                cm.sendNext("取出道具成功" + getPicture(itemId) + "#t" + itemId + "#");
                status = 0;
                sel2 = -1;
            }
        }
    } else {
        cm.dispose();
    }
}

function getCollectedStatSetItemMessageInternal(maxDamage, damageRate, summonDamageRate, str, dex, int_, luk, strRate, dexRate, intRate, lukRate, expRate, dropRate, moneyRate, minusFishingInterval, noReflectDamage, diseaseControl, newLine) {
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

function getAllCollectedStatSetMessage() {
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
    for (let i = 0; i < setInfos.length; i++) {
        let type = setInfos[i].type;
        let account = setInfos[i].account;
        let itemList = convertNumberListToLinkedList(setInfos[i].set); // linkedList
        let collectedItemList = cmb.getCollectedStatSetItemList(account, type);
        if (!collectedItemList.isEmpty()) {
            let setInfoFromInput = cm.getCollectedSetStatInfo(itemList);
            if (!setInfoFromInput.isEmpty()) {
                let setInfosListFromCollected = cm.getCollectedSetStatInfo(collectedItemList);
                if (!setInfosListFromCollected.isEmpty()) {
                    let iterator = setInfosListFromCollected.iterator();
                    while (iterator.hasNext()) {
                        let setInfoListFromCollected = iterator.next();
                        maxDamage += setInfoListFromCollected.getMaxDamage();
                        damageRate += setInfoListFromCollected.getDamageRate();
                        summonDamageRate += setInfoListFromCollected.getSummonedDamageRate();
                        str += setInfoListFromCollected.getStr();
                        dex += setInfoListFromCollected.getDex();
                        int_ += setInfoListFromCollected.getInt_();
                        luk += setInfoListFromCollected.getLuk();
                        strRate += setInfoListFromCollected.getStrRate();
                        dexRate += setInfoListFromCollected.getDexRate();
                        intRate += setInfoListFromCollected.getIntRate();
                        lukRate += setInfoListFromCollected.getLukRate();
                        expRate += setInfoListFromCollected.getExpRate();
                        dropRate += setInfoListFromCollected.getDropRate();
                        moneyRate += setInfoListFromCollected.getMoneyRate();
                        minusFishingInterval += setInfoListFromCollected.getMinusFishingInterval();
                        if (setInfoListFromCollected.isDiseaseControl()) {
                            noReflectDamage = true;
                        }
                        if (setInfoListFromCollected.isNoReflectDamage()) {
                            diseaseControl = true;
                        }
                    }
                }
            }
        }
    }
    message += getCollectedStatSetItemMessageInternal(maxDamage, damageRate, summonDamageRate, str, dex, int_, luk, strRate, dexRate, intRate, lukRate, expRate, dropRate, moneyRate, minusFishingInterval, noReflectDamage, diseaseControl, true);
    return message;
}

function getCollectedStatSetMessage(sel) {
    let itemList = convertNumberListToLinkedList(setInfos[sel].set);
    let message = "";
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

    let setInfoFromInput = cm.getCollectedSetStatInfo(itemList);
    if (!setInfoFromInput.isEmpty()) {
        let iterator = setInfoFromInput.iterator();
        while (iterator.hasNext()) {
            let setInfoListFromCollected = iterator.next();
            maxDamage += setInfoListFromCollected.getMaxDamage();
            damageRate += setInfoListFromCollected.getDamageRate();
            summonDamageRate += setInfoListFromCollected.getSummonedDamageRate();
            str += setInfoListFromCollected.getStr();
            dex += setInfoListFromCollected.getDex();
            int_ += setInfoListFromCollected.getInt_();
            luk += setInfoListFromCollected.getLuk();
            strRate += setInfoListFromCollected.getStrRate();
            dexRate += setInfoListFromCollected.getDexRate();
            intRate += setInfoListFromCollected.getIntRate();
            lukRate += setInfoListFromCollected.getLukRate();
            expRate += setInfoListFromCollected.getExpRate();
            dropRate += setInfoListFromCollected.getDropRate();
            moneyRate += setInfoListFromCollected.getMoneyRate();
            minusFishingInterval += setInfoListFromCollected.getMinusFishingInterval();
            if (setInfoListFromCollected.isDiseaseControl()) {
                noReflectDamage = true;
            }
            if (setInfoListFromCollected.isNoReflectDamage()) {
                diseaseControl = true;
            }
        }
        message += getCollectedStatSetItemMessageInternal(maxDamage, damageRate, summonDamageRate, str, dex, int_, luk, strRate, dexRate, intRate, lukRate, expRate, dropRate, moneyRate, minusFishingInterval, noReflectDamage, diseaseControl, true);
    }
    return message;
}

function checkAndShowLackingSetStat() {
    for (let i = 0; i < setInfos.length; i++) {
        let itemList = convertNumberListToLinkedList(setInfos[i].set);
        let setInfoFromInput = cm.getCollectedSetStatInfo(itemList);
        if (setInfoFromInput.isEmpty()) {
            cm.getPlayer().dropMessage(6, "[提示] 發現未設置收集套組能力道具: " + itemList);
        }
    }
}

function getPicture(id) {
    return "#v" + id + "#";
}

function markValue(val) {
    return (val > 0 ? "#b" + val + "#k" : val);
}

function convertNumberListToLinkedList(numberList) {
    let list = cm.getNewLinkedList();
    for (let i = 0; i < numberList.length; i++) {
        list.add(numberList[i]);
    }
    return list;
}