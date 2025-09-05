/**
 * 世界導航腳本
 * 此腳本用法為從其他腳本使用函數
 * cm.dispose();
 * cm.openOrUpdateWorldGuideWindow();
 * 且將本腳本放於Special目錄下
 * 而非直接開啟本腳本使用
 * 2024.12.25
 * By WindyBoy
 */
let targetFieldId = -1;

let fieldInfoList = {
    // 範例
    // "WZ值填入內容": {id: 地圖代碼, active: 是否開放(true / false), applyBlockFieldList: 是否套用通用禁用地圖列表(true / false), reqMoney: 需要的錢(不要=0), reqItemId: 需要的道具代碼(不要=0或是道具數量填0), reqItemQuantity: 需要的道具數量(不要=0), minimumLevel: 最低等級限制, maximumLevel: 最高等級限制, independentBlockFieldList: [獨立禁用地圖代碼, 獨立禁用地圖代碼2, 獨立禁用地圖代碼3, 獨立禁用地圖代碼4]},
    "巴洛古": {id: 105100100, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "殘暴炎魔": {id: 211042300, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "闇黑龍王": {id: 240050400, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "希拉": {id: 262030000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "比艾樂": {id: 105200000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "斑斑": {id: 105200000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "血腥皇后": {id: 105200000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "貝倫": {id: 105200000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "凡雷恩": {id: 211070000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "阿卡伊農": {id: 272020110, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "梅格耐斯": {id: 401060399, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "皮卡啾": {id: 270050000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "西格諾斯": {id: 271040000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "史烏": {id: 350060000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "戴米安": {id: 105300303, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "培羅德": {id: 863010000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "Ranmaru": {id: 807300100, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "Princess Nou": {id: 811000999, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "露希妲": {id: 450003600, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "卡翁": {id: 221030900, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "拉圖斯": {id: 220080000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "威爾": {id: 450007240, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "真希拉": {id: 450011990, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "黑魔法師": {id: 450012500, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "戴斯克": {id: 450009301, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "頓凱爾": {id: 450012200, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "受選的賽蓮": {id: 410002000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "守護天使綠水靈": {id: 160000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "監視者卡洛斯": {id: 410005005, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "咖凌": {id: 410007025, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "終極怪物公園": {id: 951000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "維多利亞港": {id: 104000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "勇士之村": {id: 102000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "墮落城市": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "弓箭手村": {id: 100000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "魔法森林": {id: 105000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "奇幻村": {id: 105040300, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "鯨魚號": {id: 120000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "瑞恩村": {id: 140000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "101大道": {id: 742000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "天空之城": {id: 200000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "玩具城": {id: 220000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "冰原雪域": {id: 211000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "水之都": {id: 230000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "神木村": {id: 240000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "納希綠洲城": {id: 260000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "瑪迦提亞城": {id: 261000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "靈藥幻境": {id: 251000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "時間神殿": {id: 270000100, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "上海灘": {id: 701000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "昭和村": {id: 801000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "楓葉古城": {id: 800040000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "都會潮流區": {id: 550000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "駁船碼頭城": {id: 541000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "中心商務區": {id: 540000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "瑪亞家": {id: 100000001, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "遊戲中心": {id: 100000203, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "結婚小鎮": {id: 680000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "轉蛋屋": {id: 749050400, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "被破壞的弓箭手村": {id: 271010000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "黃昏的勇士之村": {id: 273000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "尖耳狐狸村": {id: 410000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "萬神殿": {id: 400000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "暴君之城": {id: 401050000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "野蠻之星": {id: 940203215, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "亞修羅姆": {id: 402000500, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "克拉班避難處": {id: 402000600, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "商店街": {id: 410000200, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "里斯托尼亞": {id: 993215099, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "圖倫城市": {id: 993164001, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "燃燒的賽爾尼溫": {id: 993215029, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "納林": {id: 993165502, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "無盡之塔": {id: 410005001, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "埃里莫斯": {id: 410007505, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "聯盟前哨基地": {id: 100000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "月之橋": {id: 993165752, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "苦痛迷宮": {id: 450011102, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "利曼": {id: 993070074, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "反轉城市": {id: 993176000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "嚼嚼艾爾蘭": {id: 993176802, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "賽拉斯": {id: 100000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "時空裂縫": {id: 221024500, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "女神痕跡": {id: 200080101, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "超綠": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "金勾": {id: 251010404, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "毒霧": {id: 300030100, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "龍騎": {id: 240080000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "湯寶寶": {id: 912080000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "怪公": {id: 951000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "貿易": {id: 865000001, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "台版祭壇": {id: 301000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "國際祭壇": {id: 930100000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "黑市": {id: 402000200, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "納林": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "亞修羅姆": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "萬神殿": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "尖耳狐狸村": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "圖倫城市": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "青雲谷": {id: 993160103, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "里斯托尼亞": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "反轉城市": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "消逝的旅途": {id: 450001003, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "啾啾村": {id: 450002000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "拉契爾恩": {id: 450003000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "阿爾卡娜": {id: 940204000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "魔菈斯": {id: 940204003, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "艾斯佩拉": {id: 450007500, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "賽爾尼溫": {id: 410000500, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "阿爾克斯": {id: 410005000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "奧迪溫": {id: 993217032, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "桃源境": {id: 993215813, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "阿爾特利亞": {id: 410007530, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "卡爾西溫": {id: 410007602, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "消逝的旅途": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "啾啾艾爾蘭": {id: 450002202, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "拉契爾恩": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "阿爾卡納": {id: 450005000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "魔菈斯": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "艾斯佩拉": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "賽爾尼溫": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "阿爾克斯": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "奧迪溫": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "桃源境": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "阿爾特利亞": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "卡爾西溫": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "肥肥海岸": {id: 104010001, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "藍菇菇樹林": {id: 100030001, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "黑肥肥領土": {id: 101040001, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "結冰的平原": {id: 211030000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "雲彩公園": {id: 200010000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "烏鴉樹林": {id: 800020000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "亡者之林": {id: 211041100, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "藍光庭園": {id: 200010130, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "天空露臺": {id: 220010600, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "時間漩渦": {id: 220050100, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "克嵐草原": {id: 221040000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "扭曲時間": {id: 220060000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "彎曲時間": {id: 220060201, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "西海岔道": {id: 230010400, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "海藻塔": {id: 230020100, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "烏山入口": {id: 222010000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "鋼之黑肥肥": {id: 101040003, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "深海峽谷": {id: 230040000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "西門町街道": {id: 740010000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "消失的村落": {id: 800020120, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "大佛的邂逅": {id: 800020130, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "半人馬領土": {id: 240020000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "神木村東邊": {id: 240011000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "隱密龍之墓": {id: 240030103, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "遺留龍巢穴": {id: 240040511, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "荒廢藥草田": {id: 251010000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "人蔘谷": {id: 251010300, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "灼熱沙漠": {id: 260010400, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "北部沙漠路": {id: 260020100, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "古城城門內": {id: 800040100, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "紅寶王": {id: 104000400, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "蘑菇王": {id: 100000005, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "樹妖王": {id: 101030404, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "藍色蘑菇王": {id: 101030404, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "沼澤巨鱷": {id: 107000300, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "巨居蟹": {id: 101030404, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "殭屍猴王": {id: 101030404, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "艾利傑": {id: 101030404, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "火蚌殼": {id: 230020100, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "殭屍蘑菇王": {id: 105070002, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    // "巴洛古": {id: 103000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "咕咕鐘": {id: 220050000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "仙人長老": {id: 220050100, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "仙人玩偶": {id: 250020300, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "肯德熊": {id: 250010304, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "喵怪仙人": {id: 250010504, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "海怒斯": {id: 230040420, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "天狗": {id: 800020130, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "噴火龍": {id: 240020401, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "格瑞芬多": {id: 240020101, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "鎧甲武士": {id: 800040208, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "黑道大姐頭": {id: 801040003, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "寒霜冰龍": {id: 240040401, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "多多": {id: 270010500, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "利里諾斯": {id: 270020500, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "萊伊卡": {id: 270030500, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "狩獵黃金豬": {id: 910000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]},
    "系統活動": {id: 910000000, active: true, applyBlockFieldList: true, reqMoney: 0, reqItemId: 4000000, reqItemQuantity: 0, minimumLevel: 0, maximumLevel: 9999, independentBlockFieldList: [0, 1, 2, 3]}
};

let blockFieldList = [
    // 額外禁用地圖代碼區
    10, 11, 12, 13
];

function start() {
    let player = cm.getPlayer();
    let info = cm.getInfo();
    if (info == null) {
        showErrorMessage(player, "發生未知錯誤");
        return;
    }
    if (player.getEventInstance() != null || player.getPartyQuest() != null || player.isTestingDPS() || player.getTrade() != null || player.getMonsterCarnival() != null || player.getPlayerShop() != null || player.getMiniGame() != null || !player.isAlive()) {
        showErrorMessage(player, "目前無法使用");
        return;
    }
    let fieldInfo = fieldInfoList[info];
    if (fieldInfo == null) {
        showErrorMessage(player, "未填入地圖資訊: " + info);
        return;
    } else if (!fieldInfo.active) {
        showErrorMessage(player, "目前未開放");
        return;
    } else if (fieldInfo.applyBlockFieldList && inArray(blockFieldList, player.getMapId())) {
        showErrorMessage(player, "此地圖無法使用");
        return;
    } else if (fieldInfo.independentBlockFieldList.length > 0 && inArray(fieldInfo.independentBlockFieldList, player.getMapId())) {
        showErrorMessage(player, "此地圖無法使用");
        return;
    } else if (player.getLevel() < fieldInfo.minimumLevel) {
        showErrorMessage(player, "至少需要" + fieldInfo.minimumLevel + "等才可以進入");
        return;
    } else if (player.getLevel() > fieldInfo.maximumLevel) {
        showErrorMessage(player, "只有" + fieldInfo.maximumLevel + "等之前才可以進入");
        return;
    }

    if (fieldInfo.reqMoney > 0) {
        if (player.getMeso() < fieldInfo.reqMoney) {
            showErrorMessage(player, "金錢不足，需要" + cm.numberWithCommas(fieldInfo.reqMoney) + "才能使用");
            return;
        }
    }
    if (fieldInfo.reqItemId > 0 && fieldInfo.reqItemQuantity > 0) {
        if (!player.haveItem(fieldInfo.reqItemId, fieldInfo.reqItemQuantity)) {
            showErrorMessage(player, "道具不足，需要" + fieldInfo.reqItemQuantity + "個" + cm.getItemName(fieldInfo.reqMoney) + "才能使用");
            return;
        }
    }
    if (fieldInfo.reqMoney > 0) {
        cm.gainMeso(-fieldInfo.reqMoney);
    }
    if (fieldInfo.reqItemId > 0 && fieldInfo.reqItemQuantity > 0) {
        cm.gainItem(fieldInfo.reqItemId, -fieldInfo.reqItemQuantity)
    }

    targetFieldId = fieldInfo.id;

    action(1, 0, 0);
}

function action(mode, type, selection) {
    cm.dispose();
    cm.warp(targetFieldId, 0);
}

function showErrorMessage(player, message) {
    player.dropMessage(1, message);
    cm.dispose();
}

function inArray(array, element) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === element) {
            return true;
        }
    }
    return false;
}