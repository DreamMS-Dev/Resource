/**
 * 2025/09/17
 * 測謊腳本
 * Windyboy
 */
let status = -1, sel = -1;

let debug = true; // true = 尚未開放, false = 開放
let ignoreCooling = true; // 是否無視測謊機本身冷卻時間 (透過道具/技能的測謊)
let ignoreAttackTime = true; // 是否無視角色攻擊冷卻

let coolingTimeLogName = "測謊臨時冷卻";
let sourceCoolingTime = 1 * 60 * 1000; // 測謊他人角色的冷卻時間毫秒
let targetCoolingTime = 1 * 60 * 1000; // 被測謊角色的冷卻時間毫秒

function start() {
    if (debug && !cm.getPlayer().isGM()) {
        cm.sendNext("目前尚未開放")
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
        let message = "#r測謊機系統#k\r\n";
        message += "#L0##d選擇地圖上的角色#k#l\r\n";
        message += "#L1##b輸入指定角色名稱#k";
        cm.askMenu(message, 0);
    } else if (status === 1) {
        if (mode === 1 || sel === -1) {
            sel = selection;
        }
        if (sel === 0) {
            let next = false;
            let message = "請選擇#r要測謊的角色#k:\r\n";
            let iterator = cm.getPlayer().getMap().getAllPlayers().iterator();
            while (iterator.hasNext()) {
                let character = iterator.next();
                if (isAvailableCharacter(character, true)) {
                    next = true;
                    message += "#L" + character.getId() + "#" + character.getName() + "\r\n"
                }
            }
            if (next) {
                cm.askMenu(message, 0);
            } else {
                cm.say("地圖上沒有可選的角色", false, true, 0);
                status = -1;
                sel = -1;
            }
        } else {
            cm.askText("請輸入角色名稱", "", 0, 0, 0);
        }
    } else if (status === 2) {
        let character;
        if (sel === 0) {
            character = cm.getChr(selection);
        } else {
            character = cm.getChr(cm.getText());
        }
        if (cm.getPlayer().getAccMapleLog(coolingTimeLogName) != null) {
            cm.say("你的帳號才剛剛測謊過別人，請稍後再試", false, true, 0);
            status = -1;
            sel = -1;
            return;
        } else if (!isAvailableCharacter(character, sel === 0)) {
            cm.say("該角色目前狀態不可用，可能是已死亡 / 交易中 / 個人商店中 / 雇傭商人中 / 操作倉庫中 / 腳本對話中 ...", false, true, 0);
            status = -1;
            sel = -1;
            return;
        } else if (character.getScriptMethodBridge().getTemporaryLog(coolingTimeLogName) != null) {
            cm.say("該角色才剛剛被測謊過，請稍後再試", false, true, 0);
            status = -1;
            sel = -1;
            return;
        }

        if (cm.startLieDetector(character, 2, ignoreCooling, ignoreAttackTime)) {
            cm.say("測謊發送成功!", false, true, 0);
            character.getScriptMethodBridge().setTemporaryLog(coolingTimeLogName, "1", null, null, cm.getCurrentTimeMillis() + targetCoolingTime);
            cm.getPlayer().setAccLog(coolingTimeLogName, "1", cm.getCurrentTimeMillis() + sourceCoolingTime);
        } else {
            if (!ignoreCooling && !ignoreAttackTime) {
                cm.say("測謊發送失敗，可能是測謊機冷卻時間未到或是該角色不在攻擊狀態", false, true, 0);
            } else if (!ignoreCooling) {
                cm.say("測謊發送失敗，可能是測謊機冷卻時間未到", false, true, 0);
            } else if (!ignoreAttackTime) {
                cm.say("測謊發送失敗，可能是角色不在攻擊狀態", false, true, 0);
            } else {
                cm.say("測謊發送失敗，未知錯誤", false, true, 0);
            }
            cm.dispose();
        }
    }
}

function isAvailableCharacter(character, sameField) {
    return character != null &&
        character.getId() !== cm.getPlayer().getId() && // 不是自己
        (!sameField || (sameField && character.getMapId() === cm.getPlayer().getMapId())) && // 相同地圖
        character.isAlive() && // 活著
        character.getTrade() == null && // 沒在交易
        character.getPlayerShop() == null && // 沒在個人商店
        character.getHiredMerchant() == null && // 沒在雇傭商人
        !character.getScriptMethodBridge().isOperatingTrunk() && // 沒在操作倉庫
        !character.getScriptMethodBridge().isOperatingScript() && // 沒在操作腳本對話
        character.getGMLevel() <= cm.getPlayer().getGMLevel() // 權限必須小於或是同於自己
        ;
}