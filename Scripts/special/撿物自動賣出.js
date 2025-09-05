let status = -1;

function start() {
    removeAbnormalItem();
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
        let message = "有什麼我能為您服務的嗎?\r\n";
        message += "#L0##d開關撿物自動賣出功能: " + (cm.getPlayer().canAutoSellOnPickUp() ? "#r已啟用" : "#b已關閉") + "\r\n";
        message += "#L1##d開關撿物自動賣出顯示訊息功能: " + (cm.getPlayer().canAutoSellMessageOnPickUp() ? "#r已啟用" : "#b已關閉") + "\r\n";
        message += "#L2##d新增不自動賣出物品\r\n";
        message += "#L3##d整理不自動賣出物品 (目前#b" + cm.getPlayer().getAutoSellOnPickUpBlockItems().size() + "#d個物品)\r\n";
        cm.sendSimple(message);
    } else if (status === 1) {
        sel = selection;
        if (sel === 0) {
            cm.getPlayer().setAutoSellOnPickUp();
            status = -1;
            action(1, 0, 0);
        } else if (sel === 1) {
            cm.getPlayer().setAutoSellMessageOnPickUp();
            status = -1;
            action(1, 0, 0);
        } else if (sel === 2) {
            cm.sendGetText("請輸入要不自動賣出的物品名稱:");
        } else if (sel === 3) {
            if (!hasItemList()) {
                cm.sendNext("目前沒有任何不自動賣出清單");
                status = -1;
            } else {
                cm.sendSimple(showItemList());
            }
        }
    } else if (status === 2) {
        if (sel === 2) {
            cm.sendOk(cm.searchItem(cm.getText(), false, false, false, true));
        } else if (sel === 3) {
            sel2 = selection;
            if (sel2 < 0) {
                cm.dispose();
            } else if (sel2 === 0) {
                cm.getPlayer().removeAutoSellOnPickUpBlockItem(sel2, true);
                cm.sendNext("已經清除完成");
                status = -1;
            } else {
                cm.getPlayer().removeAutoSellOnPickUpBlockItem(sel2, false);
                cm.sendNext("成功把#r#t" + sel2 + ":##k從清單移除.");
                status = -1;
            }
        }
    } else if (status === 3) {
        if (selection <= 0 || !cm.itemExists(selection)) {
            cm.dispose();
            return;
        }
        cm.getPlayer().addAutoSellOnPickUpBlockItem(selection);
        cm.sendNext("成功添加#r#t" + selection + ":##k到不自動賣出清單內.");
        status = -1;
    }
}

function hasItemList() {
    return !cm.getPlayer().getAutoSellOnPickUpBlockItems().isEmpty();
}

function showItemList() {
    let message = "";
    let infos = cm.getPlayer().getAutoSellOnPickUpBlockItems();
    if (infos.isEmpty()) {
        message += "目前沒有任何不自動賣出清單";
    } else {
        message += "以下是目前的不自動賣出清單(#r點擊圖片移除#k)\r\n";
        message += "#L0#移除全部的不自動賣出清單物品#l\r\n";
        let iter = infos.iterator();
        while (iter.hasNext()) {
            let itemId = iter.next();
            message += "#L" + itemId + "##v" + itemId + ":##l";
        }
    }
    return message;
}

function removeAbnormalItem() {
    let iter = cm.getPlayer().getAutoSellOnPickUpBlockItems().iterator();
    while (iter.hasNext()) {
        let itemId = iter.next();
        if (!cm.itemExists(itemId)) {
            cm.getPlayer().removeAutoSellOnPickUpBlockItem(itemId, false);
        }
    }
}