//region selection

let changePositionSelection = 0;
let welcomeMessageSelection = 1;
let lockOrUnlockSelection = 2;
let passwordSelection = 3;
let furnitureSelection = 4;
let customStatSelection = 5;
let visitorSelection = 6;
let neighborSelection = 7;
let messageBoardSelection = 8;
let blockUserSelection = 9;
let enterMyHomeSelection = 10;

let visitorCheckCustomStatSelection = 100;
let visitorCheckVisitorSelection = 101;
let visitorCheckNeighborSelection = 102;
let visitorMessageBoardSelection = 103;
let visitorGiveFlowerSelection = 104;
let visitorThrowMudSelection = 105;

//endregion

//region system variable

let status = -1, sel = -1, sel2 = -1, sel3 = -1, sel4 = -1, sel5 = -1;
let account = true;
let newFurnitureTrunkInfoId = -1;
let owner = false;
let messageContent = "";

//endregion

//region options

let showDebugText = false; // 啟用偵錯模式
let showCustomStatToVisitor = true; // 訪客查看小屋能力加成
let useMessageBoardSystem = true; // 啟用留言板系統
let messageBoardDisplayDate = true; // 留言板只顯示日期，而不是詳細時間
let pagePerMessage = 20; // 留言板內容每頁留言數量
let useNeighborSystem = true; // 啟用鄰居系統
let useVisitorSystem = true; // 啟用訪客系統
let visitorDisplayDate = true; // 訪客只顯示日期，而不是詳細時間
let maxNeighborQuantity = 200; // 最多鄰居數量
let maxBlockUserQuantity = 500; // 最多禁止訪問角色數量
let sameFurnitureTemplateIdOnlyApplyOnce = true; // 相同家具額外能力只計算一次，不疊加計算
//
let visitorHomeActionLogName = "home_visitor_action_"; // 送花/扔泥巴角色Log名稱

let fieldArray = [
    // 小屋名稱(空白=地圖名), 地圖代碼, 最多擴充家具數量(-1為不可擴充), 單次家具擴充空間 最多擴充倉庫家具數量(-1為不可擴充), 單次倉庫家具擴充空間, money, cash, maplePoint, pachinko, items
    ["", 910000001, 50, 5, 200, 10, 0, 0, 0, 0, [[2000000, 1], [2000001, 2]]],
    ["海景第一排", 910000002, 60, 5, -1, -1, 10, 0, 0, 0, []],
    ["林間別墅", 910000003, -1, -1, 220, 10, 0, 10, 0, 0, []],
    ["叢林宅邸", 910000004, 30, 5, 300, 10, 0, 0, 10, 0, []],
    ["田野鄉間", 910000005, -1, -1, -1, -1, 0, 0, 0, 10, []]
];

let furnitureInfoArray = [
    [910000001, [
        // id, money, cash, maplePoint, pachinko, items, 最大傷害, 召喚獸傷害倍率,Boss傷害倍率,傷害倍率,經驗倍率,掉寶倍率,金錢倍率,全屬性倍率,力量倍率,敏捷倍率,智力倍率,幸運倍率,全屬性,力量,敏捷,智力,幸運,抵擋異常狀態機率,無視怪物傷害機率,藥水回血倍率,藥水回魔倍率
        [2112014, 0, 0, 0, 0, [[2000000, 1], [2000001, 2]], 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2302003, 0, 0, 0, 0, [], 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2229009, 0, 0, 0, 0, [], 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808000, 0, 0, 0, 0, [], 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808001, 0, 0, 0, 0, [], 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808002, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808003, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808004, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808005, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808006, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808007, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808008, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808009, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808010, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0],
        [9808011, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0],
        [9808012, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0],
        [9808013, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0],
        [9902000, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0],
        [9908001, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0],
        [9802008, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20.1, 0],
        [9808002, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20.2, 0]
    ]
    ],
    [910000002, [
        // id, money, cash, maplePoint, pachinko, items, 最大傷害, 召喚獸傷害倍率,Boss傷害倍率,傷害倍率,經驗倍率,掉寶倍率,金錢倍率,全屬性倍率,力量倍率,敏捷倍率,智力倍率,幸運倍率,全屬性,力量,敏捷,智力,幸運,抵擋異常狀態機率,無視怪物傷害機率,藥水回血倍率,藥水回魔倍率
        [2112014, 0, 0, 0, 0, [[2000000, 1], [2000001, 2]], 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2302003, 0, 0, 0, 0, [], 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2229009, 0, 0, 0, 0, [], 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808000, 0, 0, 0, 0, [], 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808001, 0, 0, 0, 0, [], 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808002, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808003, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808004, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808005, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808006, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808007, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808008, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808009, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0],
        [9808010, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0],
        [9808011, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0],
        [9808012, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0],
        [9808013, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0],
        [9902000, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0],
        [9908001, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0],
        [9802008, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20.1, 0],
        [9808002, 0, 0, 0, 0, [], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20.2, 0]
    ]
    ],
];


//endregion

