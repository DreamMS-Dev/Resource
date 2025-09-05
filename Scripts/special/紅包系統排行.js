var status = -1, selType;

function start() {
    action(1, 0, 0);
}

function action(m, t, s) {
    if (m == 1) {
        status++;
    } else if (m == 0) {
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status < 0) {
        cm.dispose();
    } else if (status == 0) {
        var msg = "#e#r紅包排行#k#n\r\n";
        msg += "#L0#總數量排行" + getRankName(0) + "#l\r\n";
        msg += "#L1#楓幣排行" + getRankName(1) + "#l\r\n";
        msg += "#L2#點券排行" + getRankName(2) + "#l\r\n";
        msg += "#L3#抵用券排行" + getRankName(3) + "#l\r\n";
        cm.sendSimple(msg);
    } else if (status == 1) {
        if (m == 1) {
            selType = s;
        }
        cm.sendSimple("選擇型別:\r\n\r\n#L0#一般#l\r\n#L1##r詳細#k#l\r\n");
    } else if (status == 2) {
        if (s == 0) {
            cm.displayRedEnvelopeRank(selType);
        } else {
            cm.displayRedEnvelopeRankInfo(selType);
        }
        cm.dispose();
    }
}

function getRankName(type) {
    var rank = cm.getBestRedEnvelopeRank(type);
    if (rank > 0) {
        return "(第" + rank + "名)";
    }
    return "";
}
