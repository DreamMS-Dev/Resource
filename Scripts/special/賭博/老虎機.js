let status = -1;
let sel = -1, sel2 = -1, sel3 = -1;
let number1 = 1;
let number2 = 2;
let number3 = 3;
let number4 = 4;
let number5 = 5;
let number6 = 6;
let playing = false;
let currentIncome = 0;
let totalRound = 0;
let successRound = 0;
//
let pointIncomeName = "slotMachineIncome"; // 角色老虎機總收益
let pointLogName = "slotMachinePoint"; // 角色老虎機點數
let useThreeSlot = true; // true為3個數字，關閉為6個數字
//
let moneyToPoint = true; // 錢換點數
let moneyRatio = 1; // 比值
let gashToPoint = true; // gash換點數
let gashRatio = 10; // 比值
let maplePointToPoint = true; // 楓葉點數換點數
let maplePointRatio = 10; // 比值
let itemId = 4000000; // 道具代碼
let itemToPoint = true; // 道具換點數
let itemRatio = 10; // 比值
let accountLog = false; // 帳號通用點數
let minimumPoint = 100; // 最低下注數量
let maximumPoint = 100000000; // 最高下注數量
let broadcastIfNumberBiggerThan = 2; // 幾個7以後開始廣播
let sextuple7Ratio = 15; // 777777獎勵倍率
let quintuple7Ratio = 13; // 77777獎勵倍率
let quadruple7Ratio = 10; // 7777獎勵倍率
let triple7Ratio = 9; // 777獎勵倍率
let double7Ratio = 3; // 77獎勵倍率
let single7Ratio = 1; // 7獎勵倍率