function start() {
    account = cm.isMyHomeAccountMode();
    if (cm.getPlayer().getMap().getMyHomeId() === -1) {
        cm.sendNext("請在小屋內跟我對話");
        cm.dispose();
        return;
    }
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        if (status === 3) {
            if (sel === furnitureSelection) {
                if (sel2 === 12) {
                    quickEditFurnitureInfo(selection, cm.getMyHome(cm.getPlayer().getMap().getMyHomeId()), sel3);
                    status = 2; // back to status 3
                }
            }
        }
        if (showDebugText) {
            cm.getPlayer().dropMessage(6, "status: " + status + " mode: " + mode + " sel: " + sel + " sel2: " + sel2 + " sel3: " + sel3 + " sel4: " + sel4);
        }
        status++;
    } else if (mode === 0) {
        if (status === 1) {
            sel = -1;
        } else if (status === 2) {
            sel2 = -1;
        } else if (status === 3) {
            sel3 = -1;
        } else if (status === 4) {
            if (sel === furnitureSelection && sel2 === 0) {
                sel = -1;
                sel2 = -1;
                sel3 = -1;
                sel4 = -1;
                status = -1;
                newFurnitureTrunkInfoId = -1;
            } else {
                sel4 = -1;
            }
        } else if (status === 5) {
            sel5 = -1;
        }
        if (showDebugText) {
            cm.getPlayer().dropMessage(6, "status: " + status + " mode: " + mode + " sel: " + sel + " sel2: " + sel2 + " sel3: " + sel3 + " sel4: " + sel4);
        }
        status--;
    } else {
        cm.dispose();
        return;
    }

    if (status <= -1) {
        cm.dispose();
    } else if (status === 0) {
        let info = cm.getMyHome(cm.getPlayer().getMap().getMyHomeId());
        if (info === null) {
            cm.sendNext("小屋發生未知錯誤: " + cm.getPlayer().getMap().getMyHomeId());
            cm.dispose();
            return;
        }
        if (account) {
            if (info.getAccountId() === cm.getPlayer().getAccountId()) {
                owner = true;
            }
        } else {
            if (info.getCharacterId() === cm.getPlayer().getId()) {
                owner = true;
            }
        }

        let message;
        if (owner) {
            message = "[我的小屋]\r\n";
            if (info.getFlower() > 0 || info.getMud() > 0) {
                message += "鮮花數量: #r" + cm.numberWithCommas(info.getFlower()) + "#k 泥巴數量: #d" + cm.numberWithCommas(info.getMud()) + "#k\r\n";
            }
            message += "\r\n";
            message += "#L" + changePositionSelection + "##d換位置到我站的地方#k#l\r\n";
            message += "#L" + welcomeMessageSelection + "##b歡迎訊息: " + (info.getWelcomeMessage().length() > 0 ? "#r有" : "#k無") + "#k#l\r\n";
            message += "#L" + lockOrUnlockSelection + "##b小屋門鎖: " + (info.isPrivateHome() ? "#r已上鎖" : "#k未上鎖") + "#k#l\r\n";
            message += "#L" + passwordSelection + "##b小屋密碼: " + (info.getPassword().length() > 0 ? "#r有" : "#k無") + "#k#l\r\n";
            message += "#L" + furnitureSelection + "##d確認家具資訊#k(#r" + (Math.max(0, info.getSubInfo().getFurnitureInfoList().size() - 1)) + ")#k#l\r\n";
            message += "#L" + customStatSelection + "##d確認能力加成#k#l\r\n";
            if (useVisitorSystem) {
                message += "#L" + visitorSelection + "##b確認訪客名單#k(#r" + info.getVisitorSize() + "#k)#l\r\n";
            }
            if (useNeighborSystem) {
                message += "#L" + neighborSelection + "##d管理鄰居列表#k(#r" + info.getSubInfo().getNeighborInfos().size() + "#k)#l\r\n";
            }
            if (useMessageBoardSystem) {
                message += "#L" + messageBoardSelection + "##r管理留言板#k(#r" + info.getSubInfo().getMessageInfoList().size() + "#k)#l\r\n";
            }
            message += "#L" + blockUserSelection + "##b管理禁止訪問角色#k(#r" + info.getSubInfo().getBlockUserInfos().size() + "#k)#l\r\n";
            let myHomeInfoListSize = account ? cm.getMyHomeListByAccountId(cm.getPlayer().getAccountId()).size() : cm.getMyHomeListByCharacterId(cm.getPlayer().getId()).size();
            if (myHomeInfoListSize > 1) {
                message += "#L" + enterMyHomeSelection + "##d前往我的其他小屋#k(#r" + myHomeInfoListSize + "#k)#l\r\n";
            }
            if (useNeighborSystem) {
                message += "#L" + visitorCheckNeighborSelection + "##d前往鄰居的小屋\r\n";
            }
        } else {
            message = "[" + info.getCharacterName() + "的小屋]\r\n";
            if (info.getFlower() > 0 || info.getMud() > 0) {
                message += "鮮花數量: #r" + cm.numberWithCommas(info.getFlower()) + "#k 泥巴數量: #d" + cm.numberWithCommas(info.getMud()) + "#k\r\n";
            }
            message += "\r\n";
            if (showCustomStatToVisitor) {
                message += "#L" + visitorCheckCustomStatSelection + "##b查看小屋能力加成\r\n";
            }
            if (useVisitorSystem) {
                message += "#L" + visitorCheckVisitorSelection + "##b查看訪客列表(#r" + info.getVisitorSize() + "#k)#k#l\r\n";
            }
            if (useNeighborSystem) {
                message += "#L" + visitorCheckNeighborSelection + "##b查看鄰居列表(#r" + info.getSubInfo().getNeighborInfos().size() + "#k)#k#l\r\n";
            }
            if (useMessageBoardSystem) {
                message += "#L" + visitorMessageBoardSelection + "##d前往留言板#k#l\r\n";
            }
            message += "\r\n\r\n";
            message += "#L" + visitorGiveFlowerSelection + "##d送小屋一朵花#k#l\r\n";
            message += "#L" + visitorThrowMudSelection + "##b丟小屋一坨泥巴#k#l\r\n";
        }

        cm.sendSimple(message);
    } else if (status === 1) {
        if (mode === 1 && sel === -1) {
            sel = selection;
        }
        let info = cm.getMyHome(cm.getPlayer().getMap().getMyHomeId());
        if (sel === changePositionSelection) {
            let currentFurnitureInfo = null;
            let furnitureInfoList = info.getSubInfo().getFurnitureInfoList();
            let furnitureInfoListIterator = furnitureInfoList.iterator();
            while (furnitureInfoListIterator.hasNext()) {
                let localFurnitureInfo = furnitureInfoListIterator.next();
                if (localFurnitureInfo.getType().getValue() === 1 && localFurnitureInfo.getTemplateId() === cm.getId()) {
                    currentFurnitureInfo = localFurnitureInfo;
                    break;
                }
            }
            if (currentFurnitureInfo != null) {
                let pos = cm.getPlayer().getPosition();
                info.editFurniture(currentFurnitureInfo.getFurnitureId(), cm.getId(), 1, parseInt(pos.getX()), parseInt(pos.getY()), cm.getPlayer().isFacingLeft());
                cm.dispose();
            } else {
                cm.sendNext("發生未知錯誤");
                cm.dispose();
            }
        } else if (sel === welcomeMessageSelection) {
            let message = "[小屋歡迎訊息]\r\n";
            message += "目前訊息: #r" + (info.getWelcomeMessage().length() > 0 ? info.getWelcomeMessage() : "未設置") + "#k\r\n";
            message += "\r\n";
            message += "#L0##d修改歡迎訊息#k#l\r\n";
            message += "#L1##b移除歡迎訊息#k#l\r\n";
            cm.sendSimple(message);
        } else if (sel === lockOrUnlockSelection) {
            info.setPrivateHome(!info.isPrivateHome());
            cm.sendNext("小屋門鎖已修改為: " + (info.isPrivateHome() ? "#r已上鎖" : "#k未上鎖"));
            status = -1;
            sel = -1;
        } else if (sel === passwordSelection) {
            let message = "[小屋密碼]\r\n";
            message += "目前密碼: #r" + (info.getPassword().length() > 0 ? "有" : "未設置") + "#k\r\n";
            message += "\r\n";
            message += "#L0##d修改密碼#k#l\r\n";
            message += "#L1##b移除密碼#k#l\r\n";
            cm.sendSimple(message);
        } else if (sel === furnitureSelection) {
            let fieldArrayInfo = getFieldArrayInfo(info.getFieldId());
            let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
            let message = "[小屋家具]\r\n";

            if (info.getFurnitureSize() > 0) {
                message += "已放出家具數量: #r" + Math.max(0, info.getSubInfo().getFurnitureInfoList().size() - 1) + "/" + info.getFurnitureSize() + "#k\r\n"; // 1 = manage npc
            } else {
                message += "已放出家具數量: #r" + Math.max(0, info.getSubInfo().getFurnitureInfoList().size() - 1) + "#k\r\n"; // 1 = manage npc
            }
            if (info.getTrunkSize() > 0) {
                message += "倉庫內家具數量: #r" + info.getSubInfo().getFurnitureTrunkInfoList().size() + "/" + info.getTrunkSize() + "#k\r\n";
            } else {
                message += "倉庫內家具數量: #r" + info.getSubInfo().getFurnitureTrunkInfoList().size() + "#k\r\n";
            }
            if (fieldFurnitureInfoArray != null) {
                message += "#L0##r購買小屋家具#l\r\n";
                let thresholds = [100, 200, 300, 400, 500, 600, 700, 800];
                for (let i = 0; i < thresholds.length; i++) {
                    if (fieldFurnitureInfoArray.length >= thresholds[i]) {
                        message += "#L" + (i + 1) + "##r購買小屋家具" + (i + 2) + "#l\r\n";
                    } else {
                        break;
                    }
                }
            }
            if (fieldArrayInfo != null) {
                if (fieldArrayInfo[2] > 0) {
                    message += "#L1000##d擴充家具數量(#b" + info.getFurnitureSize() + "#d/#r" + fieldArrayInfo[2] + "#d)#l\r\n";
                }
                if (fieldArrayInfo[4] > 0) {
                    message += "#L1001##d擴充倉庫家具數量(#b" + info.getTrunkSize() + "#d/#r" + fieldArrayInfo[4] + "#d)#l\r\n";
                }
            }
            //
            message += "\r\n";
            //
            message += "#L10##b確認已放出家具#k#l\r\n";
            message += "#L11##b收回已放出家具#k#l\r\n";
            message += "#L12##b修改已放出家具#k#l\r\n";
            //
            message += "\r\n";
            //
            message += "#L100##d確認倉庫內家具#k#l\r\n";
            message += "#L101##d放置倉庫內家具#k#l\r\n";
            message += "#L102##d移除倉庫內家具#k#l\r\n";
            message += "\r\n";
            cm.sendSimple(message);
        } else if (sel === customStatSelection) {
            cm.sendNext("[我的小屋]\r\n能力加成如下:\r\n\r\n" + getCustomStatMessage(info));
            status = -1;
            sel = -1;
        } else if (sel === visitorSelection) {
            sendVisitorList(info, "[我的小屋]\r\n\r\n");
            status = -1;
            sel = -1;
        } else if (sel === neighborSelection) {
            let message = "[小屋管理鄰居]\r\n";
            message += "目前鄰居數量: #r" + info.getSubInfo().getNeighborInfos().size() + "#k個\r\n";
            message += "\r\n";
            message += "#L0##d增加鄰居#k#l\r\n";
            message += "#L1##b移除鄰居#k#l\r\n";
            message += "#L2##r移除所有鄰居#k#l\r\n";
            cm.sendSimple(message);
        } else if (sel === messageBoardSelection) {
            let message = "[小屋管理留言板]\r\n";
            message += "目前留言板所有訊息數量: #r" + info.getSubInfo().getMessageInfoList().size() + "#k個\r\n";
            message += "目前留言板可見訊息數量: #r" + getAvailableMessageInfoSize(info) + "#k個\r\n";
            message += "\r\n";
            message += "#L0##d管理個別留言#k#l\r\n";
            message += "#L1##d開啟顯示所有留言#k#l\r\n";
            message += "#L2##d關閉顯示所有留言#k#l\r\n";
            message += "#L3##r移除所有留言#k#l\r\n";
            cm.sendSimple(message);
        } else if (sel === enterMyHomeSelection) {
            let currentHomeInfoListIterator = account ? cm.getMyHomeListByAccountId(cm.getPlayer().getAccountId()).iterator() : cm.getMyHomeListByCharacterId(cm.getPlayer().getId()).iterator();
            let message = "請選擇要進入的小屋:\r\n\r\n";
            while (currentHomeInfoListIterator.hasNext()) {
                let iterator = currentHomeInfoListIterator.next();
                if (iterator.getId() !== info.getId()) {
                    message += "#L" + iterator.getId() + "#" + getFieldNickNameById(iterator.getFieldId()) + "\r\n";
                }
            }
            cm.sendSimple(message);
        } else if (sel === blockUserSelection) {
            let message = "[小屋管理禁止訪問角色]\r\n";
            message += "目前禁止訪問角色數量: #r" + info.getSubInfo().getBlockUserInfos().size() + "#k個\r\n";
            message += "\r\n";
            message += "#L0##d增加禁止訪問角色#k#l\r\n";
            message += "#L1##b移除禁止訪問角色#k#l\r\n";
            message += "#L2##r移除所有禁止訪問角色#k#l\r\n";
            cm.sendSimple(message);
        } else if (sel === visitorCheckCustomStatSelection) {
            cm.sendNext("[" + info.getCharacterName() + "的小屋]\r\n能力加成如下:\r\n\r\n" + getCustomStatMessage(info));
            status = -1;
            sel = -1;
        } else if (sel === visitorCheckVisitorSelection) {
            sendVisitorList(info, "[" + info.getCharacterName() + "的小屋]\r\n\r\n");
            status = -1;
            sel = -1;
        } else if (sel === visitorCheckNeighborSelection) {
            sendNeighborList(info, "[" + info.getCharacterName() + "的小屋鄰居]\r\n\r\n");
            if (info.getSubInfo().getNeighborInfos().size() === 0) {
                status = -1;
                sel = -1;
            }
        } else if (sel === visitorGiveFlowerSelection) {
            if (cm.getPlayer().getLogValue(visitorHomeActionLogName + info.getId()) <= 0) {
                cm.getPlayer().addDailyLogValue(visitorHomeActionLogName + info.getId(), 1);
                info.addFlower(cm.getPlayer().getId());
                let message = "[" + info.getCharacterName() + "的小屋]\r\n\r\n";
                message += "#d鮮花#k數量: #r" + cm.numberWithCommas(info.getFlower()) + "#k\r\n";
                message += "#d泥巴#k數量: #b" + cm.numberWithCommas(info.getMud()) + "#k";
                cm.sendNext(message);
            } else {
                cm.sendNext("今天已經幫小屋做過評價了哦!");
            }
            status = -1;
            sel = -1;
        } else if (sel === visitorThrowMudSelection) {
            if (cm.getPlayer().getLogValue(visitorHomeActionLogName + info.getId()) <= 0) {
                cm.getPlayer().addDailyLogValue(visitorHomeActionLogName + info.getId(), 1);
                info.addMud(cm.getPlayer().getId());
                let message = "[" + info.getCharacterName() + "的小屋]\r\n\r\n";
                message += "#d鮮花#k數量: #r" + cm.numberWithCommas(info.getFlower()) + "#k\r\n";
                message += "#d泥巴#k數量: #b" + cm.numberWithCommas(info.getMud()) + "#k";
                cm.sendNext(message);
            } else {
                cm.sendNext("今天已經幫小屋做過評價了哦!");
            }
            status = -1;
            sel = -1;
        } else if (sel === visitorMessageBoardSelection) {
            let message = "[" + info.getCharacterName() + "的小屋留言板]\r\n";
            message += "目前留言板訊息數量: #r" + getAvailableMessageInfoSize(info) + "#k個\r\n";
            message += "\r\n";
            message += "#L0##d我要查看留言#k#l\r\n";
            message += "#L1##b我要留言#k#l\r\n";
            cm.sendSimple(message);
        }
    } else if (status === 2) {
        if (mode === 1 && sel2 === -1) {
            sel2 = selection;
        }
        let info = cm.getMyHome(cm.getPlayer().getMap().getMyHomeId());
        if (sel === welcomeMessageSelection) {
            if (sel2 === 0) {
                cm.sendGetText("原始歡迎訊息: #r" + (info.getWelcomeMessage().length() > 0 ? info.getWelcomeMessage() : "未設置") + "#k\r\n\r\n請輸入新的歡迎訊息");
            } else if (sel2 === 1) {
                if (info.getWelcomeMessage().length() <= 0) {
                    cm.sendNext("目前沒有設置歡迎訊息");
                    sel2 = -1;
                    status = 0;
                } else {
                    cm.sendYesNo("是否確認要移除目前的歡迎訊息:\r\n\r\n#r" + info.getWelcomeMessage());
                }
            }
        } else if (sel === passwordSelection) {
            if (sel2 === 0) {
                cm.sendGetText("原始密碼: #r" + (info.getPassword().length() > 0 ? "有" : "未設置") + "#k\r\n\r\n請輸入新的密碼");
            } else if (sel2 === 1) {
                if (info.getPassword().length() <= 0) {
                    cm.sendNext("目前沒有設置密碼");
                    sel2 = -1;
                    status = 0;
                } else {
                    cm.sendYesNo("是否確認要移除目前的密碼");
                }
            }
        } else if (sel === furnitureSelection) {
            if (sel2 >= 0 && sel2 <= 9) {
                let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                let message = "\r\n";
                if (fieldFurnitureInfoArray === null) {
                    cm.sendNext("該小屋目前沒有開放購買家具");
                    sel2 = -1;
                    status = 0;
                } else {
                    let minimum = sel2 * 100;
                    let maximum = (sel2 + 1) * 100;
                    maximum = Math.min(maximum, fieldFurnitureInfoArray.length);
                    for (let i = minimum; i < maximum; i++) {
                        message += "#L" + i + "#" + getReactorPicture(fieldFurnitureInfoArray[i][0]) + "#l\r\n";
                        message += getFurnitureReqMessage(fieldFurnitureInfoArray, i, true);
                        message += getFurnitureStatMessage(fieldFurnitureInfoArray, i, i, true);
                        if (hasFurniture(info, 0, fieldFurnitureInfoArray[i][0]) || hasFurnitureInTrunk(info, 0, fieldFurnitureInfoArray[i][0])) {
                            message += "#L" + i + "##r已擁有#k#l";
                        }
                        message += "\r\n";
                    }
                    cm.sendSimple(message);
                }
            } else if (sel2 === 1000 || sel2 === 1001) {
                let fieldArrayInfo = getFieldArrayInfo(info.getFieldId());
                if (sel2 === 1000) {
                    if (info.getFurnitureSize() >= fieldArrayInfo[2]) {
                        cm.sendNext("小屋可放置家具數量無法繼續擴充了!");
                        sel2 = -1;
                        status = 0;
                        return;
                    }
                } else if (sel2 === 1001) {
                    let fieldArrayInfo = getFieldArrayInfo(info.getFieldId());
                    if (info.getTrunkSize() >= fieldArrayInfo[4]) {
                        cm.sendNext("小屋倉庫可放置家具數量無法繼續擴充了!");
                        sel2 = -1;
                        status = 0;
                        return;
                    }
                }
                let message = "[小屋家具]\r\n擴充#r" + (sel2 === 1000 ? "家具" : "倉庫") + "#b" + (sel2 === 1000 ? fieldArrayInfo[3] : fieldArrayInfo[5]) + "#k格\r\n";
                let reqMoney = fieldArrayInfo[6];
                let reqCash = fieldArrayInfo[7];
                let reqMaplePoint = fieldArrayInfo[8];
                let reqPachinko = fieldArrayInfo[9];
                let reqItems = fieldArrayInfo[10];
                message += getReqMessageInternal(reqMoney, reqCash, reqMaplePoint, reqPachinko, reqItems, -1, false);
                message += "\r\n\r\n是否確認要擴充?";
                cm.sendYesNo(message);
            } else if (sel2 === 10) {
                let furnitureInfoList = info.getSubInfo().getFurnitureInfoList();
                if (furnitureInfoList.size() === 1) { // 1 = manage npc
                    cm.sendNext("該小屋目前沒有放置家具");
                    sel2 = -1;
                    status = 0;
                } else {
                    let message = "\r\n";
                    let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                    let furnitureInfoListIterator = furnitureInfoList.iterator();
                    while (furnitureInfoListIterator.hasNext()) {
                        let furnitureInfo = furnitureInfoListIterator.next();
                        if (furnitureInfo.getType().getValue() === 0) {
                            let selectionIndex = -1;

                            for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                                if (fieldFurnitureInfoArray[i][0] === furnitureInfo.getTemplateId()) {
                                    selectionIndex = i;
                                    break;
                                }
                            }

                            message += getReactorPicture(furnitureInfo.getTemplateId()) + "#l\r\n";
                            if (selectionIndex !== -1) {
                                message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, selectionIndex, false);
                            }
                        }
                    }
                    cm.sendNext(message);
                    sel2 = -1;
                    status = 0;
                }
            } else if (sel2 === 11) {
                let furnitureInfoList = info.getSubInfo().getFurnitureInfoList();
                if (furnitureInfoList.size() === 1) { // 1 = manage npc
                    cm.sendNext("該小屋目前沒有放置家具");
                    sel2 = -1;
                    status = 0;
                } else {
                    let message = "請選擇要收回的家具\r\n";
                    let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                    let furnitureInfoListIterator = furnitureInfoList.iterator();
                    while (furnitureInfoListIterator.hasNext()) {
                        let furnitureInfo = furnitureInfoListIterator.next();
                        if (furnitureInfo.getType().getValue() === 0) {
                            let selectionIndex = -1;

                            for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                                if (fieldFurnitureInfoArray[i][0] === furnitureInfo.getTemplateId()) {
                                    selectionIndex = i;
                                    break;
                                }
                            }

                            message += "#L" + furnitureInfo.getFurnitureId() + "#" + getReactorPicture(furnitureInfo.getTemplateId()) + "#l\r\n";
                            if (selectionIndex !== -1) {
                                message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, furnitureInfo.getFurnitureId(), true);
                            }
                        }
                    }
                    cm.sendSimple(message);
                }
            } else if (sel2 === 12) {
                let furnitureInfoList = info.getSubInfo().getFurnitureInfoList();
                if (furnitureInfoList.size() === 1) { // 1 = manage npc
                    cm.sendNext("該小屋目前沒有放置家具");
                    sel2 = -1;
                    status = 0;
                } else {
                    let message = "請選擇要修改的家具\r\n";
                    let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                    let furnitureInfoListIterator = furnitureInfoList.iterator();
                    while (furnitureInfoListIterator.hasNext()) {
                        let furnitureInfo = furnitureInfoListIterator.next();
                        if (furnitureInfo.getType().getValue() === 0) {
                            let selectionIndex = -1;

                            for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                                if (fieldFurnitureInfoArray[i][0] === furnitureInfo.getTemplateId()) {
                                    selectionIndex = i;
                                    break;
                                }
                            }

                            message += "#L" + furnitureInfo.getFurnitureId() + "#" + getReactorPicture(furnitureInfo.getTemplateId()) + "#l\r\n";
                            if (selectionIndex !== -1) {
                                message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, furnitureInfo.getFurnitureId(), true);
                            }
                        }
                    }
                    cm.sendSimple(message);
                }
            } else if (sel2 === 100) {
                let furnitureTrunkInfoList = info.getSubInfo().getFurnitureTrunkInfoList();
                if (furnitureTrunkInfoList.size() === 0) {
                    cm.sendNext("小屋倉庫內目前沒有家具");
                    sel2 = -1;
                    status = 0;
                } else {
                    let message = "\r\n";
                    let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                    let furnitureInfoListIterator = furnitureTrunkInfoList.iterator();
                    while (furnitureInfoListIterator.hasNext()) {
                        let furnitureInfo = furnitureInfoListIterator.next();
                        if (furnitureInfo.getType().getValue() === 0) {
                            let selectionIndex = -1;

                            for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                                if (fieldFurnitureInfoArray[i][0] === furnitureInfo.getTemplateId()) {
                                    selectionIndex = i;
                                    break;
                                }
                            }

                            message += getReactorPicture(furnitureInfo.getTemplateId()) + "#l\r\n";
                            if (selectionIndex !== -1) {
                                message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, selectionIndex, false);
                            }
                        }
                    }
                    cm.sendNext(message);
                    sel2 = -1;
                    status = 0;
                }
            } else if (sel2 === 101) {
                let furnitureTrunkInfoList = info.getSubInfo().getFurnitureTrunkInfoList();
                if (furnitureTrunkInfoList.size() === 0) {
                    cm.sendNext("小屋倉庫內目前沒有家具");
                    sel2 = -1;
                    status = 0;
                } else {
                    let message = "請選擇要放出的家具\r\n";
                    let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                    let furnitureInfoListIterator = furnitureTrunkInfoList.iterator();
                    while (furnitureInfoListIterator.hasNext()) {
                        let furnitureInfo = furnitureInfoListIterator.next();
                        if (furnitureInfo.getType().getValue() === 0) {
                            let selectionIndex = -1;

                            for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                                if (fieldFurnitureInfoArray[i][0] === furnitureInfo.getTemplateId()) {
                                    selectionIndex = i;
                                    break;
                                }
                            }

                            message += "#L" + furnitureInfo.getFurnitureId() + "#" + getReactorPicture(furnitureInfo.getTemplateId()) + "#l\r\n";
                            if (selectionIndex !== -1) {
                                message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, furnitureInfo.getFurnitureId(), true);
                            }
                        }
                    }
                    cm.sendSimple(message);
                }
            } else if (sel2 === 102) {
                let furnitureTrunkInfoList = info.getSubInfo().getFurnitureTrunkInfoList();
                if (furnitureTrunkInfoList.size() === 0) {
                    cm.sendNext("小屋倉庫內目前沒有家具");
                    sel2 = -1;
                    status = 0;
                } else {
                    let message = "請選擇要#r#e移除#k#n的家具\r\n";
                    let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                    let furnitureInfoListIterator = furnitureTrunkInfoList.iterator();
                    while (furnitureInfoListIterator.hasNext()) {
                        let furnitureInfo = furnitureInfoListIterator.next();
                        if (furnitureInfo.getType().getValue() === 0) {
                            let selectionIndex = -1;

                            for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                                if (fieldFurnitureInfoArray[i][0] === furnitureInfo.getTemplateId()) {
                                    selectionIndex = i;
                                    break;
                                }
                            }

                            message += "#L" + furnitureInfo.getFurnitureId() + "#" + getReactorPicture(furnitureInfo.getTemplateId()) + "#l\r\n";
                            if (selectionIndex !== -1) {
                                message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, furnitureInfo.getFurnitureId(), true);
                            }
                        }
                    }
                    cm.sendSimple(message);
                }
            }
        } else if (sel === neighborSelection) {
            if (sel2 === 0) {
                if (info.getSubInfo().getNeighborInfos().size() >= maxNeighborQuantity) {
                    cm.sendNext("#d最多只能有#r" + maxNeighborQuantity + "#d個鄰居!");
                    sel2 = -1;
                    status = 0;
                } else {
                    cm.sendGetText("請輸入要加入鄰居的角色名稱:");
                }
            } else if (sel2 === 1) {
                sendNeighborList(info, "請選擇要#r移除的鄰居:#k\r\n\r\n");
                if (info.getSubInfo().getNeighborInfos().size() === 0) {
                    sel2 = -1;
                    status = 0;
                }
            } else if (sel2 === 2) {
                if (info.getSubInfo().getNeighborInfos().size() === 0) {
                    cm.sendNext("目前沒有鄰居可以移除");
                    sel2 = -1;
                    status = 0;
                } else {
                    cm.sendYesNo("是否確認要#r移除#k所有鄰居(#r" + info.getSubInfo().getNeighborInfos().size() + "#k個)?");
                }
            }
        } else if (sel === messageBoardSelection) {
            if (sel2 === 0) {
                let messageBoardPageInfo = getMessageBoardPageList(info, "請選擇要管理的留言頁數");
                let totalMessageSize = messageBoardPageInfo[0];
                let message = messageBoardPageInfo[1];
                if (totalMessageSize <= 0) {
                    cm.sendNext("目前沒有留言");
                    sel2 = -1;
                    status = 0;
                } else {
                    cm.sendSimple(message);
                }
            } else if (sel2 === 1) {
                cm.sendYesNo("是否確認#r開啟顯示所有留言");
            } else if (sel2 === 2) {
                cm.sendYesNo("是否確認#r關閉顯示所有留言");
            } else if (sel2 === 3) {
                cm.sendYesNo("是否確認#r移除所有留言");
            }
        } else if (sel === enterMyHomeSelection) {
            if (cm.getPlayer().getParty() != null) {
                if (!cm.warpPartyToMyHome(sel2, true)) {
                    cm.sendNext("傳送時發生未知錯誤");
                }
            } else {
                if (!cm.warpToMyHome(sel2, false)) {
                    cm.sendNext("傳送時發生未知錯誤");
                }
            }
            cm.dispose();
        } else if (sel === blockUserSelection) {
            if (sel2 === 0) {
                if (info.getSubInfo().getBlockUserInfos().values().size() >= maxBlockUserQuantity) {
                    cm.sendNext("#d最多只能有#r" + maxBlockUserQuantity + "#d個訪問此小屋的角色!");
                    sel2 = -1;
                    status = 0;
                } else {
                    cm.sendGetText("請輸入要禁止訪問此小屋的角色名稱:");
                }
            } else if (sel2 === 1) {
                let message = "請選擇要移除的禁止訪問角色:\r\n\r\n";
                let blockUserInfoList = info.getSubInfo().getBlockUserInfos().values();
                let blockUserInfoListIterator = blockUserInfoList.iterator();
                message += "#d";
                while (blockUserInfoListIterator.hasNext()) {
                    let blockUserInfo = blockUserInfoListIterator.next();
                    message += "#L" + blockUserInfo.getCharacterId() + "#" + blockUserInfo.getCharacterName() + "\r\n";
                }
                if (blockUserInfoList.size() === 0) {
                    cm.sendNext("目前沒有任何禁止訪問角色");
                } else {
                    cm.sendNext(message);
                }
            } else if (sel2 === 2) {
                if (info.getSubInfo().getBlockUserInfos().size() === 0) {
                    cm.sendNext("目前沒有禁止訪問角色可以移除");
                    sel2 = -1;
                    status = 0;
                } else {
                    cm.sendYesNo("是否確認要#r移除#k所有禁止訪問角色(#r" + info.getSubInfo().getBlockUserInfos().size() + "#k個)?");
                }
            }
        } else if (sel === visitorCheckNeighborSelection) {
            let characterId = sel2;
            let homeList;
            if (account) {
                let accountId = cm.getAccountIdByCharacterId(characterId);
                if (accountId === -1) {
                    cm.sendNext("角色`" + cm.getCharacterNameById(characterId) + "`發生未知錯誤，找不到帳號編號");
                    sel2 = -1;
                    status = 0;
                    return;
                }
                homeList = cm.getMyHomeListByAccountId(accountId);
            } else {
                homeList = cm.getMyHomeListByCharacterId(characterId);
            }
            if (homeList.size() === 0) {
                cm.sendNext("角色`" + cm.getCharacterNameById(characterId) + "`目前沒有可進入的小屋");
                sel2 = -1;
                status = 0;
                return;
            }
            let next = false;
            let message = "請選擇要進入的小屋:\r\n";
            let homeListIterator = homeList.iterator();
            while (homeListIterator.hasNext()) {
                let iterator = homeListIterator.next();
                if (!iterator.isPrivateHome() && !iterator.getSubInfo().isBlockUser(cm.getPlayer().getId())) {
                    next = true;
                    message += "#L" + iterator.getId() + "#" + getFieldNickNameById(iterator.getFieldId()) + "" + (iterator.getPassword().length() > 0 ? "(需要密碼)" : "") + "\r\n";
                }
            }
            if (!next) {
                cm.sendNext("角色`" + cm.getCharacterNameById(characterId) + "`目前沒有可進入的小屋");
                sel2 = -1;
                status = 0;
                return;
            }
            cm.sendSimple(message);
        } else if (sel === visitorMessageBoardSelection) {
            if (sel2 === 0) {
                let messageBoardPageInfo = getMessageBoardPageList(info, "[" + info.getCharacterName() + "的小屋留言板] ");
                let totalMessageSize = messageBoardPageInfo[0];
                let message = messageBoardPageInfo[1];
                if (totalMessageSize <= 0) {
                    cm.sendNext("目前還沒有可查看的留言");
                    sel2 = -1;
                    status = 0;
                } else {
                    cm.sendSimple(message);
                }
            } else if (sel2 === 1) {
                cm.sendGetText("請輸入要留言的內容:\r\n");
            }
        }
    } else if (status === 3) {
        if (mode === 1 && sel3 === -1) {
            sel3 = selection;
        }
        let info = cm.getMyHome(cm.getPlayer().getMap().getMyHomeId());
        if (sel === welcomeMessageSelection) {
            if (sel2 === 0) {
                info.setWelcomeMessage(cm.getText());
                cm.sendNext("已設置新的歡迎訊息:\r\n\r\n#r" + (info.getWelcomeMessage().length() > 0 ? info.getWelcomeMessage() : "未設置"));
            } else if (sel2 === 1) {
                cm.sendNext("已經移除目前的歡迎訊息: #r" + info.getWelcomeMessage());
                info.setWelcomeMessage("");
            }
            sel3 = -1;
            sel2 = -1;
            status = 0;
        } else if (sel === passwordSelection) {
            if (sel2 === 0) {
                info.setPassword(cm.getText());
                cm.sendNext("已設置新的密碼:\r\n\r\n#r" + (info.getPassword().length() > 0 ? "有" : "未設置"));
            } else if (sel2 === 1) {
                cm.sendNext("已經移除目前的密碼");
                info.setPassword("");
            }
            sel3 = -1;
            sel2 = -1;
            status = 0;
        } else if (sel === furnitureSelection) {
            if (sel2 >= 0 && sel2 <= 9) {
                if (info.getTrunkSize() > 0 && info.getSubInfo().getFurnitureTrunkInfoList().size() >= info.getTrunkSize()) {
                    cm.sendNext("此小屋的倉庫已經放不下更多家具啦!");
                    sel3 = -1;
                    status = 1;
                    return;
                }
                let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                let message = "是否確認要購買家具:#l\r\n";
                message += getReactorPicture(fieldFurnitureInfoArray[sel3][0]) + "#l\r\n";
                message += getFurnitureReqMessage(fieldFurnitureInfoArray, sel3, false);
                message += getFurnitureStatMessage(fieldFurnitureInfoArray, sel3, sel3, false);
                if (hasFurniture(info, 0, fieldFurnitureInfoArray[sel3][0]) || hasFurnitureInTrunk(info, 0, fieldFurnitureInfoArray[sel3][0])) {
                    message += "#r已擁有#k#l";
                }
                cm.sendYesNo(message);
            } else if (sel2 === 1000 || sel2 === 1001) {
                let fieldArrayInfo = getFieldArrayInfo(info.getFieldId());

                let message = "[小屋家具]\r\n擴充#r" + (sel2 === 1000 ? "家具" : "倉庫") + "#b" + (sel2 === 1000 ? fieldArrayInfo[3] : fieldArrayInfo[5]) + "#k格\r\n";
                let reqMoney = fieldArrayInfo[6];
                let reqCash = fieldArrayInfo[7];
                let reqMaplePoint = fieldArrayInfo[8];
                let reqPachinko = fieldArrayInfo[9];
                let reqItems = fieldArrayInfo[10];
                if (cm.getPlayer().getMeso() < reqMoney) {
                    cm.sendNext(getMoneyName() + "不足，至少需要#r" + cm.numberWithCommas(reqMoney) + "#k");
                    sel2 = -1;
                    sel3 = -1;
                    status = 0;
                    return;
                } else if (cm.getCash(1) < reqCash) {
                    cm.sendNext(getCashName() + "不足，至少需要#r" + cm.numberWithCommas(reqCash) + "#k");
                    sel2 = -1;
                    sel3 = -1;
                    status = 0;
                    return;
                } else if (cm.getCash(2) < reqMaplePoint) {
                    cm.sendNext(getMaplePointName() + "不足，至少需要#r" + cm.numberWithCommas(reqMaplePoint) + "#k");
                    sel2 = -1;
                    sel3 = -1;
                    status = 0;
                    return;
                } else if (cm.getBeans() < reqPachinko) {
                    cm.sendNext(getPachinkoName() + "不足，至少需要#r" + cm.numberWithCommas(reqPachinko) + "#k");
                    sel2 = -1;
                    sel3 = -1;
                    status = 0;
                    return;
                }

                for (let i = 0; i < reqItems.length; i++) {
                    let itemId = reqItems[i][0];
                    let itemQuantity = reqItems[i][1];
                    if (!cm.haveItem(itemId, itemQuantity)) {
                        cm.sendNext("道具不足，身上缺少#v" + itemId + "##t" + itemId + "#x" + cm.numberWithCommas(itemQuantity) + "個#l\r\n");
                        sel2 = -1;
                        sel3 = -1;
                        status = 0;
                        return;
                    }
                }
                if (reqMoney > 0) {
                    cm.gainMeso(-reqMoney);
                }
                if (reqCash > 0) {
                    cm.gainCash(1, -reqCash);
                }
                if (reqMaplePoint > 0) {
                    cm.gainCash(2, -reqMaplePoint);
                }
                if (reqPachinko > 0) {
                    cm.getPlayer().gainBean(2, -reqPachinko);
                }
                for (let i = 0; i < reqItems.length; i++) {
                    cm.gainItem(reqItems[i][0], -reqItems[i][1]);
                }
                message += getReqMessageInternal(reqMoney, reqCash, reqMaplePoint, reqPachinko, reqItems, -1, false);
                message += "\r\n\r\n擴充#r" + (sel2 === 1000 ? "家具" : "倉庫") + "#b" + (sel2 === 1000 ? fieldArrayInfo[3] : fieldArrayInfo[5]) + "#k格完成\r\n\r\n";
                if (sel2 === 1000) {
                    info.setFurnitureSize(Math.min(info.getFurnitureSize() + fieldArrayInfo[3], fieldArrayInfo[2]));
                } else {
                    info.setTrunkSize(Math.min(info.getTrunkSize() + fieldArrayInfo[5], fieldArrayInfo[4]));
                }
                if (fieldArrayInfo != null) {
                    if (fieldArrayInfo[2] > 0) {
                        message += "#d目前擴充家具數量(#b" + info.getFurnitureSize() + "#d/#r" + fieldArrayInfo[2] + "#d)#l\r\n";
                    }
                    if (fieldArrayInfo[4] > 0) {
                        message += "#d目前擴充倉庫家具數量(#b" + info.getTrunkSize() + "#d/#r" + fieldArrayInfo[4] + "#d)#l\r\n";
                    }
                }
                cm.sendNext(message);
                sel3 = -1;
                sel2 = -1;
                status = 0;
            } else if (sel2 === 11) {
                if (info.getTrunkSize() > 0 && info.getSubInfo().getFurnitureTrunkInfoList().size() >= info.getTrunkSize()) {
                    cm.sendNext("倉庫已經放不下更多家具啦!");
                    sel3 = -1;
                    status = 1;
                    return;
                }
                let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                let furnitureInfo = info.getSubInfo().getFurniture(sel3);
                let selectionIndex = -1;

                for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                    if (fieldFurnitureInfoArray[i][0] === furnitureInfo.getTemplateId()) {
                        selectionIndex = i;
                        break;
                    }
                }

                let message = "是否確認要收回家具:#l\r\n";
                message += getReactorPicture(furnitureInfo.getTemplateId()) + "#l\r\n";
                if (selectionIndex !== -1) {
                    message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, sel3, false);
                }
                cm.sendYesNo(message);
            } else if (sel2 === 12) {
                let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                let furnitureInfo = info.getSubInfo().getFurniture(sel3);
                let selectionIndex = -1;

                for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                    if (fieldFurnitureInfoArray[i][0] === furnitureInfo.getTemplateId()) {
                        selectionIndex = i;
                        break;
                    }
                }

                let message = "要修改的家具#l\r\n";
                message += getReactorPicture(furnitureInfo.getTemplateId()) + "#l\r\n";
                if (selectionIndex !== -1) {
                    message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, sel3, false);
                }
                message += "#b\r\n\r\n#L0#換方向#l\t  #L1#移動到角色位置#l\r\n";
                message += "#L2##b往#r上#b移動#l\t#L3##b往#r下#b移動#l\t\r\n";
                message += "#L4##b往#r左#b移動#l\t#L5##b往#r右#b移動#l\t";
                cm.sendSimple(message);
            } else if (sel2 === 101) {

                if ((info.getSubInfo().getFurnitureInfoList().size() - 1) >= info.getFurnitureSize()) { // 1 = manage npc
                    cm.sendNext("小屋容量滿了，無法放置更多家具");
                    sel3 = -1;
                    status = 1;
                    return;
                }

                let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                let furnitureTrunkInfo = info.getSubInfo().getFurnitureTrunk(sel3);
                let selectionIndex = -1;

                for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                    if (fieldFurnitureInfoArray[i][0] === furnitureTrunkInfo.getTemplateId()) {
                        selectionIndex = i;
                        break;
                    }
                }

                let message = "是否確認要放置家具:#l\r\n";
                message += getReactorPicture(furnitureTrunkInfo.getTemplateId()) + "#l\r\n";
                if (selectionIndex !== -1) {
                    message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, sel3, false);
                }
                cm.sendYesNo(message);
            } else if (sel2 === 102) {

                let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                let furnitureInfo = info.getSubInfo().getFurnitureTrunk(sel3);
                let selectionIndex = -1;

                for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                    if (fieldFurnitureInfoArray[i][0] === furnitureInfo.getTemplateId()) {
                        selectionIndex = i;
                        break;
                    }
                }

                let message = "是否確認要#r#e移除#n#k家具:#l\r\n";
                message += getReactorPicture(furnitureInfo.getTemplateId()) + "#l\r\n";
                if (selectionIndex !== -1) {
                    message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, sel3, false);
                }
                cm.sendYesNo(message);
            }
        } else if (sel === neighborSelection) {
            if (sel2 === 0) {
                let characterName = cm.getText();
                let characterId = cm.getCharacterIdByName(characterName);
                if (characterId === -1) {
                    cm.sendNext("找不到角色`" + characterName + "`");
                    sel3 = -1;
                    status = 1;
                    return;
                }
                let homeList;
                if (account) {
                    let accountId = cm.getAccountIdByCharacterId(characterId);
                    if (accountId === -1) {
                        cm.sendNext("角色`" + cm.getCharacterNameById(characterId) + "`發生未知錯誤2，找不到帳號編號");
                        sel3 = -1;
                        status = 1;
                        return;
                    }
                    homeList = cm.getMyHomeListByAccountId(accountId);
                } else {
                    homeList = cm.getMyHomeListByCharacterId(characterId);
                }
                if (homeList.size() === 0) {
                    cm.sendNext("角色`" + characterName + "`目前沒有小屋，無法加入為鄰居");
                    sel3 = -1;
                    status = 1;
                    return;
                }
                if (cm.getPlayer().getId() === characterId) {
                    cm.sendNext("無法將自己設為鄰居!");
                } else if (info.getSubInfo().isNeighbor(characterId)) {
                    cm.sendNext("角色`" + characterName + "`已經是你的鄰居了!");
                } else {
                    info.getSubInfo().addNeighbor(characterId);
                    cm.sendNext("已成功將`" + characterName + "`加入為你的鄰居了");
                }
                sel3 = -1;
                sel2 = -1;
                status = 0;
            } else if (sel2 === 1) {
                if (info.getSubInfo().removeNeighbor(sel3)) {
                    cm.sendNext("已成功將`" + cm.getCharacterNameById(sel3) + "`從鄰居中移除了");
                    if (info.getSubInfo().getNeighborInfos().size() === 0) {
                        sel3 = -1;
                        sel2 = -1;
                        status = 0;
                    } else {
                        sel3 = -1;
                        status = 1;
                    }
                } else {
                    cm.sendNext("發生未知錯誤，移除鄰居[" + cm.getCharacterNameById(sel3) + "]失敗");
                    cm.dispose();
                }
            } else if (sel2 === 2) {
                cm.sendNext("已經#r移除#k了共" + info.getSubInfo().getNeighborInfos().size() + "個所有鄰居");
                info.getSubInfo().removeNeighbor(-1)
                sel2 = -1;
                sel3 = -1;
                status = 0;
            }
        } else if (sel === messageBoardSelection) {
            if (sel2 === 0) {
                if (!sendMessageBoardList(info, "請選擇要管理的留言\r\n", pagePerMessage * (sel3 - 1), sel3 * pagePerMessage, true)) {
                    sel3 = -1;
                    status = 1;
                }
            } else if (sel2 === 1 || sel2 === 2) {
                info.getSubInfo().editAllMessageShowStatus(sel2 === 1);
                cm.sendNext("#d已經完成#r" + (sel2 === 1 ? "開啟" : "關閉") + "#d顯示所有留言");
                sel3 = -1;
                sel2 = -1;
                status = 0;
            } else if (sel2 === 3) {
                info.getSubInfo().removeMessage(-1);
                cm.sendNext("#d已經完成#r移除#d所有留言");
                sel3 = -1;
                sel2 = -1;
                status = 0;
            }
        } else if (sel === blockUserSelection) {
            if (sel2 === 0) {
                let characterName = cm.getText();
                let characterId = cm.getCharacterIdByName(characterName);
                if (characterId === -1) {
                    cm.sendNext("找不到角色`" + characterName + "`");
                    sel3 = -1;
                    status = 1;
                    return;
                }

                if (cm.getPlayer().getId() === characterId) {
                    cm.sendNext("無法將自己設為禁止訪問角色名單!");
                } else if (info.getSubInfo().isBlockUser(characterId)) {
                    cm.sendNext("角色`" + characterName + "`已經在禁止訪問角色名單了!");
                } else {
                    info.getSubInfo().addBlockUser(characterId);
                    cm.sendNext("已成功將`" + characterName + "`加入為禁止訪問角色名單了");
                }
                sel3 = -1;
                sel2 = -1;
                status = 0;
            } else if (sel2 === 1) {
                if (info.getSubInfo().removeBlockUser(sel3)) {
                    cm.sendNext("已成功將`" + cm.getCharacterNameById(sel3) + "`從禁止訪問角色名單中移除了");
                    if (info.getSubInfo().getBlockUserInfos().size() === 0) {
                        sel3 = -1;
                        sel2 = -1;
                        status = 0;
                    } else {
                        sel3 = -1;
                        status = 1;
                    }
                } else {
                    cm.sendNext("發生未知錯誤，移除禁止訪問角色[" + cm.getCharacterNameById(sel3) + "]失敗");
                    cm.dispose();
                }
            } else if (sel2 === 2) {
                cm.sendNext("已經#r移除#k了共" + info.getSubInfo().getBlockUserInfos().size() + "個所有禁止訪問角色");
                info.getSubInfo().removeBlockUser(-1)
                sel2 = -1;
                sel3 = -1;
                status = 0;
            }
        } else if (sel === visitorCheckNeighborSelection) {
            let homeInfo = cm.getMyHome(sel3);
            if (homeInfo === null) {
                cm.sendNext("發生未知錯誤: " + sel3);
                cm.dispose();
            } else {

                if (homeInfo.getPassword().length() > 0 && (account ? (cm.getPlayer().getAccountId() !== homeInfo.getAccountId()) : (cm.getPlayer().getId() !== homeInfo.getCharacterId()))) {
                    cm.sendGetText("請輸入" + homeInfo.getCharacterName() + "的小屋 - " + getFieldNickNameById(homeInfo.getFieldId()) + "密碼");
                } else {
                    cm.sendYesNo("是否確認要進入" + homeInfo.getCharacterName() + "的小屋: " + getFieldNickNameById(homeInfo.getFieldId()));
                }
            }
        } else if (sel === visitorMessageBoardSelection) {
            if (sel2 === 0) {
                sendMessageBoardList(info, "[" + info.getCharacterName() + "的小屋留言板]\r\n\r\n", pagePerMessage * (sel3 - 1), sel3 * pagePerMessage, false)
                sel3 = -1;
                status = 1;
            } else if (sel2 === 1) {
                messageContent = cm.getText();
                cm.sendYesNo("是否確認要留言:\r\n\r\n" + messageContent);
            }
        }
    } else if (status === 4) {
        if (mode === 1 && sel4 === -1) {
            sel4 = selection;
        }
        let info = cm.getMyHome(cm.getPlayer().getMap().getMyHomeId());
        if (sel === furnitureSelection) {
            if (sel2 >= 0 && sel2 <= 9) {
                let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                let reqMoney = fieldFurnitureInfoArray[sel3][1];
                let reqCash = fieldFurnitureInfoArray[sel3][2];
                let reqMaplePoint = fieldFurnitureInfoArray[sel3][3];
                let reqPachinko = fieldFurnitureInfoArray[sel3][4];
                let reqItems = fieldFurnitureInfoArray[sel3][5];
                if (cm.getPlayer().getMeso() < reqMoney) {
                    cm.sendNext(getMoneyName() + "不足，至少需要#r" + cm.numberWithCommas(reqMoney) + "#k");
                    sel3 = -1;
                    sel4 = -1;
                    status = 1;
                    return;
                } else if (cm.getCash(1) < reqCash) {
                    cm.sendNext(getCashName() + "不足，至少需要#r" + cm.numberWithCommas(reqCash) + "#k");
                    sel3 = -1;
                    sel4 = -1;
                    status = 1;
                    return;
                } else if (cm.getCash(2) < reqMaplePoint) {
                    cm.sendNext(getMaplePointName() + "不足，至少需要#r" + cm.numberWithCommas(reqMaplePoint) + "#k");
                    sel3 = -1;
                    sel4 = -1;
                    status = 1;
                    return;
                } else if (cm.getBeans() < reqPachinko) {
                    cm.sendNext(getPachinkoName() + "不足，至少需要#r" + cm.numberWithCommas(reqPachinko) + "#k");
                    sel3 = -1;
                    sel4 = -1;
                    status = 1;
                    return;
                }

                for (let i = 0; i < reqItems.length; i++) {
                    let itemId = reqItems[i][0];
                    let itemQuantity = reqItems[i][1];
                    if (!cm.haveItem(itemId, itemQuantity)) {
                        cm.sendNext("道具不足，身上缺少#v" + itemId + "##t" + itemId + "#x" + cm.numberWithCommas(itemQuantity) + "個#l\r\n");
                        sel3 = -1;
                        sel4 = -1;
                        status = 1;
                        return;
                    }
                }
                if (reqMoney > 0) {
                    cm.gainMeso(-reqMoney);
                }
                if (reqCash > 0) {
                    cm.gainCash(1, -reqCash);
                }
                if (reqMaplePoint > 0) {
                    cm.gainCash(2, -reqMaplePoint);
                }
                if (reqPachinko > 0) {
                    cm.getPlayer().gainBean(2, -reqPachinko);
                }
                for (let i = 0; i < reqItems.length; i++) {
                    cm.gainItem(reqItems[i][0], -reqItems[i][1]);
                }
                let furnitureTrunkInfo = info.getSubInfo().addFurnitureTrunk(fieldFurnitureInfoArray[sel3][0], 0);
                newFurnitureTrunkInfoId = furnitureTrunkInfo.getFurnitureId();
                cm.sendYesNo("購買家具\r\n" + getReactorPicture(fieldFurnitureInfoArray[sel3][0]) + "\r\n完成，是否在目前位置立刻放置家具?");
            } else if (sel2 === 11) {
                let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                let furnitureInfo = info.getSubInfo().getFurniture(sel3);
                let selectionIndex = -1;

                for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                    if (fieldFurnitureInfoArray[i][0] === furnitureInfo.getTemplateId()) {
                        selectionIndex = i;
                        break;
                    }
                }

                let message = "收回家具:#l\r\n";
                message += getReactorPicture(furnitureInfo.getTemplateId()) + "#l\r\n";
                if (selectionIndex !== -1) {
                    message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, sel3, false);
                }
                message += "完成!";
                cm.sendNext(message);
                info.getSubInfo().addFurnitureTrunk(furnitureInfo.getTemplateId(), 0);
                info.removeFurniture(furnitureInfo.getFurnitureId());
                recalculateCustomStat(info);
                if (info.getSubInfo().getFurnitureInfoList().size() > 1) {
                    sel3 = -1;
                    sel4 = -1;
                    status = 1;
                } else {
                    sel2 = -1;
                    sel3 = -1;
                    sel4 = -1;
                    status = 0;
                }

            } else if (sel2 === 101) {
                let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                let furnitureTrunkInfo = info.getSubInfo().getFurnitureTrunk(sel3);
                let selectionIndex = -1;

                for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                    if (fieldFurnitureInfoArray[i][0] === furnitureTrunkInfo.getTemplateId()) {
                        selectionIndex = i;
                        break;
                    }
                }

                let message = "放置家具:#l\r\n";
                message += getReactorPicture(furnitureTrunkInfo.getTemplateId()) + "#l\r\n";
                if (selectionIndex !== -1) {
                    message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, sel3, false);
                }
                message += "完成!";
                cm.sendNext(message);
                info.getSubInfo().removeFurnitureTrunk(furnitureTrunkInfo.getFurnitureId());
                addFurniture(info, 0, furnitureTrunkInfo.getTemplateId());
                recalculateCustomStat(info);
                cm.dispose(); // dispose script since we need to check the new object in the map

            } else if (sel2 === 102) {

                let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                let furnitureInfo = info.getSubInfo().getFurnitureTrunk(sel3);
                let selectionIndex = -1;

                for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                    if (fieldFurnitureInfoArray[i][0] === furnitureInfo.getTemplateId()) {
                        selectionIndex = i;
                        break;
                    }
                }

                let message = "#r二次#k確認要#r#e移除#n#k家具:#l\r\n";
                message += getReactorPicture(furnitureInfo.getTemplateId()) + "#l\r\n";
                if (selectionIndex !== -1) {
                    message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, sel3, false);
                }
                message += "\r\n#r#e注意: 此動作無法反悔";
                cm.sendYesNo(message);
            }
        } else if (sel === messageBoardSelection) {
            if (sel2 === 0) {
                let messageBoardInfo = info.getSubInfo().getMessageInfoByMessageId(sel4);
                if (messageBoardInfo === null) {
                    cm.sendNext("找不到留言流水號`" + sel4 + "`");
                    cm.dispose();
                    return;
                }

                let message = getMessageManageBasicContent(messageBoardInfo);
                message += "#L0#修改顯示狀態#l\r\n";
                message += "#L1#回覆留言訊息#l\r\n";
                message += "#L2##r移除留言#k#l\r\n";
                message += "#L3##r#e移除該角色所有留言(共#b" + getCharacterMessageContentSize(info, messageBoardInfo.getCharacterId()) + "#r個)#l\r\n";
                cm.sendSimple(message);
            }
        } else if (sel === visitorCheckNeighborSelection) {
            let homeInfo = cm.getMyHome(sel3);
            if (homeInfo === null) {
                cm.sendNext("發生未知錯誤: " + sel3);
                cm.dispose();
            } else {
                if (homeInfo.getPassword().length() > 0 && (account ? (cm.getPlayer().getAccountId() !== homeInfo.getAccountId()) : (cm.getPlayer().getId() !== homeInfo.getCharacterId()))) {
                    if (homeInfo.isCorrectPassword(cm.getText())) {
                        cm.sendNext("密碼錯誤，請重試");
                        status = 2;
                    } else {
                        cm.warpToMyHome(homeInfo.getId(), (account ? (homeInfo.getAccountId() !== cm.getPlayer().getAccountId()) : (homeInfo.getCharacterId() !== cm.getPlayer().getId())));
                        cm.dispose();
                    }
                } else {
                    cm.warpToMyHome(homeInfo.getId(), (account ? (homeInfo.getAccountId() !== cm.getPlayer().getAccountId()) : (homeInfo.getCharacterId() !== cm.getPlayer().getId())));
                    cm.dispose();
                }
            }
        } else if (sel === visitorMessageBoardSelection) {
            info.getSubInfo().addMessage(cm.getPlayer().getId(), messageContent);
            cm.sendNext("已成功留言:\r\n\r\n" + messageContent + "\r\n\r\n小屋主人審核過後即會顯示!");
            sel = -1;
            sel2 = -1;
            sel3 = -1;
            sel4 = -1;
            status = -1;
        }
    } else if (status === 5) {
        if (mode === 1 && sel5 === -1) {
            sel5 = selection;
        }
        let info = cm.getMyHome(cm.getPlayer().getMap().getMyHomeId());
        if (sel === furnitureSelection) {
            if (sel2 >= 0 && sel2 <= 9) {
                if ((info.getSubInfo().getFurnitureInfoList().size() - 1) >= info.getFurnitureSize()) { // 1 = manage npc
                    cm.sendNext("小屋容量滿了，無法放置更多家具");
                    sel = -1;
                    sel2 = -1;
                    sel3 = -1;
                    sel4 = -1;
                    status = -1;
                    return;
                }
                let furnitureTrunkInfo = info.getSubInfo().getFurnitureTrunk(newFurnitureTrunkInfoId);
                if (furnitureTrunkInfo != null) {
                    addFurniture(info, 0, furnitureTrunkInfo.getTemplateId());
                    info.getSubInfo().removeFurnitureTrunk(newFurnitureTrunkInfoId);
                    cm.dispose();
                } else {
                    cm.sendNext("發生未知錯誤: `" + furnitureSelection + "`");
                    cm.dispose();
                }
            } else if (sel2 === 102) {
                let fieldFurnitureInfoArray = getFurnitureArrayByFieldId(info.getFieldId());
                let furnitureTrunkInfo = info.getSubInfo().getFurnitureTrunk(sel3);
                let selectionIndex = -1;

                for (let i = 0; i < fieldFurnitureInfoArray.length; i++) {
                    if (fieldFurnitureInfoArray[i][0] === furnitureTrunkInfo.getTemplateId()) {
                        selectionIndex = i;
                        break;
                    }
                }

                let message = "#r移除#k家具:#l\r\n";
                message += getReactorPicture(furnitureTrunkInfo.getTemplateId()) + "#l\r\n";
                if (selectionIndex !== -1) {
                    message += getFurnitureStatMessage(fieldFurnitureInfoArray, selectionIndex, sel3, false);
                }
                message += "完成!";
                cm.sendNext(message);
                info.getSubInfo().removeFurnitureTrunk(furnitureTrunkInfo.getFurnitureId());
                if (info.getSubInfo().getFurnitureTrunkInfoList().size() > 0) {
                    status = 1;
                    sel5 = -1;
                    sel4 = -1;
                    sel3 = -1;
                } else {
                    status = 0;
                    sel5 = -1;
                    sel4 = -1;
                    sel3 = -1;
                    sel2 = -1;
                }
            }
        } else if (sel === messageBoardSelection) {
            if (sel2 === 0) {
                let messageBoardInfo = info.getSubInfo().getMessageInfoByMessageId(sel4);
                if (messageBoardInfo === null) {
                    cm.sendNext("找不到留言流水號`" + sel4 + "`");
                    cm.dispose();
                    return;
                }
                if (sel5 === 0) {
                    info.getSubInfo().editMessage(messageBoardInfo.getMessageId(),
                        messageBoardInfo.getCharacterId(),
                        messageBoardInfo.getMessage(),
                        messageBoardInfo.getReplyMessage(),
                        messageBoardInfo.getTime(),
                        !messageBoardInfo.isShow());
                    cm.sendNext("修改留言顯示狀態完成!");
                    status = 3;
                    sel5 = -1;
                } else if (sel5 === 1) {
                    let message = getMessageManageBasicContent(messageBoardInfo);
                    message += "請輸入回覆留言內容:\r\n";
                    cm.sendGetText(message);
                } else if (sel5 === 2) {
                    let message = getMessageManageBasicContent(messageBoardInfo);
                    message += "是否確認#r移除#k留言";
                    cm.sendYesNo(message);
                } else if (sel5 === 3) {
                    let message = getMessageManageBasicContent(messageBoardInfo);
                    message += "是否確認移除該角色所有留言(共#b" + getCharacterMessageContentSize(info, messageBoardInfo.getCharacterId()) + "#r個)#l";
                    cm.sendYesNo(message);
                }
            }
        }
    } else if (status === 6) {
        if (sel === messageBoardSelection) {
            if (sel2 === 0) {
                let info = cm.getMyHome(cm.getPlayer().getMap().getMyHomeId());
                let messageBoardInfo = info.getSubInfo().getMessageInfoByMessageId(sel4);
                if (messageBoardInfo === null) {
                    cm.sendNext("找不到留言流水號`" + sel4 + "`");
                    cm.dispose();
                    return;
                }
                if (sel5 === 1) {
                    info.getSubInfo().editMessage(messageBoardInfo.getMessageId(),
                        messageBoardInfo.getCharacterId(),
                        messageBoardInfo.getMessage(),
                        cm.getText(),
                        messageBoardInfo.getTime(),
                        messageBoardInfo.isShow());
                    cm.sendNext("回覆留言完成\r\n\r\n#r" + messageBoardInfo.getReplyMessage());
                    status = 3;
                    sel5 = -1;
                } else if (sel5 === 2) {
                    let message = getMessageManageBasicContent(messageBoardInfo);
                    message += "移除留言完成";
                    cm.sendNext(message);
                    info.getSubInfo().removeMessage(messageBoardInfo.getMessageId());
                    status = 1;
                    sel5 = -1;
                    sel4 = -1;
                    sel3 = -1;
                } else if (sel5 === 3) {
                    let messageBoardInfoList = info.getSubInfo().getMessageInfoList();
                    let characterMessageContentSize = 0;
                    let messageBoardInfoListIterator = messageBoardInfoList.iterator();
                    while (messageBoardInfoListIterator.hasNext()) {
                        let localMessageBoardInfo = messageBoardInfoListIterator.next();
                        if (localMessageBoardInfo.getCharacterId() === messageBoardInfo.getCharacterId()) {
                            characterMessageContentSize++;
                        }
                    }
                    let message = getMessageManageBasicContent(messageBoardInfo);
                    message += "移除角色[" + messageBoardInfo.getCharacterName() + "]所有留言完成";
                    cm.sendNext(message);
                    info.getSubInfo().removeMessageByCharacterId(messageBoardInfo.getCharacterId());
                    status = 1;
                    sel5 = -1;
                    sel4 = -1;
                    sel3 = -1;
                }
            }
        }
    }
}

