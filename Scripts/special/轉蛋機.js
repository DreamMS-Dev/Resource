/**
 * 高級轉蛋機
 * 2023.01.08 初版
 * 2024.03.23 加入最後賞功能
 * 2024.12.13 加入保底功能
 * By Windyboy
 */

let status = -1, sel = -1, sel2 = -1, sel3 = -1;
let newItemId = -1, newWeight = -1, newMinimumQuantity = -1, newMaximumQuantity = -1, newLeftQuantity = -1,
newAutoResetLeftQuantityPerDay = -1;
let newBroadcast = false, newMinusLeftQuantity = false, newRandomEquipmentStat = false, newAccumulationPoint = -1,
newTotalAccumulationPoint = -1;
let gachaponLogName;

let gachaponName = "轉蛋機";
let reqItemId = 5220000; // 需要的道具，不使用則填入0
let reqItemQuantity = 1; // 需要的道具數量
let reqMoney = 0; // 需要的錢，不使用則填入0
let reqCash = 0; // 需要的Gash數量，不使用則填入0
let reqMaplePoint = 0; // 需要的楓葉點數數量，不使用則填入0
let reqPachinko = 0; // 需要的小鋼珠數量，不使用則填入0
let reqCharacterLog = ""; // 需要的角色Log紀錄名稱
let reqCharacterLogName = ""; // 需要的角色Log名稱(顯示用)
let reqCharacterLogCount = 0; // 需要的角色Log紀錄，不使用則填入0
let reqAccountLog = ""; // 需要的帳號Log紀錄名稱
let reqAccountLogName = ""; // 需要的帳號Log名稱(顯示用)
let reqAccountLogCount = 0; // 需要的帳號Log紀錄，不使用則填入0

// 將轉蛋內最後一個有剩餘數量道具抽走後額外獲得的獎勵道具
let lastLeftQuantityRewardItemId = 0; // 獎勵道具代碼 (填入0為不啟用)
let lastLeftQuantityRewardItemQuantity = 1; // 獎勵道具數量
let lastLeftQuantityRewardItemPeriod = -1; // 獎勵道具天數 (-1為永久)
let lastLeftQuantityRewardItemBroadcast = true; // 獎勵道具是否廣播

// 角色保底機制
let guaranteedPullMechanism = true; // 是否啟用保底
let shouldGiveGuaranteedReward = true; // 未中大獎時，是否給予保底道具 (可以直接透過將保底加入轉蛋池並將權重改的非常高來直接給予道具，因此不一定要額外給予)
let showRemainingGuaranteedPulls = true; // 是否顯示剩餘保底數量
let grandPrizeItems = [2000001, 2000002]; // 道具代碼，抽到的不是此列表內的代碼時，將給予額外保底道具，反之將清除一次保底數量
let guaranteedRewardItemId = 4000000; // 未中大獎時，給予角色的額外保底道具，主要用於計算次數
let guaranteedRewardQuantity = 100; // 保底數量

let gachaponType = 1; // 轉蛋機類型
let showContent = true; // 顯示內容
let showContentQuantity = true; // 顯示獲得隨機數量
let showContentLeftQuantity = true; // 顯示剩餘數量
let showContentWeight = false; // 顯示權重
let fullInventoryToRewardBox = false; // 背包滿了自動放入類型1000的獎勵箱內

