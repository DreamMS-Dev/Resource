var status = -1;
var sel = -1, typeSel = -1;
var exceptItemIds = []; // 不可使用藥水
var chr;
var potionItemId;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    chr = cm.getPlayer();
    if (mode == 1) {
        status++;
    } else if (mode == 0) {
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status <= -1) {
        cm.dispose();
    } else if (status === 0) {
        var hpConsume = chr.getAutoPotionHpItemId();
        var mpConsume = chr.getAutoPotionMpItemId();
        var msg = "#e自動喝水#n\r\n";
        msg += "#b#L0#自動補血:" + (hpConsume < 2000000 ? "無" : "#i" + hpConsume + "##t" + hpConsume + "#，血量:" + chr.getAutoPotionHpValue()) + "#l\r\n";
        msg += "#b#L1#自動補魔:" + (mpConsume < 2000000 ? "無" : "#i" + mpConsume + "##t" + mpConsume + "#，魔量:" + chr.getAutoPotionMpValue()) + "#l\r\n";
        msg += "#b#L2#自動喝水開關:" + (cm.getPlayer().canAutoPotion() ? "#r開啟\r\n" : "關閉\r\n");
        msg += "#b#L3#重設所有設定#l\r\n";
        msg += "#b#L4#重設補血設定#l\r\n";
        msg += "#b#L5#重設補魔設定#l\r\n";
        cm.sendSimple(msg);
    } else if (status == 1) {
        if (mode == 1) {
            typeSel = selection;
        }
        switch (typeSel) {
            case 0:
            case 1:
                cm.sendSimple(getPotionList());
                break;
            case 2:
                chr.toggleAutoPotion(!chr.canAutoPotion());
                cm.sendNext("目前喝水系統已經" + (chr.canAutoPotion() ? "#r開啟#k" : "#b關閉#k"));
                status = -1;
                break;
            case 3:
                chr.setAutoPotionHp(0, 0);
                chr.setAutoPotionMp(0, 0);
                cm.sendNext("重設目前#d所有#k設定成功");
                status = -1;
                break;
            case 4:
                chr.setAutoPotionHp(0, 0);
                cm.sendNext("重設目前#d血量#k設定成功");
                status = -1;
                break;
            case 5:
                chr.setAutoPotionMp(0, 0);
                cm.sendNext("重設目前#dMP#k設定成功");
                status = -1;
                break;
            default:
                cm.dispose();
                break;
        }
    } else if (status == 2) {
        if (mode == 1) {
            if (selection < 0 || cm.getItem(2, selection) == null) {
                cm.dispose();
                return;
            }
            potionItemId = cm.getItem(2, selection).getItemId();
            if (isExceptItem(potionItemId)) {
                cm.dispose();
                return;
            } else if (!isPotion(potionItemId)) {
                cm.dispose();
                return;
            }
        }
        switch (typeSel) {
            case 0:
                chr.setAutoPotionHp(potionItemId, -1);
                cm.sendGetNumber("目前指定藥水:#v" + potionItemId + "#\r\n\r\n請輸入最低補充血量", 100, 100, cm.getPlayer().getCurrentMaxHp());
                break;
            case 1:
                chr.setAutoPotionMp(potionItemId, -1);
                cm.sendGetNumber("目前指定藥水:#v" + potionItemId + "#\r\n\r\n請輸入最低補充魔量", 100, 100, cm.getPlayer().getCurrentMaxMp());
                break;
            default:
                cm.dispose();
                break;
        }
    } else if (status == 3) {
        if (selection < 100 || (selection > (typeSel == 0 ? cm.getPlayer().getCurrentMaxHp() : cm.getPlayer().getCurrentMaxMp()))) {
            cm.dispose();
            return;
        }
        if (typeSel == 0) {
            chr.setAutoPotionHp(-1, selection);
            cm.sendNext("藥水:#v" + potionItemId + "#\r\n目前最低血量:" + selection);
        } else if (typeSel == 1) {
            chr.setAutoPotionMp(-1, selection);
            cm.sendNext("藥水:#v" + potionItemId + "#\r\n目前最低魔量:" + selection);
        } else {
            cm.dispose();
            return;
        }
        potionItemId = -1;
        status = -1;
    } else {
        cm.dispose();
    }
}

function isExceptItem(itemid) {
    for (var i = 0; i < exceptItemIds.length; i++) {
        var id = exceptItemIds[i];
        if (itemid == id) {
            return true;
        }
    }
    return false;
}

function isPotion(itemId) {
    if (itemId > 2022034) {
        return false;
    }
    switch (Math.floor(itemId / 10000)) {
        case 200:
        case 201:
        case 202:
            return true;
    }
    return false;
}

function getPotionList() {
    var msg = "請選擇藥水:\r\n";
    var items = cm.getItemList(2);
    var it = items.iterator();
    while (it.hasNext()) {
        var item = it.next();
        if (item == null) {
            continue;
        }
        if (isExceptItem(item.getItemId())) {
            continue;
        } else if (!isPotion(item.getItemId())) {
            continue;
        }
        msg += "#L" + item.getPosition() + "##v" + item.getItemId() + "#";
        if (item.getQuantity() > 1) {
            msg += " x " + item.getQuantity();
        }
        msg += " #l\r\n";
    }
    return msg;
}
