let status = -1, sel, selType, selId;
let typeNames = [
    [1, "獎勵1"],
    [2, "獎勵2"],
    [3, "獎勵3"],
    [1000, "滿背包存放"],
];

let rewards = null;

function start() {
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
        let message = "角色箱系統\r\n";
        message += "#L0#確認目前可領取獎勵\r\n";
        message += "#L1#確認目前背包箱\r\n";
        cm.sendSimple(message);
    } else if (status === 1) {
        if (mode === 1) {
            sel = selection;
        }
        if (sel === 0) {
            let hasReward = false;
            let message = "請選擇領取類型:\r\n";
            for (let i = 0; i < typeNames.length; i++) {
                if (typeNames[i][0] === 1000) {
                    continue;
                }
                let localRewardInfo = cm.getUsableReward(typeNames[i][0], cm.getPlayer().getAccountId(), cm.getPlayer().getId());
                if (!localRewardInfo.isEmpty()) {
                    message += "#L" + typeNames[i][0] + "#" + typeNames[i][1] + "#l\r\n";
                    hasReward = true;
                }
            }
            if (!hasReward) {
                resetValue();
                cm.sendNext("目前沒有可領取的獎勵");
                return;
            }
            cm.sendSimple(message);
        } else if (sel == 1) {
            rewards = cm.getUsableReward(1000, cm.getPlayer().getAccountId(), cm.getPlayer().getId());
            if (rewards.isEmpty()) {
                resetValue();
                cm.sendNext("目前沒有需要領取的道具");
                return;
            }
            let i = 0;
            let message = "請選擇要領取的道具:\r\n";
            let iterator = rewards.iterator();
            while (iterator.hasNext()) {
                i++;
                let localInfo = iterator.next();
                message += "#L" + localInfo.getId() + "#";
                message += "#v" + localInfo.getItemId() + "##t" + localInfo.getItemId() + "#";
                if (localInfo.getItemQuantity() > 1) {
                    message += " x " + localInfo.getItemQuantity();
                }
                if (localInfo.getItemExpiration() > 0) {
                    message += " 可用" + localInfo.getItemExpiration() + "小時";
                }
                message += "#l\r\n";
                if (i >= 50) {
                    message += "道具過多，無法顯示...";
                    break;
                }
            }
            cm.sendSimple(message);
        }
    } else if (status === 2) {
        if (mode === 1) {
            if (sel === 0) {
                selType = selection;
            } else if (sel === 1) {
                selId = selection;
            }
        }

        if (sel === 0) {
            rewards = cm.getUsableReward(selType, cm.getPlayer().getAccountId(), cm.getPlayer().getId());
            if (rewards.isEmpty()) {
                resetValue();
                cm.sendNext("目前沒有可領取的獎勵");
                return;
            }

            let message = "請選擇要領取的獎勵:\r\n";
            let iterator = rewards.iterator();
            while (iterator.hasNext()) {
                let localInfo = iterator.next();
                message += "#L" + localInfo.getId() + "#" + localInfo.getDescription() + " 期限:" + localInfo.getReadableExpiration() + "#l\r\n";
            }
            cm.sendSimple(message);

        } else if (sel == 1) {
            if (!cm.isUsableReward(selId, cm.getPlayer().getAccountId(), cm.getPlayer().getId())) {
                resetValue();
                cm.sendNext("所選擇的編號本角色/帳號無法領取");
                return;
            }
            let rewardInfo = null;
            let iterator = rewards.iterator();
            while (iterator.hasNext()) {
                let localInfo = iterator.next();
                if (localInfo.getId() === selId) {
                    rewardInfo = localInfo;
                    break;
                }
            }
            if (rewardInfo == null) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            } else if (!cm.canHold(rewardInfo.getItemId(), rewardInfo.getItemQuantity())) {
                cm.sendNext("背包空間不足");
                cm.dispose();
                return;
            }
            gainRewardItemInfo(rewardInfo);
            cm.sendNext("#d領取道具#v" + rewardInfo.getItemId() + "##t" + rewardInfo.getItemId() + "# x " + rewardInfo.getItemQuantity() + "#b成功");
            cm.removeRewardById(rewardInfo.getId());
            resetValue();
        }
    } else if (status === 3) {
        if (mode === 1) {
            if (sel === 0) {
                selId = selection;
            }
        }

        if (sel === 0) {
            if (!cm.isUsableReward(selId, cm.getPlayer().getAccountId(), cm.getPlayer().getId())) {
                resetValue();
                cm.sendNext("所選擇的編號本角色/帳號無法領取");
                return;
            }
            let rewardInfo = null;
            let iterator = rewards.iterator();
            while (iterator.hasNext()) {
                let localInfo = iterator.next();
                if (localInfo.getId() === selId) {
                    rewardInfo = localInfo;
                    break;
                }
            }
            if (rewardInfo == null) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            } else if (rewardInfo.getItemId() > 0 && !cm.canHold(rewardInfo.getItemId(), rewardInfo.getItemQuantity())) {
                cm.sendNext("背包空間不足");
                cm.dispose();
                return;
            } else if (cm.getPlayer().getMeso() + rewardInfo.getMeso() >= 2147483647) {
                cm.sendNext("背包金錢過多");
                cm.dispose();
                return;
            } else if (cm.getPlayer().getCSPoints(1) + rewardInfo.getCash() >= 2147483647) {
                cm.sendNext("Gash過多");
                cm.dispose();
                return;
            } else if (cm.getPlayer().getCSPoints(2) + rewardInfo.getMaplePoint() >= 2147483647) {
                cm.sendNext("楓葉點數過多");
                cm.dispose();
                return;
            } else if (cm.getPlayer().getBean() + rewardInfo.getPachinko() >= 2147483647) {
                cm.sendNext("小鋼珠過多");
                cm.dispose();
                return;
            }
            gainRewardInfo(rewardInfo);

            let message = "#d領取獎勵如下:\r\n";

            if (rewardInfo.getMeso() > 0) {
                message += "#d金錢: #b" + rewardInfo.getMeso() + "\r\n"
            }
            if (rewardInfo.getCash() > 0) {
                message += "#dGash: #b" + rewardInfo.getCash() + "\r\n"
            }
            if (rewardInfo.getMaplePoint() > 0) {
                message += "#d楓葉點數: #b" + rewardInfo.getMaplePoint() + "\r\n"
            }
            if (rewardInfo.getPachinko() > 0) {
                message += "#d小鋼珠: #b" + rewardInfo.getPachinko() + "\r\n"
            }
            if (rewardInfo.getItemId() > 0) {
                message += "#v" + rewardInfo.getItemId() + "##b#t" + rewardInfo.getItemId() + "# x " + rewardInfo.getItemQuantity();
                if (rewardInfo.getItemExpiration() > 0) {
                    message += " #d可使用#b" + rewardInfo.getItemExpiration() + "#d小時";
                }
                message += "\r\n";
            }
            cm.sendNext(message);
            cm.removeRewardById(rewardInfo.getId());
            resetValue();
        }
    }
}