let usePointItemInfo = false; // 啟用點數兌換道具
let pointItemInfo = [
    // point [[itemId, itemQuantity, itemPeriod(day)]]
    // point [[itemId, itemQuantity, itemPeriod(day)], [itemId, itemQuantity, itemPeriod(day)]]
    [10000, [[1302000, 1, -1], [3010000, 1, -1], [3010001, 1, -1]]],
    [15000, [[3010002, 1, 1], [3010003, 1, 2], [3010004, 1, 3]]]
]

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if ((sel === 0 || sel === 1) && selection === 100 && status === 1) {
        resetValue();
    }
    if (mode === 1) {
        status++;
    } else if (mode === 1) {
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status <= -1) {
        cm.dispose();
    } else if (status === 0) {
        giveNumber();
        let message = "歡迎來到老虎機遊樂場\r\n\r\n";
        if (getTotalIncome() !== 0) {
            message += "目前點數總收益: #b" + getTotalIncomeInText() + "#k#l\r\n";
        }
        if (currentIncome !== 0) {
            message += "本次收益: #b" + getCurrentIncomeInText() + "#k#l\r\n";
        }
        if (totalRound !== 0) {
            message += "本次勝率: #b" + parseInt((successRound / totalRound) * 100) + "%#k\r\n";
        }
        message += "目前可用點數: #b" + getPointValueInString() + "#k#l\r\n";
        message += "#b最低下注點數: #b" + cm.numberWithCommas(minimumPoint) + "\r\n";
        message += "#r最高下注點數: #r" + cm.numberWithCommas(maximumPoint) + "\r\n\r\n";
        message += "#d#L0#兌換點數#l\r\n";
        if (usePointItemInfo) {
            message += "#L1#兌換道具#l\r\n";
        }
        message += "#L10##r開始遊戲#l";
        if (cm.getPlayer().isGM()) {
            message += "\r\n\r\n\r\n";
            message += "#b[GM提示]\r\n"
            if (useThreeSlot) {
                message += "本次數字: " + number1 + "," + number2 + "," + number3 + "\r\n";
            } else {
                message += "本次數字: " + number1 + "," + number2 + "," + number3 + "," + number4 + "," + number5 + "," + number6 + "\r\n";
            }
            message += "#L1000##r重置總收益#l\r\n";
            message += "#L1001##r重置點數#l\r\n";
        }
        cm.sendSimple(message);
    } else if (status === 1) {
        if (mode === 1) {
            sel = selection;
        }
        if (sel === 0) {
            let next = false;
            let message = "歡迎來到角色老虎機，來兌換點數吧\r\n\r\n";
            message += "目前可用老虎機點數:#d" + getPointValueInString() + "#k#l\r\n";
            message += "\r\n#L100#返回上一頁#l\r\n\r\n";
            if (gashToPoint) {
                message += "#L1#1 " + getExchangeName(1) + " : " + getExchangeRatio(1) + "老虎機點數(目前有" + getExchangeTypeValueInString(1) + " " + getExchangeName(1) + ")#l\r\n";
                next = true;
            }
            if (maplePointToPoint) {
                message += "#L2#1 " + getExchangeName(2) + " : " + getExchangeRatio(2) + "老虎機點數(目前有" + getExchangeTypeValueInString(2) + " " + getExchangeName(2) + ")#l\r\n";
                next = true;
            }
            if (moneyToPoint) {
                message += "#L3#1 " + getExchangeName(3) + " : " + getExchangeRatio(3) + "老虎機點數(目前有" + getExchangeTypeValueInString(3) + " " + getExchangeName(3) + ")#l\r\n";
                next = true;
            }
            if (itemToPoint) {
                message += "#L4#1 " + getExchangeName(4) + " : " + getExchangeRatio(4) + "老虎機點數(目前有" + getExchangeTypeValueInString(4) + "個" + getExchangeName(4) + ")#l\r\n";
                next = true;
            }
            if (!next) {
                cm.sendNext("目前不開放兌換點數");
                resetValue();
                return;
            }
            cm.sendSimple(message);
        } else if (sel === 1) {
            if (!usePointItemInfo || pointItemInfo.length <= 0) {
                cm.sendNext("目前不開放兌換道具");
                resetValue();
                return;
            }
            let message = "歡迎來到老虎機遊樂場\r\n\r\n";
            message += "目前可用點數:#b" + getPointValueInString() + "#k#l\r\n";
            message += "\r\n#L100#返回上一頁#l\r\n\r\n";
            for (let i = 0; i < pointItemInfo.length; i++) {
                message += "#L" + i + "#" + cm.numberWithCommas(pointItemInfo[i][0]) + "點兌換 " + getExchangeItemStringInfo(pointItemInfo[i]) + "\r\n";
            }
            cm.sendSimple(message);
        } else if (sel === 10) {
            if (getPointValue() < minimumPoint) {
                cm.sendNext("目前可用的老虎機點數不足\r\n至少需要#r" + cm.numberWithCommas(minimumPoint) + "\r\n身上只有#b" + getPointValueInString());
                resetValue();
                return;
            }

            let message = "目前可用老虎機點數:#b" + getPointValueInString() + "#k\r\n";
            message += "最低下注點數為#b" + cm.numberWithCommas(minimumPoint) + "\r\n";
            message += "最高下注點數為#r" + cm.numberWithCommas(getMyMaximumPoint()) + "\r\n";
            message += "下注數量\r\n";
            cm.sendGetNumber(message, minimumPoint, minimumPoint, getMyMaximumPoint());
        } else if (sel === 1000) {
            setTotalIncome(0);
            cm.sendNext("已重置總收益完成");
            resetValue();
        } else if (sel === 1001) {
            setPointValue(0);
            cm.sendNext("已重置點數完成");
            resetValue();
        }
    } else if (status === 2) {
        if (mode === 1) {
            sel2 = selection;
        }
        if (sel === 0) {
            if (sel2 < 1 || sel2 > 4) {
                cm.sendNext("發生未知錯誤");
                cm.dispose();
                return;
            }
            if (!gashToPoint && sel2 === 1) {
                cm.sendNext("發生未知錯誤");
                cm.dispose();
                return;
            } else if (!maplePointToPoint && sel2 === 2) {
                cm.sendNext("發生未知錯誤");
                cm.dispose();
                return;
            } else if (!moneyToPoint && sel2 === 3) {
                cm.sendNext("發生未知錯誤");
                cm.dispose();
                return;
            } else if (!itemToPoint && sel2 === 4) {
                cm.sendNext("發生未知錯誤");
                cm.dispose();
                return;
            } else if (getExchangeTypeValue(sel2) <= 0) {
                cm.sendNext("目前沒有可以使用的" + getExchangeName(sel2));
                resetValue()
                return;
            }
            cm.sendGetNumber("目前可用老虎機點數:#b" + getPointValueInString() + "#k\r\n\r\n請輸入要使用的" + getExchangeName(sel2) + "數量\r\n1 " + getExchangeName(sel2) + " : " + getExchangeRatio(sel2) + "老虎機點數(目前有" + getExchangeTypeValueInString(sel2) + " " + getExchangeName(sel2) + ")#l", 0, 1, getExchangeTypeValue(sel2));
        } else if (sel === 1) {
            let info = pointItemInfo[sel2];
            if (getPointValue() < info[0]) {
                cm.sendNext("目前可用的點數不足\r\n至少需要#r" + info[0] + "\r\n身上只有#b" + getPointValueInString());
                resetValue();
                return;
            }
            let checkInfo = [0, 0, 0, 0, 0];
            for (let x = 0; x < info[1].length; x++) {
                let itemId = info[1][x][0];
                let quantity = info[1][x][1];
                if (!cm.canHold(itemId, quantity)) {
                    cm.sendNext("請檢查背包空間是否足夠放下" + cm.numberWithCommas(quantity) + "個#v" + itemId + "##t" + itemId + "#");
                    resetValue();
                    return;
                }
                checkInfo[parseInt(itemId / 1000000) - 1] += 1;
            }
            for (let x = 0; x < checkInfo.length; x++) {
                if (!cm.hasSpace(x + 1, checkInfo[x])) {
                    cm.sendNext("請檢查背包空間是否有" + checkInfo[x] + "個#");
                    resetValue();
                    return;
                }
            }
            cm.sendYesNo("是否確認使用" + cm.numberWithCommas(info[0]) + "點數兌換" + getExchangeItemStringInfo(info));
        } else {
            if (sel2 < minimumPoint || sel2 > getMyMaximumPoint()) {
                cm.sendNext("發生未知錯誤");
                cm.dispose();
                return;
            } else if (getPointValue() < sel2) {
                cm.sendNext("目前可用的老虎機點數不足\r\n至少需要#r" + cm.numberWithCommas(sel2) + "\r\n身上只有#b" + getPointValueInString() + "點數");
                resetValue();
                return;
            }
            cm.sendYesNo("目前可用老虎機點數:#b" + getPointValueInString() + "#k\r\n是否確認下注" + cm.numberWithCommas(sel2) + "老虎機點數?")
        }
    } else if (status === 3) {
        if (mode === 1) {
            sel3 = selection;
        }
        if (sel === 0) {
            if (getExchangeTypeValue(sel2) <= sel3) {
                cm.sendNext("目前沒有足夠的" + getExchangeName(sel2));
                resetValue()
                return;
            }
            cm.sendYesNo("是否確認使用#b" + cm.numberWithCommas(sel3) + getExchangeName(sel2) + "#k兌換成#r" + cm.numberWithCommas(parseInt(sel3 * getExchangeRatio(sel2))) + "老虎機點數#k");
        } else if (sel === 1) {
            let info = pointItemInfo[sel2];
            if (getPointValue() < info[0]) {
                cm.sendNext("目前可用的點數不足\r\n至少需要#r" + info[0] + "\r\n身上只有#b" + getPointValueInString());
                resetValue();
                return;
            }
            minusPointValue(info[0]);
            for (let x = 0; x < info[1].length; x++) {
                let itemId = info[1][x][0];
                let quantity = info[1][x][1];
                let period = info[1][x][2];
                cm.gainItemPeriod(itemId, quantity, period);
            }
            cm.sendNext("兌換成功\r\n目前老虎機點數:#b" + getPointValueInString() + "#k獲得道具\r\n\r\n" + getExchangeItemStringInfo(info))
            resetValue();
        } else {
            cm.sendNext("老虎機器即將開始", 1);
            playing = true;
        }
    } else if (playing) {
        if (selection === 101) {
            cm.sendNext("老虎機器已停止")
            resetValue();
            return;
        } else if (getPointValue() < sel2) {
            cm.sendNext("已經沒有足夠的籌碼了")
            resetValue();
            return;
        }
        let numberArray;
        if (useThreeSlot) {
            numberArray = [number1, number2, number3];
        } else {
            numberArray = [number1, number2, number3, number4, number5, number6];
        }
        totalRound++;
        minusPointValue(sel2);
        currentIncome -= sel2;
        minusTotalIncome(sel2);
        let rewardVal = -1, realRewardVal = -1;
        let message = "#w本次結果:\r\n\r\n";
        message += "第一個數字: #r" + number1 + "#k\r\n";
        message += "第二個數字: #r" + number2 + "#k\r\n";
        message += "第三個數字: #r" + number3 + "#k\r\n";
        if (!useThreeSlot) {
            message += "第四個數字: #r" + number4 + "#k\r\n";
            message += "第五個數字: #r" + number5 + "#k\r\n";
            message += "第六個數字: #r" + number6 + "#k\r\n";
        }
        message += "-------------------\r\n";
        let numberCount = getNumberCountInArray(7, numberArray);
        if (numberCount === 6 && sextuple7Ratio !== 0) {
            rewardVal = sel2 * sextuple7Ratio;
            realRewardVal = sel2 * (sextuple7Ratio + 1);
            message += "#r" + numberCount + "#k個7獎勵: #b" + sextuple7Ratio + "倍#k\r\n";
            if (numberCount >= broadcastIfNumberBiggerThan) {
                cm.broadcastGambleHeartSpeaker(cm.getPlayer().getName() + " : 在老虎機中贏得了" + sextuple7Ratio + "倍獎勵，請大家快去找他要錢!");
            }
            successRound++;
        } else if (numberCount === 5 && quintuple7Ratio !== 0) {
            rewardVal = sel2 * quintuple7Ratio;
            realRewardVal = sel2 * (quintuple7Ratio + 1);
            message += "#r" + numberCount + "#k個7獎勵: #b" + quintuple7Ratio + "倍#k\r\n";
            if (numberCount >= broadcastIfNumberBiggerThan) {
                cm.broadcastGambleHeartSpeaker(cm.getPlayer().getName() + " : 在老虎機中贏得了" + quintuple7Ratio + "倍獎勵，請大家快去找他要錢!");
            }
            successRound++;
        } else if (numberCount === 4 && quadruple7Ratio !== 0) {
            rewardVal = sel2 * quadruple7Ratio;
            realRewardVal = sel2 * (quadruple7Ratio + 1);
            message += "#r" + numberCount + "#k個7獎勵: #b" + quadruple7Ratio + "倍#k\r\n";
            if (numberCount >= broadcastIfNumberBiggerThan) {
                cm.broadcastGambleHeartSpeaker(cm.getPlayer().getName() + " : 在老虎機中贏得了" + quadruple7Ratio + "倍獎勵，請大家快去找他要錢!");
            }
            successRound++;
        } else if (numberCount === 3 && triple7Ratio !== 0) {
            rewardVal = sel2 * triple7Ratio;
            realRewardVal = sel2 * (triple7Ratio + 1);
            message += "#r" + numberCount + "#k個7獎勵: #b" + triple7Ratio + "倍#k\r\n";
            if (numberCount >= broadcastIfNumberBiggerThan) {
                cm.broadcastGambleHeartSpeaker(cm.getPlayer().getName() + " : 在老虎機中贏得了" + triple7Ratio + "倍獎勵，請大家快去找他要錢!");
            }
            successRound++;
        } else if (numberCount === 2 && double7Ratio !== 0) {
            rewardVal = sel2 * double7Ratio;
            realRewardVal = sel2 * (double7Ratio + 1);
            message += "#r" + numberCount + "#k個7獎勵: #b" + double7Ratio + "倍#k\r\n";
            if (numberCount >= broadcastIfNumberBiggerThan) {
                cm.broadcastGambleHeartSpeaker(cm.getPlayer().getName() + " : 在老虎機中贏得了" + double7Ratio + "倍獎勵，請大家快去找他要錢!");
            }
            successRound++;
        } else if (numberCount === 1 && single7Ratio !== 0) {
            rewardVal = sel2 * single7Ratio;
            realRewardVal = sel2 * (single7Ratio + 1);
            message += "#r" + numberCount + "#k個7獎勵: #b" + single7Ratio + "倍#k\r\n";
            if (numberCount >= broadcastIfNumberBiggerThan) {
                cm.broadcastGambleHeartSpeaker(cm.getPlayer().getName() + " : 在老虎機中贏得了" + single7Ratio + "倍獎勵，請大家快去找他要錢!");
            }
            successRound++;
        } else {
            message += "無中獎(" + numberCount + "個7)\r\n";
        }
        if (realRewardVal !== -1) {
            addPointValue(realRewardVal);
            currentIncome += realRewardVal;
            addTotalIncome(realRewardVal);
        }
        message += "-------------------\r\n";
        message += "下注點數:#b" + cm.numberWithCommas(sel2) + "#k\r\n";
        if (rewardVal !== -1) {
            message += "獲得點數:#r" + cm.numberWithCommas(rewardVal) + "#k\r\n";
        }
        message += "目前老虎機點數:#b" + getPointValueInString() + "#k\r\n";
        if (currentIncome !== 0) {
            message += "目前點數收益:#b" + getCurrentIncomeInText() + "#k\r\n";
        }
        if (getTotalIncome() !== 0) {
            message += "目前點數總收益: #b" + getTotalIncomeInText() + "#k#l\r\n";
        }
        if (totalRound !== 0) {
            message += "目前勝率:#b" + parseInt((successRound / totalRound) * 100) + "%#k\r\n";
        }
        message += "-------------------\r\n";
        message += "#L100##r繼續#l\r\n#L101##b停止#k\r\n";
        cm.sendSimple(message);
        giveNumber();
    } else if (status === 4) {
        if (sel === 0) {
            if (getExchangeTypeValue(sel2) <= sel3) {
                cm.sendNext("目前沒有足夠的" + getExchangeName(sel2));
                resetValue()
                return;
            }
            minusExchangeTypeValue(sel2, sel3);
            addPointValue(sel3 * getExchangeRatio(sel2))
            cm.sendNext("兌換成功!\r\n獲得了" + cm.numberWithCommas(parseInt(sel3 * getExchangeRatio(sel2))) + "老虎機點數\r\n目前共有" + getPointValueInString());
            resetValue();
        }
    }
}

