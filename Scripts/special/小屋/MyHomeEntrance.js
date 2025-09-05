//region selection

let checkHotMyHomeSelection = 0;
let enterMyHomeSelection = 1;
let boughtMyHomeSelection = 2;
let removeMyHomeSelection = 3;
let visitMyHomeSelection = 4;
let randomVisitMyHomeSelection = 5;
let adminVisitMyHomeSelection = 100;
let adminCheckMyHomeSelection = 101;

//endregion

//region system variable

let status = -1, sel = -1, sel2 = -1, sel3 = -1;
let newHomeId = -1;
let account = true;
//endregion

//region options

let showDebugText = false;
let removeMyHome = true; // 開放移除我的小屋
let hotMyHomeQuantity = 50; // 熱門小屋列表數量
let boughtFieldArray = [
    // mapName, mapId, money, cash, maplePoint, pachinko, items, npc, x, y, facingLeft, furnitureSize, trunkSize
    ["", 910000001, 100, 0, 0, 0, [[2000000, 1], [2000001, 2]], 9010001, 826, -146, true, 20, 100],
    ["海景第一排", 910000002, 200, 0, 0, 0, [[2000001, 1], [2000002, 2]], 9010001, 826, -146, true, 20, -1],
    ["林間別墅", 910000003, 300, 0, 0, 0, [[2000002, 1], [2000003, 2]], 9010001, 826, -146, true, -1, 100],
    ["叢林宅邸", 910000004, 400, 0, 0, 0, [[2000003, 1], [2000004, 2]], 9010001, 826, -146, true, 20, 100],
    ["田野鄉間", 910000005, 500, 0, 0, 0, [[2000004, 1], [2000005, 2]], 9010001, 826, -146, true, 20, 100]
];

//endregion

