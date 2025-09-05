let status = -1, sel = -1, sel2 = -1, sel3 = -1;
let inventoryType = -1;
let trunkItemItemId = -1, trunkItemItemQuantity = -1, trunkItemInventoryItemId = -1;
let backFromAddBank = false;
let backFromRemoveBank = false;
let searchText;
let item;

let inventoryTypeName = ["一般裝備", "點數裝備", "消耗", "裝飾", "其他", "特效"];
let account = true;
let allowSearch = true;
let normalTrunk = true;
let cashEquipmentTrunk = true;
let consumeTrunk = false;
let setupTrunk = true;
let etcTrunk = true;
let effectTrunk = true;

let blockItems = [
    4001008,
    4001044,
    4001045,
    4001046,
    4001047,
    4001048,
    4001049,
    4001050,
    4001051,
    4001052
];

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
        let msg = "\r\n";
        if (allowSearch) {
            msg += "#L100##r搜尋倉庫內道具#l\r\n";
        }
        if (normalTrunk) {
            msg += "#L0##d" + inventoryTypeName[0] + "類倉庫(" + getBankItemInfo(account, 0, null).length + "個道具)#l\r\n";
        }
        if (cashEquipmentTrunk) {
            msg += "#L1##b" + inventoryTypeName[1] + "類倉庫(" + getBankItemInfo(account, 1, null).length + "個道具)#l\r\n";
        }
        if (consumeTrunk) {
            msg += "#L2##r" + inventoryTypeName[2] + "類倉庫(" + getBankItemInfo(account, 2, null).length + "個道具)#l\r\n";
        }
        if (setupTrunk) {
            msg += "#L3##d" + inventoryTypeName[3] + "類倉庫(" + getBankItemInfo(account, 3, null).length + "個道具)#l\r\n";
        }
        if (etcTrunk) {
            msg += "#L4##b" + inventoryTypeName[4] + "類倉庫(" + getBankItemInfo(account, 4, null).length + "個道具)#l\r\n";
        }
        if (effectTrunk) {
            msg += "#L5##r" + inventoryTypeName[5] + "類倉庫(" + getBankItemInfo(account, 5, null).length + "個道具)#l\r\n";
        }
        cm.sendSimple(msg);
    } else if (status === 1) {
        if (mode === 1) {
            sel = selection;
        }
        if (sel === 100) {
            cm.sendGetText("請輸入要搜尋的道具名稱");
            return;
        }
        if (sel === 0 && !normalTrunk) {
            cm.dispose();
            return;
        } else if (sel === 1 && !cashEquipmentTrunk) {
            cm.dispose();
            return;
        } else if (sel === 2 && !consumeTrunk) {
            cm.dispose();
            return;
        } else if (sel === 3 && !setupTrunk) {
            cm.dispose();
            return;
        } else if (sel === 4 && !etcTrunk) {
            cm.dispose();
            return;
        } else if (sel === 5 && !effectTrunk) {
            cm.dispose();
            return;
        }
        inventoryType = Math.max(sel, 1);
        let msg = "\r\n#n#k";
        if (getBankItemInfo(account, sel, null).length > 0) {
            msg += "#d<" + inventoryTypeName[sel] + "倉庫目前有#r" + getBankItemInfo(account, sel, null).length + "#d個道具>\r\n";
        } else {
            msg += "#d<" + inventoryTypeName[sel] + "倉庫>\r\n";
        }
        msg += "#L0##d查看倉庫所有道具\r\n";
        msg += "#L1##b倉庫放入道具\r\n";
        msg += "#L2##r倉庫拿出道具\r\n";
        cm.sendSimple(msg);
    } else if (status === 2) {
        if (mode === 1) {
            sel2 = selection;
            if (backFromAddBank) {
                backFromAddBank = false;
                sel2 = 1;
            } else if (backFromRemoveBank) {
                backFromRemoveBank = false;
                sel2 = 2;
            }
        }
        if (sel === 100) {
            searchText = cm.getText();
            if (getBankItemInfo(account, sel, searchText).length === 0) {
                cm.sendNext("[" + searchText + "]\r\n倉庫內沒有包含該名稱的道具!");
                resetStatus();
                return;
            }
            cm.sendNext("請選擇要拿出的道具\r\n\r\n" + getBankItemMessage(true, account, sel, searchText));
        } else if (sel2 === 0) {
            cm.sendNext(getBankItemMessage(false, account, sel, null));
            resetStatus();
        } else if (sel2 === 1) {
            cm.sendSimple(showInventoryList(inventoryType, sel));
        } else if (sel2 === 2) {
            cm.sendNext("請選擇要拿出的道具\r\n\r\n" + getBankItemMessage(true, account, sel, null));
        }
    } else if (status === 3) {
        if (sel === 100) {
            trunkItemInventoryItemId = selection;
            trunkItemItemId = -1;
            trunkItemItemQuantity = -1;
            let bankItemInfoList = getBankItemInfo(account, sel, searchText);
            for (let i = 0; i < bankItemInfoList.length; i++) {
                let info = bankItemInfoList[i];
                if (info.getInventoryItemId() === trunkItemInventoryItemId) {
                    trunkItemItemId = info.getItemId();
                    trunkItemItemQuantity = info.getQuantity();
                    next = true;
                    break;
                }
            }
            if (trunkItemItemId === -1 || trunkItemItemQuantity === -1) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            }
            if (!cm.canHold(trunkItemItemId, trunkItemItemQuantity)) {
                cm.sendNext("請先檢查背包是否有足夠的空間");
                cm.dispose();
                return;
            }
            if (trunkItemItemId >= 1000000 && trunkItemItemId < 2000000) {
                if (!cm.isCash(trunkItemItemId)) {
                    sel = 0;
                } else {
                    sel = 1;
                }
            } else if (trunkItemItemId >= 2000000 && trunkItemItemId < 3000000) {
                sel = 2;
            } else if (trunkItemItemId >= 3000000 && trunkItemItemId < 4000000) {
                sel = 3;
            } else if (trunkItemItemId >= 4000000 && trunkItemItemId < 5000000) {
                sel = 4;
            } else if (trunkItemItemId >= 5000000 && trunkItemItemId < 5010000) {
                sel = 5;
            }
            sel2 = 2;
            cm.sendYesNo("是否確認要將#b#v" + trunkItemItemId + "##t" + trunkItemItemId + "##k拿出倉庫?");
        } else if (sel2 === 1) {
            if (mode === 1) {
                sel3 = selection;
                if (sel3 <= -1) {
                    cm.sendNext("目前沒有道具可以放入倉庫");
                    resetStatus();
                    return;
                }
                item = cm.getItem(inventoryType, sel3);
                if (item == null || !isAvailableItem(sel, item, item.getItemId(), null)) {
                    cm.sendNext("發生未知的錯誤sel: " + sel + " item: " + item);
                    cm.dispose();
                    return;
                }
            }
            cm.sendYesNo("是否確認要將#b#v" + item.getItemId() + "##t" + item.getItemId() + "##k放入倉庫?")
        } else if (sel2 === 2) {
            if (mode === 1) {
                trunkItemInventoryItemId = selection;
                trunkItemItemId = -1;
                trunkItemItemQuantity = -1;
                let bankItemInfoList = getBankItemInfo(account, sel, null);
                for (let i = 0; i < bankItemInfoList.length; i++) {
                    let info = bankItemInfoList[i];
                    if (info.getInventoryItemId() === trunkItemInventoryItemId) {
                        trunkItemItemId = info.getItemId();
                        trunkItemItemQuantity = info.getQuantity();
                        next = true;
                        break;
                    }
                }
                if (trunkItemItemId === -1 || trunkItemItemQuantity === -1) {
                    cm.sendNext("發生未知的錯誤");
                    cm.dispose();
                    return;
                }
                if (!cm.canHold(trunkItemItemId, trunkItemItemQuantity)) {
                    cm.sendNext("請先檢查背包是否有足夠的空間");
                    cm.dispose();
                    return;
                }
                cm.sendYesNo("是否確認要將#b#v" + trunkItemItemId + "##t" + trunkItemItemId + "##k拿出倉庫?")
            }
        }
    } else if (status === 4) {
        if (sel2 === 1) {
            item = cm.getItem(inventoryType, sel3);
            if (item == null || !isAvailableItem(sel, item, item.getItemId(), null)) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            }
            cm.addBankItem(item, account);
            cm.sendNext("#b#v" + item.getItemId() + "##t" + item.getItemId() + "##k放入倉庫成功!\r\n\r\n" + getBankItemMessage(false, account, sel, null));
            cm.removeSlot(inventoryType, item.getPosition(), true);
            status = 1;
            backFromAddBank = true;
        } else if (sel2 === 2) {
            if (trunkItemInventoryItemId === -1 || trunkItemItemId === -1 || trunkItemItemQuantity === -1) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            }
            let itemObject = cm.getBankItem(trunkItemInventoryItemId, account);
            if (itemObject == null) {
                cm.sendNext("發生未知的錯誤2");
                cm.dispose();
                return;
            }
            if (cm.removeBankItem(trunkItemInventoryItemId, account)) {
                cm.addByItem(itemObject);
                cm.sendNext("#b#v" + trunkItemItemId + "##t" + trunkItemItemId + "##k拿出倉庫成功!\r\n\r\n" + getBankItemMessage(false, account, sel, null));
            } else {
                cm.sendNext("拿出點裝中發生未知的錯誤");
            }
            status = 1;
            backFromRemoveBank = true;
        }
    }
}

