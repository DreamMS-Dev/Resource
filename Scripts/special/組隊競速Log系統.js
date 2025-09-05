var status = -1, sel = -1;
var debug_ = true;
var logType = 1; // 紀錄Log類型，自訂

function start() {
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
    if (cm.getPlayer().getParty() == null) {
        cm.sendNext("需要隊伍才能使用");
        cm.dispose();
        return;
    }
    if (status == 0) {
        var msg = "#e[Party Group Speed Log]#n\r\n";
        msg += "#L0#開始記錄時間#l\r\n";
        msg += "#L10#檢視紀錄排行#l\r\n";
        cm.sendSimple(msg);
    } else if (status == 1) {
        if (mode == 1) {
            sel = selection;
        }
        if (sel == 0) {
            cm.getPlayer().getParty().startGroupSpeedLog(); // 隊伍開始記錄時間
            cm.sendNext("已開始記錄隊伍通關時間, 下一步後將完成紀錄");
        } else if (sel == 1) {
            cm.getPlayer().removeSpeedLog(logType);
            cm.sendNext("已移除當前類型紀錄時間");
            status = -1;
        } else if (sel == 10) {
            cm.displayGroupSpeedRankInfo(logType);
            cm.dispose();
        }
    } else if (status == 2) {
        if (sel == 0) {
            cm.getPlayer().getParty().endGroupSpeedLog(logType); // 永久記錄，返回 MapleSpeedLog
            // cm.getPlayer().getParty().endDailyGroupSpeedLog(logType); // 記錄隔天消除，返回 MapleSpeedLog
            // cm.getPlayer().getParty().endWeeklyGroupSpeedLog(logType); // 記錄下禮拜消除，返回 MapleSpeedLog
            // cm.getPlayer().getParty().endMonthlyGroupSpeedLog(logType); // 記錄下個月消除，返回 MapleSpeedLog
            cm.sendNext("通關時間紀錄完成");
            status = -1;
        }
    } else {
        cm.dispose();
    }
}