function getFieldNickNameById(fieldId) {
    for (let i = 0; i < fieldArray.length; i++) {
        let localFieldId = fieldArray[i][1];
        if (localFieldId === fieldId && fieldArray[i][0].length > 0) {
            return fieldArray[i][0];
        }
    }
    return "#m" + fieldId + "#";
}

function getFieldName(fieldNickName, fieldId) {
    if (fieldNickName.length === 0) {
        return cm.getMapName(fieldId);
    }
    return fieldNickName;
}

function getCharacterMessageContentSize(info, characterId) {
    let messageBoardInfoList = info.getSubInfo().getMessageInfoList();
    let characterMessageContentSize = 0;
    let messageBoardInfoListIterator = messageBoardInfoList.iterator();
    while (messageBoardInfoListIterator.hasNext()) {
        let localMessageBoardInfo = messageBoardInfoListIterator.next();
        if (localMessageBoardInfo.getCharacterId() === characterId) {
            characterMessageContentSize++;
        }
    }
    return characterMessageContentSize;
}

function getAvailableMessageInfoSize(info) {
    let availableMessageInfoSize = 0;
    let messageBoardInfoList = info.getSubInfo().getMessageInfoList();
    let messageBoardInfoListIterator = messageBoardInfoList.iterator();
    while (messageBoardInfoListIterator.hasNext()) {
        let localMessageBoardInfo = messageBoardInfoListIterator.next();
        if (localMessageBoardInfo.isShow()) {
            availableMessageInfoSize++;
        }
    }
    return availableMessageInfoSize;
}

