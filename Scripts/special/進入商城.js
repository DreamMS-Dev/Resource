var status = -1;
var csTypes = [
    // name, desc, type
    ["購物商城一", "#r內有大量原版道具#k", 0],
    ["購物商城二", "#r擁有正服最新道具#k", 1],
    ["購物商城三", "#r內涵各種自創道具#k", 2]
]

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    var msg = "";
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
        var message = "請選擇要進入的商城:\r\n";
        for (var i = 0; i < csTypes.length; i++) {
            var name = csTypes[i][0];
            var desc = csTypes[i][1];
            var type_ = csTypes[i][2];
            message += "#L" + type_ + "#" + name + " - " + desc + "#l\r\n";
        }
        cm.sendSimple(message);
    } else if (status == 1) {
        if (selection < 0 || !hasType(selection)) {
            cm.sendNext("發生未知的錯誤");
            cm.dispose();
            return;
        }
        cm.getPlayer().setCSType(selection);
        cm.enterCS();
        cm.dispose();
    }
}

function hasType(type) {
    for (var i = 0; i < csTypes.length; i++) {
        var type_ = csTypes[i][2];
        if (type == type_) {
            return true;
        }
    }
    return false;
}
