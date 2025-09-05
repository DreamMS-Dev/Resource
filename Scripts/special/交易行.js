var sellingDay = 7; // 上架天數
var sellingType = 5; // 1 = 點券, 2 = 抵用券, 3 = 楓幣, 4 = 道具, 5 = 交易幣
var coin = 2000000; // 道具程式碼
var feePercent = 50; // 手續費
var maxSellingItemQty = 50; // 一個角色在拍賣行賣的物品上限
var exchangeRate = 100.0; // 交易幣兌換點券倍率，預設 1交易幣 = 2點券
var enableCashEquip = false; // 允許現金裝備
var enablePachinkoEquip = false; // 允許豆豆裝備
var title = "\t\t\t\t\t- 雲端交易行 -\r\n\r\n";
var content = "\t\t\t#b#L0#名字搜索#b#l\t#k#L1#分類搜索#l\r\n" +
        "\t\t\t#b#L2#上架管理#b#l\t#k#L3#下架管理#l\r\n" +
        "\t\t\t#b#L4#資金管理#b#l\t#k#L5#功能介紹#l\r\n" +
        "\t\t\t#b#L6#提現系統#b#l\t#k#L7#兌換點券#l\r\n";

var status = -1, sel, selInvType, auctionId, inputNumber;
var inputText;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else if (mode == 0) {
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status < 0) {
        cm.dispose();
    } else if (status == 0) {
        cm.sendSimple(title + content);
    } else if (status == 1) {
        if (mode == 1) {
            sel = selection;
        }
        if (sel == 0) { // 名字搜索
            cm.sendGetText("輸入要搜索的物品名稱:\r\n*支援模糊搜索");
        } else if (sel == 1) { // 分類搜索
            cm.sendSimple("\r\n#L1##d" + getInvTypeName(1) + "搜索#l\r\n\r\n#L2##d" + getInvTypeName(2) + "搜索#l\r\n\r\n#L4##d" + getInvTypeName(4) + "搜索#l\r\n\r\n#L3##d" + getInvTypeName(3) + "搜索#l\r\n");
        } else if (sel == 2) { // 上架管理
            if (cm.getSellingItemQuantity(cm.getPlayer().getId()) >= maxSellingItemQty) {
                cm.sendNext("目前在拍賣行最多隻能賣" + maxSellingItemQty + "個物品");
                status = -1;
                return;
            }
            cm.sendSimple("\r\n#L1##d上架#r" + getInvTypeName(1) + "#d第一個格子物品#l\r\n\r\n#L2##d上架#r" + getInvTypeName(2) + "#d第一個格子物品#l\r\n\r\n#L4##d上架#r" + getInvTypeName(4) + "#d第一個格子物品#l\r\n\r\n#L3##d上架#r" + getInvTypeName(3) + "#d第一個格子物品#l\r\n");
        } else if (sel == 3) { // 下架管理
            cm.sendSimple("你上架的東西如下:\r\n\r\n" + cm.searchSellingItemByCharacterId(cm.getPlayer().getId()));
        } else if (sel == 4) { // 資金管理
            cm.sendSimple("#b#e資金管理#n\r\n\r\n#r手續費: " + feePercent + "%#k\r\n\r\n目前已售出物品:#d(點選領取)#k\r\n\r\n#d" + cm.searchSoldOutItemByCharacterId(cm.getPlayer().getId()));
        } else if (sel == 5) { // 功能介紹
            cm.sendNext("雲端線上交易系統，支援所有裝備上架，交易幣滿100可以提現，收取10%的手續費");
            status = -1;
        } else if (sel == 6) { // 交易幣提現
            var pay = cm.getPlayer().getHyPay(1);
            if (pay <= 0) {
                cm.sendNext("目前沒有任何交易幣");
                status = -1;
                return;
            }
            cm.sendGetNumber("目前交易幣有#b" + pay + "#k\r\n請輸入提現金額", 1, 100, pay);
        } else if (sel == 7) { // 交易幣換點券
            var pay = cm.getPlayer().getHyPay(1);
            if (pay <= 0) {
                cm.sendNext("目前沒有任何交易幣");
                status = -1;
                return;
            }
            cm.sendGetNumber("目前交易幣有#b" + pay + "#k\r\n交易幣換點券倍率:" + exchangeRate + "\r\n請輸入要轉換的交易幣數量", 1, 1, pay);
        }
    } else if (status == 2) {
        if (sel == 0) { // 名字搜索
            cm.sendSimple("#b#e[" + cm.getText() + "]#k#n\r\n\r\n" + cm.searchSellingItemByEquipName(cm.getText()));
        } else if (sel == 1) { // 分類搜索
            cm.sendSimple("#b#e[" + getInvTypeName(selection) + "]#k#n\r\n\r\n" + cm.searchSellingItemByEquipNameAndItemType(null, selection));
        } else if (sel == 2) { // 上架管理
            if (mode == 1) {
                selInvType = selection;
            }
            if (selInvType < 0 || selInvType > 4) {
                cm.sendNext("未知的錯誤: " + selInvType);
                cm.dispose();
                return;
            } else if (cm.getItem(selInvType, 1) == null) {
                cm.sendNext(getInvTypeName(selInvType) + "的第一格為空");
                selInvType = -1;
                status = -1;
                return;
                /* } else if (cm.getItem(selInvType, 1).isUntradeable()) {
                 cm.sendNext(cm.getItemName(cm.getItem(selInvType, 1).getItemId()) + "是不可上架的物品");
                 selInvType = -1;
                 status = -1;
                 return; */
            } else if (!enablePachinkoEquip && cm.isPachinko(cm.getItem(selInvType, 1).getItemId())) {
                cm.sendNext(cm.getItemName(cm.getItem(selInvType, 1)) + "是豆豆裝備，無法上架");
                selInvType = -1;
                status = -1;
                return;
            } else if (!enableCashEquip && cm.isCash(cm.getItem(selInvType, 1).getItemId())) {
                cm.sendNext(cm.getItemName(cm.getItem(selInvType, 1)) + "是現金裝備，無法上架");
                selInvType = -1;
                status = -1;
                return;
            }
            cm.sendGetNumber("#v" + cm.getItem(selInvType, 1).getItemId() + "##t" + cm.getItem(selInvType, 1).getItemId() + "#\r\n請輸入" + getSellingTypeName(sellingType) + "價格", 1, sellingType == 3 ? 1000000 : 10, sellingType == 4 ? 1000 : 1000000000);
        } else if (sel == 3) { // 下架管理
            if (mode == 1) {
                auctionId = selection;
            }
            if (auctionId <= 0) {
                status = -1;
                action(1, 0, 0);
                return;
            }
            if (cm.takeBackSellingInfo(cm.getPlayer(), auctionId)) {
                cm.sendNext("下架成功");
            } else {
                cm.sendNext("下架失敗");
            }
            status = -1;
        } else if (sel == 4) { // 資金管理
            if (selection <= -1) {
                status = -1;
                action(1, 0, 0);
                return;
            }
            if (!cm.canReceiveSellingInfo(cm.getPlayer(), selection, coin, feePercent)) {
                cm.sendNext("請檢查楓幣數量及背包是否已滿");
                cm.dispose();
                return;
            }
            if (cm.receiveSellingInfo(cm.getPlayer(), selection, coin, feePercent)) {
                cm.sendNext("領取成功");
            } else {
                cm.sendNext("領取失敗");
            }
            status = 0;
        } else if (sel == 6) { // 交易幣提現
            var pay = cm.getPlayer().getHyPay(1);
            if (mode == 1) {
                inputNumber = selection;
            }
            if (inputNumber > pay || inputNumber < 0) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            }
            cm.sendGetText("請輸入交易幣提現資訊:");
        } else if (sel == 7) { // 交易幣換點券
            var pay = cm.getPlayer().getHyPay(1);
            if (mode == 1) {
                inputNumber = selection;
            }
            if (inputNumber > pay || inputNumber < 0) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            }
            cm.sendYesNo("是否確認要將#r" + inputNumber + "#k交易幣換成#b" + parseInt((inputNumber * exchangeRate)) + "#k點券?\r\n轉換后將只剩下#d" + (pay - inputNumber) + "#k交易幣");
        }
    } else if (status == 3) {
        if (sel == 0) { // 名字搜索
            if (selection < 0) {
                status = -1;
                action(1, 0, 0);
                return;
            }
            if (!cm.canHoldSellingItem(cm.getPlayer(), selection)) {
                cm.sendNext("請檢查背包空間后再購買");
                cm.dispose();
                return;
            } else if (!cm.canBuySellingItem(cm.getPlayer(), selection, coin)) {
                cm.sendNext("請檢查購買物品需要的條件及並非為販賣者");
                cm.dispose();
                return;
            }
            if (cm.buySellingItem(cm.getPlayer(), selection, coin)) {
                cm.sendNext("購買成功");
            } else {
                cm.sendNext("購買失敗");
            }
            cm.dispose();
        } else if (sel == 1) { // 分類搜索
            if (selection < 0) {
                status = -1;
                action(1, 0, 0);
                return;
            }
            if (!cm.canHoldSellingItem(cm.getPlayer(), selection)) {
                cm.sendNext("請檢查背包空間后再購買");
                cm.dispose();
                return;
            } else if (!cm.canBuySellingItem(cm.getPlayer(), selection, coin)) {
                cm.sendNext("請檢查購買物品需要的條件及並非為販賣者");
                cm.dispose();
                return;
            }
            if (cm.buySellingItem(cm.getPlayer(), selection, coin)) {
                cm.sendNext("購買成功");
            } else {
                cm.sendNext("購買失敗");
            }
            cm.dispose();
        } else if (sel == 2) { // 上架管理
            if (selection < 1 || selection > (sellingType == 4 ? 1000 : 1000000000) || cm.getItem(selInvType, 1) == null) {
                cm.sendNext("發生未知的錯誤:" + selection);
                cm.dispose();
                return;
            }
            var retItem = cm.getItem(selInvType, 1).copy();
            if (cm.addSellingItem(cm.getItem(selInvType, 1), cm.getPlayer(), sellingType, selection, sellingDay)) {
                cm.sendNext("上架成功");
                cm.boxMessage("云交易 : " + cm.getPlayer().getName() + "已經上架了道具，快去看看！", retItem);
            } else {
                cm.sendNext("上架失敗")
            }
            status = -1;
        } else if (sel == 6) { // 交易幣提現
            inputText = cm.getText();
            cm.sendYesNo("目前交易幣:#b" + cm.getPlayer().getHyPay(1) + "#k#l\r\n提現金額:#r" + inputNumber + "#k\r\n提現資訊:#d" + inputText + "#k\r\n請確認是否正確");
        } else if (sel == 7) { // 交易幣換點券
            if (inputNumber > cm.getPlayer().getHyPay(1)) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            }
            cm.getPlayer().addPay(-inputNumber);
            cm.gainCash(1, parseInt((inputNumber * exchangeRate)));
            cm.sendNext("已完成將#r" + inputNumber + "#k交易幣換成" + parseInt((inputNumber * exchangeRate)) + "點券");
            cm.logFile("交易幣轉換.txt", getTimeString() + "帳號:" + cm.getClient().getAccountName() + "(" + cm.getClient().getAccID() + ") 角色:" + cm.getPlayer().getName() + "(" + cm.getPlayer().getId() + ") 剩餘交易幣:" + cm.getPlayer().getHyPay(1) + " 交易幣轉換金額:" + inputNumber + " 目前點券:" + cm.getCash(1), true);
            status = -1;
            inputNumber = -1;
            sel = -1;
        }
    } else if (status == 4) {
        if (sel == 6) { // 交易幣提現
            if (inputNumber > cm.getPlayer().getHyPay(1)) {
                cm.sendNext("發生未知的錯誤");
                cm.dispose();
                return;
            }
            cm.getPlayer().addPay(-inputNumber);
            cm.logFile("提現.txt", getTimeString() + " 帳號:" + cm.getClient().getAccountName() + "(" + cm.getClient().getAccID() + ") 角色:" + cm.getPlayer().getName() + "(" + cm.getPlayer().getId() + ") 剩餘交易幣:" + cm.getPlayer().getHyPay(1) + " 提現金額:" + inputNumber + " 提現資訊:" + inputText, true);
            cm.sendNext("目前時間:" + getTimeString() + "\r\n剩餘交易幣:#b" + cm.getPlayer().getHyPay(1) + "#k#l\r\n提現金額:#r" + inputNumber + "#k\r\n提現資訊:#d" + inputText + "#k\r\n請截圖儲存發送給提現客服確認");
            status = -1;
            inputNumber = -1;
            sel = -1;
            inputText = null;
        }
    }
}

function getTimeString() {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    return d.getFullYear() + '/' +
            (month < 10 ? '0' : '') + month + '/' +
            (day < 10 ? '0' : '') + day +
            " " +
            (hour < 10 ? '0' : '') + hour + ":" +
            (min < 10 ? '0' : '') + min + ":" +
            (sec < 10 ? '0' : '') + sec;
}

function getSellingTypeName(val) {
    switch (val) {
        case 1:
            return "點券";
        case 2:
            return "抵用券";
        case 3:
            return "楓幣";
        case 4:
            return "道具";
        case 5:
            return "交易幣";
        default:
            return "錯誤";
    }
}

function getInvTypeName(val) {
    switch (val) {
        case 1:
            return "裝備欄";
        case 2:
            return "消耗欄";
        case 4:
            return "其他欄";
        case 3:
            return "設定欄";
        default:
            return "錯誤";
    }
}