function resetStatus() {
    trunkItemInventoryItemId = -1;
    trunkItemItemId = -1;
    trunkItemItemQuantity = -1;
    inventoryType = -1;
    item = null;
    searchText = null;
    sel = -1;
    sel2 = -1;
    sel3 = -1;
    status = -1;
}

function showInventoryList(inventoryType, type) {
    let msg = "請選擇要放入" + inventoryTypeName[type] + "倉庫的道具\r\n";
    let itemList = cm.getItemList(inventoryType);
    let it = itemList.iterator();
    while (it.hasNext()) {
        let item = it.next();
        if (item == null) {
            continue;
        }
        let itemId = item.getItemId();
        let slot_ = item.getPosition();
        if (!isAvailableItem(type, item, itemId, null)) {
            continue;
        }
        msg += "#L" + slot_ + "#" + slot_ + ") #v" + itemId + "##t" + itemId + "#";
        if (itemId >= 1000000 && itemId < 2000000) {
            let pad = item.getWatk();
            let pdd = item.getWdef();
            let mad = item.getMatk();
            let mdd = item.getMdef();
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
        } else if (item.getQuantity() > 1) {
            msg += " x " + item.getQuantity();
        }
        msg += "#l\r\n";
    }
    return msg;
}

function getBankItemMessage(choice, account, type, searchName) {
    let message = "";
    let resultItemList = getBankItemInfo(account, type, searchName);
    if (resultItemList.length === 0) {
        message = "目前倉庫沒有任何資料!";
    } else {
        if (type === 100) {
            message += "\t\t\t\t #r<倉庫搜尋[" + searchName + "]結果>#k\r\n";
        } else {
            message += "\t\t\t\t #r<" + inventoryTypeName[type] + "倉庫>#k\r\n";
        }
        for (let i = 0; i < resultItemList.length; i++) {
            let info = resultItemList[i];
            let itemId = info.getItemId();
            if (choice) {
                message += "#L" + info.getInventoryItemId() + "#";
            }
            message += "#v" + itemId + "#";
            if (itemId >= 1000000 && itemId < 2000000) {
                let pad = info.getWatk();
                let pdd = info.getWdef();
                let mad = info.getMatk();
                let mdd = info.getMdef();
                let hp = info.getHp();
                let mp = info.getMp();
                if (pad > 0) {
                    message += " 物攻: " + pad;
                }
                if (pdd > 0) {
                    message += " 物防: " + pdd;
                }
                if (mad > 0) {
                    message += " 魔攻: " + mad;
                }
                if (mdd > 0) {
                    message += " 魔防: " + mdd;
                }
                if (hp > 0) {
                    message += " HP: " + hp;
                }
                if (mp > 0) {
                    message += " MP: " + mp;
                }
            } else if (info.getQuantity() > 1) {
                message += " x " + info.getQuantity();
            }
            if (info.getExpiration() !== -1) {
                message += " " + info.getStringExpiration();
            }
            message += "\r\n";
        }
    }
    return message;
}

