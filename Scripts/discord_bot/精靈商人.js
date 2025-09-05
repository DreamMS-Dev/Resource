// 2025/05/09 - 2025/05/20
// Discord腳本 - 綁定的帳號可以快速管理開啟中的精靈商人，如查看營業額、商店剩餘道具 / 關店 / 提示販賣資訊 / 時間到自動關閉時提示
// By Windy

let enable = false; // true = 開啟 , false = 關閉

let LOG_KEY_EXPIRATION_NOTICE = "ENTRUSTED_SHOP_CLOSED_DISCORD_NOTICE";
let LOG_KEY_PURCHASED_NOTICE = "ENTRUSTED_SHOP_PURCHASED_DISCORD_NOTICE";

function onMessageReceived(event, content) {
    if (!enable) {
        cm.dispose();
        return;
    }

    let accountId = cm.getBindingAccountId();
    if (accountId === -1) {
        cm.sendPrivateMessage("請先綁定帳號後再使用此功能。");
        cm.dispose();
        return;
    }

    let expirationNoticeStatus = cm.getAccountLog(accountId, LOG_KEY_EXPIRATION_NOTICE) === "1";
    let purchasedNoticeStatus = cm.getAccountLog(accountId, LOG_KEY_PURCHASED_NOTICE) === "1";

    cm.sendPrivateMessage(
        "請選擇操作：",
        cm.createPrimaryButton("Information", "查看商店資訊"),
        cm.createDangerButton("CloseShop", "關閉商店"),
        cm.createSuccessButton("ToggleExpirationNotice", "切換過期提示（目前已" + (expirationNoticeStatus ? "開啟" : "關閉") + "）"),
        cm.createPrimaryButton("TogglePurchasedNotice", "切換販售提示（目前已" + (purchasedNoticeStatus ? "開啟" : "關閉") + "）"),
        cm.createDangerButton("Dispose", "結束對話")
    );
}