function start() {
    account = cm.isMyHomeAccountMode();
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        if (showDebugText) {
            cm.getPlayer().dropMessage(6, "status: " + status + " mode: " + mode + " sel: " + sel + " sel2: " + sel2 + " sel3: " + sel3);
        }
        status++;
    } else if (mode === 0) {
        if (status === 1) {
            sel = -1;
        } else if (status === 2) {
            sel2 = -1;
        } else if (status === 3) {
            if (sel === boughtMyHomeSelection) {
                status = 1; // 0
                sel = -1;
                sel2 = -1;
                sel3 = -1;
                newHomeId = -1;
            } else {
                sel3 = -1;
            }
        }
        if (showDebugText) {
            cm.getPlayer().dropMessage(6, "status: " + status + " mode: " + mode + " sel: " + sel + " sel2: " + sel2 + " sel3: " + sel3);
        }
        status--;
    } else {
        cm.dispose();
        return;
    }

    if (status <= -1) {
        cm.dispose();
    } else if (status === 0) {
        let message = "[小屋入口]\r\n\r\n";
        message += "#L" + checkHotMyHomeSelection + "##r熱門小屋列表#l\r\n";
        message += "#L" + enterMyHomeSelection + "##b進入#k我的小屋#l\r\n";
        message += "#L" + boughtMyHomeSelection + "##r購買#k小屋#l\r\n";
        if (removeMyHome) {
            message += "#L" + removeMyHomeSelection + "##r#e移除#n#k小屋#l\r\n";
        }
        message += "#L" + visitMyHomeSelection + "##d參觀#k角色小屋#l\r\n";
        message += "#L" + randomVisitMyHomeSelection + "#隨機#d參觀#k小屋#l\r\n";
        if (cm.getPlayer().isGM()) {
            message += "#L" + adminVisitMyHomeSelection + "##r管理員#k進入指定角色小屋#l\r\n";
            message += "#L" + adminCheckMyHomeSelection + "##r管理員#k查看所有小屋#l\r\n";
        }
        cm.sendSimple(message);
    } else if (status === 1) {
        if (mode === 1 && sel === -1) {
            sel = selection;
        }
        if (sel === checkHotMyHomeSelection) {
            let homeInfoList = cm.getAllMyHomeHotInfoList(hotMyHomeQuantity);
            if (homeInfoList.size() === 0) {
                cm.sendNext("目前沒有熱門小屋");
                sel = -1;
                status = -1;
            } else {
                let homeInfoListIterator = homeInfoList.iterator();
                let message = "請選擇要進入的熱門小屋:\r\n";
                message += "#d注意: 每小時更新一次且只會列出" + hotMyHomeQuantity + "個未上鎖的小屋\r\n";
                message += "\r\n";
                let i = 1;
                while (homeInfoListIterator.hasNext()) {
                    let iterator = homeInfoListIterator.next();
                    message += "#L" + iterator.getId() + "#" + getFormattedNumber(i) + "." + iterator.getCharacterName() + "-" + getFieldNickNameById(iterator.getFieldId()) + " 人氣: #r#e" + iterator.getVisitorSize() + "#k#n\r\n";
                    i++;
                }
                cm.sendSimple(message);
            }
        } else if (sel === enterMyHomeSelection) {
            let currentHomeInfoList = account ? cm.getMyHomeListByAccountId(cm.getPlayer().getAccountId()) : cm.getMyHomeListByCharacterId(cm.getPlayer().getId());
            let currentHomeInfoListIterator = currentHomeInfoList.iterator();
            if (currentHomeInfoList.size() === 0) {
                cm.sendNext("目前沒有小屋");
                sel = -1;
                status = -1;
            } else {
                let message = "請選擇要進入的小屋:\r\n\r\n";
                while (currentHomeInfoListIterator.hasNext()) {
                    let iterator = currentHomeInfoListIterator.next();
                    message += "#L" + iterator.getId() + "#" + getFieldNickNameById(iterator.getFieldId()) + "\r\n";
                }
                cm.sendSimple(message);
            }
        } else if (sel === boughtMyHomeSelection) {
            let currentHomeInfoList = account ? cm.getMyHomeListByAccountId(cm.getPlayer().getAccountId()) : cm.getMyHomeListByCharacterId(cm.getPlayer().getId());
            let message = "請選擇要購買的小屋:\r\n\r\n";
            let hasFieldToBuy = false;
            if (showDebugText) {
                cm.getPlayer().dropMessage("目前小屋數量: " + currentHomeInfoList.size());
            }
            for (let i = 0; i < boughtFieldArray.length; i++) {
                let ownTheField = false;
                let fieldId = boughtFieldArray[i][1];
                let availableFurnitureSize = boughtFieldArray[i][11];
                let availableTrunkSize = boughtFieldArray[i][12];

                let currentHomeInfoListIterator = currentHomeInfoList.iterator();
                while (currentHomeInfoListIterator.hasNext()) {
                    let iterator = currentHomeInfoListIterator.next();
                    if (iterator.getFieldId() === fieldId) {
                        ownTheField = true;
                        break;
                    }
                }
                hasFieldToBuy = true;
                if (availableFurnitureSize <= 0 && availableTrunkSize <= 0) {
                    message += "#L" + i + "#" + getFieldName(boughtFieldArray[i][0], fieldId) + " " + (ownTheField ? "(#r已購買#k)" : "") + "\r\n";
                } else if (availableFurnitureSize <= 0) {
                    message += "#L" + i + "#" + getFieldName(boughtFieldArray[i][0], fieldId) + " 無限家具空間和" + availableTrunkSize + "格倉庫" + (ownTheField ? "(#r已購買#k)" : "") + "\r\n";
                } else if (availableTrunkSize <= 0) {
                    message += "#L" + i + "#" + getFieldName(boughtFieldArray[i][0], fieldId) + " " + availableFurnitureSize + "#k個家具空間和無限倉庫" + (ownTheField ? "(#r已購買#k)" : "") + "\r\n";
                } else {
                    message += "#L" + i + "#" + getFieldName(boughtFieldArray[i][0], fieldId) + " " + availableFurnitureSize + "#k個家具空間和" + availableTrunkSize + "格倉庫" + (ownTheField ? "(#r已購買#k)" : "") + "\r\n";
                }
            }
            if (!hasFieldToBuy) {
                cm.sendNext("目前沒有可購買的小屋");
                sel = -1;
                status = -1;
            } else {
                cm.sendSimple(message);
            }
        } else if (sel === removeMyHomeSelection) {
            let currentHomeInfoList = account ? cm.getMyHomeListByAccountId(cm.getPlayer().getAccountId()) : cm.getMyHomeListByCharacterId(cm.getPlayer().getId());
            let currentHomeInfoListIterator = currentHomeInfoList.iterator();
            if (currentHomeInfoList.size() === 0) {
                cm.sendNext("目前沒有小屋");
                sel = -1;
                status = -1;
            } else {
                let message = "請選擇要#r#e移除的小屋:#k#n\r\n\r\n";
                while (currentHomeInfoListIterator.hasNext()) {
                    let iterator = currentHomeInfoListIterator.next();
                    message += "#L" + iterator.getId() + "#" + getFieldNickNameById(iterator.getFieldId()) + "\r\n";
                }
                cm.sendSimple(message);
            }
        } else if (sel === visitMyHomeSelection) {
            cm.sendGetText("請輸入要參觀小屋的角色名稱");
        } else if (sel === randomVisitMyHomeSelection) {
            let homeInfo = getRandomAvailableHome(cm.getPlayer().getId(), cm.getPlayer().getParty());
            if (homeInfo === null) {
                cm.sendNext("目前沒有可參觀的小屋");
                sel = -1;
                status = -1;
            } else {
                cm.dispose();
                if (cm.getPlayer().getParty() != null) {
                    if (!cm.warpPartyToMyHome(homeInfo.getId(), true)) {
                        cm.sendNext("傳送時發生未知錯誤");
                    }
                } else {
                    if (!cm.warpToMyHome(homeInfo.getId(), (account ? (homeInfo.getAccountId() !== cm.getPlayer().getAccountId()) : (homeInfo.getCharacterId() !== cm.getPlayer().getId())))) {
                        cm.sendNext("傳送時發生未知錯誤");
                    }
                }
            }
        } else if (sel === adminVisitMyHomeSelection) {
            cm.sendGetText("請輸入要參觀小屋的角色名稱");
        } else if (sel === adminCheckMyHomeSelection) {
            let message = "請選擇要查看小屋的角色:\r\n\r\n";
            if (account) {
                let accountIdList = getAvailableAccountIdListInMyHome();
                for (let i = 0; i < accountIdList.length; i++) {
                    let accountId = accountIdList[i];
                    let characterIdList = cm.getCharacterIdsInAccount(accountId, cm.getPlayer().getMap().getWorld());
                    let characterName;
                    if (characterIdList.length > 0) {
                        characterName = cm.getCharacterNameById(characterIdList[0]);
                    } else {
                        characterName = "無角色";
                    }
                    message += "#L" + accountId + "##b" + characterName + "#k - #d" + cm.getMyHomeListByAccountId(accountId).size() + "#k間小屋#l\r\n";
                }
                if (accountIdList.length === 0) {
                    cm.sendNext("目前沒有可參觀的小屋");
                    sel = -1;
                    status = -1;
                } else {
                    cm.sendSimple(message);
                }
            } else {
                let characterIdList = getAvailableCharacterIdListInMyHome();
                for (let i = 0; i < characterIdList.length; i++) {
                    let characterId = characterIdList[i];
                    message += "#L" + characterId + "##b" + cm.getCharacterNameById(characterId) + "#k - #d" + cm.getMyHomeListByCharacterId(characterId).size() + "#k間小屋#l\r\n";
                }
                if (characterIdList.length === 0) {
                    cm.sendNext("目前沒有可參觀的小屋");
                    sel = -1;
                    status = -1;
                } else {
                    cm.sendSimple(message);
                }
            }

        }
    } else if (status === 2) {
        if (mode === 1 && sel2 === -1) {
            sel2 = selection;
        }
        if (sel === checkHotMyHomeSelection) {
            let homeInfo = cm.getMyHome(sel2);
            if (homeInfo === null) {
                cm.sendNext("該小屋目前未開放進入");
                sel2 = -1;
                status = 0;
            } else if (homeInfo.isPrivateHome() || homeInfo.getSubInfo().isBlockUser(cm.getPlayer().getId())) {
                cm.sendNext("該小屋目前未開放進入");
                sel2 = -1;
                status = 0;
            } else {
                if (homeInfo.getPassword().length() > 0 && (account ? (homeInfo.getAccountId() !== cm.getPlayer().getAccountId()) : (homeInfo.getCharacterId() !== cm.getPlayer().getId()))) {
                    cm.sendGetText("請輸入" + homeInfo.getCharacterName() + "的小屋 - " + getFieldNickNameById(homeInfo.getFieldId()) + "密碼");
                } else {
                    cm.sendYesNo("是否確認要進入" + homeInfo.getCharacterName() + "的小屋: " + getFieldNickNameById(homeInfo.getFieldId()));
                }
            }
        } else if (sel === enterMyHomeSelection) {
            if (cm.getPlayer().getParty() != null) {
                if (!cm.warpPartyToMyHome(sel2, true)) {
                    cm.sendNext("傳送時發生未知錯誤");
                }
            } else {
                if (!cm.warpToMyHome(sel2, false)) {
                    cm.sendNext("傳送時發生未知錯誤");
                }
            }
            cm.dispose();

        } else if (sel === boughtMyHomeSelection) {
            let currentHomeInfoList = account ? cm.getMyHomeListByAccountId(cm.getPlayer().getAccountId()) : cm.getMyHomeListByCharacterId(cm.getPlayer().getId());
            let currentHomeInfoListIterator = currentHomeInfoList.iterator();
            let ownTheField = false;
            let fieldId = boughtFieldArray[sel2][1];

            while (currentHomeInfoListIterator.hasNext()) {
                let iterator = currentHomeInfoListIterator.next();
                if (iterator.getFieldId() === fieldId) {
                    ownTheField = true;
                    break;
                }
            }
            if (ownTheField) {
                cm.sendNext("已經有該小屋，無法重複購買");
                sel2 = -1;
                status = 0;
            } else {
                let itemInfoList = boughtFieldArray[sel2][6];
                let availableFurnitureSize = boughtFieldArray[sel2][11];
                let availableTrunkSize = boughtFieldArray[sel2][12];
                let message = "是否確認購買小屋-" + getFieldName(boughtFieldArray[sel2][0], fieldId) + "\r\n";
                if (availableFurnitureSize > 0 && availableTrunkSize > 0) {
                    message += "#b" + availableFurnitureSize + "#k個家具空間\r\n";
                    message += "#r" + availableTrunkSize + "#k個家具倉庫空間\r\n";
                }
                // mapName, mapId, money, cash, maplePoint, items
                message += "該小屋需要:\r\n\r\n";
                if (boughtFieldArray[sel2][2] > 0) {
                    message += cm.numberWithCommas(boughtFieldArray[sel2][2]) + getMoneyName() + "\r\n";
                }
                if (boughtFieldArray[sel2][3] > 0) {
                    message += cm.numberWithCommas(boughtFieldArray[sel2][3]) + getCashName() + "\r\n";
                }
                if (boughtFieldArray[sel2][4] > 0) {
                    message += cm.numberWithCommas(boughtFieldArray[sel2][4]) + getMaplePointName() + "\r\n";
                }
                if (boughtFieldArray[sel2][5] > 0) {
                    message += cm.numberWithCommas(boughtFieldArray[sel2][5]) + getPachinkoName() + "\r\n";
                }
                if (itemInfoList.length > 0) {
                    for (let i = 0; i < itemInfoList.length; i++) {
                        let itemId = itemInfoList[i][0];
                        let itemQuantity = itemInfoList[i][1];
                        message += "#v" + itemId + "##t" + itemId + "#x" + cm.numberWithCommas(itemQuantity) + "個\r\n";
                    }
                }
                cm.sendYesNo(message)
            }
        } else if (sel === removeMyHomeSelection) {
            let homeInfo = cm.getMyHome(sel2);
            if (homeInfo === null) {
                cm.sendNext("發生未知錯誤: " + sel2);
                cm.dispose();
            } else {
                cm.sendYesNo("#r是否確認要移除我的小屋-" + getFieldNickNameById(homeInfo.getFieldId()) + "，此動作無法反悔?#k");
            }
        } else if (sel === visitMyHomeSelection) {
            let characterName = cm.getText();
            let characterId = cm.getCharacterIdByName(characterName);
            if (characterId === -1) {
                cm.sendNext("找不到角色`" + characterName + "`");
                sel2 = -1;
                status = 0;
                return;
            }
            let homeList
            if (account) {
                let accountId = cm.getAccountIdByChrName(characterName);
                homeList = cm.getMyHomeListByAccountId(accountId);
                if (homeList.size() === 0) {
                    cm.sendNext("角色`" + characterName + "`目前沒有可進入的小屋");
                    sel2 = -1;
                    status = 0;
                    return;
                }
            } else {
                homeList = cm.getMyHomeListByCharacterId(characterId);
                if (homeList.size() === 0) {
                    cm.sendNext("角色`" + characterName + "`目前沒有可進入的小屋");
                    sel2 = -1;
                    status = 0;
                    return;
                }
            }
            let next = false;
            let message = "請選擇要進入的小屋:\r\n";
            let homeListIterator = homeList.iterator();
            while (homeListIterator.hasNext()) {
                let iterator = homeListIterator.next();
                if (!iterator.isPrivateHome() && !iterator.getSubInfo().isBlockUser(cm.getPlayer().getId())) {
                    next = true;
                    message += "#L" + iterator.getId() + "#" + getFieldNickNameById(iterator.getFieldId()) + "" + (iterator.getPassword().length() > 0 ? "(需要密碼)" : "") + "\r\n";
                }
            }
            if (!next) {
                cm.sendNext("角色`" + characterName + "`目前沒有可進入的小屋");
                sel2 = -1;
                status = 0;
                return;
            }
            cm.sendSimple(message);
        } else if (sel === adminVisitMyHomeSelection) {
            let characterName = cm.getText();
            let characterId = cm.getCharacterIdByName(characterName);
            if (characterId === -1) {
                cm.sendNext("找不到角色`" + characterName + "`");
                sel2 = -1;
                status = 0;
                return;
            }
            let homeList
            if (account) {
                let accountId = cm.getAccountIdByChrName(characterName);
                homeList = cm.getMyHomeListByAccountId(accountId);
                if (homeList.size() === 0) {
                    cm.sendNext("角色`" + characterName + "`目前沒有小屋");
                    sel2 = -1;
                    status = 0;
                    return;
                }
            } else {
                homeList = cm.getMyHomeListByCharacterId(characterId);
                if (homeList.size() === 0) {
                    cm.sendNext("角色`" + characterName + "`目前沒有小屋");
                    sel2 = -1;
                    status = 0;
                    return;
                }
            }
            let message = "角色`" + characterName + "`小屋如下\r\n\r\n";
            let homeListIterator = homeList.iterator();
            while (homeListIterator.hasNext()) {
                let iterator = homeListIterator.next();
                next = true;
                message += "#L" + iterator.getId() + "#" + getFieldNickNameById(iterator.getFieldId()) + "" + (iterator.getPassword().length() > 0 ? "(有密碼)" : "") + "\r\n";
            }
            cm.sendSimple(message);
        } else if (sel === adminCheckMyHomeSelection) {
            let homeList = account ? cm.getMyHomeListByAccountId(sel2) : cm.getMyHomeListByCharacterId(sel2);
            let message = "請選擇要進入的小屋:\r\n";
            let homeListIterator = homeList.iterator();
            while (homeListIterator.hasNext()) {
                let iterator = homeListIterator.next();
                message += "#L" + iterator.getId() + "#" + getFieldNickNameById(iterator.getFieldId()) + "" + (iterator.getPassword().length() > 0 ? "(有密碼)" : "") + "\r\n";
            }
            cm.sendSimple(message);
        }
    } else if (status === 3) {
        if (mode === 1 && sel3 === -1) {
            sel3 = selection;
        }
        if (sel === checkHotMyHomeSelection) {
            let homeInfo = cm.getMyHome(sel2);
            if (homeInfo === null) {
                cm.sendNext("發生未知錯誤: " + sel2);
                cm.dispose();
            } else {
                if (homeInfo.getPassword().length() > 0 && (account ? (homeInfo.getAccountId() !== cm.getPlayer().getAccountId()) : (homeInfo.getCharacterId() !== cm.getPlayer().getId()))) {
                    if (!homeInfo.isCorrectPassword(cm.getText())) {
                        cm.sendNext("密碼錯誤，請重試");
                        status = 1;
                    } else {
                        cm.warpToMyHome(homeInfo.getId(), (account ? (homeInfo.getAccountId() !== cm.getPlayer().getAccountId()) : (homeInfo.getCharacterId() !== cm.getPlayer().getId())));
                        cm.dispose();
                    }
                } else {
                    cm.warpToMyHome(homeInfo.getId(), (account ? (homeInfo.getAccountId() !== cm.getPlayer().getAccountId()) : (homeInfo.getCharacterId() !== cm.getPlayer().getId())));
                    cm.dispose();
                }
            }
        } else if (sel === boughtMyHomeSelection) {
            if (cm.getMeso() < boughtFieldArray[sel2][2]) {
                cm.sendNext("至少需要" + cm.numberWithCommas(boughtFieldArray[sel2][2]) + getMoneyName());
                cm.dispose();
                return;
            } else if (cm.getCash(1) < boughtFieldArray[sel2][3]) {
                cm.sendNext("至少需要" + cm.numberWithCommas(boughtFieldArray[sel2][3]) + getCashName());
                cm.dispose();
                return;
            } else if (cm.getCash(2) < boughtFieldArray[sel2][4]) {
                cm.sendNext("至少需要" + cm.numberWithCommas(boughtFieldArray[sel2][4]) + getMaplePointName());
                cm.dispose();
                return;
            } else if (cm.getBeans() < boughtFieldArray[sel2][5]) {
                cm.sendNext("至少需要" + cm.numberWithCommas(boughtFieldArray[sel2][5]) + getPachinkoName());
                cm.dispose();
                return;
            }
            let itemInfoList = boughtFieldArray[sel2][6];
            for (let i = 0; i < itemInfoList.length; i++) {
                let itemId = itemInfoList[i][0];
                let itemQuantity = itemInfoList[i][1];
                if (!cm.haveItem(itemId, itemQuantity)) {
                    cm.sendNext("身上沒有#v" + itemId + "##t" + itemId + "#x" + cm.numberWithCommas(itemQuantity) + "個");
                    cm.dispose();
                    return;
                }
            }
            if (boughtFieldArray[sel2][2] > 0) {
                cm.gainMeso(-boughtFieldArray[sel2][2]);
            }
            if (boughtFieldArray[sel2][3] > 0) {
                cm.gainCash(1, -boughtFieldArray[sel2][3]);
            }
            if (boughtFieldArray[sel2][4] > 0) {
                cm.gainCash(2, -boughtFieldArray[sel2][4]);
            }
            if (boughtFieldArray[sel2][5] > 0) {
                cm.getPlayer().gainBean(-boughtFieldArray[sel2][5]);
            }
            for (let i = 0; i < itemInfoList.length; i++) {
                let itemId = itemInfoList[i][0];
                let itemQuantity = itemInfoList[i][1];
                cm.gainItem(itemId, -itemQuantity);
            }
            let info = cm.addMyHome(cm.getPlayer().getId(), cm.getPlayer().getAccountId(), boughtFieldArray[sel2][1], boughtFieldArray[sel2][11], boughtFieldArray[sel2][12]);
            info.getSubInfo().addFurniture(boughtFieldArray[sel2][7], 1, boughtFieldArray[sel2][8], boughtFieldArray[sel2][9], boughtFieldArray[sel2][10]);
            cm.sendYesNo("購買小屋成功: " + getFieldName(boughtFieldArray[sel2][0], boughtFieldArray[sel2][1]) + "，是否要立刻前往?");
            newHomeId = info.getId();
        } else if (sel === removeMyHomeSelection) {
            let homeInfo = cm.getMyHome(sel2);
            if (homeInfo === null) {
                cm.sendNext("發生未知錯誤: " + sel2);
                cm.dispose();
            } else {
                cm.sendYesNo("#b#e2次#n#r是否確認要移除我的小屋-" + getFieldNickNameById(homeInfo.getFieldId()) + "，此動作無法反悔?#k")
            }
        } else if (sel === visitMyHomeSelection) {
            let homeInfo = cm.getMyHome(sel3);
            if (homeInfo === null) {
                cm.sendNext("發生未知錯誤: " + sel3);
                cm.dispose();
            } else {
                if (homeInfo.getPassword().length() > 0) {
                    cm.sendGetText("請輸入" + homeInfo.getCharacterName() + "的小屋 - " + getFieldNickNameById(homeInfo.getFieldId()) + "密碼");
                } else {
                    cm.sendYesNo("是否確認要進入" + homeInfo.getCharacterName() + "的小屋: " + getFieldNickNameById(homeInfo.getFieldId()));
                }
            }
        } else if (sel === adminVisitMyHomeSelection || sel === adminCheckMyHomeSelection) {
            cm.warpToMyHome(selection, false);
            cm.dispose();
        }
    } else if (status === 4) {
        if (sel === visitMyHomeSelection) {
            let homeInfo = cm.getMyHome(sel3);
            if (homeInfo === null) {
                cm.sendNext("發生未知錯誤: " + sel3);
                cm.dispose();
            } else {
                if (homeInfo.getPassword().length() > 0) {
                    if (!homeInfo.isCorrectPassword(cm.getText())) {
                        cm.sendNext("密碼錯誤，請重試");
                        status = 2;
                    } else {
                        cm.warpToMyHome(homeInfo.getId(), (account ? (homeInfo.getAccountId() !== cm.getPlayer().getAccountId()) : (homeInfo.getCharacterId() !== cm.getPlayer().getId())));
                        cm.dispose();
                    }
                } else {
                    cm.warpToMyHome(homeInfo.getId(), (account ? (homeInfo.getAccountId() !== cm.getPlayer().getAccountId()) : (homeInfo.getCharacterId() !== cm.getPlayer().getId())));
                    cm.dispose();
                }
            }
        } else if (sel === removeMyHomeSelection) {
            let homeInfo = cm.getMyHome(sel2);
            if (homeInfo === null) {
                cm.sendNext("發生未知錯誤: " + sel2);
                cm.dispose();
            } else {
                cm.sendNext("小屋-" + getFieldNickNameById(homeInfo.getFieldId()) + "已經#r移除#k");
                cm.removeMyHome(sel2);
                status = -1;
                sel = -1;
                sel2 = -1;
                sel3 = -1;
            }
        } else if (sel === boughtMyHomeSelection) {
            if (cm.getPlayer().getParty() != null) {
                if (!cm.warpPartyToMyHome(newHomeId, true)) {
                    cm.sendNext("傳送時發生未知錯誤");
                }
            } else {
                if (!cm.warpToMyHome(newHomeId, false)) {
                    cm.sendNext("傳送時發生未知錯誤");
                }
            }
            cm.dispose();
        }
    }
}

