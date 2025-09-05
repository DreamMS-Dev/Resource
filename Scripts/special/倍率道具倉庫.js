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
        cm.sendSimple("歡迎使用倍率道具倉庫系統\r\n#L0#新增倍率道具至倉庫#l\r\n#L1#從倉庫拿出倍率道具#l");
    } else if (status === 1) {
        sel = selection;
        if (sel === 0) {
            cm.sendSimple("請選擇要放入倉庫的倍率道具:\r\n\r\n" + showInventoryRateItemList());
        } else if (sel === 1) {
            cm.sendSimple(showBankItems());
        }
    } else if (status === 2) {
        sel2 = selection;
        if (sel === 0) {
            let rateItem = cm.getItem(invType, sel2);
            if (rateItem == null) {
                cm.sendNext("未選擇任何倍率道具");
                status = -1;
                sel = -1;
                sel2 = -1;
                return;
            } else if (!hasItemInList(rateItem.getItemId())) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            } else if (rateItem.getExpiration() > 0) {
                cm.sendNext("有期限的道具無法放入");
                cm.dispose();
                return;
            }
            cm.removeSlot(invType, rateItem.getPosition(), 1);
            if (account) {
                cm.getPlayer().addAccountRateItem(rateItem.getItemId());
            } else {
                cm.getPlayer().addRateItem(rateItem.getItemId());
            }
            cm.getPlayer().updateStat();
            cm.sendNext("成功將#v" + rateItem.getItemId() + "#放入倍率道具倉庫");
            status = -1;
            sel = -1;
            sel2 = -1;
        } else if (sel === 1) {
            if (!account && !cm.getPlayer().hasRateItem(sel2)) {
                cm.sendNext("未選擇任何倍率道具");
                status = -1;
                sel = -1;
                sel2 = -1;
                return;
            } else if (account && !cm.getPlayer().hasAccountRateItem(sel2)) {
                cm.sendNext("未選擇任何倍率道具");
                status = -1;
                sel = -1;
                sel2 = -1;
                return;
            } else if (!cm.canHold(sel2, 1)) {
                cm.sendNext("背包已滿");
                cm.dispose();
                return;
            }
            if (account) {
                cm.getPlayer().removeAccountRateItem(sel2);
            } else {
                cm.getPlayer().removeRateItem(sel2);
            }
            cm.gainItem(sel2, 1);
            cm.sendNext("成功把#r#t" + sel2 + ":##k從倉庫中拿出.");
            status = -1;
        }
    }
}

function showBankItems() {
    let message = "";
    let itemInfos = account ? cm.getPlayer().getAccountRateItems() : cm.getPlayer().getRateItems();
    if (itemInfos.isEmpty()) {
        message += "目前沒有任何倍率道具";
    } else {
        message += "以下是目前倉庫的倍率道具(#r點擊圖片取出#k)\r\n";
        let iterator = itemInfos.iterator();
        while (iterator.hasNext()) {
            let itemId = iterator.next();
            message += "#L" + itemId + "##v" + itemId + ":##l";
        }
    }
    return message;
}

function showInventoryRateItemList() {
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
        } else if (!account && cm.getPlayer().hasRateItem(itemId)) {
            continue;
        } else if (account && cm.getPlayer().hasAccountRateItem(itemId)) {
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
        return cm.isCustomRateItem(itemId);
    } else {
        for (let i = 0; i < itemList.length; i++) {
            if (itemList[i] === itemId) {
                return true;
            }
        }
        return false;
    }
}
