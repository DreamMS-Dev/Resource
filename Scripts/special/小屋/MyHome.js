/*
 使用方法: 將入口腳本改寫為
function start() {
    cm.dispose();
    cm.openNpc(9010001, "小屋/MyHome");
}
*/
function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    cm.dispose();
    if (cm.getPlayer().getMap().getMyHomeId() > 0) {
        cm.openNpc(cm.getId(), "小屋/MyHomeManage");
    } else {
        cm.openNpc(cm.getId(), "小屋/MyHomeEntrance");
    }
}