function getFieldNickNameById(fieldId) {
    for (let i = 0; i < boughtFieldArray.length; i++) {
        let localFieldId = boughtFieldArray[i][1];
        if (localFieldId === fieldId && boughtFieldArray[i][0].length > 0) {
            return boughtFieldArray[i][0];
        }
    }
    return "#m" + fieldId + "#";
}

function getFieldName(fieldNickName, fieldId) {
    if (fieldNickName.length === 0) {
        return cm.getMapName(fieldId);
    }
    return fieldNickName;
}

function getAvailableAccountIdListInMyHome() {
    let result = [];
    let myHomeList = cm.getAllMyHomeList();
    let iterator = myHomeList.iterator();
    while (iterator.hasNext()) {
        let myHomeInfo = iterator.next();
        if (!inArray(result, myHomeInfo.getAccountId())) {
            result.push(myHomeInfo.getAccountId());
        }
    }
    if (myHomeList.size() === 0) {
        return [];
    }
    return result;
}

function getAvailableCharacterIdListInMyHome() {
    let result = [];
    let myHomeList = cm.getAllMyHomeList();
    let iterator = myHomeList.iterator();
    while (iterator.hasNext()) {
        let myHomeInfo = iterator.next();
        if (!inArray(result, myHomeInfo.getCharacterId())) {
            result.push(myHomeInfo.getCharacterId());
        }
    }
    if (myHomeList.size() === 0) {
        return [];
    }
    return result;
}