function getMessageManageBasicContent(messageBoardInfo) {
    let message = "[留言管理]\r\n\r\n";
    if (showDebugText) {
        message += "流水: #d" + messageBoardInfo.getMessageId() + "#k\r\n";
    }
    message += "顯示: " + (messageBoardInfo.isShow() ? "#b是" : "#r否") + "#k\r\n";
    if (messageBoardDisplayDate) {
        message += "日期: #d" + messageBoardInfo.getReadableDate() + "#k\r\n";
    } else {
        message += "時間: #d" + messageBoardInfo.getReadableTime() + "#k\r\n";
    }
    message += "角色: #d" + messageBoardInfo.getCharacterName() + "#k\r\n";
    message += "訊息: #b" + messageBoardInfo.getMessage() + "#k\r\n";
    message += "回覆: #b" + (messageBoardInfo.getReplyMessage().length() > 0 ? messageBoardInfo.getReplyMessage() : "無") + "#k\r\n";
    message += "-------------------------------------\r\n";
    return message;
}

function generatePageLink(page, start, end) {
    return "#L" + page + "#第#d" + page + "#k頁 (#b" + start + "#k~#b" + end + ")#k#l\r\n";
}

function getMessageBoardPageList(info, message) {
    let totalMessageSize = info.getSubInfo().getMessageInfoList().size();
    message += "(#r" + totalMessageSize + "#k個留言):\r\n\r\n";
    let page = 1;
    let startMessage = 1;

    while (totalMessageSize > pagePerMessage) {
        message += generatePageLink(page, startMessage, pagePerMessage * page);
        totalMessageSize -= pagePerMessage;
        startMessage += pagePerMessage;
        page++;
    }

    if (totalMessageSize > 0) {
        message += generatePageLink(page, startMessage, startMessage + totalMessageSize - 1);
    }
    return [totalMessageSize, message];
}

