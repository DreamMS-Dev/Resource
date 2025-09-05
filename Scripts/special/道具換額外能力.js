/**
 * 2025/03/14
 * 道具增加角色額外能力
 * Windyboy
 */

let status = -1, sel = -1, sel2 = -1;
let infos = [
    // {id: 流水號, name: "顯示名稱", endName: "數字結尾文字", add: 添加值, item: [{id: 可用道具代碼1, quantity: 可用道具數量1},{id: 可用道具代碼2, quantity: 可用道具數量2}]},
    {id: 0, name: "四屬倍率        ", endName: "%", add: 1, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 1}]},
    {id: 1, name: "力量倍率        ", endName: "%", add: 1, item: [{id: 4000002, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 2, name: "敏捷倍率        ", endName: "%", add: 1, item: [{id: 4000003, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 3, name: "智力倍率        ", endName: "%", add: 1, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 4, name: "幸運倍率        ", endName: "%", add: 1, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 5, name: "四屬加成        ", endName: "點", add: 100, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 6, name: "力量加成        ", endName: "點", add: 10, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 7, name: "敏捷加成        ", endName: "點", add: 10, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 8, name: "智力加成        ", endName: "點", add: 10, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 9, name: "幸運加成        ", endName: "點", add: 10, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 10, name: "經驗倍率        ", endName: "%", add: 1, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 11, name: "掉寶倍率        ", endName: "%", add: 1, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 12, name: "金錢倍率        ", endName: "%", add: 1, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 13, name: "傷害倍率        ", endName: "%", add: 1, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 14, name: "召喚獸傷害倍率  ", endName: "%", add: 1, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 15, name: "BOSS傷害倍率    ", endName: "%", add: 1, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 16, name: "免疫負面機率    ", endName: "%", add: 1, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 17, name: "忽略怪物傷害機率", endName: "%", add: 1, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 18, name: "HP藥水恢復倍率  ", endName: "%", add: 1.2, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 19, name: "MP藥水恢復倍率  ", endName: "%", add: 1.1, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]},
    {id: 20, name: "頂傷追加        ", endName: "點", add: 10000, item: [{id: 4000000, quantity: 1}, {id: 4000001, quantity: 2}]}
];

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else if (mode === 0) {
        if (status === 2) {
            sel2 = -1;
        } else if (status === 1) {
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
        let message = "目前角色屬性追加如下(#b點擊屬性提升#k)\r\n\r\n";
        for (let i = 0; i < infos.length; i++) {
            let info = infos[i];
            let characterValue = getValue(info);
            message += "#L" + info.id + "##d" + info.name + "#k -> #b" + formatValue(" ", (isDecimal(characterValue) ? cm.numberWithCommas(getValue(info)) : characterValue)) + "#d" + info.endName + "#l\r\n";
        }
        cm.sendSimple(message);
    } else if (status === 1) {
        if (mode === 1 && sel === -1) {
            sel = selection;
        }

        let info = getInfo(sel);
        if (info === null) {
            cm.sendNext("發生錯誤");
            cm.dispose();
            return;
        }
        let characterValue = getValue(info);
        let message = "#d" + info.name.trim() + ": #b" + (isDecimal(characterValue) ? cm.numberWithCommas(characterValue) : characterValue) + "#d" + info.endName + "\r\n\r\n";
        for (let i = 0; i < info.item.length; i++) {
            let itemInfo = info.item[i];
            message += "#L" + i + "#使用#r" + itemInfo.quantity + "#k個#b#v" + itemInfo.id + "##t" + itemInfo.id + "##k來提升#r" + (isDecimal(info.add) ? cm.numberWithCommas(info.add) : info.add) + "#k" + info.endName + "#l\r\n";
        }
        cm.sendSimple(message);
    } else if (status === 2) {
        if (mode === 1 && sel2 === -1) {
            sel2 = selection;
        }
        let info = getInfo(sel);
        if (info === null) {
            cm.sendNext("發生錯誤");
            cm.dispose();
            return;
        }
        let itemInfo = info.item[sel2];
        if (itemInfo === null) {
            cm.sendNext("發生錯誤");
            cm.dispose();
            return;
        }
        cm.sendYesNo("是否確認使用#r" + itemInfo.quantity + "#k個#b#v" + itemInfo.id + "##t" + itemInfo.id + "##k來提升#d" + info.name.trim() + "#r" + (isDecimal(info.add) ? cm.numberWithCommas(info.add) : info.add) + "#k" + info.endName);
    } else if (status === 3) {
        let info = getInfo(sel);
        if (info === null) {
            cm.sendNext("發生錯誤");
            cm.dispose();
            return;
        }
        let itemInfo = info.item[sel2];
        if (itemInfo === null) {
            cm.sendNext("發生錯誤");
            cm.dispose();
            return;
        }
        if (!cm.exchange(0, itemInfo.id, -itemInfo.quantity)) {
            cm.sendNext("道具不足");
            status = -1;
            sel = -1;
            sel2 = -1;
            return;
        }

        if (!addValue(info)) {
            cm.sendNext("發生未知錯誤");
            cm.dispose();
        } else {
            cm.sendNext("提升#r" + (isDecimal(info.add) ? cm.numberWithCommas(info.add) : info.add) + "#k" + info.endName + "#d" + info.name.trim() + "#k成功!");
            status = -1;
            sel = -1;
            sel2 = -1;
        }

    }
}

function getValue(info) {
    switch (info.id) {
        case 0:
            return cm.getPlayer().getCharacterCustomStat().getCustomAllStatRate();
        case 1:
            return cm.getPlayer().getCharacterCustomStat().getCustomStrRate();
        case 2:
            return cm.getPlayer().getCharacterCustomStat().getCustomDexRate();
        case 3:
            return cm.getPlayer().getCharacterCustomStat().getCustomIntRate();
        case 4:
            return cm.getPlayer().getCharacterCustomStat().getCustomLukRate();
        case 5:
            return cm.getPlayer().getCharacterCustomStat().getCustomAllStat();
        case 6:
            return cm.getPlayer().getCharacterCustomStat().getCustomStr();
        case 7:
            return cm.getPlayer().getCharacterCustomStat().getCustomDex();
        case 8:
            return cm.getPlayer().getCharacterCustomStat().getCustomInt();
        case 9:
            return cm.getPlayer().getCharacterCustomStat().getCustomLuk();
        case 10:
            return cm.getPlayer().getCharacterCustomStat().getCustomExpRate();
        case 11:
            return cm.getPlayer().getCharacterCustomStat().getCustomDropRate();
        case 12:
            return cm.getPlayer().getCharacterCustomStat().getCustomMoneyRate();
        case 13:
            return cm.getPlayer().getCharacterCustomStat().getCustomDamageRate();
        case 14:
            return cm.getPlayer().getCharacterCustomStat().getCustomSummonDamageRate();
        case 15:
            return cm.getPlayer().getCharacterCustomStat().getCustomBossDamageRate();
        case 16:
            return cm.getPlayer().getCharacterCustomStat().getCustomIgnoreDiseaseChance();
        case 17:
            return cm.getPlayer().getCharacterCustomStat().getCustomIgnoreMobHitChance();
        case 18:
            return cm.getPlayer().getCharacterCustomStat().getCustomHpPotionRate();
        case 19:
            return cm.getPlayer().getCharacterCustomStat().getCustomMpPotionRate();
        case 20:
            return cm.getPlayer().getCharacterCustomStat().getCustomMaxDamage();
        default:
            return -1;
    }
}

function addValue(info) {
    switch (info.id) {
        case 0:
            cm.getPlayer().getCharacterCustomStat().setCustomAllStatRate(cm.getPlayer().getCharacterCustomStat().getCustomAllStatRate() + info.add);
            cm.getPlayer().updateStat();
            return true;
        case 1:
            cm.getPlayer().getCharacterCustomStat().setCustomStrRate(cm.getPlayer().getCharacterCustomStat().getCustomStrRate() + info.add);
            cm.getPlayer().updateStat();
            return true;
        case 2:
            cm.getPlayer().getCharacterCustomStat().setCustomDexRate(cm.getPlayer().getCharacterCustomStat().getCustomDexRate() + info.add);
            cm.getPlayer().updateStat();
            return true;
        case 3:
            cm.getPlayer().getCharacterCustomStat().setCustomIntRate(cm.getPlayer().getCharacterCustomStat().getCustomIntRate() + info.add);
            cm.getPlayer().updateStat();
            return true;
        case 4:
            cm.getPlayer().getCharacterCustomStat().setCustomLukRate(cm.getPlayer().getCharacterCustomStat().getCustomLukRate() + info.add);
            cm.getPlayer().updateStat();
            return true;
        case 5:
            cm.getPlayer().getCharacterCustomStat().setCustomAllStat(cm.getPlayer().getCharacterCustomStat().getCustomAllStat() + info.add);
            cm.getPlayer().updateStat();
            return true;
        case 6:
            cm.getPlayer().getCharacterCustomStat().setCustomStr(cm.getPlayer().getCharacterCustomStat().getCustomStr() + info.add);
            cm.getPlayer().updateStat();
            return true;
        case 7:
            cm.getPlayer().getCharacterCustomStat().setCustomDex(cm.getPlayer().getCharacterCustomStat().getCustomDex() + info.add);
            cm.getPlayer().updateStat();
            return true;
        case 8:
            cm.getPlayer().getCharacterCustomStat().setCustomInt(cm.getPlayer().getCharacterCustomStat().getCustomInt() + info.add);
            cm.getPlayer().updateStat();
            return true;
        case 9:
            cm.getPlayer().getCharacterCustomStat().setCustomLuk(cm.getPlayer().getCharacterCustomStat().getCustomLuk() + info.add);
            cm.getPlayer().updateStat();
            return true;
        case 10:
            cm.getPlayer().getCharacterCustomStat().setCustomExpRate(cm.getPlayer().getCharacterCustomStat().getCustomExpRate() + info.add);
            return true;
        case 11:
            cm.getPlayer().getCharacterCustomStat().setCustomDropRate(cm.getPlayer().getCharacterCustomStat().getCustomDropRate() + info.add);
            return true;
        case 12:
            cm.getPlayer().getCharacterCustomStat().setCustomMoneyRate(cm.getPlayer().getCharacterCustomStat().getCustomMoneyRate() + info.add);
            return true;
        case 13:
            cm.getPlayer().getCharacterCustomStat().setCustomDamageRate(cm.getPlayer().getCharacterCustomStat().getCustomDamageRate() + info.add);
            return true;
        case 14:
            cm.getPlayer().getCharacterCustomStat().setCustomSummonDamageRate(cm.getPlayer().getCharacterCustomStat().getCustomSummonDamageRate() + info.add);
            return true;
        case 15:
            cm.getPlayer().getCharacterCustomStat().setCustomBossDamageRate(cm.getPlayer().getCharacterCustomStat().getCustomBossDamageRate() + info.add);
            return true;
        case 16:
            cm.getPlayer().getCharacterCustomStat().setCustomIgnoreDiseaseChance(cm.getPlayer().getCharacterCustomStat().getCustomIgnoreDiseaseChance() + info.add);
            return true;
        case 17:
            cm.getPlayer().getCharacterCustomStat().setCustomIgnoreMobHitChance(cm.getPlayer().getCharacterCustomStat().getCustomIgnoreMobHitChance() + info.add);
            return true;
        case 18:
            cm.getPlayer().getCharacterCustomStat().setCustomHpPotionRate(cm.getPlayer().getCharacterCustomStat().getCustomHpPotionRate() + info.add);
            return true;
        case 19:
            cm.getPlayer().getCharacterCustomStat().setCustomMpPotionRate(cm.getPlayer().getCharacterCustomStat().getCustomMpPotionRate() + info.add);
            return true;
        case 20:
            cm.getPlayer().getCharacterCustomStat().setCustomMaxDamage(cm.getPlayer().getCharacterCustomStat().getCustomMaxDamage() + info.add);
            cm.getPlayer().updateCustomDamageCap();
            return true;
        default:
            return false;
    }
}

function getInfo(id) {
    for (let i = 0; i < infos.length; i++) {
        if (infos[i].id === id) {
            return infos[i];
        }
    }
    return null;
}

function formatValue(fill, content) {
    return cm.getRightPaddedStr(content, fill, 13);
}

function isDecimal(num) {
    return num === Math.floor(num);
}