function getRandomAvailableHome(characterId, party) {
    let result = [];
    let myHomeList = cm.getAllMyHomeList();
    let myHomeIterator = myHomeList.iterator();
    if (party != null) {
        let partyOnlineCharacterIdList = party.getPartyOnlineMemberIds();
        while (myHomeIterator.hasNext()) {
            let myHomeInfo = myHomeIterator.next();
            if (!myHomeInfo.isPrivateHome() && myHomeInfo.getPassword().length() === 0) {
                let hasBlockUser = false;
                let partyOnlineCharacterIdListIterator = partyOnlineCharacterIdList.iterator();
                while (partyOnlineCharacterIdListIterator.hasNext()) {
                    let partyCharacterId = partyOnlineCharacterIdListIterator.next();
                    if (myHomeInfo.getSubInfo().isBlockUser(partyCharacterId)) {
                        hasBlockUser = true;
                        break;
                    }
                }
                if (!hasBlockUser) {
                    result.push(myHomeInfo);
                }
            }
        }
    } else {
        while (myHomeIterator.hasNext()) {
            let myHomeInfo = myHomeIterator.next();
            if (!myHomeInfo.isPrivateHome() && !myHomeInfo.getSubInfo().isBlockUser(characterId) && myHomeInfo.getPassword().length() === 0) {
                result.push(myHomeInfo);
            }
        }
    }
    if (myHomeList.size() === 0) {
        return null;
    }
    return result[cm.getRandomValue(0, result.length - 1)];
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

function getFormattedNumber(number) {
    if (number < 10) {
        return "0" + number;
    }
    return number;
}

function inArray(array, element) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === element) {
            return true;
        }
    }
    return false;
}