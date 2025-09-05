// 2025/04/29 - 2025/05/20
// Discord腳本 - 查詢線上角色所在位置
// By Windy

let enable = false; // true = 開放 , false = 關閉

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
    let character = cm.getOnlineCharacter();

    if (character != null) {
        let map = character.getMap();
        if (map != null) {
            let channel = map.getChannel();
            let streetName = map.getStreetName();
            let mapName = map.getMapName();
            let message = "📍 角色 <" + character.getName() + "> 目前在線上\n";
            message += "🌍 位置: 頻道[" + channel + "] " + streetName + " - " + mapName + "\n";
            message += "✅ 本次對話已結束";
            cm.sendPrivateMessage(message);
        } else {
            cm.sendPrivateMessage("⚠️ 角色在線，但找不到所在地圖\n❌ 本次對話已結束");
        }
        cm.dispose();
    } else {
        cm.sendPrivateMessage(
            "🔴 目前沒有任何角色在線上",
            cm.createPrimaryButton("Search-Again", "再次搜尋"),
            cm.createDangerButton("Dispose", "結束對話")
        );
    }

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