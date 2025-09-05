let status, sel, sel2;
let input;
let debug = false;

function reset() {
    status = -1;
    sel = -1;
    sel2 = -1;
    input = null;
}

function start() {
    reset();
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (debug) {
        cm.getPlayer().dropMessage(6, "mode: " + mode + " selection: " + selection + " status: " + status + " sel: " + sel + " sel2: " + sel2);
    }
    if (mode === 1) {
        if (status === 1 && sel === 0) {
            if (selection === 0) {
                reset();
            } else {
                cm.removeIgnoreMegaphoneCharacterId(selection);
                reset();
                status = 0;
                sel = 0;
            }
        }
        status++;
    } else if (mode === 0) {
        status--;
        if (status === 0 && (sel === 1 || sel === 2)) {
            reset();
            status = 0;
        }
    } else {
        cm.dispose();
        return;
    }

    if (status <= -1) {
        cm.dispose();
    } else if (status === 0) {
        let message = "#d#e忽略角色廣播系統#k#n#b\r\n\r\n";
        message += "#L0#管理目前忽略角色清單#l\r\n";
        message += "#L1#新增目前忽略角色清單#l\r\n";
        message += "#L2#清空目前忽略角色清單#l\r\n";
        cm.sendSimple(message);
    } else if (status === 1) {
        if (mode === 1 && sel === -1) {
            sel = selection;
        }
        if (sel === 0) {
            if (cm.getIgnoreMegaphoneCharacterIdList().isEmpty()) {
                cm.sendNext("#d目前清單內沒有任何角色");
                reset();
            } else {
                cm.sendSimple(getIgnoreCharacterBroadcastMessage());
            }
        } else if (sel === 1) {
            cm.sendGetText("#d請輸入#b忽略廣播#d的角色名稱");
        } else if (sel === 2) {
            if (cm.getIgnoreMegaphoneCharacterIdList().isEmpty()) {
                cm.sendNext("#r目前清單內沒有任何角色可以清空");
                reset();
            } else {
                cm.sendYesNo("#d是否確認將清單內的#r" + cm.getIgnoreMegaphoneCharacterIdList().size() + "#d個角色清空?");
            }
        }
    } else if (status === 2) {
        if (mode === 1 && sel2 === -1) {
            sel2 = selection;
        }
        if (sel === 1) {
            if (mode === 1 && input == null) {
                input = cm.getText();
                sel2 = cm.getCharacterIdByName(input);
            }
            if (sel2 === -1) {
                cm.sendNext("#d找不到角色: #r" + input);
                reset();
                status = 0;
                sel = 1;
            } else if (sel2 === cm.getPlayer().getId()) {
                cm.sendNext("#r無法將目前角色添加至清單內");
                reset();
                status = 0;
                sel = 1;
            } else if (cm.isIgnoreMegaphoneCharacterId(sel2)) {
                cm.sendNext("#d角色[#r" + input + "]#d已經在忽略廣播角色清單中了");
                reset();
                status = 0;
                sel = 1;
            } else {
                cm.sendYesNo("#d是否確認將#r" + input + "#d加入忽略廣播角色清單?");
            }
        } else if (sel === 2) {
            cm.sendNext("#d已成功將清單內的#r" + cm.getIgnoreMegaphoneCharacterIdList().size() + "#d個角色清空");
            cm.clearIgnoreMegaphoneCharacterId();
            reset();
        }
    } else if (status === 3) {
        if (sel === 1) {
            cm.addIgnoreMegaphoneCharacterId(sel2);
            cm.sendNext("#d已成功將#r" + input + "#d加入忽略廣播角色清單\r\n");
            reset();
        }
    }
}

function getIgnoreCharacterBroadcastMessage() {
    let message = "點擊角色名稱後從忽略廣播角色清單中移除:#b\r\n";
    message += "#L0#回上一頁#l\r\n\r\n";
    let iterator = cm.getIgnoreMegaphoneCharacterIdList().iterator();
    while (iterator.hasNext()) {
        let characterId = iterator.next();
        let characterName = cm.getCharacterNameById(characterId);
        message += "#L" + characterId + "#" + characterName + "#l\r\n";
    }
    return message;
}
