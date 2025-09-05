let status = -1, sel = -1, sel2 = -1;
let damageSkinSelection = [];

let damageSkinPicture = "#fEffect/BasicEff.img/NoRed0_"; // 傷害字型圖片路徑
let damageSkinDisplayNumber = "7"; // 圖片顯示數字
let damageSkinSaveToAccount = true; // 傷害皮膚倉庫是否套用帳號
let showId = true; // 是否顯示傷害皮膚編號
let showDamage = true; // 是否顯示傷害皮膚加成傷害
let showUnit = true; // 是否顯示傷害皮膚是否有單位
let showAnimation = true; // 是否顯示傷害皮膚是否為動態
let excludeDamageSkins = [// 不要的傷害皮膚
    // 31, // 重複
    // 32, // 重複
    // 33, // 重複
    // 201,
    // 285,
];

let requestPoint = 0; // 購買字型需要的帳號Log'紅利'
let requestMoney = 0; // 購買字型需要的金錢
let requestCash = 0; // 購買字型需要的Gash
let requestMaplePoint = 0; // 購買字型需要的楓葉點數
let requestPachinko = 0; // 購買字型需要的小鋼珠
//
let requestItemId = 0; // 購買字型需要的道具
let requestItemQuantity = 0; // 購買字型需要的道具

function start() {
    if (cm.getPlayer().getCustomDamageSkin() === -1) { // 尚未切換過傷害字型
        cm.getPlayer().setCustomDamageSkin(0);
    }
    let damageSkinList = cm.getCustomDamageSkinIdList();
    for (let i = 0; i < damageSkinList.size(); i++) {
        damageSkinSelection.push(damageSkinList.get(i));
    }
    for (let i = 0; i < excludeDamageSkins.length; i++) {
        let index = damageSkinSelection.indexOf(excludeDamageSkins[i]);
        if (index !== -1) {
            damageSkinSelection.splice(index, 1);
        }
    }
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === 0) {
        if (status === 1) {
            sel = -1;
        } else if (status === 2) {
            sel2 = -1;
        }
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status < 0) {
        cm.dispose();
    } else if (status === 0) {
        let msg = "[傷害字型系統]\r\n";
        msg += "#L0##d檢視所有傷害字型#k#l\r\n";
        msg += "#L1##d前往購買傷害字型#k#l\r\n";
        msg += "#L2##d前往購買有單位的傷害字型#k#l\r\n";
        msg += "#L3##d前往購買動態傷害字型#k#l\r\n";
        msg += "#L4##d檢視我的傷害字型倉庫#k#l\r\n";
        if (cm.getPlayer().getCustomDamageSkin() !== 0) {
            msg += "#L5##d重置我的傷害字型#k#l\r\n";
        }
        if (cm.getPlayer().isGM()) {
            msg += "#L100##d快速切換傷害字型 [管理專用]#k#l\r\n";
        }
        cm.sendSimple(msg);
    } else if (status === 1) {
        if (mode === 1 && sel === -1) {
            sel = selection;
        }
        if (sel === 0 || sel === 1 || sel === 2 || sel === 3 || sel === 100) {
            let message = "以下為目前所有的傷害字型。\r\n";
            let next = false;
            for (let i = 0; i < damageSkinSelection.length; i++) {
                let skin = damageSkinSelection[i];
                let unit = cm.hasCustomDamageSkinUnit(skin);
                let ani = cm.isCustomDamageSkinAnimation(skin);
                let damageRate = cm.getCustomDamageSkinDamageRate(skin);
                if ((sel === 1 || sel === 2 || sel === 3) && (skin === 0 || hasDamageSkinInBank(skin))) { // 購買時過濾已經有的和基本的
                    continue;
                } else if (sel === 2 && !unit) {
                    continue;
                } else if (sel === 3 && !ani) {
                    continue;
                }
                next = true;
                message += "#L" + skin + "#";
                if (showId) {
                    message += skin + " - ";
                }
                message += getPic(skin);
                if (showDamage && damageRate > 0) {
                    message += " - #d傷害增加: #r" + damageRate + "#d%";
                }
                if (showUnit && unit) {
                    message += "#b(單位)#k";
                }
                if (showAnimation && ani) {
                    message += "#b(動態)#k";
                }
                message += "#l\r\n";
            }
            cm.sendSimple(message);
            if (!next || sel === 0) { // 沒資料 / 查看時則下一步返回
                sel = -1;
                status = -1;
            }
        } else if (sel === 4) {
            let skinList = getDamageSkinIdFromBank();
            if (skinList.isEmpty()) {
                cm.sendNext("倉庫內目前是空的");
                sel = -1;
                status = -1;
                return;
            }
            skinList.sort(function (a, b) {
                return a - b;
            });
            let currentSkin = cm.getPlayer().getCustomDamageSkin();
            let currentSkinDamageRate = cm.getCustomDamageSkinDamageRate(currentSkin);
            let msg = "目前使用的傷害字型: " + getPic(currentSkin);
            if (currentSkinDamageRate > 0) {
                msg += " - #d傷害增加: #r" + currentSkinDamageRate + "#d%#k#l\r\n";
            } else {
                msg += " - #b未增加傷害#k#l\r\n";
            }
            msg += "以下為目前倉庫內的傷害字型列表:\r\n";
            let iter = skinList.iterator();
            while (iter.hasNext()) {
                let skin = iter.next();
                let unit = cm.hasCustomDamageSkinUnit(skin);
                let ani = cm.isCustomDamageSkinAnimation(skin);
                let damageRate = cm.getCustomDamageSkinDamageRate(skin);
                msg += "#L" + skin + "#";
                if (showId) {
                    msg += skin + " - ";
                }
                msg += getPic(skin);
                if (showDamage && damageRate > 0) {
                    msg += " - #d傷害增加: #r" + damageRate + "#d%";
                }
                if (showUnit && unit) {
                    msg += "#b(單位)#k";
                }
                if (showAnimation && ani) {
                    msg += "#b(動態)#k";
                }
                msg += "#l\r\n";
            }

            cm.sendSimple(msg);
        } else if (sel === 5) {
            cm.getPlayer().changeCustomDamageSkin(0);
            cm.sendNext("#r重置傷害字型完成!");
            sel = -1;
            status = -1;
        } else {
            cm.dispose();
        }
    } else if (status === 2) {
        if (sel === 1 || sel === 2 || sel === 3) {
            if (mode === 1 && sel2 === -1) {
                sel2 = selection;
            }
            let message = "選擇了字型" + getPic(sel2) + "\r\n";
            if (requestPoint > 0) {
                message += "需要" + getPointName() + ": " + cm.numberWithCommas(requestPoint) + "\r\n";
            }
            if (requestMoney > 0) {
                message += "需要" + getMoneyName() + ": " + cm.numberWithCommas(requestMoney) + "\r\n";
            }
            if (requestCash > 0) {
                message += "需要" + getCashName() + ": " + cm.numberWithCommas(requestCash) + "\r\n";
            }
            if (requestMaplePoint > 0) {
                message += "需要" + getMaplePointName() + ": " + cm.numberWithCommas(requestMaplePoint) + "\r\n";
            }
            if (requestPachinko > 0) {
                message += "需要" + getPachinkoName() + ": " + cm.numberWithCommas(requestPachinko) + "\r\n";
            }
            if (requestItemQuantity > 0) {
                message += "需要" + requestItemQuantity + "個#v" + requestItemId + "##t" + requestItemId + "#\r\n";
            }
            message += "\r\n是否確認要購買";
            cm.sendYesNo(message);
        } else if (sel === 4) {
            if (selection < 0 || !hasDamageSkinInBank(selection)) {
                cm.dispose();
                return;
            }
            cm.getPlayer().changeCustomDamageSkin(selection);
            cm.sendNext("更換成功！");
            cm.dispose();
        } else if (sel === 100) {
            cm.getPlayer().changeCustomDamageSkin(selection);
            cm.sendNext("更換成功！");
            cm.dispose();
        }
    } else if (status === 3) {
        if (sel === 1 || sel === 2 || sel === 3) {
            if (cm.getPlayer().getAccLogValue(getPointName(), 0) < requestPoint) {
                cm.sendNext(getPointName() + "不足");
                se2 = -1;
                status = 0;
                return;
            }
            if (cm.getPlayer().getMeso() < requestMoney) {
                cm.sendNext(getMoneyName() + "不足");
                se2 = -1;
                status = 0;
                return;
            }
            if (cm.getPlayer().getCSPoints(1) < requestCash) {
                cm.sendNext(getCashName() + "不足");
                se2 = -1;
                status = 0;
                return;
            }
            if (cm.getPlayer().getCSPoints(2) < requestMaplePoint) {
                cm.sendNext(getMaplePointName() + "不足");
                se2 = -1;
                status = 0;
                return;
            }
            if (cm.getPlayer().getBean() < requestPachinko) {
                cm.sendNext(getPachinkoName() + "不足");
                se2 = -1;
                status = 0;
                return;
            }
            if (requestItemQuantity > 0) {
                if (!cm.haveItem(requestItemId, requestItemQuantity)) {
                    cm.sendNext("#v" + requestItemId + "##t" + requestItemId + "#不足");
                    se2 = -1;
                    status = 0;
                    return;
                }
            }
            if (requestPoint > 0) {
                cm.getPlayer().addAccLogValue(getPointName(), -requestPoint);
            }
            if (requestMoney > 0) {
                cm.gainMeso(-requestMoney);
            }
            if (requestCash > 0) {
                cm.gainCash(1, -requestCash);
            }
            if (requestMaplePoint > 0) {
                cm.gainCash(2, -requestMaplePoint);
            }
            if (requestPachinko > 0) {
                cm.getPlayer().gainBean(-requestPachinko);
            }
            if (requestItemQuantity > 0) {
                cm.gainItem(requestItemId, -requestItemQuantity);
            }

            addDamageSkinToBank(sel2);
            cm.sendNext("購買字型" + getPic(sel2) + "成功！");
            sel = -1;
            sel2 = -1;
            status = -1;
        }
    }
}

