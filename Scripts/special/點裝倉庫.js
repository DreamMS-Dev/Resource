let status = -1, sel = -1, sel2 = -1, itemId;
let item;

let showExpiration = true; // 顯示倉庫內裝備期限
let newLineAfterItem = true; // 顯示倉庫道具時換行
let character = true; // true = 角色, false = 帳號

function start() {
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
    if (status <= -1) {
        cm.dispose();
    } else if (status === 0) {
        let msg = "\r\n#n#k";
        if (getCashEquipmentBank().size() > 0) {
            msg += "#d<目前有#r" + getCashEquipmentBank().size() + "#d件點裝在點裝倉庫>\r\n";
        }
        msg += "#k請選擇要使用的功能:\r\n";
        msg += "#L0##d查看點裝倉庫\r\n";
        msg += "#L1##b倉庫放入點裝\r\n";
        msg += "#L10##b倉庫放入所有點裝\r\n";
        msg += "#L2##r倉庫拿出點裝\r\n";
        msg += "#L20##r倉庫拿出所有點裝\r\n";
        cm.sendSimple(msg);
    } else if (status === 1) {
        if (mode === 1) {
            sel = selection;
        }
        if (sel === 0) {
            cm.sendNext(getCashEquipBankInfo(false));
            resetStatus();
        } else if (sel === 1) {
            cm.sendSimple(invList(1));
        } else if (sel === 10) {
            cm.sendYesNo("是否要放入所有點裝至倉庫?");
            status = 2;
        } else if (sel === 2) {
            cm.sendNext("請選擇要拿出的點裝\r\n\r\n" + getCashEquipBankInfo(true));
        } else if (sel === 20) {
            cm.sendYesNo("是否要從倉庫拿出所有點裝?");
            status = 2;
        }
    } else if (status === 2) {
        if (sel === 1) {
            if (mode === 1) {
                sel2 = selection;
                if (sel2 <= -1) {
                    cm.sendNext("目前沒有裝備可以放入點裝倉庫");
                    resetStatus();
                    return;
                }
                item = cm.getItem(1, sel2);
                if (item == null) {
                    cm.sendNext("發生未知的錯誤");
                    cm.dispose();
                    return;
                }
            }
            cm.sendYesNo("是否確認要將點裝#b#v" + item.getItemId() + "##t" + item.getItemId() + "##k放入點裝倉庫?")
        } else if (sel === 2) {
            if (mode === 1) {
                itemId = selection;
                if (!hasCashEquipmentInBank(itemId)) {
                    cm.sendNext("發生未知的錯誤");
                    resetStatus();
                    return;
                } else if (!cm.canHold(itemId, 1)) {
                    cm.sendNext("請先檢查背包是否有足夠的空間");
                    cm.dispose();
                    return;
                }
                cm.sendYesNo("是否確認要將#b#v" + itemId + "##t" + itemId + "##k拿出點裝倉庫?")
            }
        }
    } else if (status === 3) {
        if (sel === 1) {
            if (item == null) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            }
            addCashEquipmentToBank(item);
            cm.sendNext("#b#v" + item.getItemId() + "##t" + item.getItemId() + "##k放入點裝倉庫成功!\r\n\r\n" + getCashEquipBankInfo(false));
            cm.removeSlot(1, sel2, 1);
            resetStatus();
        } else if (sel === 2) {
            if (!hasCashEquipmentInBank(itemId)) {
                cm.sendNext("發生未知的錯誤");
                resetStatus();
                return;
            }
            let cashEquipmentInfo = removeCashEquipmentFromBank(itemId);
            let newEquip = cm.getEquipById(itemId);
            newEquip.setCustomCashEquipmentInfo(cashEquipmentInfo);
            cm.addByItem(newEquip);
            cm.sendNext("#b#v" + itemId + "##t" + itemId + "##k拿出點裝倉庫成功!\r\n\r\n" + getCashEquipBankInfo(false));
            resetStatus();
        } else if (sel === 10) {
            let availableItemList = [];
            let inventoryItemList = cm.getItemList(1);
            let it = inventoryItemList.iterator();
            while (it.hasNext()) {
                let item = it.next();
                if (item == null) {
                    continue;
                }
                if (!item.isCash()) {
                    continue;
                } else if (hasCashEquipmentInBank(item.getItemId())) {
                    continue;
                }
                availableItemList.push(item);
            }
            if (availableItemList.length === 0) {
                cm.sendNext("背包內沒有可放入倉庫的點裝");
                resetStatus();
                return;
            }
            let msg = "";
            for (let i = 0; i < availableItemList.length; i++) {
                let item = availableItemList[i];
                addCashEquipmentToBank(item);
                msg += "#v" + item.getItemId() + "#";
                cm.removeSlot(1, item.getPosition(), 1);
            }
            msg += "#k\r\n放入倉庫" + availableItemList.length + "個道具成功!";
            cm.sendNext(msg);
            resetStatus();
        } else if (sel === 20) {
            let availableItemList = [];
            let cashEquipmentInfoList = getCashEquipmentBank();
            if (cashEquipmentInfoList.isEmpty()) {
                cm.sendNext("倉庫內沒有點裝");
                resetStatus();
                return;
            }

            let iter = cashEquipmentInfoList.iterator();
            while (iter.hasNext()) {
                let cashEquipmentInfo = iter.next();
                availableItemList.push(cashEquipmentInfo.getItemId());
            }

            let size = 0;
            let msg = "";
            let canHold = true;
            for (let i = 0; i < availableItemList.length; i++) {
                let itemId = availableItemList[i];
                if (cm.canHold(itemId)) {
                    size++;
                    msg += "#v" + itemId + "#";
                    let cashEquipmentInfo = removeCashEquipmentFromBank(itemId);
                    let newEquip = cm.getEquipById(itemId);
                    newEquip.setCustomCashEquipmentInfo(cashEquipmentInfo);
                    cm.addByItem(newEquip);
                } else {
                    canHold = false;
                }
            }
            msg += "\r\n#k已從倉庫成功拿出#r" + size + "#k個道具!";
            if (!canHold) {
                msg += "\r\n但是有部分道具因為背包空間不足而無法拿出";
            }
            cm.sendNext(msg);
            resetStatus();
        }
    }
}

