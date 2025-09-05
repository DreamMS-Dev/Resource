function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    cm.getPlayer().dropMessage(6, "觸發撿物腳本");
    cm.gainItem(cm.getId(), 1);
	cm.dispose();
}