function giveNumber() {
    number1 = cm.getRandomValue(1, 9);
    number2 = cm.getRandomValue(1, 9);
    number3 = cm.getRandomValue(1, 9);
    number4 = cm.getRandomValue(1, 9);
    number5 = cm.getRandomValue(1, 9);
    number6 = cm.getRandomValue(1, 9);
}

function getMyMaximumPoint() {
    return Math.min(getPointValue(), maximumPoint)
}

function getPointValueInString() {
    return cm.numberWithCommas(getPointValue());
}

function setPointValue(val) {
    if (accountLog) {
        cm.getPlayer().setAccLogValue(pointLogName, val);
    } else {
        cm.getPlayer().setLogValue(pointLogName, val);
    }
}

function addPointValue(val) {
    if (accountLog) {
        cm.getPlayer().addAccLogValue(pointLogName, val);
    } else {
        cm.getPlayer().addLogValue(pointLogName, val);
    }
}

function minusPointValue(val) {
    if (accountLog) {
        cm.getPlayer().addAccLogValue(pointLogName, -val);
    } else {
        cm.getPlayer().addLogValue(pointLogName, -val);
    }
}

function getPointValue() {
    return accountLog ? cm.getPlayer().getAccLogValue(pointLogName, 0) : cm.getPlayer().getLogValue(pointLogName, 0);
}

