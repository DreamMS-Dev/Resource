var status = -1;
var shopList;

function start() {
    shopList = cm.getAllShopList();
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
        return;
    } else if (status === 0) {
        var message = "商店列表:\r\n";
        var iterator = shopList.entrySet().iterator();
        while (iterator.hasNext()) {
            var next = iterator.next();
            var shopId = next.getKey();
            var npcId = next.getValue();
            message += "#w#L" + shopId + "#Id: " + shopId + " Npc: #p" + npcId + "#(" + npcId + ")\r\n";
        }
        cm.sendSimple(message);
    } else if (status === 1) {
		cm.dispose();
        cm.openShopNPC(selection);
    }
}
