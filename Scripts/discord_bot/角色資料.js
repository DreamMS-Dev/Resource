// 2025/05/05 - 2025/05/20
// Discord腳本 - 綁定後可以查詢帳號下所有角色資訊，如等級 轉生次數 職業 表功 是否在線上 線上的位置資訊等
// By Windy

let enable = false; // true = 開放 , false = 關閉
let showOfflineInfo = true; // 是否顯示離線角色的資料庫資訊，資料庫負擔較大 true = 顯示 , false = 不顯示

function onMessageReceived(event, content) {
    if (!enable) {
        cm.dispose();
        return;
    }
    let accountId = cm.getBindingAccountId();
    if (accountId === -1) {
        cm.sendPrivateMessage("未綁定帳號無法查詢");
        cm.dispose();
        return;
    }
    let characterIdList = cm.getCharacterIdsInAccount(accountId, -1);
    if (characterIdList == null) {
        cm.sendPrivateMessage("帳號內沒有任何角色!");
        cm.dispose();
        return;
    }

    let onlineCharacter = cm.getOnlineCharacter();
    let message = "🧾 帳號內共有 " + characterIdList.size() + " 個角色\n";

    let iterator = characterIdList.iterator();
    while (iterator.hasNext()) {
        let characterId = iterator.next();
        let characterOnline = onlineCharacter != null && onlineCharacter.getId() === characterId;
        let characterOfflineInfo = !characterOnline && showOfflineInfo ? fetchCharacterOfflineInfoById(characterId) : null;
        let characterName = cm.getCharacterNameById(characterId);
        let characterLevel = cm.getCharacterLevelById(characterId);
        let characterReborn = cm.getCharacterRebornById(characterId);
        let characterMoney = characterOnline ? onlineCharacter.getMeso() : showOfflineInfo ? characterOfflineInfo.money : -1;
        let characterStatDamage = characterOnline ? onlineCharacter.getStatDamageValue() : showOfflineInfo ? characterOfflineInfo.statDamageValue : -1;
        let characterJobId = cm.getCharacterJobById(characterId);
        let characterGender = cm.getCharacterGenderById(characterId);

        let jobName = getJobName(characterJobId)
        let genderString = characterGender === 0 ? "男" : characterGender === 1 ? "女" : "異常(" + characterGender + ")";

        message += "\n🧍 角色: " + characterName + "　🚻 性別: " + genderString + "　👔 職業: " + jobName + "　\n";
        message += "📈 等級: " + cm.numberWithCommas(characterLevel) + (characterReborn > 0 ? "　🔁 轉生: " + cm.numberWithCommas(characterReborn) : "") + "\n";
        message += "💰 楓幣: " + (characterMoney === -1 ? "無法取得" : cm.numberWithCommas(characterMoney)) + "\n";
        message += "🗡️ 表功: " + (characterStatDamage === -1 ? "無法取得" : cm.numberWithCommas(characterStatDamage)) + "\n";
        message += "📡 狀態: " + (characterOnline ? "🟢 線上" : "🔴 離線");

        if (characterOnline) {
            let map = onlineCharacter.getMap();
            if (map != null) {
                let channel = map.getChannel();
                let streetName = map.getStreetName();
                let mapName = map.getMapName();
                message += "\n🌍 位置: 頻道[" + channel + "] " + streetName + " - " + mapName;
            }
        }

        message += "\n━━━━━━━━━━━━━━━━━━";
    }

    cm.sendPrivateMessage(
        message,
        cm.createPrimaryButton("Search-Again", "再次查看"),
        cm.createDangerButton("Dispose", "結束對話")
    );

}

function onButtonInteraction(event, buttonId, buttonText) {
    if (buttonId.equals("Search-Again")) {
        event.reply("搜尋中...").queue();
        onMessageReceived("");
    } else {
        event.reply("本次對話已結束").queue();
        cm.dispose();
    }
}

function onStringSelectInteraction(event, menuId, selectedId) {
    event.reply("本次對話已結束").queue();
    cm.dispose();
}

function onModalInteraction(event, modalId) {
    event.reply("本次對話已結束").queue();
    cm.dispose();
}

function fetchCharacterOfflineInfoById(characterId) {
    let result = {
        money: 0,
        statDamageValue: 0
    };
    let listResult = cm.selectSQL("SELECT `meso`, `stat_damage_value` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result.money = parseInt(mapResult.get("meso"));
        result.statDamageValue = parseInt(mapResult.get("stat_damage_value"));
    }
    return result;
}

function getJobName(jobId) {
    switch (jobId) {
        case 330:
        case 331:
        case 332:
            return "開拓者";
    }
    return cm.getJobName(jobId);
}