function setTotalIncome(val) {
    if (accountLog) {
        cm.getPlayer().setAccLogValue(pointIncomeName, val);
    } else {
        cm.getPlayer().setLogValue(pointIncomeName, val);
    }
}

function addTotalIncome(val) {
    if (accountLog) {
        cm.getPlayer().addAccLogValue(pointIncomeName, val);
    } else {
        cm.getPlayer().addLogValue(pointIncomeName, val);
    }
}

function minusTotalIncome(val) {
    if (accountLog) {
        cm.getPlayer().addAccLogValue(pointIncomeName, -val);
    } else {
        cm.getPlayer().addLogValue(pointIncomeName, -val);
    }
}

function getCurrentIncomeInText() {
    let val = currentIncome;
    if (val > 0) {
        return "#r" + cm.numberWithCommas(val) + "#k";
    } else {
        return "#b" + cm.numberWithCommas(val) + "#k";
    }
}

function getTotalIncomeInText() {
    let val = getTotalIncome();
    if (val > 0) {
        return "#r" + cm.numberWithCommas(val) + "#k";
    } else {
        return "#b" + cm.numberWithCommas(val) + "#k";
    }
}

function getTotalIncome() {
    return accountLog ? cm.getPlayer().getAccLogValue(pointIncomeName, 0) : cm.getPlayer().getLogValue(pointIncomeName, 0);
}

