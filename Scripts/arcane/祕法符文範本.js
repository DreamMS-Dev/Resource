let debug = true;
let currentPage = 1;
let totalPage = -1;
let elementsPerPage = 6;

// 觸發方法為從別的腳本使用
// cm.dispose();
// cm.openArcaneForceScript(9010000, "此腳本名稱");
// 而不是直接開啟此腳本

function start() {
    let arcaneItemSize = createItemInfoList(false).size();
    totalPage = Math.ceil(arcaneItemSize / 6); // (6 elements in one page)
    cm.sendArcaneForceOpenAndUpdate(createArcaneForceInfo()); // open UI
    if (debug) {
        cm.getPlayer().dropMessage(5, "[start] totalPage: " + totalPage);
    }
}

function upgrade(position) {
    if (debug) {
        cm.getPlayer().dropMessage(5, "[upgrade] position: " + position);
    }
    // todo - get item in position (0 ~ 5) and upgrade
    cm.sendArcaneForceEffect(position); // effect
}

// I don't think we need to change this method anymore
function changePage(newPage) {
    if (debug) {
        cm.getPlayer().dropMessage(5, "[changePage] totalPage: " + totalPage + " newPage: " + newPage)
    }
    if (newPage <= totalPage) {
        currentPage = newPage;
        cm.sendArcaneForceOpenAndUpdate(createArcaneForceInfo()); // update UI
    }
}

function createArcaneForceInfo() {
    return cm.createArcaneForceInfo(createArcaneStatInfoList(), createItemInfoList(true), currentPage, totalPage);
}

function createItemInfoList(slice) {
    let arcaneItemInfoList = [];

    // todo - auto fetch from array (we need 6 elements, size can not less than 6)
    // itemId:      物品編號 (UI.wz/YutoShield/ArcaneForce.img/item 2439990, 2439991, 2439992, 2439993, 2439994, 2439995)
    // itemLevel:   物品等級
    // statusValue: 顯示狀態 0=顯示進度條, 1=顯示滿等, 2=顯示升級按鈕
    // exp:         當前經驗
    // totalExp:    上限經驗
    arcaneItemInfoList.push(cm.createArcaneItemInfo(5010500, 1, 0, 100, 1000));
    arcaneItemInfoList.push(cm.createArcaneItemInfo(5010521, 10, 2, 1000, 10000));
    arcaneItemInfoList.push(cm.createArcaneItemInfo(5010542, 20, 0, 2000, 10000));
    arcaneItemInfoList.push(cm.createArcaneItemInfo(5010563, 30, 0, 3000, 10000));
    arcaneItemInfoList.push(cm.createArcaneItemInfo(0, 0, 0, 0, 0));
    arcaneItemInfoList.push(cm.createArcaneItemInfo(5010605, 50, 0, 5000, 10000));
    arcaneItemInfoList.push(cm.createArcaneItemInfo(5010626, 70, 0, 7000, 10000));
    arcaneItemInfoList.push(cm.createArcaneItemInfo(5010647, 100, 1, 100000000, 100000000));

    if (slice) {
        let startIndex = (currentPage - 1) * elementsPerPage;
        let endIndex = startIndex + elementsPerPage;
        arcaneItemInfoList = arcaneItemInfoList.slice(startIndex, endIndex);
        while (arcaneItemInfoList.length < 6) {
            arcaneItemInfoList.push(cm.createArcaneItemInfo(0, 0, 0, 0, 0));
        }
        return cm.createArcaneItemInfoList(arcaneItemInfoList);
    } else {
        while (arcaneItemInfoList.length < 6) {
            arcaneItemInfoList.push(cm.createArcaneItemInfo(0, 0, 0, 0, 0));
        }
        return cm.createArcaneItemInfoList(arcaneItemInfoList);
    }
}

function createArcaneStatInfoList() {
    let arcaneStatInfos = [];

    // todo - auto fetch from array and we don't support hp and mp
    // statValue: 屬性類型 0=Empty, 1=Str, 2=Luk, 3=Dex, 4=Int, 5=Hp, 6=Arc, 7=MaxDamageCn, 8=MaxDamageEng
    // unit:      單位 0=Empty, 1=K, 2=W
    // signed:    運算符號 0=Empty, 1=Plus
    // value:     數值
    arcaneStatInfos.push(cm.createArcaneStatInfo(1, 0, 1, 100));
    arcaneStatInfos.push(cm.createArcaneStatInfo(2, 1, 0, 2));
    arcaneStatInfos.push(cm.createArcaneStatInfo(3, 2, 0, 3));
    arcaneStatInfos.push(cm.createArcaneStatInfo(4, 3, 0, 4));
    // arcaneStatInfos.push(cm.createArcaneStatInfo(5, 3, 0, 1000));
    return cm.createArcaneStatInfoList(arcaneStatInfos);
}