function start() {
    if (!canGachapon() && !cm.getPlayer().isGM()) {
        cm.sendNext("目前未開放");
        cm.dispose();
        return;
    }
    gachaponLogName = "gachaponStatus_" + gachaponType;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === 0) {
        if (status === 1) {
            sel = -1;
        }
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status <= -1) {
        cm.dispose();
    } else if (status === 0) {
        let msg = gachaponName;
        if (!canGachapon()) {
            msg += "#r關閉中#K\r\n\r\n";
        } else {
            msg += "\r\n";
        }
        msg += "#L0##d開始#k抽獎";
        if (reqItemId > 0 && reqItemQuantity > 0) {
            if (reqItemQuantity === 1) {
                msg += "(需要#v" + reqItemId + "#)";
            } else {
                msg += "(需要#v" + reqItemId + "x" + cm.numberWithCommas(reqItemQuantity) + "#)";
            }
        } else if (reqMoney > 0) {
            msg += "(需要" + cm.numberWithCommas(reqMoney) + "元)";
        } else if (reqCash > 0) {
            msg += "(需要" + cm.numberWithCommas(reqCash) + getCashName() + ")";
        } else if (reqMaplePoint > 0) {
            msg += "(需要" + cm.numberWithCommas(reqMaplePoint) + getMaplePointName() + ")";
        } else if (reqPachinko > 0) {
            msg += "(需要" + cm.numberWithCommas(reqPachinko) + getPachinkoName() + ")";
        } else if (reqCharacterLogCount > 0) {
            msg += "(需要" + cm.numberWithCommas(reqCharacterLogCount) + reqCharacterLogName + ")";
        } else if (reqAccountLogCount > 0) {
            msg += "(需要" + cm.numberWithCommas(reqAccountLogCount) + reqAccountLogName + ")";
        }

        if (guaranteedPullMechanism && showRemainingGuaranteedPulls) {
            msg += " 保底: " + cm.getItemQuantity(guaranteedRewardItemId) + "/" + guaranteedRewardQuantity + "#l\r\n";
        } else {
            msg += "#l\r\n";
        }

        if (showContent || cm.getPlayer().isGM()) {
            msg += "#L1#查看內容物#l\r\n";
        }
        if (cm.getPlayer().isGM()) {
            msg += "\r\n\r\n";
            msg += "#L10##b新增#k道具#l\r\n";
            msg += "#L11##r移除#k道具#l\r\n";
            msg += "#L12##d修改#k道具#l\r\n";
            msg += "#L100##b儲存#k轉蛋系統#l\r\n";
            msg += "#L101##r" + (canGachapon() ? "關閉" : "開啟") + "#k此轉蛋機#l\r\n";
            if (guaranteedPullMechanism) {
                msg += "\r\n---------保底資訊---------\r\n"
                msg += "保底道具代碼: " + guaranteedRewardItemId + "\r\n";
                msg += "保底數量: " + guaranteedRewardQuantity + "\r\n";
                msg += "保底時大獎列表: " + grandPrizeItems + "\r\n";

            }
        }
        cm.sendSimple(msg);
    } else if (status === 1) {
        if (mode === 1 && sel === -1) {
            sel = selection;
        }
        if (sel === 0) {
            if (!canGachapon() && !cm.getPlayer().isGM()) {
                cm.sendNext("目前未開放");
                cm.dispose();
                return;
            }
            if (reqItemId > 0 && reqItemQuantity > 0) {
                if (!cm.haveItem(reqItemId, reqItemQuantity)) {
                    cm.sendNext("身上的#r#v" + reqItemId + "##t" + reqItemId + "##k不足，至少需要" + cm.numberWithCommas(reqItemQuantity) + "個");
                    resetValue();
                    return;
                }
            } else if (reqMoney > 0) {
                if (cm.getMeso() < reqMoney) {
                    cm.sendNext("身上的" + getMoneyName() + "#k至少需要" + cm.numberWithCommas(reqMoney));
                    resetValue();
                    return;
                }
            } else if (reqCash > 0) {
                if (cm.getPlayer().getCSPoints(1) < reqCash) {
                    cm.sendNext("身上的" + getCashName() + "#k至少需要" + cm.numberWithCommas(reqCash));
                    resetValue();
                    return;
                }
            } else if (reqMaplePoint > 0) {
                if (cm.getPlayer().getCSPoints(2) < reqMaplePoint) {
                    cm.sendNext("身上的" + getMaplePointName() + "#k至少需要" + cm.numberWithCommas(reqMaplePoint));
                    resetValue();
                    return;
                }
            } else if (reqPachinko > 0) {
                if (cm.getPlayer().getBean() < reqPachinko) {
                    cm.sendNext("身上的" + getPachinkoName() + "#k至少需要" + cm.numberWithCommas(reqPachinko));
                    resetValue();
                    return;
                }
            } else if (reqCharacterLogCount > 0) {
                if (cm.getPlayer().getLogValue(reqCharacterLog) < reqCharacterLogCount) {
                    cm.sendNext(reqCharacterLogName + "#k至少需要" + cm.numberWithCommas(reqCharacterLogCount));
                    resetValue();
                    return;
                }
            } else if (reqAccountLogCount > 0) {
                if (cm.getPlayer().getAccLogValue(reqAccountLog) < reqAccountLogCount) {
                    cm.sendNext(reqAccountLogName + "#k至少需要" + cm.numberWithCommas(reqAccountLogCount));
                    resetValue();
                    return;
                }
            } else if (guaranteedPullMechanism && shouldGiveGuaranteedReward && !cm.canHold(guaranteedRewardItemId, 1)) {
                cm.sendNext("背包放不下保底道具，請整理後再試");
                cm.dispose();
                return;
            }

            let info = cm.getGachaponItem(gachaponType);
            if (info === null) {
                cm.sendNext("沒有任何道具可以抽了");
                resetValue();
            } else if (!cm.hasAllSpace(2)) {
                cm.sendNext("每種背包至少需要留下2個空位");
                resetValue();
            } else {
                if (reqItemId > 0 && reqItemQuantity > 0) {
                    cm.gainItem(reqItemId, -reqItemQuantity);
                } else if (reqMoney > 0) {
                    cm.gainMeso(-reqMoney);
                } else if (reqCash > 0) {
                    cm.gainCash(1, -reqCash);
                } else if (reqMaplePoint > 0) {
                    cm.gainCash(2, -reqMaplePoint);
                } else if (reqPachinko > 0) {
                    cm.getPlayer().gainBean(-reqPachinko);
                } else if (reqCharacterLogCount > 0) {
                    cm.getPlayer().addLogValue(reqCharacterLog, -reqCharacterLogCount);
                } else if (reqAccountLogCount > 0) {
                    cm.getPlayer().addAccLogValue(reqAccountLog, -reqAccountLogCount);
                }

                let isMinusLeftQuantityItem = lastLeftQuantityRewardItemId > 0 && info.isMinusLeftQuantity() && info.getLeftQuantity() > 0;
                let isGuaranteedPull = guaranteedPullMechanism && cm.getItemQuantity(guaranteedRewardItemId) >= guaranteedRewardQuantity && grandPrizeItems.length > 0;
                let item;
                if (isGuaranteedPull) {
                    item = getItem(grandPrizeItems[Math.floor(Math.random() * grandPrizeItems.length)]);
                } else {
                    item = info.getItem(true);
                    if (info.isBroadcast()) {
                        cm.gachaponMessage(cm.getPlayer().getName() + " : 從" + gachaponName + "中獲得了道具x" + item.getQuantity(), "", item);
                    }
                }

                if (fullInventoryToRewardBox && !cm.canHold(item.getItemId())) {
                    cm.addRewardToCharacter(cm.getPlayer().getId(), 1000, -1, "背包已滿", 0, 0, 0, 0, item.getItemId(), item.getQuantity(), -1, "");
                    cm.sendNext("獲得了: #v" + item.getItemId() + "##t" + item.getItemId() + "#，但是背包已滿，已自動放入滿包獎勵箱");
                } else if (!cm.canHold(item.getItemId())) {
                    cm.getPlayer().getMap().spawnItemDrop(item, cm.getPlayer().getPosition());
                    cm.sendNext("獲得了: #v" + item.getItemId() + "##t" + item.getItemId() + "#，但是背包已滿，所以直接丟地板上");
                } else {
                    cm.addByItem(item);
                    cm.sendNext("獲得了: #v" + item.getItemId() + "##t" + item.getItemId() + "#");
                }
                if (guaranteedPullMechanism) {
                    if (hasId(grandPrizeItems, item.getItemId())) {
                        if (cm.getItemQuantity(guaranteedRewardItemId) > 0) {
                            cm.gainItem(guaranteedRewardItemId,  - (Math.min(cm.getItemQuantity(guaranteedRewardItemId), guaranteedRewardQuantity)));
                        }
                    } else if (shouldGiveGuaranteedReward) {
                        cm.gainItem(guaranteedRewardItemId, 1);
                    }
                }
                if (!isGuaranteedPull && isMinusLeftQuantityItem && info.getLeftQuantity() === 0) {
                    let list = cm.getGachaponRewardInfo(gachaponType);
                    if (list != null) {
                        let iterator = list.iterator();
                        let noLeft = true;
                        while (iterator.hasNext()) {
                            let info = iterator.next();
                            if (info.isMinusLeftQuantity() && info.getLeftQuantity() > 0) {
                                noLeft = false;
                                break;
                            }
                        }
                        if (noLeft) {
                            let lastRewardItem;
                            if (lastLeftQuantityRewardItemId >= 2000000) {
                                lastRewardItem = cm.getNewItem(lastLeftQuantityRewardItemId, 0, lastLeftQuantityRewardItemQuantity);
                            } else {
                                lastRewardItem = cm.getEquipById(lastLeftQuantityRewardItemId);
                            }
                            if (lastLeftQuantityRewardItemPeriod > 0) {
                                lastRewardItem.setExpiration(cm.getCurrentTime() + (lastLeftQuantityRewardItemPeriod * 24 * 60 * 60 * 1000));
                            }
                            if (fullInventoryToRewardBox && !cm.canHold(lastLeftQuantityRewardItemId, lastLeftQuantityRewardItemQuantity)) {
                                cm.addRewardToCharacter(cm.getPlayer().getId(), 1000, -1, "背包已滿", 0, 0, 0, 0, lastLeftQuantityRewardItemId, lastLeftQuantityRewardItemQuantity, -1, "");
                                cm.getPlayer().dropMessage(5, "獲得了最後賞'" + cm.getItemName(lastLeftQuantityRewardItemId) + "'，但是背包已滿，已自動放入滿包獎勵箱");
                            } else {
                                if (!cm.canHold(lastLeftQuantityRewardItemId, lastLeftQuantityRewardItemQuantity)) {
                                    cm.getPlayer().getMap().spawnItemDrop(lastRewardItem, cm.getPlayer().getPosition());
                                    cm.getPlayer().dropMessage(5, "獲得了最後賞'" + cm.getItemName(lastLeftQuantityRewardItemId) + "'，但是背包已滿，所以直接丟地板上");
                                } else {
                                    cm.addByItem(lastRewardItem);
                                    cm.getPlayer().dropMessage(5, "獲得了最後賞'" + cm.getItemName(lastLeftQuantityRewardItemId) + "'");
                                }
                            }
                            if (lastLeftQuantityRewardItemBroadcast) {
                                cm.gachaponMessage(cm.getPlayer().getName() + " : 從" + gachaponName + "中獲得了最後賞", "", lastRewardItem);
                            }
                        }
                    }
                }
                resetValue();
            }

        } else if (sel === 1) {
            if (!showContent && !cm.getPlayer().isGM()) {
                cm.sendNext("發生錯誤");
            } else {
                cm.sendNext(getRewardList(false));
            }
            resetValue();
        } else if (sel === 10) {
            cm.sendGetNumber("請輸入要新增的道具代碼:\r\n\r\n", 1000000, 1000000, 6000000);
        } else if (sel === 11) {
            cm.sendSimple("請選擇要#r移除#k的轉蛋道具\r\n\r\n" + getRewardList(true));
        } else if (sel === 12) {
            cm.sendSimple("請選擇要#d修改#k的轉蛋道具\r\n\r\n" + getRewardList(true));
        } else if (sel === 100) {
            cm.getPlayer().dropMessage(6, "正在儲存轉蛋機系統，請等待Npc提示儲存完成...");
            cm.saveGachaponSystem();
            cm.sendNext("儲存完成");
            resetValue();
        } else if (sel === 101) {
            toggleGachapon(!canGachapon());
            cm.sendNext("目前轉蛋機已經: " + (canGachapon() ? "開放" : "關閉"));
            resetValue();
        }
    } else if (status === 2) {
        if (mode === 1 && sel2 === -1) {
            sel2 = selection;
        }
        if (sel === 10) {
            if (mode === 1 && newItemId === -1) {
                newItemId = selection;
                if (!cm.itemExists(newItemId)) {
                    cm.sendNext("道具不存在: " + newItemId);
                    resetValue();
                    return;
                }
            }
            cm.sendGetNumber(getAddedValueMessage(false, false, false) + "\r\n\r\n請輸入要新增的道具權重:\r\n\r\n", 10000, 1, 2100000000);
        } else if (sel === 11) {
            if (sel2 === -1) {
                cm.sendNext("未選擇道具");
                resetValue();
                return;
            }
            cm.sendYesNo("是否確認移除轉蛋獎勵:\r\n" + getReward(cm.getGachaponInfoById(sel2)));
        } else if (sel === 12) {
            if (sel2 === -1) {
                cm.sendNext("未選擇道具");
                resetValue();
                return;
            }
            let info = cm.getGachaponInfoById(sel2);
            let msg = getReward(info) + "\r\n\r\n";
            msg += "請選擇要#d修改#k的項目\r\n\r\n";
            msg += "#L0#道具代碼(" + info.getItemId() + ")#l\r\n";
            msg += "#L1#權重(" + info.getChance() + ")#l\r\n";
            msg += "#L2#最低獲得數量(" + info.getMinimumQuantity() + ")#l\r\n";
            msg += "#L3#最高獲得數量(" + info.getMaximumQuantity() + ")#l\r\n";
            msg += "#L4#剩餘數量(" + info.getLeftQuantity() + ")#l\r\n";
            msg += "#L8#每日自動重置剩餘數量(" + info.getAutoResetLeftQuantityPerDay() + ") - 0代表不自動重置#l\r\n";
            msg += "#L9#目前累積抽取點數(" + info.getAccumulationPoint() + ")#l\r\n";
            msg += "#L10#需要總抽取點數(" + info.getTotalAccumulationPoint() + ")#l\r\n";
            msg += "#L5#是否廣播(" + (info.isBroadcast() ? "是" : "否") + ")#l\r\n";
            msg += "#L6#是否減少剩餘數量(" + (info.isMinusLeftQuantity() ? "是" : "否") + ")#l\r\n";
            msg += "#L7#裝備是否使用隨機素質(" + (info.isRandomStat() ? "是" : "否") + ")#l\r\n";
            msg += "#L100#回上一頁#l\r\n";
            cm.sendSimple(msg);
        }
    } else if (status === 3) {
        if (sel === 10) {
            if (mode === 1 && newWeight === -1) {
                newWeight = selection;
            }
            cm.sendGetNumber(getAddedValueMessage(false, false, false) + "\r\n\r\n請輸入要新增的最低獲得數量:\r\n\r\n", 1, 1, 30000);
        } else if (sel === 11) {
            cm.removeGachaponRewardInfo(gachaponType, sel2);
            cm.sendNext("移除轉蛋獎勵完成");
            resetValue();
        } else if (sel === 12) {
            if (mode === 1 && sel3 === -1) {
                sel3 = selection;
            }
            let info = cm.getGachaponInfoById(sel2);
            let msg = getReward(info) + "\r\n\r\n";
            switch (sel3) {
            case 0:
                cm.sendGetNumber(msg + "\r\n原始道具代碼(" + info.getItemId() + ")\r\n新道具代碼: ", 1000000, 1000000, 6000000);
                break;
            case 1:
                cm.sendGetNumber(msg + "\r\n原始權重(" + info.getChance() + ")\r\n新權重: ", 1, 1, 1000000000);
                break;
            case 2:
                cm.sendGetNumber(msg + "\r\n原始最低獲得數量(" + info.getMinimumQuantity() + ")\r\n新最低獲得數量: ", 1, 1, 30000);
                break;
            case 3:
                cm.sendGetNumber(msg + "\r\n原始最高獲得數量(" + info.getMinimumQuantity() + ")\r\n新最高獲得數量: ", 1, 1, 30000);
                break;
            case 4:
                cm.sendGetNumber(msg + "\r\n原始剩餘數量(" + info.getLeftQuantity() + ")\r\n新剩餘數量: ", 1, 1, 30000);
                break;
            case 5:
                cm.sendSimple(msg + "\r\n原始廣播(" + (info.isBroadcast() ? "是" : "否") + ")\r\n新廣播:\r\n\r\n#L0##r是#l\r\n#L1#否#l");
                break;
            case 6:
                cm.sendSimple(msg + "\r\n原始減少剩餘數量(" + (info.isMinusLeftQuantity() ? "是" : "否") + ")\r\n新減少剩餘數量:\r\n\r\n#L0##r是#l\r\n#L1#否#l");
                break;
            case 7:
                cm.sendSimple(msg + "\r\n原始裝備使用隨機素質(" + (info.isRandomStat() ? "是" : "否") + ")\r\n新裝備使用隨機素質:\r\n\r\n#L0##r是#l\r\n#L1#否#l");
                break;
            case 8:
                cm.sendGetNumber(msg + "\r\n每日自動重置剩餘數量(" + info.getAutoResetLeftQuantityPerDay() + ")\r\n新每日自動重置剩餘數量: ", 1, 0, 30000);
                break;
            case 9:
                cm.sendGetNumber(msg + "\r\n目前累積抽取點數(" + info.getAccumulationPoint() + ")\r\n新累積抽取點數: ", info.getAccumulationPoint(), 0, 2100000000);
                break;
            case 10:
                cm.sendGetNumber(msg + "\r\n目前需要總抽取點數(" + info.getTotalAccumulationPoint() + ")\r\n新總抽取點數: ", info.getTotalAccumulationPoint(), 0, 2100000000);
                break;
            case 100:
                resetValue();
                action(1, 0, 0);
                break;
            }
        }
    } else if (status === 4) {
        if (sel === 10) {
            if (mode === 1 && newMinimumQuantity === -1) {
                newMinimumQuantity = selection;
            }
            cm.sendGetNumber(getAddedValueMessage(false, false, false) + "\r\n\r\n請輸入要新增的最高獲得數量:\r\n\r\n", 1, newMinimumQuantity, 30000);
        } else if (sel === 12) {
            let info = cm.getGachaponInfoById(sel2);
            switch (sel3) {
            case 0:
                if (!cm.itemExists(selection)) {
                    cm.sendNext("道具不存在: " + selection);
                    resetValue();
                    return;
                }
                info.setItemId(selection);
                break;
            case 1:
                info.setChance(selection);
                break;
            case 2:
                info.setMinimumQuantity(selection);
                break;
            case 3:
                info.setMaximumQuantity(selection);
                break;
            case 4:
                info.setLeftQuantity(selection);
                break;
            case 5:
                info.setBroadcast(selection === 0);
                break;
            case 6:
                info.setMinusLeftQuantity(selection === 0);
                break;
            case 7:
                info.setRandomStat(selection === 0);
                break;
            case 8:
                info.setAutoResetLeftQuantityPerDay(selection);
                break;
            case 9:
                info.setAccumulationPoint(selection);
                break;
            case 10:
                info.setTotalAccumulationPoint(selection);
                break;
            }

            cm.updateGachaponRewardInfo(sel2, info.getItemId(), info.getChance(), info.getMinimumQuantity(), info.getMaximumQuantity(), info.getLeftQuantity(), info.getAutoResetLeftQuantityPerDay(), info.getAccumulationPoint(), info.getTotalAccumulationPoint(), info.isBroadcast(), info.isMinusLeftQuantity(), info.isRandomStat());
            cm.sendNext("目前累積抽取點數修改完成: \r\n\r\n" + getReward(cm.getGachaponInfoById(sel2)));
            status = 1;
            sel = 12;
            sel3 = -1;
        }
    } else if (status === 5) {
        if (sel === 10) {
            if (mode === 1 && newMaximumQuantity === -1) {
                newMaximumQuantity = selection;
            }
            cm.sendGetNumber(getAddedValueMessage(false, false, false) + "\r\n\r\n請輸入要新增的剩餘數量:\r\n\r\n", 1, 0, 2000000000);
        }
    } else if (status === 6) {
        if (sel === 10) {
            if (mode === 1 && newLeftQuantity === -1) {
                newLeftQuantity = selection;
            }
            cm.sendGetNumber(getAddedValueMessage(false, false, false) + "\r\n\r\n每日自動重置數量(0為不自動重置):\r\n\r\n", 0, 0, 2100000000);
        }
    } else if (status === 7) {
        if (sel === 10) {
            if (mode === 1 && newAutoResetLeftQuantityPerDay === -1) {
                newAutoResetLeftQuantityPerDay = selection;
            }
            cm.sendGetNumber(getAddedValueMessage(false, false, false) + "\r\n\r\n總累積抽取點數(0為抽到就出，否則是抽到指定次數才出):\r\n\r\n", 0, 0, 2100000000);
        }
    } else if (status === 8) {
        if (sel === 10) {
            if (mode === 1 && newTotalAccumulationPoint === -1) {
                newTotalAccumulationPoint = selection;
            }
            cm.sendSimple(getAddedValueMessage(false, false, false) + "\r\n\r\n是否廣播:\r\n\r\n#L0##r是#l\r\n#L1#否#l");
        }
    } else if (status === 9) {
        if (sel === 10) {
            if (mode === 1) {
                newBroadcast = selection === 0;
            }
            cm.sendSimple(getAddedValueMessage(true, false, false) + "\r\n\r\n是否減少剩餘數量:\r\n\r\n#L0##r是#l\r\n#L1#否#l");
        }
    } else if (status === 10) {
        if (sel === 10) {
            if (mode === 1) {
                newMinusLeftQuantity = selection === 0;
            }
            cm.sendSimple(getAddedValueMessage(true, true, false) + "\r\n\r\n裝備是否隨機數值:\r\n\r\n#L0##r是#l\r\n#L1#否#l");
        }
    } else if (status === 11) {
        if (sel === 10) {
            if (mode === 1) {
                newRandomEquipmentStat = selection === 0;
            }
            cm.sendYesNo(getAddedValueMessage(true, true, true) + "\r\n\r\n是否確認新增");
        }
    } else if (status === 12) {
        cm.addGachaponRewardInfo(gachaponType, newItemId, newWeight, newMinimumQuantity, newMaximumQuantity, newLeftQuantity, newAutoResetLeftQuantityPerDay, newTotalAccumulationPoint, newBroadcast, newMinusLeftQuantity, newRandomEquipmentStat);
        cm.sendNext("新增成功");
        resetValue();
    }
}

