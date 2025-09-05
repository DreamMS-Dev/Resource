let addCharacterIgnoreDrop = 0;
let addCharacterFieldMobIgnoreDrop = 1;
let checkCharacterIgnoreDrop = 2;
let characterIgnoreDropToAccountIgnoreDrop = 3;
let addAccountIgnoreDrop = 4;
let addAccountFieldMobIgnoreDrop = 5;
let checkAccountIgnoreDrop = 6;
let accountIgnoreDropToCharacterIgnoreDrop = 7;
let checkAllIgnoreDrop = 8;
let removeAbnormalIgnoreDrop = 9;

let status, sel, sel2;
let character;
let inputText;
let showDebugText = false;
let selectBySearching = true; // 透過搜尋新增過濾掉落物
let selectFromField = true; // 透過地圖怪物新增過濾掉落物
let applyCharacter = true; // 啟用角色忽略掉落物
let applyAccount = true; // 啟用帳號忽略掉落物

function resetValue() {
    status = -1;
    sel = -1;
    sel2 = -1;
    character = false;
    inputText = null;
}

function start() {
    resetValue();
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === 0) {
        status--;
        if (inputText != null && status === 1) {
            inputText = null;
        }
        if (status === 0 && selection === -1) {
            sel = -1;
        }
        if (status === 1 && selection === -1) {
            sel2 = -1;
        }
    } else {
        cm.dispose();
        return;
    }
    if (showDebugText) {
        cm.getPlayer().dropMessage(6, "mode: " + mode + " selection: " + selection + " status: " + status + " sel: " + sel + "  sel2: " + sel2 + " text: " + inputText);
    }
    if (status === 0) {
        let message = "#d[怪物掉落過濾系統]#l\r\n\r\n";
        if (applyCharacter) {
            if (selectBySearching) {
                message += "#L" + addCharacterIgnoreDrop + "##b新增角色物品過濾#l\r\n";
            }
            if (selectFromField) {
                message += "#L" + addCharacterFieldMobIgnoreDrop + "##b新增角色#d地圖怪物#b物品過濾#l\r\n";
            }
            message += "#L" + checkCharacterIgnoreDrop + "##b整理角色物品過濾清單#l\r\n";
            if (applyAccount) {
                message += "#L" + characterIgnoreDropToAccountIgnoreDrop + "##b角色物品過濾清單複製至帳號物品過濾清單#l\r\n";
            }
            message += "\r\n-------------------------------\r\n";
        }
        if (applyAccount) {
            if (selectBySearching) {
                message += "#L" + addAccountIgnoreDrop + "##b新增帳號物品過濾#l\r\n";
            }
            if (selectFromField) {
                message += "#L" + addAccountFieldMobIgnoreDrop + "##b新增帳號#d地圖怪物#b物品過濾#l\r\n";
            }
            message += "#L" + checkAccountIgnoreDrop + "##b整理帳號物品過濾清單濾單#l\r\n";
            if (applyCharacter) {
                message += "#L" + accountIgnoreDropToCharacterIgnoreDrop + "##b帳號物品過濾清單複製至角色物品過濾清單#l\r\n";
            }
            message += "\r\n-------------------------------\r\n";
        }
        message += "#L" + checkAllIgnoreDrop + "##b確認目前所有已過濾物品#l\r\n";
        message += "#L" + removeAbnormalIgnoreDrop + "#移除異常過濾物品#l\r\n";
        cm.sendSimple(message);
    } else if (status === 1) {
        if (mode === 1) {
            if (sel === -1) {
                sel = selection;
            }
            character = (sel < addAccountFieldMobIgnoreDrop);
        }
        if (sel === addCharacterIgnoreDrop) {
            cm.sendGetText("請輸入要角色過濾的物品名稱:");
        } else if (sel === addCharacterFieldMobIgnoreDrop) {
            let message = "#d請選擇要角色過濾的怪物掉寶:\r\n#b";
            message += "#L0##r過濾地圖上怪物所有掉寶#l\r\n\r\n";
            let iterator = cm.getMap().getUniqueMonsters().iterator();
            let next = false;
            while (iterator.hasNext()) {
                let mobId = iterator.next();
                if (hasDropInfo(mobId)) {
                    next = true;
                    message += "#L" + mobId + "##o" + mobId + "##l\r\n";
                }
            }
            if (!next) {
                cm.sendNext("本地圖沒有可以再過濾掉落道具的怪物");
                resetValue();
            } else {
                cm.sendSimple(message);
            }
        } else if (sel === checkCharacterIgnoreDrop) {
            if (hasCharacterIgnoreDropItem()) {
                cm.sendSimple(getCharacterIgnoreDropItemMessage());
            } else {
                cm.sendNext(getCharacterIgnoreDropItemMessage());
                resetValue();
            }
        } else if (sel === characterIgnoreDropToAccountIgnoreDrop) {
            cm.sendYesNo("是否確認將#r角色物品過濾清單#k複製至#b帳號物品過濾清單#k");
        } else if (sel === addAccountIgnoreDrop) {
            cm.sendGetText("請輸入要帳號過濾的物品名稱:");
        } else if (sel === addAccountFieldMobIgnoreDrop) {
            let message = "#d請選擇要帳號過濾的怪物掉寶:\r\n#b";
            message += "#L0##r過濾地圖上怪物所有掉寶#l\r\n\r\n";
            let iterator = cm.getMap().getUniqueMonsters().iterator();
            let next = false;
            while (iterator.hasNext()) {
                let mobId = iterator.next();
                if (hasDropInfo(mobId)) {
                    message += "#L" + mobId + "##o" + mobId + "##l\r\n";
                    next = true;
                }
            }
            if (!next) {
                cm.sendNext("本地圖沒有會掉落道具的怪物");
                resetValue();
            } else {
                cm.sendSimple(message);
            }
        } else if (sel === checkAccountIgnoreDrop) {
            if (hasAccountIgnoreDropItem()) {
                cm.sendSimple(getAccountIgnoreDropItemMessage());
            } else {
                cm.sendNext(getAccountIgnoreDropItemMessage());
                resetValue();
            }
        } else if (sel === accountIgnoreDropToCharacterIgnoreDrop) {
            cm.sendYesNo("是否確認將#r帳號物品過濾清單#k複製至#b角色物品過濾清單#k");
        } else if (sel === checkAllIgnoreDrop) {
            cm.sendNext(getAllIgnoreDropItemMessage());
            resetValue();
        } else if (sel === removeAbnormalIgnoreDrop) {
            let iterator = cm.getIgnoreDropItems(true).iterator();
            while (iterator.hasNext()) {
                let itemId = iterator.next();
                if (!cm.itemExists(itemId)) {
                    iterator.remove();
                }
            }
            iterator = cm.getIgnoreDropItems(false).iterator();
            while (iterator.hasNext()) {
                let itemId = iterator.next();
                if (!cm.itemExists(itemId)) {
                    iterator.remove();
                }
            }
            cm.sendNext("已移除異常掉落物");
            resetValue();
        }
    } else if (status === 2) {
        if (mode === 1) {
            if (sel2 === -1) {
                sel2 = selection;
            }
            if (inputText === null) {
                inputText = cm.getText();
            }
        }
        if (sel === addCharacterIgnoreDrop || sel === addAccountIgnoreDrop) {
            let message = cm.searchItem(inputText, false, false, false, true, true);
            if (!message.contains("#L")) {
                cm.sendNext(message);
                resetValue();
            } else {
                cm.sendSimple(message);
            }
        } else if (sel === addCharacterFieldMobIgnoreDrop || sel === addAccountFieldMobIgnoreDrop) {
            if (sel2 === 0) {
                cm.sendYesNo("是否確認要將地圖上所有掉寶過濾?");
            } else if (!hasDropInfo(sel2)) {
                cm.sendNext(getAllDropInfoMessage(sel2));
                resetValue();
            } else {
                cm.sendSimple(getAllDropInfoMessage(sel2));
            }
        } else if (sel === checkCharacterIgnoreDrop || sel === checkAccountIgnoreDrop) {
            if (sel2 === 1) {
                resetValue();
                action(1, 0, 0);
                return;
            }
            if (sel2 === 0) {
                cm.removeIgnoreDropItem(sel2, true, character);
                cm.sendNext("已經將" + (character ? "角色" : "帳號") + "物品過濾清單全部清除");
                resetValue();
            } else {
                cm.removeIgnoreDropItem(sel2, false, character);
                cm.sendNext("已將#t" + sel2 + ":#從" + (character ? "角色" : "帳號") + "物品過濾清單移除");
                status = 0;
                sel2 = -1;
            }
        } else if (sel === characterIgnoreDropToAccountIgnoreDrop) {
            let iterator = cm.getIgnoreDropItems(true).iterator();
            while (iterator.hasNext()) {
                cm.addIgnoreDropItem(iterator.next(), false);
            }
            cm.sendNext("#r角色物品過濾清單#k複製至#b帳號物品過濾清單完成");
            resetValue();
        } else if (sel === accountIgnoreDropToCharacterIgnoreDrop) {
            let iterator = cm.getIgnoreDropItems(false).iterator();
            while (iterator.hasNext()) {
                cm.addIgnoreDropItem(iterator.next(), true);
            }
            cm.sendNext("#r帳號物品過濾清單#k複製至#b角色物品過濾清單完成");
            resetValue();
        }
    } else if (status === 3) {
        if (sel2 === 0 && (sel === addCharacterFieldMobIgnoreDrop || sel === addAccountFieldMobIgnoreDrop)) {

            let mobIterator = cm.getMap().getUniqueMonsters().iterator();
            let mobIdArray = [];
            while (mobIterator.hasNext()) {
                let mobId = mobIterator.next();
                mobIdArray.push(mobId);
            }

            for (let i = 0; i < mobIdArray.length; i++) {
                let mobId = mobIdArray[i];
                let dropIterator = cm.getDropByMobId(mobId).iterator();
                while (dropIterator.hasNext()) {
                    let info = dropIterator.next();
                    if (info.getItemId() > 0 && cm.itemExists(info.getItemId())) {
                        cm.addIgnoreDropItem(info.getItemId(), character);
                    }
                }
            }

            cm.sendNext("成功添加地圖所有掉寶到" + (character ? "角色" : "帳號") + "物品過濾清單內.");
            resetValue();
        } else if (sel === addCharacterIgnoreDrop || sel === addCharacterFieldMobIgnoreDrop || sel === addAccountIgnoreDrop || sel === addAccountFieldMobIgnoreDrop) {
            cm.addIgnoreDropItem(selection, character);
            cm.sendNext("成功添加#t" + selection + ":#到" + (character ? "角色" : "帳號") + "物品過濾清單內.");
            status = 1;
        }
    }
}