function sendMessageBoardList(info, message, fromIndex, toIndex, owner) {
    let messageBoardInfoList = info.getSubInfo().getMessageInfoList(fromIndex, Math.min(toIndex, info.getSubInfo().getMessageInfoList().size()));
    let messageBoardInfoListIterator = messageBoardInfoList.iterator();
    message += "#d";
    let next = false;
    while (messageBoardInfoListIterator.hasNext()) {
        let messageBoardInfo = messageBoardInfoListIterator.next();
        if (owner) {
            message += "#L" + messageBoardInfo.getMessageId() + "#";
            if (owner && !messageBoardInfo.isShow()) {
                message += "(隱藏中)";
            }
        } else {
            if (!messageBoardInfo.isShow()) {
                continue;
            }
        }
        next = true;
        if (messageBoardDisplayDate) {
            message += messageBoardInfo.getReadableDate();
        } else {
            message += messageBoardInfo.getReadableTime();
        }
        message += " #b" + messageBoardInfo.getCharacterName() + "#k: #d" + messageBoardInfo.getMessage() + "\r\n";
        if (messageBoardInfo.getReplyMessage().length() > 0) {
            message += "主人回覆: #d" + messageBoardInfo.getReplyMessage() + "#k\r\n";
            message += "\r\n";
        }
    }
    if (!next) {
        cm.sendNext("目前還沒有可查看的留言");
    } else {
        if (owner) {
            cm.sendSimple(message);
        } else {
            cm.sendNext(message);
        }
    }
    return next;
}

