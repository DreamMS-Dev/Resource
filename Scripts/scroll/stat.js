let useUpgradeSlot = true;
let successChance = 30, curseChance = 10;
let curse, whiteScroll, legendarySpirit;
let status = -1, scrollSource, scrollDestination, scrollSourceItemId, scrollDestinationItemId;

function start() {
    curse = cm.isSuccess(curseChance);
    legendarySpirit = cm.getPlayer().hasCustomScrollLegendarySpirit();
    whiteScroll = cm.getPlayer().hasCustomScrollWhiteScroll();
    scrollSource = cm.getPlayer().getCustomScrollSource();
    scrollDestination = cm.getPlayer().getCustomScrollDestination();
    cm.getPlayer().resetCustomScrollSource();
    cm.getPlayer().resetCustomScrollDestination();
    cm.getPlayer().resetCustomScrollWhiteScroll();
    cm.getPlayer().resetCustomScrollLegendarySpirit();
    scrollSourceItemId = cm.getItem(2, scrollSource) == null ? -1 : cm.getItem(2, scrollSource).getItemId();
    scrollDestinationItemId = cm.getItem(-1, scrollDestination) == null ? -1 : cm.getItem(-1, scrollDestination).getItemId();
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (!checkEquipAndScrollStatus()) {
        return;
    }
    if (mode === 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status < 0) {
        cm.dispose();
    } else if (status === 0) {
        let equip = cm.getItem(-1, scrollDestination);
        if (equip.getUpgradeSlots() <= 0) {
            cm.showScrollEffectFail(scrollSourceItemId, scrollDestinationItemId);
            cm.dispose();
            return;
        }
        cm.removeSlot(2, scrollSource, 1);
        removeWhiteScrollIfNecessary();
        if (cm.isSuccess(successChance)) {
            equip.setStr(equip.getStr() + cm.getRandomValue(1, 5));
            equip.setDex(equip.getDex() + cm.getRandomValue(1, 5));
            equip.setInt(equip.getInt() + cm.getRandomValue(1, 5));
            equip.setLuk(equip.getLuk() + cm.getRandomValue(1, 5));
            if (useUpgradeSlot) {
                equip.setUpgradeSlots((equip.getUpgradeSlots() - 1));
            }
            equip.setLevel((equip.getLevel() + 1));
            cm.getPlayer().forceUpdateItem(equip);
            cm.showScrollEffectSuccess(legendarySpirit, whiteScroll);
            cm.addScrollLogSuccessInfo(cm.getPlayer(), equip, scrollSourceItemId, legendarySpirit, whiteScroll);
        } else if (curse) {
            cm.removeSlot(-1, scrollDestination, 1);
            cm.showScrollEffectCurse(legendarySpirit, whiteScroll);
            cm.addScrollLogCurseInfo(cm.getPlayer(), equip, scrollSourceItemId, legendarySpirit, whiteScroll);
        } else {
            if (useUpgradeSlot) {
                if (!whiteScroll) {
                    equip.setUpgradeSlots((equip.getUpgradeSlots() - 1));
                    cm.getPlayer().forceUpdateItem(equip);
                }
            }
            cm.showScrollEffectFail(legendarySpirit, whiteScroll);
            cm.addScrollLogFailInfo(cm.getPlayer(), equip, scrollSourceItemId, legendarySpirit, whiteScroll);
        }
        cm.dispose();
    }
}

function removeWhiteScrollIfNecessary() {
    if (whiteScroll) {
        let scrollPos = -1;
        let iter = cm.getItemList(2).iterator();
        while (iter.hasNext()) {
            let it = iter.next();
            if (it.getItemId() === 2340000) {
                scrollPos = it.getPosition();
                break;
            }
        }
        if (scrollPos !== -1) {
            cm.removeSlot(2, scrollPos, 1);
        }
    }
}

function checkEquipAndScrollStatus() {
    if (cm.getItem(-1, scrollDestination) == null || cm.getItem(-1, scrollDestination).getItemId() !== scrollDestinationItemId) {
        cm.sendNext("裝備異常");
        cm.dispose();
        return false;
    } else if (cm.getItem(2, scrollSource) == null || cm.getItem(2, scrollSource).getItemId() !== scrollSourceItemId) {
        cm.sendNext("卷軸異常");
        cm.dispose();
        return false;
    }
    return true;
}
