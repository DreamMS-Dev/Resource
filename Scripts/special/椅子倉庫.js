let status = -1, sel, sel2;
let account = false; // 帳號

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        cm.sendSimple("歡迎使用椅子倉庫系統\r\n#L0#新增椅子至倉庫#l\r\n#L1#從倉庫拿出椅子#l");
    } else if (status == 1) {
        sel = selection;
        if (sel == 0) {
            cm.sendSimple("請選擇要放入倉庫的椅子:\r\n\r\n" + showInventoryChairList());
        } else if (sel == 1) {
            cm.sendSimple(showChairBankItems());
        }
    } else if (status == 2) {
        sel2 = selection;
        if (sel == 0) {
            let chairItem = cm.getItem(3, sel2);
            if (chairItem == null) {
                cm.sendNext("未選擇任何椅子");
                status = -1;
                sel = -1;
                sel2 = -1;
                return;
            } else if (!isChair(chairItem.getItemId())) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            }
            cm.removeSlot(3, chairItem.getPosition(), 1);
            if (account) {
                cm.getPlayer().addCustomAccountChairBank(chairItem.getItemId());
            } else {
                cm.getPlayer().addCustomChairBank(chairItem.getItemId());
            }
            cm.sendNext("成功將#v" + chairItem.getItemId() + "#放入椅子倉庫");
            status = -1;
            sel = -1;
            sel2 = -1;
        } else if (sel == 1) {
            if (!account && !cm.getPlayer().hasCustomChairInBank(sel2)) {
                cm.sendNext("未選擇任何椅子");
                status = -1;
                sel = -1;
                sel2 = -1;
                return;
            } else if (account && !cm.getPlayer().hasCustomAccountChairInBank(sel2)) {
                cm.sendNext("未選擇任何椅子");
                status = -1;
                sel = -1;
                sel2 = -1;
                return;
            } else if (!cm.canHold(sel2, 1)) {
                cm.sendNext("背包已滿");
                cm.dispose();
                return;
            } else {
                if (account) {
                    cm.getPlayer().removeCustomAccountChairBank(sel2);
                } else {
                    cm.getPlayer().removeCustomChairBank(sel2);
                }
                cm.gainItem(sel2, 1);
                cm.sendNext("成功把#r#t" + sel2 + ":##k從倉庫中拿出.");
                status = -1;
            }
        }
    }
}

function showChairBankItems() {
    let message = "";
    let itemInfos = account ? cm.getPlayer().getCustomAccountChairBank() : cm.getPlayer().getCustomChairBank();
    if (itemInfos.isEmpty()) {
        message += "目前沒有任何椅子";
    } else {
        message += "以下是目前倉庫的椅子(#r點擊圖片取出#k)\r\n";
        let iterator = itemInfos.iterator();
        while (iterator.hasNext()) {
            let itemId = iterator.next();
            message += "#L" + itemId + "##v" + itemId + ":##l";
        }
    }
    return message;
}

function showInventoryChairList() {
    let message = "";
    let items = cm.getItemList(3);
    let iterator = items.iterator();
    let tmp = [];
    while (iterator.hasNext()) {
        let item = iterator.next();
        if (item == null) {
            continue;
        }
        let itemId = item.getItemId();
        if (!isChair(itemId)) {
            continue;
        } else if (!account && cm.getPlayer().hasCustomChairInBank(itemId)) {
            continue;
        } else if (account && cm.getPlayer().hasCustomAccountChairInBank(itemId)) {
            continue;
        }

        let next = true;
        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i] == itemId) {
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

function isChair(itemId) {
    return parseInt(itemId / 10000) == 301;
}
