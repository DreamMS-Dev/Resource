var status = -1, sel = -1;
var mountItems = [1932086, 1932087, 1932089, 1932084, 1932124, 1932117, 1932222, 1932106, 1932062, 1932061];
var tick = 4000000;
var quantity = 1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        status--;
    }

    if (status <= -1) {
        cm.dispose();
    } else if (status == 0) {
        msg = "#r親愛的:#k#g#e #h # #n #k\r\n";
        msg += "#b你好,我是技能騎寵代理人,\r\n";
        msg += "您可以在我這邊抽取騎寵,購買騎寵以及管理騎寵倉庫。\r\n";
        msg += "#r請注意特別！！！有許多騎寵無法爬繩子！！！\r\n";
        msg += "若不介意再進行使用#d\r\n";
        msg += "#L0#我要學習訂製騎寵技能#l\r\n";
        msg += "#L1#我要取得騎寵#l\r\n";
        msg += "#L2#查看騎寵種類#l\r\n";
        msg += "#L3#打開我的騎寵倉庫#l\r\n";
        msg += "#L5#刪除我的騎寵#l\r\n";
        msg += "#L4#變回初始坐騎#l";
        cm.sendSimple(msg);
    } else if (status == 1) {
        sel = selection;
        if (sel == 0) {
            if (hasMountSkill()) {
                cm.sendNext("你已經學習過了");
                status = -1;
                return;
            }
            teachMountSkill();
            cm.sendNext("請確認技能新手欄是否有收到雪吉拉騎士的技能!");
            status = -1;
        } else if (sel == 1) {
            if (!hasMountSkill()) {
                teachMountSkill();
            }
            msg = "#r注意!!點選將直接選取騎寵哦!!按錯後無法退費!#k\r\n\r\n";
            msg += "#b 是否要使用#v" + tick + ":#兌換騎寵#l"
            cm.sendYesNo(msg);
        } else if (sel == 2) {
            msg = "這期可兌換的騎寵\r\n";
            for (var i = 0; i < mountItems.length; i++) {
                msg += "#L" + i + "##i" + mountItems[i] + "#";
            }
            cm.sendSimple(msg);
            status = -1;
        } else if (sel == 3) {
            if (!hasMountSkill()) {
                teachMountSkill();
            }
            cm.sendNext("目前騎寵為:" + (cm.getPlayer().getCustomMount() == 0 ? "無" : "#v" + cm.getPlayer().getCustomMount() + "#") + "\r\n選擇您要使用的坐騎:\r\n" + showMountBank());
        } else if (sel == 4) {
            if (cm.getPlayer().getCustomMount() == 0) {
                cm.sendNext("目前坐騎已經是初始化狀態了");
                cm.dispose();
                return;
            } else if (!hasMountSkill()) {
                teachMountSkill();
            }
            cm.getPlayer().setCustomMount(0);
            cm.sendNext("已經初始化坐騎");
            status = -1;
        } else if (sel == 5) {
            cm.sendNext("目前騎寵為:" + (cm.getPlayer().getCustomMount() == 0 ? "無" : "#v" + cm.getPlayer().getCustomMount() + "#") + "\r\n選擇您要刪除的坐騎:\r\n" + showMountBank2());
        }
    } else if (status == 2) {
        if (sel == 1) {
            msg = "選擇要兌換的坐騎:\r\n";
            for (var i = 0; i < mountItems.length; i++) {
                if (!cm.getPlayer().hasCustomMountInBank(mountItems[i])) {
                    msg += "#L" + i + "##i" + mountItems[i] + "#";
                }
            }
            cm.sendSimple(msg);
        } else if (sel == 3) {
            var mountSkill = selection;
            if (!cm.getPlayer().hasCustomMountInBank(mountSkill)) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            }
            cm.getPlayer().setCustomMount(mountSkill);
            cm.sendNext("你已將技能騎寵更換為 #i" + mountSkill + ":##t" + mountSkill + "#");
            status = -1;
        } else if (sel == 5) {
            var mount = selection;
            var mountSkill = cm.getPlayer().getCustomMountBank().get(mount);
            if (!cm.getPlayer().hasCustomMountInBank(mountSkill)) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            } else if (cm.getPlayer().getCustomMount() == mountSkill) {
                cm.sendNext("無法刪除目前使用的坐騎");
                status = -1;
                return;
            }
            cm.getPlayer().removeCustomMountFromBank(mountSkill);
            cm.sendNext("你已將技能騎寵 #i" + mountSkill + ":##t" + mountSkill + "#刪除了");
            status = -1;
        }
    } else if (status == 3) {
        if (!cm.haveItem(tick, quantity)) {
            cm.sendNext("您沒有#v" + tick + ":#x" + quantity + "無法兌換坐騎。");
            cm.dispose();
            return;
        }
        cm.getPlayer().addCustomMountToBank(mountItems[selection]);
        cm.gainItem(tick, -quantity);
        cm.sendNext("您已經獲得坐騎#i" + mountItems[selection] + "#到騎寵倉庫設置酷炫的坐騎吧!");
        status = -1;
    }
}
function showMountBank2() {
    var alreadyItemIds = [];
    var sb = "";
    var infos = cm.getPlayer().getCustomMountBank();
    if (infos.isEmpty()) {
        sb = "目前沒有任何騎寵!";
    } else {
        var next = true;
        var num = 0;
        for (var i = 0; i < infos.size(); i++) {
            var mountId = infos.get(i);
            if (alreadyItemIds.length > 0) {
                for (var x = 0; x < alreadyItemIds.length; x++) {
                    if (alreadyItemIds[x] == mountId) {
                        next = false;
                        break;
                    }
                }
                if (!next) {
                    continue;
                }
            }
            sb += "#L" + num + "##v" + mountId + "#";
            alreadyItemIds.push(mountId);
            num++;
        }
    }
    return sb;
}

function showMountBank() {
    var alreadyItemIds = [];
    var sb = "";
    var infos = cm.getPlayer().getCustomMountBank();
    if (infos.isEmpty()) {
        sb = "目前沒有任何騎寵!";
    } else {
        var num = 0;
        var next = true;
        for (var i = 0; i < infos.size(); i++) {
            var mountId = infos.get(i);
            if (alreadyItemIds.length > 0) {
                for (var x = 0; x < alreadyItemIds.length; x++) {
                    if (alreadyItemIds[x] == mountId) {
                        next = false;
                        break;
                    }
                }
                if (!next) {
                    continue;
                }
            }
            alreadyItemIds.push(mountId);
            sb += "#L" + mountId + "##v" + mountId + "#";
        }
    }
    return sb;
}
function teachMountSkill() {
    cm.teachSkill(cm.getSkillByJob(1017), 1, 1);
}

function hasMountSkill() {
    return cm.getPlayer().getSkillLevel(cm.getSkillByJob(1017)) > 0;
}