function resetValue() {
    status = -1;
    sel = -1;
    sel2 = -1;
    sel3 = -1;
    playing = false;
}

function getExchangeTypeValueInString(val) {
    return getExchangeInternal(val)[3];
}

function getExchangeTypeValue(val) {
    return getExchangeInternal(val)[2];
}

function getExchangeRatio(val) {
    return getExchangeInternal(val)[1];
}

function getExchangeName(val) {
    return getExchangeInternal(val)[0];
}

function getExchangeInternal(val) {
    switch (val) {
        case 1:
            return ["Gash", gashRatio, cm.getPlayer().getCSPoints(1), cm.numberWithCommas(cm.getPlayer().getCSPoints(1))];
        case 2:
            return ["楓葉點數", maplePointRatio, cm.getPlayer().getCSPoints(2), cm.numberWithCommas(cm.getPlayer().getCSPoints(2))];
        case 3:
            return ["楓幣", moneyRatio, cm.getPlayer().getMeso(), cm.numberWithCommas(cm.getPlayer().getMeso())];
        case 4:
            return ["#v" + itemId + "##t" + itemId + "#", itemRatio, cm.getItemQuantity(itemId), cm.numberWithCommas(cm.getItemQuantity(itemId))];
    }
}

function minusExchangeTypeValue(type, value) {
    switch (type) {
        case 1:
            cm.getPlayer().modifyCSPoints(1, -value);
            break;
        case 2:
            cm.getPlayer().modifyCSPoints(2, -value);
            break;
        case 3:
            cm.gainMeso(-value);
            break;
        case 4:
            cm.gainItem(itemId, -value);
            break;
    }
}

function getExchangeItemStringInfo(info) {
    let message = "";
    for (let x = 0; x < info[1].length; x++) {
        let itemId = info[1][x][0];
        let quantity = info[1][x][1];
        let period = info[1][x][2];
        message += "#v" + itemId + "#x" + quantity;
        if (period > 0) {
            message += "(" + period + "天)";
        }
        message += " #k";
    }
    return message;
}

function getNumberCountInArray(number, arr) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === number) {
            count++;
        }
    }
    return count;
}