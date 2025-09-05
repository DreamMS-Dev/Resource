var map;
var minute = 60 * 1000;
var setupTask;
var nextTime;
var ch = [false, 1]; // [隨機頻道,專用頻道(前提前格為false)]
var nowCh = -1;
var reloadWithSummon = true; // 重載時也觸發召喚
var mode = 0; // 0間隔 1隨機時間 2隨機整點
var interval = 24 * 60 * 60 * 1000; // 間隔時間
var randomTimeRange = [1, 1000]; // 隨機時間範圍(分鐘)
var randomOnTimeChance = 50; // 隨機整理觸發機率
var day = -1; // -1每天  ( 1禮拜日 2禮拜一 .... 7禮拜六  用法 var day = [0,1]; 禮拜日.禮拜一兩天
var mobList = [
    //[mapId,
    //[mobId,mobNum,mobHp,mobExp,x,y,] x.y某值-1地圖上隨機出現
    //]
    [100000000,
        [100100, 10, 100, 100, -15, 274]
    ]
];
function init() {
    if (em.getChannel() != 1) {
        return;
    }
    cancelSchedule();
    var cal = em.getCalendarWithArg(0, 0, 0);
    nextTime = cal.getTimeInMillis();
    if (reloadWithSummon) {
        if (ch[0]) {
            nowCh = ch[1];
        } else {
            var tempMaxCh = 0;
            for (var i = 1; i <= 20; i++) {
                tempMaxCh = i;
                if (em.getChannelServer(i) == null) {
                    break;
                }
            }
            nowCh = Math.floor(Math.random(tempMaxCh)) + 1;
        }
        spawnMob();
    }
    getNextTime();
    scheduleSetup();
}

function scheduleSetup() {
    setupTask = em.scheduleAtTimestamp("setup", nextTime);
}

function cancelSchedule() {
    if (setupTask != null) {
        setupTask.cancel(true);
    }
}

function setup() {
    spawnMob();
    getNextTime();
    scheduleSetup();
}

function spawnMob() {
    if (!isCorrectDay()) {
        return;
    }
    if (mode == 2 && Math.floor(Math.random() * 100) + 1 <= randomOnTimeChance) {
        return;
    }
    var num = Math.floor(Math.random() * mobList.length);
    tempMobList = mobList[num];
    map = em.getMap(tempMobList[0]);
    map.resetFully();
    for (var i = 1; i < tempMobList.length; i++) {
        var pos;
        if (tempMobList[i][5] == -1 || tempMobList[i][6] == -1) {
            pos = map.getFootholds().getRandomPos();
        } else {
            pos = new java.awt.Point(tempMobList[i][5], tempMobList[i][6]);
        }
        for (var j = 0; j < tempMobList[i][1]; j++) {
            var mobObject = em.getMonster(tempMobList[i][0]);
            var modified = em.newMonsterStats();
            if (tempMobList[i][2] != -1)
                modified.setOHp(tempMobList[i][2]);
            else
                modified.setOHp(mobObject.getHp());
            if (tempMobList[i][3] != -1)
                modified.setOExp(tempMobList[i][3]);
            else
                modified.setOExp(mobObject.getExp());
            modified.setOMp(mobObject.getMp());
            mobObject.setOverrideStats(modified);
            map.spawnMonsterOnGroundBelow(mobObject, pos);
        }
    }
    var msg = "【怪物突襲】:" + nowCh + map.getMapName() + "出現怪物";
    var itemId = 5120007;
    em.startBlowWeatherEffect(msg, itemId, 30 * 1000, -1);

    map = -1;
}

function getNextTime() {
    if (ch[0]) {
        nowCh = ch[1];
    } else {
        var tempMaxCh = 0;
        for (var i = 1; i <= 20; i++) {
            tempMaxCh = i;
            if (em.getChannelServer(i) == null) {
                break;
            }
        }
        nowCh = Math.floor(Math.random(tempMaxCh)) + 1;
    }
    if (mode == 0) {
        while (nextTime <= em.getCurrentTime()) {
            nextTime += interval;
        }
    } else if (mode == 1) {
        nextTime = em.getCurrentTime() + (Math.floor(Math.random() * (randomTimeRange[1] - randomTimeRange[0] + 1)) + randomTimeRange[0]) * minute;
    } else if (mode == 2) {
        while (nextTime <= em.getCurrentTime()) {
            nextTime += 60 * 60 * 1000;
        }
    }
}

function isCorrectDay() {
    if (day == -1) {
        return true;
    } else {
        for (var i = 0; i < day.length; i++) {
            if (day[i] == em.getDayOfWeek()) {
                return true;
            }
        }
    }
    return false;
}