function getBankItemInfo(account, type, searchName) {
    let resultItemList = [];
    let trunkItemList = cm.getBankItems(account);
    let iter = trunkItemList.iterator();
    while (iter.hasNext()) {
        let item = iter.next();
        let itemId = item.getItemId();
        if (isAvailableItem(type, item, itemId, searchName)) {
            resultItemList.push(item);
        }
    }
    return resultItemList;
}

function isAvailableItem(type, item, itemId, searchName) {
    if (isBlockItem(itemId)) {
        return false;
    }
    if (type === 0) {
        if (itemId >= 1000000 && itemId < 2000000 && !item.isCash()) {
            return true;
        }
    } else if (type === 1) {
        if (itemId >= 1000000 && itemId < 2000000 && item.isCash()) {
            return true;
        }
    } else if (type === 2) {
        if (itemId >= 2000000 && itemId < 3000000) {
            return true;
        }
    } else if (type === 3) {
        if (itemId >= 3000000 && itemId < 4000000) {
            return true;
        }
    } else if (type === 4) {
        if (itemId >= 4000000 && itemId < 5000000) {
            return true;
        }
    } else if (type === 5) {
        if (itemId >= 5010000 && itemId < 5020000) {
            return true;
        }
    } else if (type === 100) {
        if (item.getItemName() != null && item.getItemName().contains(searchName)) {
            return true;
        }
    }
    return false;
}

function isBlockItem(itemId) {
    for (let i = 0; i < blockItems.length; i++) {
        if (blockItems[i] === itemId) {
            return true;
        }
    }
    return false;
}