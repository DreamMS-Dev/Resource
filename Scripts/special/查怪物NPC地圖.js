let status = -1, sel = -1, sel2 = -1;
let text = null;
let admin = false;

let warpToField = false;

function start() {
    admin = cm.getPlayer().isGM();
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === 0) {
        if (status === 3) {
            sel2 = -1;
        } else if (status === 2) {
            text = null;
        } else if (status === 1) {
            sel = -1;
        }
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status < 0) {
        cm.dispose();
    } else if (status === 0) {
        let msg = "請選擇要執行的操作:#b\r\n\r\n";
        msg += "#L0#查地圖上NPC#l\r\n";
        msg += "#L1#查地圖上怪物#l\r\n";
        msg += "#L2#查NPC出現地圖#l\r\n";
        msg += "#L3#查怪物出現地圖#l\r\n";
        cm.sendSimple(msg);
    } else if (status === 1) {
        if (sel === -1 && mode === 1) {
            sel = selection;
        }
        switch (sel) {
            case 0:
            case 1:
                cm.sendGetText("請輸入要查詢的地圖");
                break;
            case 2:
                cm.sendGetText("請輸入要查詢的NPC名稱");
                break;
            case 3:
                cm.sendGetText("請輸入要查詢的怪物名稱");
                break;
        }
    } else if (status === 2) {
        if (text === null) {
            text = cm.getText();
        }
        let result;
        switch (sel) {
            case 0:
            case 1:
                result = cm.getSearchData(3, text);
                if (result == null) {
                    cm.sendNext("沒有任何搜尋結果<" + text + ">");
                    text = null;
                    status = 0;
                } else {
                    cm.sendSimple(cm.searchData(3, text));
                }
                break;
            case 2:
                result = cm.getSearchData(2, text);
                if (result == null) {
                    cm.sendNext("沒有任何搜尋結果<" + text + ">");
                    text = null;
                    status = 0;
                } else {
                    cm.sendSimple(cm.searchData(2, text));
                }
                break;
            case 3:
                result = cm.getSearchData(4, text);
                if (result == null) {
                    cm.sendNext("沒有任何搜尋結果<" + text + ">");
                    text = null;
                    status = 0;
                } else {
                    cm.sendSimple(cm.searchData(4, text));
                }
                break;
        }

    } else if (status === 3) {
        if (sel2 === -1 && mode === 1) {
            sel2 = selection;
        }
        let hasSelection = false;
        let resultList = null;
        let msg = null;
        switch (sel) {
            case 0:
                resultList = cm.getNpcListByMap(sel2);
                if (resultList.size() <= 0) {
                    cm.sendNext("地圖上沒有NPC");
                    status = 1;
                    sel2 = -1;
                    return;
                }
                hasSelection = false;
                msg = "搜尋地圖<" + text + ">NPC結果如下:\r\n\r\n";
                for (let i = 0; i < resultList.size(); i++) {
                    let npcId = resultList[i];
                    if (admin) {
                        hasSelection = true;
                        msg += "#L" + npcId + "#";
                    }
                    msg += "#p" + npcId + "#";
                    if (admin) {
                        msg += "(" + npcId + ")";
                    }
                    msg += "#l\r\n";
                }
                if (hasSelection) {
                    cm.sendSimple(msg);
                } else {
                    if (msg != null) {
                        cm.sendNext(msg);
                        text = null;
                        status = -1;
                        sel = -1;
                        sel2 = -1;
                    }
                }
                break;
            case 1:
                resultList = cm.getMobListByMap(sel2);
                if (resultList.size() <= 0) {
                    cm.sendNext("地圖上沒有怪物");
                    status = 1;
                    sel2 = -1;
                    return;
                }
                hasSelection = false;
                msg = "搜尋地圖<" + text + ">怪物結果如下:\r\n\r\n";
                for (let i = 0; i < resultList.size(); i++) {
                    let mobId = resultList[i];
                    if (admin) {
                        hasSelection = true;
                        msg += "#L" + mobId + "#";
                    }
                    msg += "#o" + mobId + "#";
                    if (admin) {
                        msg += "(" + mobId + ")";
                    }
                    msg += "#l\r\n";
                }
                if (hasSelection) {
                    cm.sendSimple(msg);
                } else {
                    if (msg != null) {
                        cm.sendNext(msg);
                        text = null;
                        status = -1;
                        sel = -1;
                        sel2 = -1;
                    }
                }
                break;
            case 2:
                resultList = cm.getMapListByNpc(sel2);
                if (resultList.size() <= 0) {
                    cm.sendNext("NPC不在任何地圖上");
                    status = 1;
                    sel2 = -1;
                    return;
                }
                hasSelection = false;
                msg = "搜尋NPC<" + text + ">地圖結果如下:\r\n\r\n";
                for (let i = 0; i < resultList.size(); i++) {
                    let fieldId = resultList[i];
                    if (admin || warpToField) {
                        hasSelection = true;
                        msg += "#L" + fieldId + "#";
                    }
                    msg += "#m" + fieldId + "#";
                    if (admin) {
                        msg += "(" + fieldId + ")";
                    }
                    msg += "#l\r\n";
                }
                if (hasSelection) {
                    cm.sendSimple(msg);
                } else {
                    if (msg != null) {
                        cm.sendNext(msg);
                        text = null;
                        status = -1;
                        sel = -1;
                        sel2 = -1;
                    }
                }
                break;
            case 3:
                resultList = cm.getMapListByMob(sel2);
                if (resultList.size() <= 0) {
                    cm.sendNext("怪物不在任何地圖上");
                    status = 1;
                    sel2 = -1;
                    return;
                }
                hasSelection = false;
                msg = "搜尋怪物<" + text + ">地圖結果如下:\r\n\r\n";
                for (let i = 0; i < resultList.size(); i++) {
                    let fieldId = resultList[i];
                    if (admin || warpToField) {
                        hasSelection = true;
                        msg += "#L" + fieldId + "#";
                    }
                    msg += "#m" + fieldId + "#";
                    if (admin) {
                        msg += "(" + fieldId + ")";
                    }
                    msg += "#l\r\n";
                }
                if (hasSelection) {
                    cm.sendSimple(msg);
                } else {
                    if (msg != null) {
                        cm.sendNext(msg);
                        text = null;
                        status = -1;
                        sel = -1;
                        sel2 = -1;
                    }
                }
                break;
        }
    } else if (status === 4) {
        if (sel === 0) {
            cm.dispose();
            cm.openNpc(selection);
        } else if (sel === 1) {
            cm.spawnMonster(selection, 1);
            cm.dispose();
        } else if (sel === 2 || sel === 3) {
            cm.warp(selection, 0);
            cm.dispose();
        }
    }
}