/**
 * 2025/09/30
 * 實例遠征Event範例
 * By Windy boy
 */

// 啟用副本
let isPq = true;

// 啟用角色攻擊怪物觸發函數
let useMonsterDamageMethod = false;

// 啟用撿物觸發函數
let usePickUpMethod = false;

// 啟用角色受傷觸發函數
let useUserHitMethod = false;

// 啟用怪物傷害獎勵
let useMobDamageReward = false;

// 副本內死亡點復活功能是否關閉
let disableChangeFieldOnRevive = false;

// 啟用時間排行
let useGroupSpeedLog = false;
// 自訂義速度排行類型
let groupSpeedLogType = 100;

// 啟用怪物傷害排行
let useMobDamageLog = false;
// 怪物傷害排行是否記錄離線玩家
let mobDamageLogIncludeOfflineCharacter = false;
// 自訂義怪物傷害排行類型
let mobDamageLogType = 100;
// 自訂義怪物傷害排行期限, -1為永久, 否則為Unix時間戳
let mobDamageLogExpiration = -1;

// 入場召換怪物
let mobToSpawn = [
    // mobId, x, y, 血量, 經驗 (-1為保留原始值)
    [100100, -742, 640, 100000, -1],
    [210100, -866, 490, 200000, -1],
    [210100, -737, 370, 300000, -1]
];

// 最低人數/最高人數
let minimumPlayers = 6, maximumPlayers = 30;
// 最低等級/最高等級
let minimumLevel = 100, maximumLevel = 255;
// 進入地圖
let entryMap = 551030200;
// 離開地圖
let exitMap = 551030100;
// 招募用地圖
let recruitMap = 551030100;

// 副本起始地圖代碼
let minimumFieldId = 551030200;
// 副本結束地圖代碼
let maximumFieldId = 551030200;

// 副本挑戰分鐘數
let eventTime = 60;

/**
 * 載入觸發函數
 */
function init() {
    setEventRequirements();
}

/**
 * 設置需求文字至party屬性，便可以在NPC透過party屬性取得資料，不用重複寫
 */
function setEventRequirements() {
    let reqStr = "";

    reqStr += "\r\n    玩家數量: ";
    if (maximumPlayers - minimumPlayers >= 1)
        reqStr += minimumPlayers + " ~ " + maximumPlayers;
    else
        reqStr += minimumPlayers;

    reqStr += "\r\n    等級範圍: ";
    if (maximumLevel - minimumLevel >= 1)
        reqStr += minimumLevel + " ~ " + maximumLevel;
    else
        reqStr += minimumLevel;

    reqStr += "\r\n    時間限制: ";
    reqStr += eventTime + " 分鐘";

    cm.setProperty("party", reqStr);
}

/**
 * 設置離開副本時，需要移除的道具代碼
 * @param eim 副本實例
 */
function setEventExclusives(eim) {
    let itemSet = [];
    eim.setExclusiveItems(itemSet);
}

/**
 * 副本實例化成功後觸發
 * @param eim 副本實例
 */
function afterSetup(eim) {
}

/**
 * 副本實例化
 * @param channel 頻道
 * @returns 新副本實例
 */
function setup(channel) {
    let eim = cm.newInstance("Scarga" + channel);
    eim.setDisableChangeFieldOnRevive(disableChangeFieldOnRevive);
    eim.setInvokeMonsterDamage(useMonsterDamageMethod);
    eim.setInvokePickUp(usePickUpMethod);
    eim.setInvokeUserHit(useUserHitMethod);
    eim.setProperty("canJoin", 1);
    eim.setProperty("defeatedBoss", 0);
    let level = 1;
    let map = eim.getInstanceMap(551030200);
    map.resetPQ(level);
    if (mobToSpawn.length > 0) {
        for (let i = 0; i < mobToSpawn.length; i++) {
            let mobId = mobToSpawn[i][0];
            let mobPosX = mobToSpawn[i][1];
            let mobPosY = mobToSpawn[i][2];
            let mobHp = mobToSpawn[i][3];
            let mobExp = mobToSpawn[i][4];

            let mob = cm.getMonster(mobToSpawn[i][0]);
            if (mob != null) {
                if (mobHp !== -1 || mobExp !== -1) {
                    let stat = cm.newMonsterStats();
                    if (mobExp !== -1) {
                        stat.setOExp(mobExp);
                    } else {
                        stat.setOExp(mob.getExp());
                    }
                    if (mobHp !== -1) {
                        stat.setOHp(mobHp);
                    } else {
                        stat.setOHp(mob.getMaxHp());
                    }
                    stat.setOMp(mob.getMaxMp());
                    mob.setOverrideStats(stat);
                }
                map.spawnMonsterOnGroundBelow(mob, mobPosX, mobPosY);
            } else {
                console.log("怪物代碼[" + mobId + "]不存在")
            }
        }
    }
    eim.startEventTimer(eventTime * 60000);
    if (useGroupSpeedLog) {
        eim.startGroupSpeedLog();
    }
    setEventExclusives(eim);
    return eim;
}

