let status = -1, sel = -1;
let backgroundPictureOriginalPath = "#fUI/UIWindow.img/UserInfo/backgrnd";
let backgroundPicturePath = "#fUI/UIWindow.img/UserInfo/backgrnd_";
let allBackgroundInfo;

let account = false; // 是否使用帳號儲存
let money = 100000; // 兌換新的背景花費金錢

function start() {
    allBackgroundInfo = cm.getUserInfoBackgroundIdList();
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === 0) {
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status <= -1) {
        cm.dispose();
    } else if (status === 0) {
        let msg = "歡迎使用角色資料背景兌換功能\r\n";
        msg += "#L0#我要#b兌換#d角色資料背景#k#l\r\n";
        msg += "#L1#我要#r查看#d角色資料背景#k倉庫#l\r\n";
        if (cmb.getCustomUserInfoBackground() !== -1) {
            msg += "#L2#我要#r重置#k使用中的#d角色資料背景#l\r\n";
        }
        if (cm.getPlayer().getGMLevel() > 0) {
            msg += "#L100##d切換角色資料背景 [管理專用]#k#l\r\n";
        }
        msg += "#L3##r離開\r\n";
        cm.sendSimple(msg);
    } else if (status === 1) {
        if (mode === 1) {
            sel = selection;
        }
        if (sel === 0) {
            let msg = "請選擇要兌換的角色資料背景";
            if (money > 0) {
                msg += "(需要#r" + cm.numberWithCommas(money) + "#k元)";
            }
            msg += "\r\n\r\n";
            for (let i = 0; i < allBackgroundInfo.length; i++) {
                if (!hasBackgroundInBank(allBackgroundInfo[i])) {
                    msg += "#L" + i + "#" + getPicture(allBackgroundInfo[i]) + "#l\r\n";
                }
            }
            cm.sendSimple(msg);
        } else if (sel === 1) {
            if (getBackgroundFromBank().isEmpty()) {
                cm.sendNext("倉庫裡目前是空的");
                sel = -1;
                status = -1;
                return;
            }
            var currentBackground = cmb.getCustomUserInfoBackground();
            let msg = "使用中角色資料背景: " + getPicture(currentBackground);
            msg += "\r\n\r\n";
            msg += "請選擇要使用的角色資料背景\r\n";
            let iter = getBackgroundFromBank().iterator();
            while (iter.hasNext()) {
                var backgroundId = iter.next();
                if (backgroundId !== 0 && backgroundId !== currentBackground) {
                    msg += "#L" + backgroundId + "#" + getPicture(backgroundId) + "#l\r\n";
                }
            }
            cm.sendSimple(msg);
        } else if (sel === 2) {
            cmb.setCustomUserInfoBackground(-1);
            cm.sendNext("重置角色資料背景完成");
            sel = -1;
            status = -1;
        } else if (sel === 100 && cm.getPlayer().isGM()) {
            let msg = "請選擇要兌換的角色資料背景:\r\n\r\n";
            for (let i = 0; i < allBackgroundInfo.length; i++) {
                msg += "#L" + i + "#" + i + "\r\n" + getPicture(allBackgroundInfo[i])+"#l\r\n";
            }
            cm.sendSimple(msg);
        } else {
            cm.dispose();
        }
    } else if (status === 2) {
        if (sel === 0) {
            if (selection < 0) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            }
            let backgroundId = allBackgroundInfo[selection];
            if (hasBackgroundInBank(backgroundId)) {
                cmb.setCustomUserInfoBackground(backgroundId);
                cm.sendNext("倉庫裡已經有" + getPicture(backgroundId) + "\r\n了，並且自動套用為目前使用的角色資料背景");
                sel = -1;
                status = -1;
                return;
            } else if (cm.getPlayer().getMeso() < money) {
                cm.sendOk("楓幣不足，至少需要" + cm.numberWithCommas(money) + "元");
                cm.dispose();
                return;
            }
            if (money > 0) {
                cm.gainMeso(-money);
            }
            addBackgroundToBank(backgroundId);
            cm.sendNext("已經獲得角色資料背景:" + getPicture(backgroundId) + "\r\n請去倉庫內查看");
            sel = -1;
            status = -1;
        } else if (sel === 1) {
            if (!hasBackgroundInBank(selection)) {
                cm.sendNext("沒有選擇角色資料背景 ");
                sel = -1;
                status = -1;
                return;
            }
            cmb.setCustomUserInfoBackground(parseInt(selection));
            cm.sendNext("套用角色資料背景\r\n" + getPicture(selection) + "\r\n成功");
            sel = -1;
            status = -1;
        } else if (sel === 100) {
            addBackgroundToBank(selection);
            cmb.setCustomUserInfoBackground(selection);
            cm.getPlayer().yellowMessage("角色資料背景編號: " + selection);
            cm.sendNext("更換成功！");
            cm.dispose();
        }
    }
}

function addBackgroundToBank(background) {
    cmb.addCharacterInfoBackgroundToTrunk(background, account);
}

function hasBackgroundInBank(background) {
    return cmb.hasCharacterInfoBackgroundInTrunk(background, account);
}

function getBackgroundFromBank() {
    return cmb.getCharacterInfoBackgroundListFromTrunk(account);
}

function getPicture(id) {
    if (id === -1) {
        return backgroundPictureOriginalPath;
    }
    return backgroundPicturePath + id + "#"
}