function getReward(info, showChoice) {
    let msg = "";
    if (showChoice) {
        msg += "#L" + info.getId() + "#";
    }
    msg += "#v" + info.getItemId() + "##t" + info.getItemId() + "#";
    if (showContentQuantity || cm.getPlayer().isGM()) {
        msg += " 數量: " + info.getMinimumQuantity() + "~" + info.getMaximumQuantity();
    }
    if (info.isMinusLeftQuantity() && (showContentLeftQuantity || cm.getPlayer().isGM())) {
        msg += " 剩餘數量: " + info.getLeftQuantity();
    }
    if (showContentWeight || cm.getPlayer().isGM()) {
        msg += " 權重: " + cm.numberWithCommas(info.getChance()) + " ";
    }
    if (cm.getPlayer().isGM() && info.getTotalAccumulationPoint() > 0) {
        if (info.getTotalAccumulationPoint() > 0) {
            msg += "(" + info.getAccumulationPoint() + "/" + info.getTotalAccumulationPoint() + ")";
        }
    }
    msg += "#l"
    return msg;
}

function getRewardList(showChoice) {
    let msg = "";
    let list = cm.getGachaponRewardInfo(gachaponType);
    if (list === null) {
        return "沒有任何道具";
    }
    let iterator = list.iterator();
    while (iterator.hasNext()) {
        let info = iterator.next();
        msg += getReward(info, showChoice) + "\r\n";
    }
    return msg;
}