function getAllIgnoreDropItemMessage() {
    return getIgnoreDropItemMessageInternal(cm.getAllIgnoreDropItems(), false, "");
}

function hasAccountIgnoreDropItem() {
    return !cm.getIgnoreDropItems(false).isEmpty();
}

function getAccountIgnoreDropItemMessage() {
    return getIgnoreDropItemMessageInternal(cm.getIgnoreDropItems(false), true, "帳號");
}

function hasCharacterIgnoreDropItem() {
    return !cm.getIgnoreDropItems(true).isEmpty();
}

function getCharacterIgnoreDropItemMessage() {
    return getIgnoreDropItemMessageInternal(cm.getIgnoreDropItems(true), true, "角色");
}

function getIgnoreDropItemMessageInternal(ignoreItemList, addSelection, text) {
    let message = "";
    if (ignoreItemList.isEmpty()) {
        message += "目前沒有任何" + text + "過濾清單";
    } else {
        message += "以下是目前" + text + "過濾清單\r\n";
        if (addSelection) {
            message += "(#r點擊圖片移除#k)\r\n";
        }
        message += "\r\n";
        if (addSelection) {
            message += "#L1#回上一頁#l\r\n";
            message += "#L0#移除全部的過濾清單物品#l\r\n";
        }
        let iterator = ignoreItemList.iterator();
        if (addSelection) {
            while (iterator.hasNext()) {
                let itemId = iterator.next();
                message += "#L" + itemId + "##v" + itemId + ":##l";
            }
        } else {
            while (iterator.hasNext()) {
                let itemId = iterator.next();
                message += "#v" + itemId + ":##l";
            }
        }
    }
    return message;
}