function onButtonInteraction(event, buttonId, buttonText) {
    let accountId = cm.getBindingAccountId();
    if (accountId === -1) {
        event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
        cm.dispose();
        return;
    }
    if (buttonId.equals("Information")) {
        event.deferReply().queue();
        let shopList = cm.getAccountEntrustedShopList();
        if (!shopList.isEmpty()) {
            let message = "📦 商店資訊如下：\r\n\r\n";
            let totalItemCount = 0;
            let totalItemValue = 0;

            let iterator = shopList.iterator();
            while (iterator.hasNext()) {
                let shop = iterator.next();
                if (shop != null) {
                    message += "👤 店主：" + shop.getOwnerName() + "\r\n";
                    message += "🏪 商店名稱：" + shop.getTitle() + "\r\n";
                    message += "📍 位置：頻道 " + shop.getChannel() + " - " + shop.getMap().getMapName() + "\r\n";
                    message += "⏰ 結束時間：" + cm.getReadableTime(shop.getExpiration()) + "\r\n";
                    message += "💰 營業額：" + cm.numberWithCommas(fetchEntrustedShopMoney(shop.getOwnerId())) + " 楓幣\r\n";

                    let itemList = shop.getItems();
                    if (!itemList.isEmpty()) {
                        message += "📦 剩餘販售道具：\r\n";
                        let itemListIterator = itemList.iterator();
                        while (itemListIterator.hasNext()) {
                            let shopItemInfo = itemListIterator.next();
                            let itemInfo = shopItemInfo.getItem();
                            let itemId = shopItemInfo.getItemId();
                            let itemTotalUpgradeCount = itemId < 2000000 ? itemInfo.getLevel() : 0;
                            let itemName = cm.getItemName(itemId);
                            let price = shopItemInfo.getPrice();
                            let bundle = shopItemInfo.getBundles();
                            if (bundle > 0) {
                                totalItemCount += bundle;
                                totalItemValue += price * bundle;
                                message += "‣ " + itemName + (itemTotalUpgradeCount > 0 ? " (+" + itemTotalUpgradeCount + ")" : "") + " x" + bundle + "（單價：" + cm.numberWithCommas(price) + "）\r\n";
                            }
                        }
                    } else {
                        message += "📭 此商店目前無剩餘道具可販售。\r\n";
                    }

                    message += "────────────────────────\r\n\r\n";
                }
            }

            message += "📊 統計資訊：\r\n";
            message += "🧾 總剩餘道具數量：" + cm.numberWithCommas(totalItemCount) + " 件\r\n";
            message += "💵 預估總價值：" + cm.numberWithCommas(totalItemValue) + " 楓幣\r\n";
            message += "對話已結束。";

            event.getHook().sendMessage(message).queue();
        } else {
            event.getHook().sendMessage("❌ 此帳號目前沒有開啟中的精靈商人，對話已結束。").queue();
        }
        cm.dispose();
    } else if (buttonId.equals("CloseShop")) {
        event.deferReply().queue();
        let shopList = cm.getAccountEntrustedShopList();
        if (shopList.isEmpty()) {
            event.getHook().sendMessage("❌ 此帳號目前沒有開啟中的精靈商人，對話已結束。").queue();
            return;
        }
        event.getHook().sendMessage("搜尋商店中，請稍後...").queue();
        let message = "請選擇要關閉精靈商人的角色，選擇後將立刻關閉:";
        let menuMessage = "按錯了，我不要關::Cancel###";
        let iterator = shopList.iterator();
        while (iterator.hasNext()) {
            let shop = iterator.next();
            if (shop != null) {
                let count = 0;
                let itemList = shop.getItems();
                if (!itemList.isEmpty()) {
                    let itemListIterator = itemList.iterator();
                    while (itemListIterator.hasNext()) {
                        let shopItemInfo = itemListIterator.next();
                        if (shopItemInfo.getBundles() > 0) {
                            count++;
                        }
                    }
                }
                menuMessage += "店主<" + shop.getOwnerName() + "> 剩餘販賣品項:" + count + "個 營業額：" + cm.numberWithCommas(fetchEntrustedShopMoney(shop.getOwnerId())) + "::" + shop.getOwnerId() + "###";
            }
        }
        cm.sendPrivateMessage(message, cm.createStringSelectMenu("CloseShopMenu", menuMessage, null));
    } else if (buttonId.equals("ToggleExpirationNotice")) {
        event.reply("正在切換過期提示狀態...").queue();
        toggleAccountLog(accountId, LOG_KEY_EXPIRATION_NOTICE);
        onMessageReceived("");
    } else if (buttonId.equals("TogglePurchasedNotice")) {
        event.reply("正在切換販售提示狀態...").queue();
        toggleAccountLog(accountId, LOG_KEY_PURCHASED_NOTICE);
        onMessageReceived("");
    } else {
        event.reply("對話已結束。").queue();
        cm.dispose();
    }
}

function onStringSelectInteraction(event, menuId, selectedId) {
    let accountId = cm.getBindingAccountId();
    if (accountId === -1) {
        event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
        cm.dispose();
        return;
    }
    if (menuId.equals("CloseShopMenu")) {
        if (selectedId === "Cancel") {
            event.reply("對話已結束。").queue();
            cm.dispose();
            return;
        }
        let characterId = parseInt(selectedId);
        let characterIdList = cm.getCharacterIdsInAccount(accountId, -1);
        if (characterIdList == null || !characterIdList.contains(characterId)) {
            event.reply("發生未知錯誤，對話已結束。").queue();
            cm.dispose();
            return;
        }
        let entrustedShop = cm.getEntrustedShop(characterId);
        if (entrustedShop == null) {
            event.reply("找不到指定的精靈商人商店，對話已結束。").queue();
            cm.dispose();
            return;
        }
        if (cm.closeEntrustedShop(entrustedShop)) {
            event.reply("關閉" + cm.getCharacterNameById(characterId) + "的精靈商人完成，對話已結束。").queue();
        } else {
            event.reply("發生未知錯誤關閉失敗，對話已結束。").queue();
        }
        cm.dispose();
    } else {
        event.reply("對話已結束。").queue();
        cm.dispose();
    }
}

function onModalInteraction(event, modalId) {
    event.reply("對話已結束。").queue();
    cm.dispose();
}

function toggleAccountLog(accountId, logKey) {
    cm.setAccountLog(accountId, logKey, cm.getAccountLog(accountId, logKey) === "1" ? "0" : "1", null, null, -1);
}

function fetchEntrustedShopMoney(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getMerchantMeso();
    }
    let money = 0;
    let listResult = cm.selectSQL("SELECT `MerchantMesos` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        money = parseInt(mapResult.get("MerchantMesos"));
    }
    return money;
}