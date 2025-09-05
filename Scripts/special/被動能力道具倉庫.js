let status = -1, sel, sel2;
let useSystemItemList = false;
let account = false;
let itemList = [4000000, 4000001, 4000010, 4032056];
let invType = 4;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status === 0) {
        cm.sendSimple("歡迎使用被動能力道具倉庫系統\r\n#L0#新增被動能力道具至倉庫#l\r\n#L1#從倉庫拿出被動能力道具#l");
    } else if (status === 1) {
        sel = selection;
        if (sel === 0) {
            cm.sendSimple("請選擇要放入倉庫的被動能力道具:\r\n\r\n" + showInventoryPassiveItemList());
        } else if (sel === 1) {
            cm.sendSimple(showBankItems());
        }
    } else if (status === 2) {
        sel2 = selection;
        if (sel === 0) {
            let passiveItem = cm.getItem(invType, sel2);
            if (passiveItem == null) {
                cm.sendNext("未選擇任何被動能力道具");
                status = -1;
                sel = -1;
                sel2 = -1;
                return;
            } else if (!hasItemInList(passiveItem.getItemId())) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            } else if (passiveItem.getExpiration() > 0) {
                cm.sendNext("有期限的道具無法放入");
                cm.dispose();
                return;
            }
            cm.removeSlot(invType, passiveItem.getPosition(), 1);
            if (account) {
                cm.getPlayer().addAccountPassiveItem(passiveItem.getItemId());
            } else {
                cm.getPlayer().addPassiveItem(passiveItem.getItemId());
            }
            cm.getPlayer().updateStat();
            cm.getPlayer().updateCustomDamageCap();
            cm.sendNext("成功將#v" + passiveItem.getItemId() + "#放入被動能力道具倉庫");
            status = -1;
            sel = -1;
            sel2 = -1;
        } else if (sel === 1) {
            if (!account && !cm.getPlayer().hasPassiveItem(sel2)) {
                cm.sendNext("未選擇任何被動能力道具");
                status = -1;
                sel = -1;
                sel2 = -1;
            } else if (account && !cm.getPlayer().hasAccountPassiveItem(sel2)) {
                cm.sendNext("未選擇任何被動能力道具");
                status = -1;
                sel = -1;
                sel2 = -1;
            } else if (!cm.canHold(sel2, 1)) {
                cm.sendNext("背包已滿");
                cm.dispose();
            } else {
                if (account) {
                    cm.getPlayer().removeAccountPassiveItem(sel2);
                } else {
                    cm.getPlayer().removePassiveItem(sel2);
                }
                cm.gainItem(sel2, 1);
                cm.getPlayer().updateStat();
                cm.getPlayer().updateCustomDamageCap();
                cm.sendNext("成功把#r#t" + sel2 + ":##k從倉庫中拿出.");
                status = -1;
            }
        }
    }
}

function showBankItems() {
    let message = "";
    let itemInfos = account ? cm.getPlayer().getAccountPassiveItems() : cm.getPlayer().getPassiveItems();
    if (itemInfos.isEmpty()) {
        message += "目前沒有任何被動能力";
    } else {
        message += "以下是目前倉庫的被動能力(#r點擊圖片取出#k)\r\n";
        let iterator = itemInfos.iterator();
        while (iterator.hasNext()) {
            let itemId = iterator.next();
            message += "#L" + itemId + "##v" + itemId + ":##l";
        }
    }
    return message;
}

function showInventoryPassiveItemList() {
    let message = "";
    let items = cm.getItemList(invType);
    let iterator = items.iterator();
    let tmp = [];
    while (iterator.hasNext()) {
        let item = iterator.next();
        if (item == null) {
            continue;
        }
        let itemId = item.getItemId();
        if (!hasItemInList(itemId)) {
            continue;
        } else if (!account && cm.getPlayer().hasPassiveItem(itemId)) {
            continue;
        } else if (account && cm.getPlayer().hasAccountPassiveItem(itemId)) {
            continue;
        } else if (item.getExpiration() > 0) {
            continue;
        }

        let next = true;
        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i] === itemId) {
                next = false;
                break;
            }
        }
        if (!next) {
            continue;
        }
        tmp.push(itemId);
        message += "#L" + item.getPosition() + "##v" + itemId + ":##l";
    }
    return message;
}

function hasItemInList(itemId) {
    if (useSystemItemList) {
        return cm.isPassiveStatItem(itemId);
    } else {
        for (let i = 0; i < itemList.length; i++) {
            if (itemList[i] === itemId) {
                return true;
            }
        }
        return false;
    }
}
