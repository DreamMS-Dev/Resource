/*
Windyboy
niuniu
2022/10/02 - 2024/03/22
 */

let status = -1, sel = -1, input = -1, winTimes = 0, loseTimes = 0, round = 0;
let suits = ["黑桃", "紅心", "方塊", "梅花"];
let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
let deck = [];
let systems = [];
let players = [];

let ultimateNiuniuRate = 5;
let niuniuRate = 3;
let niu8And9Rate = 2;
let normalRate = 1;
let minimumMoney = 1000; // 最低楓幣
let maximumMoney = -1;
let loseBroadcast = true; // 失敗時賠超過 broadcastMoney 時廣播
let winBroadcast = true; // 勝利時贏超過 broadcastMoney 時廣播
let broadcastMoney = 10000000;

function start() {
    createDeck();
    shuffle();
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        if (status === 1) {
            started = true;
        }
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status <= -1) {
        cm.dispose();
    } else if (status === 0) {
        maximumMoney = parseInt((2147483647 - cm.getPlayer().getMeso()) / ultimateNiuniuRate);
        if (parseInt(cm.getPlayer().getMeso() / ultimateNiuniuRate) <= maximumMoney) {
            maximumMoney = parseInt(cm.getPlayer().getMeso() / ultimateNiuniuRate);
        }
        let message = "--------------賭博系統--------------\r\n";
        if (winTimes > 1) {
            message += "連續勝利次數  : #r" + winTimes + "#k\r\n";
        }
        if (loseTimes > 1) {
            message += "連續失敗次數  : #r" + loseTimes + "#k\r\n";
        }
        message += "☆賭博方法    : #r牛牛#d#k\r\n";
        message += "身上楓幣數量  : #d" + thousands(cm.getPlayer().getMeso()) + "#k\r\n";
        message += "最低下注楓幣  : #b" + thousands(minimumMoney) + "#k\r\n";
        message += "最高下注楓幣  : #r" + thousands(maximumMoney) + "#k\r\n\r\n";
        message += "請輸入下注金額:";
        cm.sendGetNumber(message, minimumMoney, minimumMoney, maximumMoney);
    } else if (status === 1) {
        input = selection;
        if (input > maximumMoney || input < minimumMoney) {
            cm.sendNext("發生異常");
            cm.dispose();
            return;
        } else if (input * ultimateNiuniuRate > cm.getPlayer().getMeso()) {
            cm.sendNext("楓幣不足" + thousands(input * ultimateNiuniuRate));
            cm.dispose();
            return;
        }
        let message = "--------------賭博系統--------------\r\n";
        if (winTimes > 1) {
            message += "連續勝利次數  : #r" + winTimes + "#k\r\n";
        }
        if (loseTimes > 1) {
            message += "連續失敗次數  : #r" + loseTimes + "#k\r\n";
        }
        message += "☆賭博方法    : #r牛牛#d#k\r\n";
        message += "身上楓幣數量  : #d" + thousands(cm.getPlayer().getMeso()) + "#k\r\n";
        message += "最低下注楓幣  : #b" + thousands(minimumMoney) + "#k\r\n";
        message += "最高下注楓幣  : #r" + thousands(maximumMoney) + "#k\r\n";
        message += "目前下注楓幣  : #r" + thousands(input) + "#k\r\n\r\n";
        message += "所有資訊皆確認完後，請按下<是>開始賭博!";
        cm.sendYesNo(message);
    } else if (started) {
        if (round !== 4) {
            if (round === 0) {
                cm.gainMeso(-input * ultimateNiuniuRate);
                givePlayerCard();
                givePlayerCard();
                givePlayerCard();
                givePlayerCard();
                givePlayerCard();
                giveSystemCard();
                giveSystemCard();
                giveSystemCard();
                giveSystemCard();
                giveSystemCard();
                let message = "--------------賭博系統--------------\r\n";
                message += "<第#b" + (round + 1) + "#k回合>\r\n"
                message += "目前系統牌組:";
                message += showThreeCard(systems, true);
                message += "\r\n";
                message += "目前你的牌組:";
                message += showThreeCard(players, false);
                cm.sendNext(message, 1);
                round = 1;
            } else if (round === 1) {
                let message = "--------------賭博系統--------------\r\n";
                message += "<第#b" + (round + 1) + "#k回合>\r\n"
                message += "目前系統牌組:";
                message += showThreeCard(systems, false);
                message += "\r\n";
                message += "目前你的牌組:";
                message += showThreeCard(players, false);
                cm.sendNext(message, 1);
                round++;
            } else if (round === 2) {
                let message = "--------------賭博系統--------------\r\n";
                message += "<第#b" + (round + 1) + "#k回合>\r\n"
                message += "目前系統牌組:";
                message += showThreeCard(systems, false);
                message += "\r\n\r\n";
                message += "目前你的牌組:";
                message += showAllCard(players, false);
                message += "\r\n結果: #b" + getCardResultInString(transferCardToArray(players)) + "#k";
                if (hasUltimateNiuniu(players)) {
                    message += "(" + ultimateNiuniuRate + "倍)";
                } else if (hasNiuniu(players)) {
                    message += "(" + niuniuRate + "倍)";
                } else if (getNiuValue(players) >= 8) {
                    message += "(" + niu8And9Rate + "倍)";
                } else {
                    message += "(" + normalRate + "倍)";
                }
                message += "\r\n";
                cm.sendNext(message, 1);
                round = 3;
            } else if (round === 3) {
                let message = "--------------賭博系統--------------\r\n";
                message += "<第#b" + (round + 1) + "#k回合>\r\n"
                message += "目前系統牌組:";
                message += showAllCard(systems, false);
                message += "\r\n結果:#b " + getCardResultInString(transferCardToArray(systems)) + "#k";
                if (hasUltimateNiuniu(systems)) {
                    message += "(" + ultimateNiuniuRate + "倍)";
                } else if (hasNiuniu(systems)) {
                    message += "(" + niuniuRate + "倍)";
                } else if (getNiuValue(systems) >= 8) {
                    message += "(" + niu8And9Rate + "倍)";
                } else {
                    message += "(" + normalRate + "倍)";
                }
                message += "\r\n\r\n";
                message += "目前你的牌組:";
                message += showAllCard(players, false);
                message += "\r\n結果: #b" + getCardResultInString(transferCardToArray(players)) + "#k";
                if (hasUltimateNiuniu(players)) {
                    message += "(" + ultimateNiuniuRate + "倍)";
                } else if (hasNiuniu(players)) {
                    message += "(" + niuniuRate + "倍)";
                } else if (getNiuValue(players) >= 8) {
                    message += "(" + niu8And9Rate + "倍)";
                } else {
                    message += "(" + normalRate + "倍)";
                }
                message += "\r\n";
                cm.sendNext(message, 1);
                round = 4;
            }
        } else {
            let resultRate = normalRate;
            let success = false;
            let draw = false;
            if ((hasUltimateNiuniu(players) && hasUltimateNiuniu(systems))
                || (hasNiuniu(players) && hasNiuniu(systems)) ||
                (hasNiu(players) && hasNiu(systems) && getNiuValue(players) === getNiuValue(systems)) ||
                (getValue(players) === getValue(systems))) {
                success = false;
                draw = true;
            } else if ((hasUltimateNiuniu(players) && !hasUltimateNiuniu(systems))) {
                resultRate = ultimateNiuniuRate;
                success = true;
            } else if ((hasNiuniu(players) && !hasNiuniu(systems))) {
                resultRate = niuniuRate;
                success = true;
            } else if (getNiuValue(players) !== 0 && (getNiuValue(players) > getNiuValue(systems))) {
                if (getNiuValue(players) >= 8) {
                    resultRate = niu8And9Rate;
                }
                success = true;
            } else if (getValue(players) > getValue(systems)) {
                success = true;
            }
            cm.gainMeso(input * ultimateNiuniuRate);
            if (draw) {
                cm.logFile("牛牛賭博.txt", cm.getReadableTime() + " <" + cm.getPlayer().getName() + "> 賭博結果為平局\r\n", false);
            } else if (!success) {
                if (hasUltimateNiuniu(systems)) {
                    resultRate = ultimateNiuniuRate;
                } else if (hasNiuniu(systems)) {
                    resultRate = niuniuRate;
                } else if (getNiuValue(systems) >= 8) {
                    resultRate = niu8And9Rate;
                }

                loseTimes++;
                winTimes = 0;
                if (loseBroadcast && input * resultRate >= broadcastMoney) {
                    cm.broadcastGambleSkullSpeaker("『賭博公告』 : 玩家【" + cm.getPlayer().getName() + "】 在賭博中賠掉了" + thousands(input * resultRate) + "家產，大家施捨他一些財產吧!");
                }
                cm.logFile("牛牛賭博.txt", cm.getReadableTime() + " <" + cm.getPlayer().getName() + "> 賭博中賠掉了" + parseInt(input * resultRate) + "楓幣\r\n", false);
                if (resultRate >= 1) {
                    cm.gainMeso(-input * resultRate);
                }
            } else {
                loseTimes = 0;
                winTimes += 1;
                if (winBroadcast && input * resultRate >= broadcastMoney) {
                    cm.broadcastGambleHeartSpeaker("『賭博公告』 : 玩家【" + cm.getPlayer().getName() + "】 在賭博中贏得了" + thousands(input * resultRate) + "楓幣，大家快跟他拿紅包吧!");
                }
                cm.logFile("牛牛賭博.txt", cm.getReadableTime() + " <" + cm.getPlayer().getName() + "> 賭博中贏得了" + parseInt(input * resultRate) + "楓幣\r\n", false);
                cm.gainMeso(input * resultRate);
            }
            let message = "--------------賭博系統--------------\r\n";
            message += "☆下注金額    : #k<#b" + thousands(input) + "#k>#k\r\n";
            message += "☆系統結果    : #k<#b" + getCardResultInString(transferCardToArray(systems)) + "#k>#k\r\n";
            message += "☆角色結果    : #k<#b" + getCardResultInString(transferCardToArray(players)) + "#k>#k\r\n";
            message += "☆賭博結果    : #k<#r" + (success ? "成功!" : draw ? "平局" : "失敗") + "#k>#k\r\n";
            if (!draw) {
                if (success) {
                    message += "☆獲得金額    : #k<#r" + thousands(input * resultRate) + "#k>#k\r\n";
                    message += "☆獲得倍率    : #k<#b" + resultRate + "#k>#k\r\n";
                } else {
                    message += "☆失去金額    : #k<#r" + thousands(input * resultRate) + "#k>#k\r\n";
                    message += "☆失敗倍率    : #k<#b" + resultRate + "#k>#k\r\n";
                }
            }
            cm.sendNext(message);
            status = -1;
            started = false;
            deck = [];
            systems = [];
            players = [];
            createDeck();
            shuffle();
            round = 0;
        }
    } else {
        cm.dispose();
    }
}

