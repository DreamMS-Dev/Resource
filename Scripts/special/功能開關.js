/**
 * 2025/09/17
 * 功能開關腳本
 * Windyboy
 */
let status = -1;
let iconNote = "#fEffect/CharacterEff/1112915/0/1#";

let options = [
    {name: "寵物吸物開關        ", toggle: (chr, cmb) => chr.togglePetVac(), status: (chr, cmb) => chr.canPetVac()},
    {name: "雙擊二段跳          ", toggle: (chr, cmb) => cmb.setCustomDoubleFlashJump(), status: (chr, cmb) => cmb.getCustomDoubleFlashJump()},
    {name: "找人系統找人        ", toggle: (chr, cmb) => cmb.toggleDisplayInWhisper(), status: (chr, cmb) => cmb.canDisplayInWhisper()},
    {name: "公會成員升級提示    ", toggle: (chr, cmb) => cmb.setDisplayGuildMemberLevelUp(), status: (chr, cmb) => cmb.canDisplayGuildMemberLevelUp()},
    {name: "顯示賭博廣播        ", toggle: (chr, cmb) => cmb.toggleGambleBroadcast(), status: (chr, cmb) => cmb.canDisplayGambleBroadcast()},
    {name: "顯示轉蛋廣播        ", toggle: (chr, cmb) => cmb.toggleGachaponBroadcast(), status: (chr, cmb) => cmb.canDisplayGachaponBroadcast()},
    {name: "顯示其他玩家        ", toggle: (chr, cmb) => cmb.toggleDisplayOtherPlayer(), status: (chr, cmb) => cmb.canDisplayOtherPlayer()},
    {name: "顯示其他玩家道具特效", toggle: (chr, cmb) => cmb.toggleOtherPlayerActiveEffectItem(), status: (chr, cmb) => cmb.canDisplayOtherPlayerActiveEffectItem()},
    {name: "顯示其他玩家寵物    ", toggle: (chr, cmb) => cmb.toggleOtherPlayerPet(), status: (chr, cmb) => cmb.canDisplayOtherPlayerPet()},
    {name: "顯示攻擊特效        ", toggle: (chr, cmb) => cmb.setDisplayAttackEffect(), status: (chr, cmb) => cmb.canDisplayAttackEffect()},
    {name: "顯示玩家廣播訊息    ", toggle: (chr, cmb) => cmb.setDisplayPlayerMegaphone(), status: (chr, cmb) => cmb.canDisplayPlayerMegaphone()},
    {name: "顯示釣魚廣播訊息    ", toggle: (chr, cmb) => cmb.setDisplayFishingBroadcastMessage(), status: (chr, cmb) => cmb.canDisplayFishingBroadcastMessage()},
    {name: "聆聽點歌系統        ", toggle: (chr, cmb) => cmb.setApplyPlaySong(), status: (chr, cmb) => cmb.canApplyPlaySong()},
    {name: "拾取自動販售訊息    ", toggle: (chr, cmb) => cmb.setAutoSellMessageOnPickUp(), status: (chr, cmb) => cmb.canAutoSellMessageOnPickUp()},
    {name: "拾取自動販售物品    ", toggle: (chr, cmb) => cmb.setAutoSellOnPickUp(), status: (chr, cmb) => cmb.canAutoSellOnPickUp()},
    {name: "顯示定時廣播        ", toggle: (chr, cmb) => cmb.setDisplayBroadcastBot(), status: (chr, cmb) => cmb.canDisplayBroadcastBot()},
    {name: "顯示Boss勝利廣播    ", toggle: (chr, cmb) => cmb.setDisplayBossVictoryBroadcast(), status: (chr, cmb) => cmb.canDisplayBossVictoryBroadcast()},
    {name: "顯示PVP擊殺廣播     ", toggle: (chr, cmb) => cmb.setDisplayPVPKillBroadcast(), status: (chr, cmb) => cmb.canDisplayPVPKillBroadcast()},
    {name: "顯示傷害字型        ", toggle: (chr, cmb) => cmb.setDisplayCustomDamageSkin(), status: (chr, cmb) => cmb.getDisplayCustomDamageSkin()},
    {name: "顯示傷害字型單位    ", toggle: (chr, cmb) => cmb.setDisplayCustomDamageUnit(), status: (chr, cmb) => cmb.getDisplayCustomDamageUnit()},
];

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    let chr = cm.getPlayer();

    if (mode === 0) {
        status--;
    } else if (mode === 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }

    if (status === 0) {
        let msg = "\t\t    玩家您好，請您選擇要切換的功能：\r\n";
        for (let i = 0; i < options.length; i++) {
            msg += "#L" + i + "##d" + iconNote + options[i].name + "#k " + iconNote + " 目前狀態:#r " + getStatusIcon(options[i].status(chr, cmb)) + "#k#l\r\n";
        }
        cm.sendSimple(msg);
    } else if (status === 1) {
        if (selection >= 0 && selection < options.length) {
            options[selection].toggle(chr, cmb);
        }
        cm.dispose();
        cm.openNpc(9010000, "功能開關");
    } else {
        cm.dispose();
    }
}

function getStatusIcon(status) {
    return status ? "#fUI/UIWindow/Radio/On/0#" : "#fUI/UIWindow/Radio/Off/0#";
}