function addDamageSkinToBank(skinId) {
    if (damageSkinSaveToAccount) {
        cm.getPlayer().addCustomAccountDamageSkinBank(skinId);
    } else {
        cm.getPlayer().addCustomDamageSkinBank(skinId);
    }
}

function hasDamageSkinInBank(skinId) {
    if (damageSkinSaveToAccount) {
        return cm.getPlayer().hasCustomAccountDamageSkinInBank(skinId);
    } else {
        return cm.getPlayer().hasCustomDamageSkinInBank(skinId);
    }
}

function getDamageSkinIdFromBank() {
    return damageSkinSaveToAccount ? cm.getPlayer().getCustomAccountDamageSkinBank() : cm.getPlayer().getCustomDamageSkinBank();
}

function getPic(skin) {
    if (cm.isCustomDamageSkinAnimation(skin)) {
        return damageSkinPicture + skin + "/" + damageSkinDisplayNumber + "/0#"
    } else {
        return damageSkinPicture + skin + "/" + damageSkinDisplayNumber + "#"
    }
}

function getPointName() {
    return "紅利";
}

function getMoneyName() {
    return "楓幣";
}

function getCashName() {
    return "Gash";
}

function getMaplePointName() {
    return "楓葉點數";
}

function getPachinkoName() {
    return "小鋼珠";
}
