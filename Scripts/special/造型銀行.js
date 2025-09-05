var status = -1, sel = -1, sel2 = -1;

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
    if (status <= -1) {
        cm.dispose();
    } else if (status == 0) {
        var msg = "#k請選擇要使用的功能:\r\n";
        msg += "#L0##d使用美髮相簿\r\n";
        msg += "#L1##b使用美容相簿\r\n";
        cm.sendSimple(msg);
    } else if (status == 1) {
        if (mode == 1 && sel == -1) {
            sel = selection;
        }
        if (sel == 0) {
            var msg = "目前髮型:#b#z" + cm.getPlayer().getHair() + "# #k\r\n";
            msg += "#L1000#新增目前髮型#l\r\n\r\n";
            var looptime = 0;
            for (var i = 0; looptime < cm.getPlayer().getStyleBank_Hair().size(); i += 2) {
                var hairId = cm.getPlayer().getStyleBank_Hair().get(looptime);
                var hair = hairId > 0 ? "#d#z" + hairId + "##k" : "無";
                looptime += 1;
                msg += "髮型" + looptime + ":" + hair + " #L" + (i + 1) + "#移除 #L" + (i + 2) + "#變更#l \r\n\r\n";
            }
            msg += "#L10000#回上一頁";
            cm.sendSimple(msg);
        } else if (sel == 1) {
            var msg = "目前臉型:#b#z" + cm.getPlayer().getFace() + "# #k\r\n\r\n";
            msg += "#L1000#新增目前臉型#l\r\n\r\n";
            var looptime = 0;
            for (var i = 0; looptime < cm.getPlayer().getStyleBank_Face().size(); i += 2) {
                var faceId = cm.getPlayer().getStyleBank_Face().get(looptime);
                var face = faceId > 0 ? "#d#z" + faceId + "##k" : "無";
                looptime += 1;
                msg += "臉型" + looptime + ":" + face + " #L" + (i + 1) + "#移除 #L" + (i + 2) + "#變更#l \r\n\r\n";
            }
            msg += "#L10000#回上一頁";
            cm.sendSimple(msg);
        } else {
            cm.sendNext("發生未知的錯誤 : " + sel);
            cm.dispose();
        }
    } else if (status == 2) {
        if (mode == 1) {
            sel2 = selection;
            if (selection == 10000) {
                sel = -1;
                sel2 = -1;
                status = -1;
                action(1, type, -1);
                return;
            }
        }
        var index = 0;
        var change = false;
        var remove = false;
        switch (sel2 % 2) {
            case 0:
                change = true;
                break;
            case 1:
                remove = true;
                break;
        }
        while (sel2 > 2) {
            index++;
            sel2 -= 2;
        }
        if (sel == 0) {
            if (selection == 1000) {
                cm.getPlayer().addStyleBank(cm.getPlayer().getHair());
            } else if (remove) {
                cm.getPlayer().removeStyleBank(cm.getPlayer().getStyleBank_Hair().get(index));
            } else if (change) {
                cm.setHair(cm.getPlayer().getStyleBank_Hair().get(index));
            }
        } else if (sel == 1) {
            if (selection == 1000) {
                cm.getPlayer().addStyleBank(cm.getPlayer().getFace());
            } else if (remove) {
                cm.getPlayer().removeStyleBank(cm.getPlayer().getStyleBank_Face().get(index));
            } else if (change) {
                cm.setFace(cm.getPlayer().getStyleBank_Face().get(index));
            }
        }
        cm.sendNext("動作操作成功, 請按下一步");
        sel2 = -1;
        status = 0;
    }
}