function thousands(num) {
    let str = num.toString();
    let reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
    return str.replace(reg, "$1,");
}

function showThreeCard(array, hide) {
    let message = "";
    for (let i = 0; i < array.length; i++) {
        let value = array[i][0];
        let suit = array[i][1];
        if (hide || i >= 3) {
            message += "<未知>";
        } else {
            message += "<" + suit + value + ">";
        }
    }
    return message;
}

function showAllCard(array, hide) {
    let message = "";
    for (let i = 0; i < array.length; i++) {
        let value = array[i][0];
        let suit = array[i][1];
        if (hide) {
            message += "<未知>";
        } else {
            message += "<" + suit + value + ">";
        }
    }
    return message;
}

function giveSystemCard() {
    let card = deck.pop();
    systems.push(card);
}

function givePlayerCard() {
    let card = deck.pop();
    players.push(card);
}

function hasUltimateNiuniu(array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i][2] !== 10) {
            return false;
        } else if (array[i][0] !== "J" && array[i][0] !== "Q" && array[i][0] !== "K") {
            return false;
        }
    }
    return true;
}

function hasNiuniu(array) {
    return getCardResultInString(transferCardToArray(array)) === "牛牛";
}

function getNiuValue(array) {
    if (!hasNiu(array)) {
        return 0;
    } else {
        return parseInt(getCardResultInString(transferCardToArray(array)).substring(1, 2));
    }
}