function sendNeighborList(info, message) {
    let neighborInfoList = info.getSubInfo().getNeighborInfos().values();
    let neighborInfoListIterator = neighborInfoList.iterator();
    message += "#d";
    while (neighborInfoListIterator.hasNext()) {
        let neighborInfo = neighborInfoListIterator.next();
        if (account) {
            let accountId = cm.getAccountIdByCharacterId(neighborInfo.getCharacterId());
            if (accountId !== -1) {
                message += "#L" + neighborInfo.getCharacterId() + "#" + neighborInfo.getCharacterName() + "(" + cm.getMyHomeListByAccountId(accountId).size() + "個小屋)\r\n";
            }
        } else {
            message += "#L" + neighborInfo.getCharacterId() + "#" + neighborInfo.getCharacterName() + "(" + cm.getMyHomeListByCharacterId(neighborInfo.getCharacterId()).size() + "個小屋)\r\n";
        }
    }
    if (neighborInfoList.size() === 0) {
        cm.sendNext("目前還沒有鄰居");
    } else {
        cm.sendNext(message);
    }
}

function sendVisitorList(info, message) {
    let visitorList = info.getSubInfo().getVisitorDisplayInfos().values();
    let visitorListIterator = visitorList.iterator();
    while (visitorListIterator.hasNext()) {
        let visitorInfo = visitorListIterator.next();
        switch (visitorInfo.getActionType().getValue()) {
            case 1:
                message += "(#r給花#k) ";
                break;
            case 2:
                message += "(#b泥巴#k) ";
                break;
            default:
                message += "       ";
                break;
        }
        if (visitorDisplayDate) {
            message += "#d" + visitorInfo.getReadableVisitDate() + " #b" + visitorInfo.getCharacterName() + "#k";
        } else {
            message += "#d" + visitorInfo.getReadableVisitTime() + " #b" + visitorInfo.getCharacterName() + "#k";
        }
        message += "\r\n";
    }
    if (visitorList.size() === 0) {
        cm.sendNext("目前還沒有人來過");
    } else {
        cm.sendNext(message);
    }
}

