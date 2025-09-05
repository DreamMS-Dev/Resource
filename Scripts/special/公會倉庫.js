function start() {
    action(1, 0, 0);
}

function action(mode, type, action) {
    let guild = cm.getPlayer().getGuild();
    if (guild == null) {
        cm.sendNext("加入公會後才能使用公會倉庫");
        cm.dispose();
        return;
    }
	cm.dispose();
    cm.sendGuildTrunk(cm.getClient(), guild, 9010000);
}
