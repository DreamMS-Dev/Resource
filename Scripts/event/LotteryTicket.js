/**
 * 需要搭配一般腳本'彩券'一起使用
 * 2024.12.08
 * By Windyboy
 */

let logName = "彩券";
let interval = 24 * 60 * 60 * 1000;

let enable = false; // 是否啟用, true = 啟用, false = 關閉
let bettingMessage = "[彩券系統] : 今日彩券開放下注啦！快來試試手氣吧";
let lotteryMessage = "[彩券系統] : 今日樂透開獎啦！快去查看自己是不是萬中選一的幸運兒！";
let lotteryItemId = 5121008; // 樂透天氣道具代碼
let lotteryNumberCount = 5; // 樂透數字數量
let minimumNumber = 1; // 樂透最低數字
let maximumNumber = 50;  // 樂透最高數字
let keepingDataMonth = 3; // 樂透號碼保留多少個月
let lotteryHourlyBroadcast = 21; // 開獎時間，24小時制，範圍是0~23，0代表凌晨零點

function init() {
    if (!enable || cm.getChannel() !== 1) {
        return;
    }
    let cal = cm.getCalendarWithArg(0, 0, 0);
    let cal2 = cm.getCalendarWithArg(lotteryHourlyBroadcast, 0, 0); // 開獎廣播時間
    let nextSetupTime = cal.getTimeInMillis();
    let nextBroadcastTime = cal2.getTimeInMillis();
    // 以凌晨0點為基礎, 再+24個小時
    while (nextSetupTime <= cm.getCurrentTime()) {
        nextSetupTime += interval;
    }
    cm.setLongProperty("nextSetupTime", nextSetupTime)
    // 以lotteryHourlyBroadcast點為基礎, 再+24個小時
    while (nextBroadcastTime <= cm.getCurrentTime()) {
        nextBroadcastTime += interval;
    }
    cm.setLongProperty("nextBroadcastTime", nextBroadcastTime)
    //
    let world = cm.getWorld();
    let yesterdayDate = getYesterdayDateInString();
    let todayDate = getTodayDateInString();
    // 不存在則產生昨日樂透號碼
    generateLotteryNumbers(yesterdayDate, world, false);
    // 不存在則產生今日樂透號碼
    generateLotteryNumbers(todayDate, world, false);
    // 輸出訊息
    cm.println(cm.getReadableTime() + " [世界" + world + "] 昨日樂透編號: " + cm.getCacheLog(logName + "_" + yesterdayDate, world) + " 今日樂透編號: " + cm.getCacheLog(logName + "_" + todayDate, world));

    scheduleSetup();
    scheduleBroadcast();
}

function scheduleSetup() {
    let setupTask = cm.scheduleAtTimestamp("setup", cm.getLongProperty("nextSetupTime"));
    cm.setObjectProperty("setupTask", setupTask);
}

function scheduleBroadcast() {
    let broadcastTask = cm.scheduleAtTimestamp("broadcast", cm.getLongProperty("nextBroadcastTime"));
    cm.setObjectProperty("broadcastTask", broadcastTask);
}

function cancelSchedule() {
    let setupTask = cm.getObjectProperty("setupTask");
    if (setupTask != null && setupTask !== undefined) {
        setupTask.cancel(true);
        cm.removeObjectProperty(setupTask);
    }
    let broadcastTask = cm.getObjectProperty("broadcastTask");
    if (broadcastTask != null && broadcastTask !== undefined) {
        broadcastTask.cancel(true);
        cm.removeObjectProperty(broadcastTask);
    }
}

function broadcast() {
    cm.startGambleBlowWeatherEffect(lotteryMessage, lotteryItemId, cm.getWorld(), -1);
    cm.setLongProperty("nextBroadcastTime", (cm.getLongProperty("nextBroadcastTime") + interval));
    scheduleBroadcast();
}

// 每日0點5分觸發，更新編號及廣播可以開始下注
function setup() {
    let world = cm.getWorld();
    let todayDate = getTodayDateInString();
    // 產生今日樂透號碼
    generateLotteryNumbers(todayDate, world, true);
    // 輸出
    cm.println(cm.getReadableTime() + " [世界" + world + "] 今日樂透編號: " + cm.getCacheLog(logName + "_" + todayDate, world));
    // 廣播
    cm.broadcastGambleSpeakerWorld(bettingMessage, cm.getWorld(), -1);
    // 設置下次時間
    cm.setLongProperty("nextSetupTime", (cm.getLongProperty("nextSetupTime") + interval));
    // 註冊下次執行時間
    scheduleSetup();
}

function generateLotteryNumbers(dateStr, world, force) {
    let logWithDate = logName + "_" + dateStr;
    if (force || cm.getCacheLog(logWithDate, world) == null) {
        let numbers = [];
        for (let i = 1; i <= lotteryNumberCount; i++) {
            let number;
            do {
                number = cm.getRandomValue(minimumNumber, maximumNumber);
            } while (hasId(numbers, number));
            numbers.push(number);
        }
        cm.setCacheLog(logWithDate, numbers.join(","), getFirstDayOfNextMonths(keepingDataMonth + 1), world);
        if (force) {
            cm.println(cm.getReadableTime() + " [世界" + world + "] 強制重新生成樂透編號，將自動產生 (" + dateStr + ")");
        } else {
            cm.println(cm.getReadableTime() + " [世界" + world + "] 未偵測到樂透編號，將自動產生 (" + dateStr + ")");
        }
    }
}

function getCurrentTime() {
    let dt = new Date();
    let year = dt.getFullYear();
    let month = dt.getMonth() + 1;
    let day = dt.getDate();
    let hour = dt.getHours();
    let min = dt.getMinutes();
    let sec = dt.getSeconds();
    return year + "-" + month + '-' + day + ' ' + hour + ":" + min + ":" + sec;
}

function getYesterdayDateInString() {
    return getDateStr(-1);
}

function getTodayDateInString() {
    return getDateStr(0);
}

function getDateStr(adjustDayCount) {
    let dd = new Date();
    dd.setDate(dd.getDate() + adjustDayCount);
    let y = dd.getFullYear();
    let m = dd.getMonth() + 1;
    let d = dd.getDate();
    return y + "-" + m + "-" + d;
}

function getFirstDayOfNextMonths(monthsToAdd) {
    let now = new Date();
    let targetMonth = now.getMonth() + monthsToAdd;
    let targetDate = new Date(now.getFullYear(), targetMonth, 1);
    return targetDate.getTime();
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