function getReactorPicture(reactorId) {
    if (reactorId < 10) {
        return "#fReactor/000000" + reactorId + ".img/0/0#";
    } else if (reactorId < 100) {
        return "#fReactor/00000" + reactorId + ".img/0/0#";
    } else if (reactorId < 1000) {
        return "#fReactor/0000" + reactorId + ".img/0/0#";
    } else if (reactorId < 10000) {
        return "#fReactor/000" + reactorId + ".img/0/0#";
    } else if (reactorId < 100000) {
        return "#fReactor/00" + reactorId + ".img/0/0#";
    } else if (reactorId < 1000000) {
        return "#fReactor/0" + reactorId + ".img/0/0#";
    }
    return "#fReactor/" + reactorId + ".img/0/0#";
}

function getFurnitureReqMessage(furnitureInfoArray, i, showSelection) {
    let reqMoney = furnitureInfoArray[i][1];
    let reqCash = furnitureInfoArray[i][2];
    let reqMaplePoint = furnitureInfoArray[i][3];
    let reqPachinko = furnitureInfoArray[i][4];
    let reqItems = furnitureInfoArray[i][5];
    return getReqMessageInternal(reqMoney, reqCash, reqMaplePoint, reqPachinko, reqItems, i, showSelection);
}

function getReqMessageInternal(reqMoney, reqCash, reqMaplePoint, reqPachinko, reqItems, i, showSelection) {
    let message = "";
    if (reqMoney > 0 || reqCash > 0 || reqMaplePoint > 0 || reqPachinko > 0 || reqItems.length > 0) {
        if (showSelection) {
            message += "#L" + i + "#";
        }
        message += "需要#r#l\r\n";
    }
    if (reqMoney > 0) {
        if (showSelection) {
            message += "#L" + i + "#";
        }
        message += cm.numberWithCommas(reqMoney) + "#k" + getMoneyName() + "#l\r\n";
    }
    if (reqCash > 0) {
        if (showSelection) {
            message += "#L" + i + "#";
        }
        message += cm.numberWithCommas(reqCash) + "#k" + getCashName() + "#l\r\n";
    }
    if (reqMaplePoint > 0) {
        if (showSelection) {
            message += "#L" + i + "#";
        }
        message += cm.numberWithCommas(reqMaplePoint) + "#k" + getMaplePointName() + "#l\r\n";
    }
    if (reqPachinko > 0) {
        if (showSelection) {
            message += "#L" + i + "#";
        }
        message += cm.numberWithCommas(reqPachinko) + "#k" + getPachinkoName() + "#l\r\n";
    }
    if (reqItems.length > 0) {
        for (let i = 0; i < reqItems.length; i++) {
            let itemId = reqItems[i][0];
            let itemQuantity = reqItems[i][1];
            if (showSelection) {
                message += "#L" + i + "#";
            }
            message += "#v" + itemId + "##t" + itemId + "#x" + cm.numberWithCommas(itemQuantity) + "個#l\r\n";
        }
    }
    return message;
}

function getFurnitureStatMessage(furnitureInfoArray, arrayIndex, selection, showSelection) {
    let message = "";
    let maxDamage = furnitureInfoArray[arrayIndex][6];
    let summonDamageRate = furnitureInfoArray[arrayIndex][7];
    let bossDamageRate = furnitureInfoArray[arrayIndex][8];
    let damageRate = furnitureInfoArray[arrayIndex][9];
    let expRate = furnitureInfoArray[arrayIndex][10];
    let dropRate = furnitureInfoArray[arrayIndex][11];
    let moneyRate = furnitureInfoArray[arrayIndex][12];
    let statRate = furnitureInfoArray[arrayIndex][13];
    let strRate = furnitureInfoArray[arrayIndex][14];
    let dexRate = furnitureInfoArray[arrayIndex][15];
    let intRate = furnitureInfoArray[arrayIndex][16];
    let lukRate = furnitureInfoArray[arrayIndex][17];
    let stat = furnitureInfoArray[arrayIndex][18];
    let str = furnitureInfoArray[arrayIndex][19];
    let dex = furnitureInfoArray[arrayIndex][20];
    let int_ = furnitureInfoArray[arrayIndex][21];
    let luk = furnitureInfoArray[arrayIndex][22];
    let ignoreDiseaseChance = furnitureInfoArray[arrayIndex][23];
    let ignoreUserHitChance = furnitureInfoArray[arrayIndex][24];
    let hpPotionRate = furnitureInfoArray[arrayIndex][25];
    let mpPotionRate = furnitureInfoArray[arrayIndex][26];
    if (maxDamage > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(maxDamage) + "#k最大傷害#l\r\n";
    }
    if (summonDamageRate > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(summonDamageRate) + "#k%額外召喚獸傷害#l\r\n";
    }
    if (bossDamageRate > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(bossDamageRate) + "#k%額外BOSS傷害#l\r\n";
    }
    if (damageRate > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(damageRate) + "#k%額外傷害#l\r\n";
    }
    if (expRate > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(expRate) + "#k%額外經驗值#l\r\n";
    }
    if (dropRate > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(dropRate) + "#k%額外掉寶率#l\r\n";
    }
    if (moneyRate > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(moneyRate) + "#k%額外金幣獲得#l\r\n";
    }
    if (statRate > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(statRate) + "#k%額外所有屬性#l\r\n";
    }
    if (strRate > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(strRate) + "#k%額外力量#l\r\n";
    }
    if (dexRate > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(dexRate) + "#k%額外敏捷#l\r\n";
    }
    if (intRate > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(intRate) + "#k%額外智力#l\r\n";
    }
    if (lukRate > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(lukRate) + "#k%額外幸運#l\r\n";
    }
    if (stat > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(stat) + "#k額外所有屬性#l\r\n";
    }
    if (str > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(str) + "#k額外力量#l\r\n";
    }
    if (dex > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(dex) + "#k額外敏捷#l\r\n";
    }
    if (int_ > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(int_) + "#k額外智力#l\r\n";
    }
    if (luk > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(luk) + "#k額外幸運#l\r\n";
    }
    if (ignoreDiseaseChance > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(ignoreDiseaseChance) + "#k%忽略異常狀態機率#l\r\n";
    }
    if (ignoreUserHitChance > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(ignoreUserHitChance) + "#k%忽略怪物攻擊機率#l\r\n";
    }
    if (hpPotionRate > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(hpPotionRate) + "#k%額外使用HP藥水倍率#l\r\n";
    }
    if (mpPotionRate > 0) {
        if (showSelection) {
            message += "#L" + selection + "#";
        }
        message += "#b" + cm.numberWithCommas(mpPotionRate) + "#k%額外使用MP藥水倍率#l\r\n";
    }
    return message;
}