/**
 * 角色進入副本觸發
 * @param eim 副本實例
 * @param user 角色實例
 */
function playerEntry(eim, user) {
    eim.dropMessage(5, "[遠征隊] " + user.getName() + " 已進入地圖。");
    let map = eim.getMapInstance(entryMap);
    user.changeMap(map, map.getPortal(0));
}

/**
 * 副本時間結束觸發
 * @param eim 副本實例
 */
function scheduledTimeout(eim) {
    end(eim);
}

/**
 * 角色換地圖觸發
 * @param eim 副本實例
 * @param user 角色實例
 * @param fieldId 新地圖代碼
 */
function changedMap(eim, user, fieldId) {
    if (fieldId < minimumFieldId || fieldId > maximumFieldId) {
        if (eim.isExpeditionTeamLackingNow(true, minimumPlayers, user)) {
            eim.unregisterPlayer(user);
            eim.dropMessage(5, "[遠征隊] 遠征隊隊長已經退出了遠征隊，或者剩餘人數不足。");
            end(eim);
        } else {
            eim.dropMessage(5, "[遠征隊] " + user.getName() + " 已離開隊伍。");
            eim.unregisterPlayer(user);
        }
    }
}

/**
 * 副本內切換隊長觸發
 * @param eim 副本實例
 * @param leader 新隊長角色實例
 */
function changedLeader(eim, leader) {
}

/**
 * 角色死亡觸發
 * @param eim 副本實例
 * @param user 角色實例
 */
function playerDead(eim, user) {
}

/**
 * 角色死亡後點擊復活觸發
 * @param eim 副本實例
 * @param user 角色實例
 * @returns true = 正常復活流程, false = 跳過服務端復活流程
 */
function playerRevive(eim, user) {
    if (eim.isExpeditionTeamLackingNow(true, minimumPlayers, user)) {
        eim.unregisterPlayer(user);
        eim.dropMessage(5, "[遠征隊] 遠征隊隊長已經退出了遠征隊，或者剩餘人數不足。");
        end(eim);
    } else {
        eim.dropMessage(5, "[遠征隊] " + user.getName() + " 已離開。");
        eim.unregisterPlayer(user);
    }
}

/**
 * 角色斷線觸發
 * @param eim 副本實例
 * @param user 角色實例
 */
function playerDisconnected(eim, user) {
    if (eim.isExpeditionTeamLackingNow(true, minimumPlayers, user)) {
        eim.unregisterPlayer(user);
        eim.dropMessage(5, "[遠征隊] 要麼是遠征隊隊長已經退出了遠征隊，或者剩餘人數不足。");
        end(eim);
    } else {
        eim.dropMessage(5, "[遠征隊] " + user.getName() + " 已離開隊伍。");
        eim.unregisterPlayer(user);
    }
}

/**
 * 角色離開隊伍觸發
 * @param eim 副本實例
 * @param user 角色實例
 */
function leftParty(eim, user) {
}

/**
 * 解散隊伍觸發
 * @param eim 副本實例
 */
function disbandParty(eim) {
}

/**
 * 怪物被殺死時觸發
 * @param eim 副本實例
 * @param mobId 怪物代碼
 * @param user 最後一擊角色實例
 * @param mob 怪物實例
 * @returns {number}
 */
function monsterValue(eim, mobId, user, mob) {
    return 0;
}

/**
 * 角色從副本中移除時觸發
 * @param eim 副本實例
 * @param user 離開的角色實例
 */
function playerUnregistered(eim, user) {
}

/**
 * 角色從副本中離開時觸發
 * @param eim 副本實例
 * @param user 離開的角色實例
 */
function playerExit(eim, user) {
    eim.unregisterPlayer(user);
    user.changeMap(exitMap, 0);
}

/**
 * 副本結束時觸發
 * @param eim 副本實例
 */
function end(eim) {
    let iterator = eim.getPlayers().iterator();
    while (iterator.hasNext()) {
        let user = iterator.next();
        playerExit(eim, user);
    }
    eim.dispose();
}

/**
 * 判斷傳入怪物是否為9420544或是9420549
 * @param mob 怪物實例
 * @returns {boolean} 是否為指定怪物
 */
function isScarga(mob) {
    let mobId = mob.getId();
    return (mobId === 9420544) || (mobId === 9420549);
}