function hasNiu(array) {
    let result = getCardResultInString(transferCardToArray(array));
    if (result.length !== 2) {
        return false;
    } else if (result.substring(0, 1) !== "牛") {
        return false;
    }
    return true;
}

function getValue(array) {
    if (hasUltimateNiuniu(array)) {
        return 10000;
    } else if (hasNiuniu(array)) {
        return 1000;
    } else if (hasNiu(array)) {
        return getNiuValue(array) * 100;
    } else {
        return parseInt(getCardResultInString(transferCardToArray(array)));
    }
}

function transferCardToArray(array) {
    let cardArray = [];
    for (let i = 0; i < array.length; i++) {
        cardArray.push([array[i][0], array[i][2]]);
    }
    return cardArray;
}

function getCardResultInString(cards) {
    let sums = 0;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i][1] > 10) {
            cards[i][1] = 10;
        }
        sums += cards[i][1];
    }
    if (sums === 50) {
        let ultimate = true;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i][0] !== "J" && cards[i][0] !== "Q" && cards[i][0] !== "K") {
                ultimate = false;
                break;
            }
        }
        if (ultimate) {
            return "終極牛牛";
        }
    }
    if (sums % 10 === 0) {
        return "牛牛";
    }
    // 牛1 ~ 牛9
    let bull = 0;
    for (let i = 0; i < cards.length - 2; i++) {
        let cardI = cards[i][1];
        for (let j = i + 1; j < cards.length; j++) {
            let cardJ = cards[j][1];
            for (let k = j + 1; k < cards.length; k++) {
                let cardK = cards[k][1];
                let total = cardI + cardJ + cardK;
                if (total % 10 === 0) {
                    let n = (sums - total) % 10;
                    bull = bull < n ? n : bull;
                }
            }
        }
    }
    if (bull === 0) {
        let maxValue = 0;
        for (let i = 0; i < cards.length; i++) {
            maxValue = Math.max(cards[i][1]);
        }
        return maxValue;
    } else {
        return "牛" + bull; // 牛1 ~ 牛9
    }
}

function createDeck() {
    deck = [];
    for (let i = 0; i < values.length; i++) {
        for (let x = 0; x < suits.length; x++) {
            let weight = parseInt(values[i]);
            if (values[i] === "A") {
                weight = 1;
            } else if (values[i] === "J" || values[i] === "Q" || values[i] === "K") {
                weight = 10;
            }
            let card = [values[i], suits[x], weight];
            deck.push(card);
        }
    }
}

function shuffle() {
    // for 1000 turns
    // switch the values of two random cards
    for (let i = 0; i < 1000; i++) {
        let location1 = Math.floor((Math.random() * deck.length));
        let location2 = Math.floor((Math.random() * deck.length));
        let tmp = deck[location1];
        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}

function isSuccess(chance) {
    return getRandomInt(0, 99) < chance;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