function getFieldArrayInfo(fieldId) {
    for (let i = 0; i < fieldArray.length; i++) {
        if (fieldArray[i][1] === fieldId) {
            return fieldArray[i];
        }
    }
    return null;
}

function getFurnitureInfoByFieldIdAndTemplateId(fieldId, templateId) {
    for (let i = 0; i < furnitureInfoArray.length; i++) {
        if (furnitureInfoArray[i][0] === fieldId) {
            let localFurnitureInfo = furnitureInfoArray[i][1];
            for (let x = 0; x < localFurnitureInfo.length; x++) {
                if (localFurnitureInfo[x][0] === templateId) {
                    return localFurnitureInfo[x];
                }
            }
        }
    }
    return null;
}

function getFurnitureArrayByFieldId(fieldId) {
    for (let i = 0; i < furnitureInfoArray.length; i++) {
        if (furnitureInfoArray[i][0] === fieldId) {
            return furnitureInfoArray[i][1];
        }
    }
    return null;
}

function addFurniture(info, type, templateId) {
    let pos = cm.getPlayer().getPosition();
    info.addFurniture(templateId, type, parseInt(pos.getX()), parseInt(pos.getY()), cm.getPlayer().isFacingLeft());
    recalculateCustomStat(info);
}

function quickEditFurnitureInfo(selection, info, furnitureId) {
    if (info != null) {
        let furnitureInfo = info.getSubInfo().getFurniture(furnitureId);
        if (furnitureInfo != null) {
            switch (selection) {
                case 0: // changeFurnitureDirection
                    info.editFurniture(furnitureId, furnitureInfo.getTemplateId(), 0, furnitureInfo.getX(), furnitureInfo.getY(), !furnitureInfo.isFacingLeft());
                    break;
                case 1: // changeFurnitureToPlayerPosition
                    let playerPosition = cm.getPlayer().getPosition();
                    info.editFurniture(furnitureId, furnitureInfo.getTemplateId(), 0, parseInt(playerPosition.getX()), parseInt(playerPosition.getY()), cm.getPlayer().isFacingLeft());
                    break;
                case 2: // moveFurniturePositionToHigher
                    info.editFurniture(furnitureId, furnitureInfo.getTemplateId(), 0, furnitureInfo.getX(), furnitureInfo.getY() - 10, furnitureInfo.isFacingLeft());
                    break;
                case 3: // moveFurniturePositionToLower
                    info.editFurniture(furnitureId, furnitureInfo.getTemplateId(), 0, furnitureInfo.getX(), furnitureInfo.getY() + 10, furnitureInfo.isFacingLeft());
                    break;
                case 4: // moveFurniturePositionToLeft
                    info.editFurniture(furnitureId, furnitureInfo.getTemplateId(), 0, furnitureInfo.getX() - 10, furnitureInfo.getY(), furnitureInfo.isFacingLeft());
                    break;
                case 5: // moveFurniturePositionToRight
                    info.editFurniture(furnitureId, furnitureInfo.getTemplateId(), 0, furnitureInfo.getX() + 10, furnitureInfo.getY(), furnitureInfo.isFacingLeft());
                    break;
            }
        }
    }
}

function hasFurniture(info, type, templateId) {
    let furnitureInfoList = info.getSubInfo().getFurnitureInfoList();
    let furnitureInfoListIterator = furnitureInfoList.iterator();
    while (furnitureInfoListIterator.hasNext()) {
        let furnitureInfo = furnitureInfoListIterator.next();
        if (furnitureInfo.getType().getValue() === type && furnitureInfo.getTemplateId() === templateId) {
            return true;
        }
    }
    return false;
}

function hasFurnitureInTrunk(info, type, templateId) {
    let furnitureTrunkInfoList = info.getSubInfo().getFurnitureTrunkInfoList();
    let furnitureTrunkInfoListIterator = furnitureTrunkInfoList.iterator();
    while (furnitureTrunkInfoListIterator.hasNext()) {
        let furnitureTrunkInfo = furnitureTrunkInfoListIterator.next();
        if (furnitureTrunkInfo.getType().getValue() === type && furnitureTrunkInfo.getTemplateId() === templateId) {
            return true;
        }
    }
    return false;
}


function recalculateCustomStat(info) {
    let templateIdArray = [];
    let maxDamage = 0;
    let summonDamageRate = 0;
    let bossDamageRate = 0;
    let damageRate = 0;
    let expRate = 0;
    let dropRate = 0;
    let moneyRate = 0;
    let statRate = 0;
    let strRate = 0;
    let dexRate = 0;
    let intRate = 0;
    let lukRate = 0;
    let stat = 0;
    let str = 0;
    let dex = 0;
    let int_ = 0;
    let luk = 0;
    let ignoreDiseaseChance = 0;
    let ignoreUserHitChance = 0;
    let hpPotionRate = 0;
    let mpPotionRate = 0;

    let furnitureInfoList = info.getSubInfo().getFurnitureInfoList();
    let furnitureInfoListIterator = furnitureInfoList.iterator();
    while (furnitureInfoListIterator.hasNext()) {
        let localFurnitureInfo = furnitureInfoListIterator.next();
        if (localFurnitureInfo.getType().getValue() === 0) { // reactor
            let furnitureCustomStatInfo = getFurnitureInfoByFieldIdAndTemplateId(info.getFieldId(), localFurnitureInfo.getTemplateId());
            if (furnitureCustomStatInfo != null) {
                if (sameFurnitureTemplateIdOnlyApplyOnce) {
                    if (inArray(templateIdArray, localFurnitureInfo.getTemplateId())) {
                        continue;
                    }
                    templateIdArray.push(localFurnitureInfo.getTemplateId());
                }
                maxDamage += furnitureCustomStatInfo[6];
                summonDamageRate += furnitureCustomStatInfo[7];
                bossDamageRate += furnitureCustomStatInfo[8];
                damageRate += furnitureCustomStatInfo[9];
                expRate += furnitureCustomStatInfo[10];
                dropRate += furnitureCustomStatInfo[11];
                moneyRate += furnitureCustomStatInfo[12];
                statRate += furnitureCustomStatInfo[13];
                strRate += furnitureCustomStatInfo[14];
                dexRate += furnitureCustomStatInfo[15];
                intRate += furnitureCustomStatInfo[16];
                lukRate += furnitureCustomStatInfo[17];
                stat += furnitureCustomStatInfo[18];
                str += furnitureCustomStatInfo[19];
                dex += furnitureCustomStatInfo[20];
                int_ += furnitureCustomStatInfo[21];
                luk += furnitureCustomStatInfo[22];
                ignoreDiseaseChance += furnitureCustomStatInfo[23];
                ignoreUserHitChance += furnitureCustomStatInfo[24];
                hpPotionRate += furnitureCustomStatInfo[25];
                mpPotionRate += furnitureCustomStatInfo[26];
            }
        }
    }

    let customStat = info.getSubInfo().getCustomStat();
    //
    customStat.setCustomMaxDamage(maxDamage);
    customStat.setCustomSummonDamageRate(summonDamageRate);
    customStat.setCustomBossDamageRate(bossDamageRate);
    customStat.setCustomDamageRate(damageRate);
    //
    customStat.setCustomExpRate(expRate);
    customStat.setCustomDropRate(dropRate);
    customStat.setCustomMoneyRate(moneyRate);
    //
    customStat.setCustomAllStatRate(statRate);
    customStat.setCustomStrRate(strRate);
    customStat.setCustomDexRate(dexRate);
    customStat.setCustomIntRate(intRate);
    customStat.setCustomLukRate(lukRate);
    //
    customStat.setCustomAllStat(stat);
    customStat.setCustomStr(str);
    customStat.setCustomDex(dex);
    customStat.setCustomInt(int_);
    customStat.setCustomLuk(luk);
    //
    customStat.setCustomIgnoreDiseaseChance(ignoreDiseaseChance);
    customStat.setCustomIgnoreMobHitChance(ignoreUserHitChance);
    customStat.setCustomHpPotionRate(hpPotionRate);
    customStat.setCustomMpPotionRate(mpPotionRate);
    //
    cm.getPlayer().getHomeCustomStat().recalculateStatAndUpdate(cm.getPlayer());
}

function getCustomStatMessage(info) {
    let stat = info.getSubInfo().getCustomStat();
    let msg = "";
    msg += "#d額外最大傷害: " + markValue(stat.getCustomMaxDamage()) + "#d\r\n";
    msg += "#d額外召喚獸傷害倍率: " + markValue(stat.getCustomSummonDamageRate()) + "#d%\r\n";
    msg += "#d額外Boss傷害倍率: " + markValue(stat.getCustomBossDamageRate()) + "#d%\r\n";
    msg += "#d額外傷害倍率: " + markValue(stat.getCustomDamageRate()) + "#d%\r\n";
    msg += "#d額外經驗倍率: " + markValue(stat.getCustomExpRate()) + "#d%\r\n";
    msg += "#d額外掉寶倍率: " + markValue(stat.getCustomDropRate()) + "#d%\r\n";
    msg += "#d額外金錢倍率: " + markValue(stat.getCustomMoneyRate()) + "#d%\r\n";
    msg += "#d額外全屬性倍率: " + markValue(stat.getCustomAllStatRate()) + "#d%\r\n";
    msg += "#d額外力量倍率: " + markValue(stat.getCustomStrRate()) + "#d%\r\n";
    msg += "#d額外敏捷倍率: " + markValue(stat.getCustomDexRate()) + "#d%\r\n";
    msg += "#d額外智力倍率: " + markValue(stat.getCustomIntRate()) + "#d%\r\n";
    msg += "#d額外幸運倍率: " + markValue(stat.getCustomLukRate()) + "#d%\r\n";
    msg += "#d額外全屬性: " + markValue(stat.getCustomAllStat()) + "\r\n";
    msg += "#d額外力量: " + markValue(stat.getCustomStr()) + "\r\n";
    msg += "#d額外敏捷: " + markValue(stat.getCustomDex()) + "\r\n";
    msg += "#d額外智力: " + markValue(stat.getCustomInt()) + "\r\n";
    msg += "#d額外幸運: " + markValue(stat.getCustomLuk()) + "\r\n";
    msg += "#d額外抵擋異常狀態機率: " + markValue(stat.getCustomIgnoreDiseaseChance()) + "#d%\r\n";
    msg += "#d額外無視怪物傷害機率: " + markValue(stat.getCustomIgnoreMobHitChance()) + "#d%\r\n";
    msg += "#d額外藥水回血: " + markValue(stat.getCustomHpPotionRate()) + "#d%\r\n";
    msg += "#d額外藥水回魔: " + markValue(stat.getCustomMpPotionRate()) + "#d%\r\n";
    return msg;
}

function markValue(val) {
    return (val > 0 ? "#b" + val + "#k" : val);
}

function getMoneyName() {
    return "楓幣";
}

function getCashName() {
    return "Gash";
}

function getMaplePointName() {
    return "楓葉點數";
}

function getPachinkoName() {
    return "小鋼珠";
}

function inArray(array, element) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === element) {
            return true;
        }
    }
    return false;
}