function hasDropInfo(mobId) {
    let characterIgnoreInfoList = cm.getIgnoreDropItems(true);
    let accountIgnoreInfoList = cm.getIgnoreDropItems(false);
    let hasInfo = false;
    let iterator = cm.getDropByMobId(mobId).iterator();
    while (iterator.hasNext()) {
        let info = iterator.next();
        if (info.getItemId() <= 0) {
            continue;
        }
        if (character && characterIgnoreInfoList.contains(info.getItemId())) {
            continue;
        } else if (!character && accountIgnoreInfoList.contains(info.getItemId())) {
            continue;
        }
        hasInfo = true;
        break;
    }
    return hasInfo;
}

function getAllDropInfoMessage(mobId) {
    let characterIgnoreInfoList = cm.getIgnoreDropItems(true);
    let accountIgnoreInfoList = cm.getIgnoreDropItems(false);
    let iterator = cm.getDropByMobId(mobId).iterator();
    let msg = "#o" + mobId + ":#\r\n\r\n";
    let hasInfo = false;
    while (iterator.hasNext()) {
        let info = iterator.next();
        if (info.getItemId() <= 0) {
            continue;
        }
        if (character && characterIgnoreInfoList.contains(info.getItemId())) {
            continue;
        } else if (!character && accountIgnoreInfoList.contains(info.getItemId())) {
            continue;
        }
        msg += getDropInfoMessage(info);
        hasInfo = true;
    }
    if (hasInfo) {
        return msg;
    } else {
        return "#r怪物沒有掉落物資料";
    }
}

function getDropInfoMessage(info) {
    let msg = "";
    if (info.getChance() <= 0) {
        return msg;
    } else if (info.getItemId() === 0) {
        return msg;
    }
    msg += "#L" + info.getItemId() + "##v" + info.getItemId() + "#";
    return msg;
}
