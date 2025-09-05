let status = -1, sel = -1;
let debug = true;
let logName = "紅利購買技能";
let skillInfos = [
    [8000, 1000],
    [8001, 1000],
    [8002, 1000],
    [8003, 1000]
]

function start() {
    if (debug && !cm.getPlayer().isGM()) {
        cm.sendNext("維修中");
        cm.dispose();
        return;
    }
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status < 0) {
        cm.dispose();
    } else if (status === 0) {
        let message = "#b[購買技能]\r\n";
        message += "技能購買後將會出現在新手區\r\n";
        message += "#b目前紅利: #d" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "\r\n\r\n";
        for (let i = 0; i < skillInfos.length; i++) {
            let skillId = skillInfos[i][0];
            let price = skillInfos[i][1];
            message += "#L" + i + "##s" + skillId + "##q" + skillId + "# - " + cm.numberWithCommas(price) + "紅利";
            if (cm.getPlayer().getAccLogValue(getLogName(skillId), 0) > 0) {
                message += "(已購買)";
            }
            message += "#l\r\n";
        }
        cm.sendSimple(message);
    } else if (status === 1) {
        sel = selection;
        let skillId = skillInfos[sel][0];
        let price = skillInfos[sel][1];
        if (cm.getPlayer().getAccLogValue(getLogName(skillId), 0) > 0) {
            cm.teachSkill(cm.getSkillByJob(skillId), 1, 1);
            cm.sendNext("本帳號已經購買過#s" + skillId + "#了，將直接領取技能。");
            sel = -1;
            status = -1;
        } else {
            if (cm.getPlayer().getAccLogValue("紅利", 0) < price) {
                cm.sendNext("紅利不足");
                sel = -1;
                status = -1;
            } else {
                cm.sendYesNo("是否確認要購買技能#s" + skillId + "#，需要花費" + cm.numberWithCommas(price) + "紅利");
            }
        }
    } else if (status === 2) {
        let skillId = skillInfos[sel][0];
        let price = skillInfos[sel][1];
        if (cm.getPlayer().getAccLogValue("紅利", 0) < price) {
            cm.sendNext("紅利不足");
            sel = -1;
            status = -1;
        } else {
            cm.getPlayer().addAccLogValue("紅利", -price);
            cm.getPlayer().setAccLogValue(getLogName(skillId), 1);
            cm.teachSkill(cm.getSkillByJob(skillId), 1, 1);
            cm.sendNext("購買技能#s" + skillId + "#成功");
            cm.broadcastMessageToGameMaster(cm.getClient().getChannel(), 6, "[購買技能] : 帳號<" + cm.getClient().getAccountName() + ">角色<" + cm.getPlayer().getName() + "> 購買了技能" + skillId + "，目前共有" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "紅利");
            cm.logFile("購買技能.txt", cm.getReadableTime() + " 帳號<" + cm.getClient().getAccountName() + ">角色<" + cm.getPlayer().getName() + "> 購買了技能" + skillId + "，目前共有" + cm.numberWithCommas(cm.getPlayer().getAccLogValue("紅利", 0)) + "紅利", false);
			sel = -1;
            status = -1;
        }
    }
}

function getLogName(skillId) {
    return logName + "_" + skillId;
}