function getAddedValueMessage(showBroadcast, showMinusLeftQuantity, showRandomEquipmentStat) {
    let msg = "";
    if (newItemId !== -1) {
        msg += "新增道具: #v" + newItemId + "#\r\n";
    }
    if (newWeight !== -1) {
        msg += "新增權重: " + newWeight + "\r\n";
    }
    if (newMinimumQuantity !== -1) {
        msg += "最低獲得數量: " + newMinimumQuantity + "\r\n";
    }
    if (newMaximumQuantity !== -1) {
        msg += "最高獲得數量: " + newMaximumQuantity + "\r\n";
    }
    if (newLeftQuantity !== -1) {
        msg += "剩餘數量: " + newLeftQuantity + "\r\n";
    }
    if (newAutoResetLeftQuantityPerDay !== -1) {
        msg += "每日自動重置數量: " + newAutoResetLeftQuantityPerDay + "\r\n";
    }
    if (newTotalAccumulationPoint !== -1) {
        msg += "總累積抽取點數: " + newTotalAccumulationPoint + "\r\n";
    }
    if (showBroadcast) {
        msg += "廣播: " + (newBroadcast ? "是" : "否") + "\r\n";
    }
    if (showMinusLeftQuantity) {
        msg += "減少剩餘數量: " + (newMinusLeftQuantity ? "是" : "否") + "\r\n";
    }
    if (showRandomEquipmentStat) {
        msg += "裝備隨機數值: " + (newRandomEquipmentStat ? "是" : "否") + "\r\n";
    }
    return msg;
}

function resetValue() {
    status = -1;
    sel = -1;
    sel2 = -1;
    sel3 = -1;
    newItemId = -1;
    newWeight = -1;
    newMinimumQuantity = -1;
    newMaximumQuantity = -1;
    newLeftQuantity = -1;
    newAutoResetLeftQuantityPerDay = -1;
    newAccumulationPoint = -1;
    newTotalAccumulationPoint = -1;
    newBroadcast = false;
    newMinusLeftQuantity = false;
    newRandomEquipmentStat = false;
}

function canGachapon() {
    if (cm.getCacheLog(gachaponLogName) == null) {
        return true;
    } else {
        return cm.getCacheLogValue(gachaponLogName) === 1;
    }
}

function toggleGachapon(status) {
    cm.setCacheLog(gachaponLogName, (status ? "1" : "0"));
}

function getItem(itemId) {
    if (itemId >= 2000000) {
        return cm.getNewItem(itemId, 1, 1);
    } else {
        return cm.getEquipById(itemId);
    }
}

function hasId(array, id) {
    if (array.length <= 0) {
        return false;
    }
    for (let i = 0; i < array.length; i++) {
        if (array[i] === id) {
            return true;
        }
    }
    return false;
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

function getMoneyName() {
    return "楓幣";
}