function gainRewardInfo(info) {
    if (info.getMeso() > 0) {
        cm.gainMeso(info.getMeso());
    }
    if (info.getCash() > 0) {
        cm.getPlayer().gainCash(1, info.getCash())
    }
    if (info.getMaplePoint() > 0) {
        cm.getPlayer().gainCash(2, info.getMaplePoint())
    }
    if (info.getPachinko() > 0) {
        cm.getPlayer().gainBean(info.getPachinko());
    }
    gainRewardItemInfo(info);
}

function gainRewardItemInfo(info) {
    if (info.getItemId() === 0) {
        return
    }
    if (info.getItemId() >= 5000000 && info.getItemId() < 5010000) {
        cm.gainItem(info.getItemId(), info.getItemQuantity(), false, true, info.getItemExpiration() * 60 * 60 * 1000);
    } else if (info.getItemId() < 2000000) {
        let rewardItem = cm.getEquipById(info.getItemId());
        if (info.getItemExpiration() > 0) {
            rewardItem.setExpiration((cm.getCurrentTimeMillis() + info.getItemExpiration() * 60 * 60 * 1000));
        }
        if (!info.getItemOwner().equals("")) {
            rewardItem.setOwner(info.getItemOwner())
        }
        cm.addFromDrop(cm.getClient(), rewardItem, true);
    } else {
        let rewardItem = cm.getNewItem(info.getItemId(), 1, info.getItemQuantity());
        if (info.getItemExpiration() > 0) {
            rewardItem.setExpiration((cm.getCurrentTimeMillis() + info.getItemExpiration() * 60 * 60 * 1000));
        }
        if (!info.getItemOwner().equals("")) {
            rewardItem.setOwner(info.getItemOwner())
        }
        cm.addFromDrop(cm.getClient(), rewardItem, true);
    }
}

function resetValue() {
    status = -1;
    sel = -1;
    selType = -1;
    selId = -1;
    hasReward = false;
    rewards = null;
}