/**
 * 怪物死亡觸發
 * @param mob 怪物實例
 * @param eim 副本實例
 */
function monsterKilled(mob, eim) {
    if (isScarga(mob)) {
        let killed = eim.getIntProperty("defeatedBoss");
        if (killed === 0) {
            if (useMobDamageLog) {
                mob.writeTakenDamageToRanking(mobDamageLogType, mobDamageLogExpiration, mobDamageLogIncludeOfflineCharacter);
            }
            if (useMobDamageReward) {
                eim.setLongProperty("mob1MaxHp", mob.getMaxHp());
                eim.setObjectProperty("mob1TakenDamage", mob.getAllTakenDamage());
            }
        } else if (killed === 1) {
            if (useMobDamageLog) {
                mob.writeTakenDamageToRanking((mobDamageLogType + 1), mobDamageLogExpiration, mobDamageLogIncludeOfflineCharacter);
            }
            if (useGroupSpeedLog) {
                let speedLog = eim.endGroupSpeedLog(groupSpeedLogType);
                cm.worldMessage(5, speedLog.getCharacterNames() + "花費了 " + speedLog.getStringDuartion() + "擊敗了Boss，恭喜他們", -1);
            }
            if (useMobDamageReward) {
                let mobMaxHp = mob.getMaxHp() + eim.getLongProperty("mob1MaxHp");
                let mob1TakenDamage = eim.getObjectProperty("mob1TakenDamage");
                let iter = mob.getAllTakenDamage().entrySet().iterator();
                while (iter.hasNext()) {
                    let entry = iter.next();
                    let characterId = entry.getKey();
                    let characterName = cm.getCharacterNameById(characterId);
                    let characterObject = cm.getChr(characterId);
                    let damage = entry.getValue();
                    let damagePercent = Math.round((damage / mobMaxHp) * 100);

                    if (mob1TakenDamage != null && mob1TakenDamage.containsKey(characterId)) {
                        damage += mob1TakenDamage.remove(characterId);
                        damagePercent = Math.round((damage / mobMaxHp) * 100);
                    }
                    handleBossReward(eim, characterObject, characterName, damage, damagePercent);
                }
            }
            eim.showClearEffect();
            eim.clearPQ();
        }
        eim.setIntProperty("defeatedBoss", killed + 1);
    }
}

/**
 * 處理Boss獎勵
 * @param eim 副本實例
 * @param characterObject 角色實例
 * @param characterName 角色名稱
 * @param damage 傷害
 * @param damagePercent 傷害占比
 */
function handleBossReward(eim, characterObject, characterName, damage, damagePercent) {
    eim.dropMessage(6, cm.getRightPaddedStr(characterName, " ", 13) + " 造成了" + damage + "傷害(" + damagePercent + "%)");
    if (characterObject != null) {
        if (damage >= 100000000) {
            characterObject.openNpc(9010000, "S獎勵");
        } else if (damage >= 10000000) {
            characterObject.openNpc(9010000, "A獎勵");
        } else if (damage >= 5000000) {
            characterObject.openNpc(9010000, "B獎勵");
        }
    }
}

/**
 * 角色攻擊怪物時觸發
 * 初始化時需要使用 eim.setInvokeMonsterDamage(true)
 * 才會觸發
 * @param eim 副本實例
 * @param user 角色實例
 * @param mobId 怪物代碼
 * @param damage 傷害值
 * @param mob 怪物實例
 */
function monsterDamaged(eim, user, mobId, damage, mob) {
}

/**
 * 撿起道具時候觸發
 * 初始化時需要使用 eim.setInvokePickUp(true);
 * 才會觸發
 * @param eim 副本實例
 * @param user 角色實例
 * @param itemId 道具代碼
 * @param quantity 道具數量
 * @param money 金錢數量
 */
function pickUpItem(eim, user, itemId, quantity, money) {
}

/**
 * 角色受到攻擊時候觸發
 * 初始化時需要使用 eim.setInvokeUserHit(true);
 * 才會觸發
 * @param eim 副本實例
 * @param user 角色實例
 * @param damageType 傷害類型
 * @param objectId 實例流水號
 * @param templateId 實例樣本代碼
 * @param originalDamage 原始傳入傷害
 * @param damage 實際受的傷害
 */
function userHit(eim, user, damageType, objectId, templateId, originalDamage, damage) {

}

/**
 * 全部怪物死亡時觸發
 * @param eim 副本實例
 */
function allMonstersDead(eim) {
}

/**
 * 副本重新載入時，原始副本時觸發，用以關閉副本內開的額外線程
 */
function cancelSchedule() {
}

/**
 * 副本實例關閉時觸發
 * @param eim 副本實例
 */
function dispose(eim) {
}
