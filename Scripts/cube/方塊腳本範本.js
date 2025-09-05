let debug = true, itemId = -1;
let slot = -1;
let requestItemId = 2000000; // 方塊代碼

// 觸發方法為從別的腳本使用
// cm.dispose();
// cm.openCubeScript(9010000, "此腳本名稱", 裝備格數);
// 而不是直接開啟此腳本

function start() {
    slot = cm.getId();
    let item = cm.getItem(1, slot);
    if (item == null) {
        cm.sendNext("發生錯誤 slot: " + slot);
        cm.dispose();
        return;
    }
    itemId = item.getId();
    cm.sendCubeOpenAndUpdate(itemId, cm.getItemQuantity(requestItemId), "", "", false); // open UI
    if (debug) {
        cm.getPlayer().dropMessage(5, "[start]");
    }
}

function repeat() {
    let success = true;
    let item = cm.getItem(1, slot);
    if (item == null || item.getId() !== itemId) {
        cm.sendNext("發生錯誤 slot: " + slot + " itemId: " + itemId);
        cm.dispose();
        return;
    }
    cm.gainItem(requestItemId, -1);
    cm.sendCubeOpenAndUpdate(itemId, cm.getItemQuantity(requestItemId), "傳說", "爆擊機率+10%\r\n總傷害+30%", success);
    if (debug) {
        cm.getPlayer().dropMessage(5, "[repeat]");
    }
}
