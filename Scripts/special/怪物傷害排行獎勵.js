let status = -1, sel = -1, sel2 = -1;

var mobDamageLogType = 100; // 紀錄Log型別，自訂

var canGainRewardHigherThanCurrent = true; // 第1名是否可領取2、3、4名的獎勵
var rewardLogName = "怪物傷害排行獎勵";
var rewardItemList = [
    [1,
        [
            // itemid, qty, stat
            [1302000, 1, -1],
            [1302001, 1, -1],
            [4000000, 100, 0]
        ]
    ],
    [2,
        [
            // itemid, qty, stat
            [1302000, 1, 10],
            [4000001, 15, 0]
        ]
    ]
];

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
    if (status == 0) {
        let msg = "[怪物傷害排行系統]\r\n";
        if (getMobDamageLogRank() != -1) {
            msg += "#d目前我的最佳排行: #r" + getMobDamageLogRank() + "#k\r\n";
        }
        msg += "#L100##b我要領取怪物傷害排行獎勵#k#l\r\n";
        msg += "#L10##d查看怪物傷害排行#k#l\r\n";
        cm.sendSimple(msg);
    } else if (status == 1) {
        if (mode == 1) {
            sel = selection;
        }
        if (sel == 10) {
            cm.displayMobDamageRankInfo(mobDamageLogType);
            status = -1;
        } else if (sel == 100) {
            let message = "";
            for (let i = 0; i < rewardItemList.length; i++) {
                let rewardInfo = rewardItemList[i];
                let rewardRank = rewardInfo[0];
                let currentRewardItemList = rewardInfo[1];
                message += "#L" + rewardRank + "#[" + rewardRank + "]";
                message += addRewardItemMessageInfo(currentRewardItemList);
                message += "\r\n";
            }
            cm.sendSimple(message);
        }
    } else if (status == 2) {
        if (sel == 100) {
            if (mode == 1) {
                sel2 = selection;
            }
            let rank = getMobDamageLogRank();
            if (rank == -1) {
                cm.sendNext("目前不在排行榜上");
                sel = -1;
                sel2 = -1;
                status = -1;
                return;
            } else if (rank != sel2 && !canGainRewardHigherThanCurrent) {
                cm.sendNext("#d目前排行為#r" + rank + "#k\r\n#b無法領取");
                sel = -1;
                sel2 = -1;
                status = -1;
                return;
            } else if (rank < sel2 && canGainRewardHigherThanCurrent) {
                cm.sendNext("#d目前排行為#r" + rank + "#d領取獎勵為#r" + sel2 + "\r\n#b無法領取");
                sel = -1;
                sel2 = -1;
                status = -1;
                return;
            } else if (cm.getPlayer().getLogValue(rewardLogName + "_" + sel2) > 0) {
                cm.sendNext("#d排行為#r" + sel2 + "的#d獎勵已經領取過了");
                sel = -1;
                sel2 = -1;
                status = -1;
                return;
            } else if (!canHoldItem(rewardItemList[sel2 - 1][1])) {
                cm.dispose();
                return;
            }
            cm.getPlayer().setLogValue(rewardLogName + "_" + sel2, 1);
            gainRewardItem(rewardItemList[sel2 - 1][1]);
            cm.sendNext("領取第" + rewardItemList[sel2 - 1][0] + "名獎勵成功\r\n" + addRewardItemMessageInfo(rewardItemList[sel2 - 1][1]));
            sel = -1;
            sel2 = -1;
            status = -1;
        }
    } else {
        cm.dispose();
    }
}

function canHoldItem(currentRewardItemList) {
    for (let i = 0; i < currentRewardItemList.length; i++) {
        let itemId = currentRewardItemList[i][0];
        let itemQty = currentRewardItemList[i][1];
        if (itemQty <= 0) {
            continue;
        }
        if (!cm.canHold(itemId, itemQty)) {
            cm.sendOk("背包已滿, 無法放下#v" + itemId + "# x " + itemQty);
            return false;
        }
    }
    for (let i = 0; i < currentRewardItemList.length; i++) {
        let itemId = currentRewardItemList[i][0];
        let itemQty = currentRewardItemList[i][1];
        if (itemQty <= 0) {
            continue;
        }
        let itemIdPrefix = parseInt(itemId / 1000000);
        let size = 0;

        for (let x = 0; x < currentRewardItemList.length; x++) {
            if (itemIdPrefix == parseInt(currentRewardItemList[x][0] / 1000000)) {
                size += 1;
            }
        }
        if (!cm.hasSpace(itemIdPrefix, size)) {
            cm.sendOk("背包已滿, 無法放下#v" + itemId + "#, 至少需要" + size + "格空間");
            return false;
        }
    }
    return true;
}

function gainRewardItem(currentRewardItemList) {
    for (let i = 0; i < currentRewardItemList.length; i++) {
        let itemId = currentRewardItemList[i][0];
        let itemQty = currentRewardItemList[i][1];
        let itemStat = currentRewardItemList[i][2];
        if (itemQty <= 0) {
            continue;
        }
        if (itemId >= 2000000) {
            cm.gainItem(itemId, itemQty);
        } else {
            if (itemStat > 0) {
                for (let x = 0; x < itemQty; x++) {
                    let equip = cm.getEquipById(itemId);
                    equip.setStr(itemStat);
                    equip.setDex(itemStat);
                    equip.setInt(itemStat);
                    equip.setLuk(itemStat);
                    cm.addByItem(equip);
                }
            } else {
                cm.gainItem(itemId, itemQty);
            }
        }
    }
}

function addRewardItemMessageInfo(currentRewardItemList) {
    var message = "";
    for (let x = 0; x < currentRewardItemList.length; x++) {
        let itemId = currentRewardItemList[x][0];
        let itemQty = currentRewardItemList[x][1];
        let itemStat = currentRewardItemList[x][2];
        if (itemQty <= 0) {
            continue;
        }
        message += "#v" + itemId + "##t" + itemId + "#x" + itemQty;
        if (itemId < 2000000 && itemStat > 0) {
            message += "(#b全能力提升#r" + itemStat + "#k)";
        }
        //        if ((x + 1) < currentRewardItemList.length) {
        //            message += "\r\n";
        //        }
    }
    return message;
}

function getMobDamageLogRank() {
    return cm.getMobDamageRank(mobDamageLogType);
}
