var status = -1, eimIndex = 0;
var eimList = [];
var eventInfo = [
    // name, event, eventInstance, isChannelId
    ["暗黑龍王", "HorntailBattle", "Horntail", 240060000, true],
    ["殘暴炎魔", "ZakumBattle", "Zakum", 280030100, true],
    ["雄獅王", "ScargaBattle", "Scarga", 551030200, true],
    ["皮卡啾", "PinkBeanBattle", "PinkBean", 270050100, true],
    ["黑道老大", "ShowaBattle", "Showa", 801040100, true]
];

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
    if (status == -1) {
        cm.dispose();
    } else if (status == 0) {
        var message = "#r使用斷線回圖前務必確認頻道是否正確哦!\r\n#k請選擇要回到地圖的遠征隊:#b\r\n";
        var currentChannel = cm.getClient().getChannel();
        var world = cm.getPlayer().getWorld();
        var exist = false;
        for (var i = 0; i < eventInfo.length; i++) {
            var info = eventInfo[i][0];
            var emName = eventInfo[i][1];
            var eimName = eventInfo[i][2];
            var mapId = eventInfo[i][3];
            for (var ch = 1; ch < 21; ch++) {
                if (cm.getChannelServer(world, ch) == null) {
                    break;
                }
                var tmpEimName = eimName;
                if (eventInfo[i][4]) {
                    tmpEimName += "" + ch;
                }
                var eim = cm.getEventInstanceManager(emName, tmpEimName, ch);
                if (eim != null) {
                    if (ch == currentChannel) {
                        message += "#r#L" + eimIndex + "#頻道" + ch + ":" + info + "遠征隊#k#l\r\n";
                        eimIndex++;
                        eimList.push(eim);
                    } else {
                        message += "\r\n頻道" + ch + ":" + info + "遠征隊(請先換頻才能進行傳送)\r\n\r\n";
                    }
                    exist = true;
                }
            }

        }
        if (!exist) {
            cm.sendNext("目前沒有任何地圖可以回傳");
            cm.dispose();
            return;
        }
        cm.sendSimple(message);
    } else if (status == 1) {
        if (mode == 1) {
            eimIndex = selection;
        }
        var eim = eimList[eimIndex];
        if (eim == null) {
            cm.sendNext("結束了，回不去了");
        } else {
            cm.readdToEventInstance(eim);
        }
        cm.dispose();
    }
}
