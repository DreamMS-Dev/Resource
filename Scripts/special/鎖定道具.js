var status = -1;

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
        cm.sendSimple("親愛的 #h \r\n 我是#p9010000#，有什麼我能為您服務的嗎?\r\n#L0#新增物品鎖定#l\r\n#L1#整理物品鎖定清單#l");
    } else if (status == 1) {
        sel = selection;
        if (sel == 0) {
            cm.sendGetText("請輸入要鎖定的物品名稱:");
        } else if (sel == 1) {
            cm.sendSimple(showLockItems());
        }
    } else if (status == 2) {
        if (sel == 0) {
            cm.sendOk(cm.searchItem(cm.getText(), false, false, false, true));
        } else if (sel == 1) {
            twosel = selection;
            if (twosel < 0) {
                cm.dispose();
                return;
            } else if (twosel == 0) {
                cm.getPlayer().removeLockItem(twosel, true);
                cm.sendNext("已經清除完成");
                status = -1;
            } else {
                cm.getPlayer().removeLockItem(twosel, false);
                cm.sendNext("成功把#r#t" + twosel + ":##k從物品鎖定清單移除.");
                status = -1;
            }
        }
    } else if (status == 3) {
        if (selection < 0) {
            cm.dispose();
            return;
        }
        cm.getPlayer().addLockItem(selection);
        cm.sendNext("成功添加#r#t" + selection + ":##k到物品鎖定清單內.");
        status = -1;
    }
}
function showLockItems() {
    var message = "";
    var infos = cm.getPlayer().getLockItems();
    if (infos.isEmpty()) {
        message += "目前沒有任何鎖定清單";
    } else {
        message += "以下是目前的鎖定清單(#r點擊圖片移除#k)\r\n";
        message += "#L0#移除全部的鎖定清單物品#l\r\n";
        var iter = infos.iterator();
        while (iter.hasNext()) {
            var itemId = iter.next();
            message += "#L" + itemId + "##v" + itemId + ":##l";
        }
    }
    return message;
}