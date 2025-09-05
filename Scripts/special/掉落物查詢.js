let status = -1, sel, sel2, sel3;
let displayChanceForPlayer = false;
let lastSearch = null;

function resetValue() {
    status = -1;
    sel = -1;
    sel2 = -1;
    sel3 = -1;
}

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === 0) {
        if (status === 1) {
            lastSearch = null;
        }
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status === 0) {
        let msg = "#d請選擇使用的功能:\r\n";
        msg += "#L1##b怪物查找掉落物\r\n";
        msg += "#L2##b掉落物查找怪物\r\n";
        cm.sendSimple(msg);
    } else if (status === 1) {
        if (mode === 1) {
            sel = selection;
        }
        if (sel === 1) { // mobId -> itemId
            cm.sendGetText("請輸入怪物名稱:");
        } else if (sel === 2) { // itemId -> mobId
            cm.sendGetText("請輸入道具名稱:");
        }
    } else if (status === 2) {
        if (sel === 1) {
            if (lastSearch == null) {
                lastSearch = cm.getText();
            }
            let mobIds = cm.getSearchData(4, lastSearch);
            if (mobIds != null) {
                let msg = "[" + lastSearch + "] #b搜尋結果#k:\r\n\r\n";
                let x = 0;
                for (let i = 0; i < mobIds.length; i++) {
                    if (mobIds[i] >= 8810000 && mobIds[i] <= 8810017) {
                        continue;
                    } else if (mobIds[i] >= 8810024 && mobIds[i] <= 8810026) {
                        continue;
                    } else if (mobIds[i] >= 8800000 && mobIds[i] <= 8800001) {
                        continue;
                    } else if (mobIds[i] >= 8800003 && mobIds[i] <= 8800010) {
                        continue;
                    }
                    x++;
                    msg += "#L" + mobIds[i] + "##d#o" + mobIds[i] + ":##k";
                    if (((x % 2) === 0)) {
                        msg += "\r\n";
                    }
                    if (x >= 150) {
                        msg += "結果過多，無法顯示";
                        break;
                    }
                }
                cm.sendSimple(msg);
            } else {
                cm.sendNext("#r沒有搜尋結果");
                resetValue();
                return;
            }
        } else if (sel === 2) {
            if (lastSearch == null) {
                lastSearch = cm.getText();
            }
            let itemIds = cm.getSearchData(1, lastSearch);
            if (itemIds != null) {
                let msg = "[" + lastSearch + "] #b搜尋結果#k:\r\n\r\n";
                let x = 0;
                for (let i = 0; i < itemIds.length; i++) {
                    if (cm.isCash(itemIds[i])) {
                        continue;
                    } else if (itemIds[i] === 1002140) {
                        continue;
                    } else if (itemIds[i] === 1002959) {
                        continue;
                    } else if (itemIds[i] === 1003142) {
                        continue;
                    } else if (itemIds[i] === 1042003) {
                        continue;
                    } else if (itemIds[i] === 1062007) {
                        continue;
                    } else if (itemIds[i] === 1322013) {
                        continue;
                    }
                    x++;
                    msg += "#L" + itemIds[i] + "##d#t" + itemIds[i] + ":##k";
                    if (((x % 2) === 0)) {
                        msg += "\r\n";
                    }
                    if (x >= 150) {
                        msg += "結果過多，無法顯示";
                        break;
                    }
                }
                cm.sendSimple(msg);
            } else {
                cm.sendNext("#r沒有搜尋結果");
                resetValue();
                return;
            }
        }
    } else if (status === 3) {
        if (mode === 1) {
            sel2 = selection;
        }
        if (sel === 1) { // mobId -> itemId
            let mobId = sel2;
            let dropInfos = cm.getDropByMobId(mobId);
            let iter = dropInfos.iterator();
            let msg = "#o" + mobId + ":#\r\n\r\n";
            let hasInfo = false;
            while (iter.hasNext()) {
                msg += getDropInfoMessage(iter.next(), false, false);
                hasInfo = true;
            }
            if (hasInfo) {
                cm.sendSimple(msg);
            } else {
                cm.sendNext("#r沒有掉落物資料");
                resetValue()
                return;
            }
        } else if (sel === 2) { // itemId -> mobId
            let itemId = sel2;
            let dropInfos = cm.getDropByItemId(itemId);
            let iter = dropInfos.iterator();
            let msg = "#v" + itemId + ":##d#t" + itemId + ":#\r\n\r\n";
            let hasInfo = false;
            while (iter.hasNext()) {
                msg += getDropInfoMessage(iter.next(), true, false);
                hasInfo = true;
            }
            if (hasInfo) {
                cm.sendSimple(msg);
            } else {
                cm.sendNext("#r沒有掉落物資料");
                resetValue()
                return;
            }
        }
    } else if (status == 4) {
        if (mode === 1) {
            sel3 = selection;
        }
        if (sel === 2) { // mobId -> itemId -> mobId
            let mobId = sel3;
            let dropInfos = cm.getDropByMobId(mobId);
            let iter = dropInfos.iterator();
            let msg = "#o" + mobId + ":#\r\n\r\n";
            let hasInfo = false;
            while (iter.hasNext()) {
                msg += getDropInfoMessage(iter.next(), false, false);
                hasInfo = true;
            }
            if (hasInfo) {
                cm.sendSimple(msg);
            } else {
                cm.sendNext("#r沒有掉落物資料");
                resetValue()
                return;
            }
        } else if (sel === 1) { // itemId -> mobId -> itemId
            let itemId = sel3;
            let dropInfos = cm.getDropByItemId(itemId);
            let iter = dropInfos.iterator();
            let msg = "#v" + itemId + ":##d#t" + itemId + ":#\r\n\r\n";
            let hasInfo = false;
            while (iter.hasNext()) {
                msg += getDropInfoMessage(iter.next(), true, false);
                hasInfo = true;
            }
            if (hasInfo) {
                cm.sendSimple(msg);
            } else {
                cm.sendNext("#r沒有掉落物資料");
                resetValue()
                return;
            }
        }
    } else {
        cm.dispose();
    }
}

function getDropInfoMessage(info, byItemId, showPicture) {
    let msg = "";
    if (info.getChance() <= 0) {
        return msg;
    } else if (info.getItemId() === 0) { // meso
        return msg;
    }

    msg += "#d";
    if (byItemId) {
        msg += "#L" + info.getDropperId() + "#";
        msg += cm.getRightPaddedStr(info.getDropperName(), " ", 25);
    } else {
        msg += "#L" + info.getItemId() + "#";
        if (showPicture) {
            msg += "#v" + info.getItemId() + ":# #t" + info.getItemId() + ":# ";
        } else {
            // msg += cm.getRightPaddedStr(info.getItemName(), " ", 25);
            msg += "#t" + info.getItemId() + ":# ";
        }
    }
    if (info.getQuestId() > 0) {
        msg += "(任務-#b" + info.getQuestName() + "#k)";
    }
    if (displayChanceForPlayer || (!displayChanceForPlayer && !cm.getPlayer().isPlayer())) {
        msg += "#k機率 - #r" + (info.getChance() >= 999999 ? 100 : (info.getChance() / 10000.0)) + "#k%";
    }
    msg += "#l\r\n";
    return msg;
}