function resetStatus() {
    item = null;
    itemId = -1;
    sel = -1;
    sel2 = -1;
    status = -1;
}

function invList(invType) {
    let msg = "請選擇要放入點裝倉庫的裝備\r\n";
    let items = cm.getItemList(invType);
    let it = items.iterator();
    while (it.hasNext()) {
        let item = it.next();
        if (item == null) {
            continue;
        }
        let slot_ = item.getPosition();
        if (invType === 1) {
            if (!item.isCash()) {
                continue;
            } else if (hasCashEquipmentInBank(item.getItemId())) {
                continue;
            }
            let itemId = item.getItemId();
            let pad = item.getWatk();
            let pdd = item.getWdef();
            let mad = item.getMatk();
            let mdd = item.getMdef();
            msg += "#L" + slot_ + "#" + slot_ + ") #v" + itemId + "##t" + itemId + "#";
            if (pad > 0) {
                msg += "物攻: " + pad;
            }
            if (pdd > 0) {
                msg += " 物防: " + pdd;
            }
            if (mad > 0) {
                msg += " 魔攻: " + mad;
            }
            if (mdd > 0) {
                msg += " 魔防: " + mdd;
            }
        }
        msg += "#l\r\n";
    }
    return msg;
}

function getCashEquipBankInfo(choice) {
    let message = "";
    let cashEquipmentInfoList = getCashEquipmentBank();
    if (cashEquipmentInfoList.isEmpty()) {
        message = "目前沒有任何點裝倉庫資料!";
    } else {
        message += "\t\t\t\t #r<點裝倉庫>#k\r\n";
        let iter = cashEquipmentInfoList.iterator();
        while (iter.hasNext()) {
            let cashEquipmentInfo = iter.next();
            let itemId = cashEquipmentInfo.getItemId();
            let pad = cashEquipmentInfo.getPad();
            let pdd = cashEquipmentInfo.getPdd();
            let mad = cashEquipmentInfo.getMad();
            let mdd = cashEquipmentInfo.getMdd();
            let hp = cashEquipmentInfo.getHp();
            let mp = cashEquipmentInfo.getMp();
            let expiration = cashEquipmentInfo.getStringExpiration();
            if (choice) {
                message += "#L" + itemId + "#";
            }
            message += "#v" + itemId + "#";
            if (pad > 0) {
                message += " 物攻: " + pad;
            }
            if (pdd > 0) {
                message += " 物防: " + pdd;
            }
            if (mad > 0) {
                message += " 魔攻: " + mad;
            }
            if (hp > 0) {
                message += " HP: " + hp;
            }
            if (mp > 0) {
                message += " MP: " + mp;
            }
            if (showExpiration) {
                message += " " + expiration;
            }
            if (newLineAfterItem) {
                message += "\r\n";
            }
        }
    }
    return message;
}

function addCashEquipmentToBank(item) {
    if (character) {
        return cm.getPlayer().addCashEquipmentToBank(item);
    } else {
        return cm.getPlayer().addAccountCashEquipmentToBank(item);
    }
}

function removeCashEquipmentFromBank(itemId) {
    if (character) {
        return cm.getPlayer().removeCashEquipmentFromBank(itemId);
    } else {
        return cm.getPlayer().removeAccountCashEquipmentFromBank(itemId);
    }
}

function getCashEquipmentBank() {
    if (character) {
        return cm.getPlayer().getCashEquipmentBank();
    } else {
        return cm.getPlayer().getAccountCashEquipmentBank();
    }
}

function hasCashEquipmentInBank(itemId) {
    if (character) {
        return cm.getPlayer().hasCashEquipmentInBank(itemId);
    } else {
        return cm.getPlayer().hasAccountCashEquipmentInBank(itemId);
    }
}