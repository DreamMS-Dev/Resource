var status = -1, sel;
var customRebuyItems;
var ii;

function start() {
    ii = cm.getItemInformationProvider();
    customRebuyItems = cm.getPlayer().getCustomRebuy();
    action(1, 0, 0);
}

function action(mode, type, selection) {
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
    } else if (status == 0) {
        var message = "歡迎使用商店買回系統\r\n";
        message += "本系統可以將您在商店賣錯的道具買回\r\n";
        message += "是否要購回?\r\n";
        cm.sendYesNo(message);
    } else if (status == 1) {
        if (customRebuyItems.isEmpty()) {
            cm.sendNext("沒有任何可購回道具");
            cm.dispose();
            return;
        }
        var message = "請選擇要購回的道具: \r\n";
        var index = 0;
        var iter = customRebuyItems.iterator();
        while (iter.hasNext()) {
            var shopItem = iter.next();
            if (shopItem == null) {
                continue;
            } else if (shopItem.getRebuyItem() == null) {
                continue;
            }
            if (index >= 50) {
                break;
            }
            var item = shopItem.getRebuyItem();
            var itemId = item.getItemId();
            var price = Math.max(Math.ceil(ii.getPrice(itemId, 1) * item.getQuantity()), 0);
            if (isRechargable(itemId)) {
                price = ii.getWholePrice(itemId) + Math.ceil(item.getQuantity() * (ii.getPrice(itemId, 1)));
            }
            message += "#L" + index + "##v" + itemId + "##b#t" + itemId + "##k x " + item.getQuantity() + " #r " + price + "#k 楓幣#l\r\n";
            index++;
        }
        cm.sendSimple(message);
    } else if (status == 2) {
        if (mode == 1) {
            sel = selection;
        }
        if (sel < 0 || customRebuyItems.get(sel) == null || customRebuyItems.get(sel).getRebuyItem() == null) {
            cm.sendNext("發生異常: " + sel);
            cm.dispose();
            return;
        }
        var item = customRebuyItems.get(sel).getRebuyItem();
        var itemId = item.getItemId();
        var price = Math.max(Math.ceil(ii.getPrice(itemId, 1) * item.getQuantity()), 0);
        if (isRechargable(itemId)) {
            price = ii.getWholePrice(itemId) + Math.ceil(item.getQuantity() * (ii.getPrice(itemId, 1)));
        }
        cm.sendYesNo("是否確認要回購#v" + itemId + "##b#t" + itemId + "##k x " + item.getQuantity() + " 需要 #r " + price + "#k 楓幣\r\n");
    } else if (status == 3) {
        var item = customRebuyItems.get(sel).getRebuyItem();
        var itemId = item.getItemId();
        var price = Math.max(Math.ceil(ii.getPrice(itemId, 1) * item.getQuantity()), 0);
        if (isRechargable(itemId)) {
            price = ii.getWholePrice(itemId) + Math.ceil(item.getQuantity() * ii.getPrice(itemId, 1));
        }
        if (cm.getMeso() < price) {
            cm.sendNext("至少需要需要 #r " + price + "#k 楓幣");
            cm.dispose();
            return;
        } else if (!cm.canHold(itemId, item.getQuantity())) {
            cm.sendNext("背包無法放下#v" + itemId + "##b#t" + itemId + "##k x " + item.getQuantity());
            cm.dispose();
            return;
        }
        cm.sendNext("回購#v" + itemId + "##b#t" + itemId + "##k x " + item.getQuantity() + " #r " + price + "#k 楓幣 成功")
        cm.gainMeso(-price);
        cm.addByItem(item);
        customRebuyItems.remove(sel);
        cm.getPlayer().setCustomRebuy(customRebuyItems);
        cm.logFile("商店回購.txt", cm.getReadableTime() + " 角色[" + cm.getPlayer().getName() + "] 帳號[" + cm.getClient().getAccountName() + "] 價錢[" + price + "]回購了:" + item.toString() + "\r\n", true);
        status = 0;
    }
}

function isRechargable(itemId) {
    switch (Math.floor(itemId / 10000)) {
        case 207:
        case 233:
            return true;
    }
    return false;
}