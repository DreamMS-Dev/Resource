// 2025/06/11
// Discord腳本 - 管理功能-序號區
// By Windy

let enable = true; // true = 開放 , false = 關閉
let messageEvent = null;

let newCouponInfo = {
    createCount: 1,
    expiration: -1,

    money: 0,
    gash: 0,
    maplePoint: 0,
    pachinko: 0,
    pay: 0,

    limitAvailableAccountId: false,
    availableAccountId: -1,

    limitRemainQuantity: true,
    remainingQuantity: 1,
    items: []
};

function onMessageReceived(event, content, replyEvent = null) {
    if (!enable) {
        cm.dispose();
        return;
    }
    if (cm.getPermissionLevel() < 1) {
        cm.dispose();
        return;
    }
    messageEvent = event;

    if (replyEvent != null) {
        replyEvent.reply("")
            .addActionRow(
                cm.createSuccessButton("Query-Coupon", "🔍 查商城序號資訊"),
                cm.createPrimaryButton("Query-Coupon-By-Character", "🧍 查角色用過的序號"),
                cm.createSuccessButton("Query-Coupon-By-Account", "👤 查帳號用過的序號"),
                cm.createPrimaryButton("Save-Coupon", "💾 儲存商城序號")
            ).queue();
    } else {
        cm.sendPrivateMessage("",
            cm.createSuccessButton("Query-Coupon", "🔍 查商城序號資訊"),
            cm.createPrimaryButton("Query-Coupon-By-Character", "🧍 查角色用過的序號"),
            cm.createSuccessButton("Query-Coupon-By-Account", "👤 查帳號用過的序號"),
            cm.createPrimaryButton("Save-Coupon", "💾 儲存商城序號")
        );
    }

    cm.sendPrivateMessage("",
        cm.createSuccessButton("Disable-Coupon", "🚫 關閉商城指定序號 (調整為已過期)"),
        cm.createPrimaryButton("Enable-Coupon", "✅ 開啟商城指定序號 (調整可用期限)")
    );

    cm.sendPrivateMessage("",
        cm.createSuccessButton("Create-Coupon", "🎟️ 新增商城序號"),
        cm.createDangerButton("Delete-Coupon", "🗑️ 刪除商城指定序號"),
    );

    let menuMessage = "";
    menuMessage += "🛠️ 管理主頁區::Open-Script-管理功能###";
    menuMessage += "👤 管理角色區::Open-Script-管理功能-角色區###";
    menuMessage += "🔐 封鎖管理區::Open-Script-管理功能-封鎖區###";
    menuMessage += "📄 日誌管理區::Open-Script-管理功能-Log區###";
    menuMessage += "🧰 修復異常區::Open-Script-管理功能-修復區###";
    menuMessage += "🔑 商城序號區::Open-Script-管理功能-序號區###";

    cm.sendPrivateMessage(
        "",
        cm.createStringSelectMenu("ScriptMenu", menuMessage, "Open-Script-管理功能-序號區"),
        cm.createDangerButton("Dispose", "❌ 結束對話")
    );
}

function onButtonInteraction(event, buttonId, buttonText) {
    if (cm.getPermissionLevel() < 1) {
        cm.dispose();
        messageEvent = null;
        return;
    }

    switch (buttonId) {
        case "Query-Coupon":
            event.replyModal(cm.createModal("Query-Coupon-Modal", "🔍 查商城序號資訊", JSON.stringify([
                {
                    label: "商城序號",
                    id: "code",
                    style: "short",
                    placeholder: "請輸入商城序號",
                    required: true
                }
            ]))).queue();
            break;
        case "Query-Coupon-By-Character":
            event.replyModal(cm.createModal("Query-Coupon-By-Character-Modal", "🧍 查角色用過的序號", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                }
            ]))).queue();
            break;
        case "Query-Coupon-By-Account":
            event.replyModal(cm.createModal("Query-Coupon-By-Account-Modal", "👤 查帳號用過的序號", JSON.stringify([
                {
                    label: "帳號",
                    id: "accountName",
                    style: "short",
                    placeholder: "請輸入帳號",
                    required: true
                }
            ]))).queue();
            break;
        case "Save-Coupon":
            if (cm.getPermissionLevel() < 3) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            cm.saveCouponCode();
            event.reply("🎉 儲存商城序號系統完成!").queue();
            break;
        case "Enable-Coupon":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Enable-Coupon-Modal", "✅ 開啟指定商城序號 (調整可用期限)", JSON.stringify([
                {
                    label: "商城序號",
                    id: "code",
                    style: "short",
                    placeholder: "請輸入商城序號",
                    required: true
                },
                {
                    label: "可用期限",
                    id: "expiration",
                    style: "short",
                    placeholder: "請輸入UNIX毫秒時間戳可用期限，-1為無期限",
                    required: true
                },
            ]))).queue();
            break;
        case "Disable-Coupon":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Disable-Coupon-Modal", "🚫 關閉指定商城序號 (調整為已過期)", JSON.stringify([
                {
                    label: "商城序號",
                    id: "code",
                    style: "short",
                    placeholder: "請輸入商城序號",
                    required: true
                }
            ]))).queue();
            break;

        case "Create-Coupon":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            sendCreateCouponMessage(event);
            break;
        case "Create-Coupon-Set-Create-Count":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Create-Coupon-Set-Create-Count-Modal", "🔁 調整產生序號數量", JSON.stringify([
                {
                    label: "產生數量",
                    id: "count",
                    style: "short",
                    placeholder: "請輸入產生數量",
                    required: true
                }
            ]))).queue();
            break;
        case "Create-Coupon-Set-Create-Start":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }

            let isEmptyContent =
                newCouponInfo.money === 0 &&
                newCouponInfo.gash === 0 &&
                newCouponInfo.maplePoint === 0 &&
                newCouponInfo.pachinko === 0 &&
                newCouponInfo.pay === 0 &&
                newCouponInfo.items.length === 0;

            if (isEmptyContent) {
                event.reply("⚠️ 尚未填寫任何獎勵內容，無法生成序號。").setEphemeral(true).queue();
                return;
            }

            if (newCouponInfo.createCount <= 0) {
                event.reply("⚠️ 請確認序號產生次數必須大於 0。").setEphemeral(true).queue();
                return;
            }

            let codeList = [];
            let expiration = newCouponInfo.expiration;
            if (expiration !== -1) {
                expiration = cm.getCurrentTimeMillis() + expiration * 60 * 1000; // 轉換為毫秒
            }

            for (let i = 0; i < newCouponInfo.createCount; i++) {
                let itemList = cm.getNewArrayList();

                for (let j = 0; j < newCouponInfo.items.length; j++) {
                    let item = newCouponInfo.items[j];
                    let itemId = item.itemId;
                    let quantity = item.quantity;
                    let duration = item.duration;
                    let itemType = parseInt(itemId / 1000000);
                    let durationMs = duration === -1 ? -1 : duration * 60 * 1000;

                    if (itemType === 1 || itemType === 5) {
                        for (let k = 0; k < quantity; k++) {
                            itemList.add(cm.createCouponItemInfo(itemId, 1, durationMs));
                        }
                    } else {
                        itemList.add(cm.createCouponItemInfo(itemId, quantity, durationMs));
                    }
                }

                let code = cm.createCouponCode(
                    20,
                    itemList,
                    newCouponInfo.money,
                    newCouponInfo.gash,
                    newCouponInfo.maplePoint,
                    newCouponInfo.pachinko,
                    newCouponInfo.pay,
                    newCouponInfo.limitAvailableAccountId,
                    newCouponInfo.availableAccountId,
                    newCouponInfo.limitRemainQuantity,
                    newCouponInfo.remainingQuantity,
                    expiration
                );

                codeList.push(code);
            }

            let message = "✅ 本次成功生成以下序號：\n";
            for (let i = 0; i < codeList.length; i++) {
                let code = codeList[i];
                message += "**" + code + "**\n";
            }

            event.reply(message).complete();
            sendCreateCouponMessage(null);
            break;

        case "Create-Coupon-Set-Money":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Create-Coupon-Set-Money-Modal", "💰 設定楓幣", JSON.stringify([
                {
                    label: "楓幣數量",
                    id: "point",
                    style: "short",
                    placeholder: "請輸入數量",
                    required: true
                }
            ]))).queue();
            break;
        case "Create-Coupon-Set-Gash":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Create-Coupon-Set-Gash-Modal", "💎 設定 GASH", JSON.stringify([
                {
                    label: "GASH 數量",
                    id: "point",
                    style: "short",
                    placeholder: "請輸入數量",
                    required: true
                }
            ]))).queue();
            break;

        case "Create-Coupon-Set-MaplePoint":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Create-Coupon-Set-MaplePoint-Modal", "🍁 設定楓葉點數", JSON.stringify([
                {
                    label: "楓葉點數數量",
                    id: "point",
                    style: "short",
                    placeholder: "請輸入數量",
                    required: true
                }
            ]))).queue();
            break;

        case "Create-Coupon-Set-Pachinko":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Create-Coupon-Set-Pachinko-Modal", "🎰 設定小鋼珠", JSON.stringify([
                {
                    label: "小鋼珠數量",
                    id: "point",
                    style: "short",
                    placeholder: "請輸入數量",
                    required: true
                }
            ]))).queue();
            break;

        case "Create-Coupon-Set-Pay":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Create-Coupon-Set-Pay-Modal", "💳 設定贊助點", JSON.stringify([
                {
                    label: "贊助點數量",
                    id: "point",
                    style: "short",
                    placeholder: "請輸入數量",
                    required: true
                }
            ]))).queue();
            break;

        case "Create-Coupon-Set-Available-Account":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Create-Coupon-Set-Available-Account-Modal", "🔒 限制帳號", JSON.stringify([
                {
                    label: "帳號 (輸入 -1 表示不限帳號)",
                    id: "accountName",
                    style: "short",
                    placeholder: "請輸入帳號",
                    required: true
                }
            ]))).queue();
            break;
        case "Create-Coupon-Set-Available-Quantity":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Create-Coupon-Set-Available-Quantity-Modal", "📦 限制數量", JSON.stringify([
                {
                    label: "限制可領取數量 (輸入 -1 表示不限數量)",
                    id: "quantity",
                    style: "short",
                    placeholder: "請輸入限制數量",
                    required: true
                }
            ]))).queue();
            break;
        case "Create-Coupon-Set-Available-Expiration":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Create-Coupon-Set-Available-Expiration-Modal", "⏳ 可用期限", JSON.stringify([
                {
                    label: "限制可用期限 (輸入 -1 表示永久，或是輸入可用分鐘數)",
                    id: "expiration",
                    style: "short",
                    placeholder: "請輸入期限",
                    required: true
                }
            ]))).queue();
            break;
        case "Create-Coupon-Clear-Item":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            newCouponInfo.items = [];
            sendCreateCouponMessage(event);
            break;
        case "Create-Coupon-Create-Item":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Create-Coupon-Create-Item-Modal", "🎁 加入道具", JSON.stringify([
                {
                    label: "道具代碼",
                    id: "itemId",
                    style: "short",
                    placeholder: "請輸入道具代碼",
                    required: true
                },
                {
                    label: "道具數量",
                    id: "itemQuantity",
                    style: "short",
                    defaultValue: "1",
                    placeholder: "請輸入道具數量",
                    required: true
                },
                {
                    label: "道具期限 (-1為永久，或是填入可用分鐘數)",
                    id: "itemPeriod",
                    style: "short",
                    placeholder: "請輸入道具期限",
                    required: true
                }
            ]))).queue();
            break;
        case "Create-Coupon-Return-Menu":
            onMessageReceived(messageEvent, null, event);
            break;
        case "Delete-Coupon":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Delete-Coupon-Modal", "🗑️ 刪除商城指定序號", JSON.stringify([
                {
                    label: "商城序號",
                    id: "code",
                    style: "short",
                    placeholder: "請輸入商城序號",
                    required: true
                }
            ]))).queue();
            break;
        case "Dispose":
        default:
            event.reply("對話已結束").queue();
            cm.dispose();
            messageEvent = null;
    }
}

function onStringSelectInteraction(event, menuId, selectedId) {
    if (cm.getPermissionLevel() < 1) {
        cm.dispose();
        messageEvent = null;
        return;
    }
    if (menuId.equals("ScriptMenu")) {
        if (selectedId.startsWith("Open-Script-")) {
            event.reply("").setEphemeral(true).complete();
            cm.openScript(selectedId.substring(12), messageEvent);
            messageEvent = null;
        }
    } else {
        event.reply("對話已結束").queue();
        cm.dispose();
        messageEvent = null;
    }
}

function onModalInteraction(event, modalId) {
    if (cm.getPermissionLevel() < 1) {
        event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
        cm.dispose();
        messageEvent = null;
        return;
    }

    switch (modalId) {
        case "Query-Coupon-Modal": {
            let code = event.getValue("code").getAsString();
            event.reply(cm.getCouponInfoByCode(code)).complete();
            cm.dispose();
            cm.openScript(cm.getScriptName(), messageEvent);
            messageEvent = null;
            break;
        }
        case "Query-Coupon-By-Character-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            replyInChunks(event, cm.getCouponInfoByCharacterName(characterName));
            cm.dispose();
            cm.openScript(cm.getScriptName(), messageEvent);
            messageEvent = null;
            break;
        }
        case "Query-Coupon-By-Account-Modal": {
            let accountName = event.getValue("accountName").getAsString();
            replyInChunks(event, cm.getCouponInfoByAccountName(accountName));
            cm.dispose();
            cm.openScript(cm.getScriptName(), messageEvent);
            messageEvent = null;
            break;
        }
        case "Enable-Coupon-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let code = event.getValue("code").getAsString();
            let expirationInString = event.getValue("expiration").getAsString();

            if (!isNumeric(expirationInString)) {
                event.reply("❌ **操作失敗**：期限必須為數字。").setEphemeral(true).queue();
                return;
            }

            let expiration = parseInt(expirationInString);
            let success = cm.editCouponExpiration(code, expiration);
            let message;

            if (success) {
                let readableTime = (expiration === -1) ? "永久" : cm.getReadableTime(expiration);
                message = "✅ 序號 <**" + code + "**> 已成功啟用，可用期限為 <" + readableTime + ">。";
            } else {
                message = "⚠️ 無法啟用序號 <**" + code + "**>。可能是序號不存在，或目前期限與輸入相同。";
            }

            event.reply(message).queue();
            break;
        }
        case "Disable-Coupon-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let code = event.getValue("code").getAsString();
            let success = cm.editCouponExpiration(code, cm.getCurrentTimeMillis() - 1000);
            let message;
            if (success) {
                message = "✅ 序號 <**" + code + "**> 已成功關閉。";
            } else {
                message = "⚠️ 無法關閉序號 <**" + code + "**>。可能是序號不存在或已被關閉。";
            }
            event.reply(message).queue();
            break;
        }
        case "Create-Coupon-Set-Create-Count-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let countInString = event.getValue("count").getAsString();
            if (!isNumeric(countInString)) {
                event.reply("❌ **操作失敗**：必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            newCouponInfo.createCount = parseInt(countInString);
            sendCreateCouponMessage(event);
            break;
        }
        case "Create-Coupon-Set-Money-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let pointInString = event.getValue("point").getAsString();
            if (!isNumeric(pointInString)) {
                event.reply("❌ **操作失敗**：必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let point = parseInt(pointInString);
            if (point > 2147483647) {
                event.reply("❌ **操作失敗**：最多不能給予超過" + cm.numberWithCommas(2147483647)).setEphemeral(true).queue();
                return;
            }
            newCouponInfo.money = point;
            sendCreateCouponMessage(event);
            break;
        }
        case "Create-Coupon-Set-Gash-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let pointStr = event.getValue("point").getAsString();
            if (!isNumeric(pointStr)) {
                event.reply("❌ **操作失敗**：必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let point = parseInt(pointStr);
            if (point > 2147483647) {
                event.reply("❌ **操作失敗**：最多不能給予超過" + cm.numberWithCommas(2147483647)).setEphemeral(true).queue();
                return;
            }
            newCouponInfo.gash = point;
            sendCreateCouponMessage(event);
            break;
        }
        case "Create-Coupon-Set-MaplePoint-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let pointStr = event.getValue("point").getAsString();
            if (!isNumeric(pointStr)) {
                event.reply("❌ **操作失敗**：必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let point = parseInt(pointStr);
            if (point > 2147483647) {
                event.reply("❌ **操作失敗**：最多不能給予超過" + cm.numberWithCommas(2147483647)).setEphemeral(true).queue();
                return;
            }
            newCouponInfo.maplePoint = point;
            sendCreateCouponMessage(event);
            break;
        }
        case "Create-Coupon-Set-Pachinko-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let pointStr = event.getValue("point").getAsString();
            if (!isNumeric(pointStr)) {
                event.reply("❌ **操作失敗**：必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let point = parseInt(pointStr);
            if (point > 2147483647) {
                event.reply("❌ **操作失敗**：最多不能給予超過" + cm.numberWithCommas(2147483647)).setEphemeral(true).queue();
                return;
            }
            newCouponInfo.pachinko = point;
            sendCreateCouponMessage(event);
            break;
        }
        case "Create-Coupon-Set-Pay-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let pointStr = event.getValue("point").getAsString();
            if (!isNumeric(pointStr)) {
                event.reply("❌ **操作失敗**：必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let point = parseInt(pointStr);
            if (point > 2147483647) {
                event.reply("❌ **操作失敗**：最多不能給予超過" + cm.numberWithCommas(2147483647)).setEphemeral(true).queue();
                return;
            }
            newCouponInfo.pay = point;
            sendCreateCouponMessage(event);
            break;
        }
        case "Create-Coupon-Set-Available-Account-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let accountName = event.getValue("accountName").getAsString();
            if (accountName === "-1") {
                newCouponInfo.limitAvailableAccountId = false;
                newCouponInfo.availableAccountId = -1;
                sendCreateCouponMessage(event);
                break;
            }
            let accountId = cm.getAccountIdByName(accountName);
            if (accountId === -1) {
                event.reply("❌ **操作失敗**：帳號<" + accountName + ">不存在。").setEphemeral(true).queue();
                return;
            }
            newCouponInfo.limitAvailableAccountId = true;
            newCouponInfo.availableAccountId = accountId;
            sendCreateCouponMessage(event);
            break;
        }
        case "Create-Coupon-Set-Available-Quantity-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let quantityStr = event.getValue("quantity").getAsString();
            if (!isNumeric(quantityStr)) {
                event.reply("❌ **操作失敗**：必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let quantity = parseInt(quantityStr);
            if (quantity < -1) {
                event.reply("❌ **操作失敗**：數量不可小於 -1。").setEphemeral(true).queue();
                return;
            }
            if (quantity === -1) {
                newCouponInfo.limitRemainQuantity = false;
                newCouponInfo.remainingQuantity = 0;
            } else {
                newCouponInfo.limitRemainQuantity = true;
                newCouponInfo.remainingQuantity = quantity;
            }
            sendCreateCouponMessage(event);
            break;
        }
        case "Create-Coupon-Set-Available-Expiration-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let expirationStr = event.getValue("expiration").getAsString();
            if (!isNumeric(expirationStr)) {
                event.reply("❌ **操作失敗**：必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let expiration = parseInt(expirationStr);
            if (expiration < -1) {
                event.reply("❌ **操作失敗**：期限不可小於 -1。").setEphemeral(true).queue();
                return;
            }
            newCouponInfo.expiration = expiration;
            sendCreateCouponMessage(event);
            break;
        }
        case "Create-Coupon-Create-Item-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let itemIdStr = event.getValue("itemId").getAsString();
            let itemQuantityStr = event.getValue("itemQuantity").getAsString();
            let itemPeriodStr = event.getValue("itemPeriod").getAsString();
            if (!isNumeric(itemIdStr)) {
                event.reply("❌ **操作失敗**：道具代碼必須輸入數字。").setEphemeral(true).queue();
                return;
            } else if (!isNumeric(itemQuantityStr)) {
                event.reply("❌ **操作失敗**：道具數量必須輸入數字。").setEphemeral(true).queue();
                return;
            } else if (!isNumeric(itemPeriodStr)) {
                event.reply("❌ **操作失敗**：道具期限必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let itemId = parseInt(itemIdStr);
            let itemQuantity = parseInt(itemQuantityStr);
            let itemPeriod = parseInt(itemPeriodStr);

            if (itemQuantity <= 0) {
                event.reply("❌ **操作失敗**：道具數量少於0。").setEphemeral(true).queue();
                return;
            } else if (!cm.itemExists(itemId)) {
                event.reply("❌ **操作失敗**：道具代碼<" + itemId + ">不存在。").setEphemeral(true).queue();
                return;
            } else if (parseInt(itemId / 10000) === 500 && itemPeriod === -1) {
                event.reply("❌ **操作失敗**：寵物必須輸入有效期限。").setEphemeral(true).queue();
                return;
            }
            newCouponInfo.items.push({
                itemId: itemId,
                quantity: itemQuantity,
                duration: itemPeriod
            });
            sendCreateCouponMessage(event);
            break;
        }
        case "Delete-Coupon-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let code = event.getValue("code").getAsString();
            let success = cm.removeCouponCode(code);
            let message;
            if (success) {
                message = "✅ 序號 <**" + code + "**> 已成功移除。";
            } else {
                message = "⚠️ 無法移除序號 <**" + code + "**>。可能是序號不存在。";
            }
            event.reply(message).queue();
            break;
        }
        default:
            event.reply("對話已結束").queue();
            cm.dispose();
            messageEvent = null;
            return;
    }
}

function sendCreateCouponMessage(event) {
    if (event != null) {
        event.reply(formatCouponInfo(newCouponInfo)).complete();
    } else {
        cm.sendPrivateMessage(formatCouponInfo(newCouponInfo));
    }
    cm.sendPrivateMessage("",
        cm.createPrimaryButton("Create-Coupon-Set-Create-Count", "🔁 調整產生序號數量"),
        cm.createDangerButton("Create-Coupon-Set-Create-Start", "🚀 開始生成序號"),
        cm.createSuccessButton("Create-Coupon-Return-Menu", "🔙 回上一頁")
    );
    cm.sendPrivateMessage("",
        cm.createPrimaryButton("Create-Coupon-Set-Money", "💰 設定楓幣"),
        cm.createSuccessButton("Create-Coupon-Set-Gash", "💎 設定 GASH"),
        cm.createPrimaryButton("Create-Coupon-Set-MaplePoint", "🍁 設定楓葉點數"),
        cm.createSuccessButton("Create-Coupon-Set-Pachinko", "🎰 設定小鋼珠"),
        cm.createPrimaryButton("Create-Coupon-Set-Pay", "💳 設定贊助點")
    );
    cm.sendPrivateMessage("",
        cm.createPrimaryButton("Create-Coupon-Set-Available-Account", "🔒 限制帳號"),
        cm.createSuccessButton("Create-Coupon-Set-Available-Quantity", "📦 可領取次數"),
        cm.createPrimaryButton("Create-Coupon-Set-Available-Expiration", "⏳ 可用期限"),
        cm.createSuccessButton("Create-Coupon-Create-Item", "🎁 加入道具"),
        cm.createDangerButton("Create-Coupon-Clear-Item", "🧹 清空道具"),
    );
}

function formatCouponInfo(coupon) {
    let message = "🎟️ **目前序號內容如下：**\n\n";

    let rewards = [];
    rewards.push("⏳ 可用期限：" + (coupon.expiration === -1 ? "永久" : coupon.expiration + "分鐘"));
    if (coupon.createCount > 0) rewards.push("🔁 產生數量：" + cm.numberWithCommas(coupon.createCount));
    if (coupon.money > 0) rewards.push("💰 楓幣：" + cm.numberWithCommas(coupon.money));
    if (coupon.gash > 0) rewards.push("💎 GASH：" + cm.numberWithCommas(coupon.gash));
    if (coupon.maplePoint > 0) rewards.push("🍁 楓葉點數：" + cm.numberWithCommas(coupon.maplePoint));
    if (coupon.pachinko > 0) rewards.push("🎰 小鋼珠：" + cm.numberWithCommas(coupon.pachinko));
    if (coupon.pay > 0) rewards.push("💳 贊助：" + cm.numberWithCommas(coupon.pay));
    if (rewards.length > 0) {
        message += rewards.join("\n") + "\n\n";
    }

    if (coupon.limitAvailableAccountId) {
        message += "🔒 可用帳號編號：" + coupon.availableAccountId + "\n";
    }

    if (coupon.limitRemainQuantity) {
        message += "📦 可領取次數：" + cm.numberWithCommas(coupon.remainingQuantity) + "\n";
    }

    if (coupon.items.length > 0) {
        message += "🎁 **道具列表：**\n";
        for (let i = 0; i < coupon.items.length; i++) {
            let item = coupon.items[i];
            message += "- 🧱 道具：" + cm.getItemName(item.itemId) + "(" + item.itemId + ")" +
                "｜數量：" + cm.numberWithCommas(item.quantity) +
                "｜時效：" + (item.duration > 0 ? item.duration + " 分鐘" : "永久") + "\n";
        }
        message += "\n";
    }

    return message;
}


function replyInChunks(event, content, maxLength = 2000) {
    let chunks = [];

    while (content.length > 0) {
        chunks.push(content.slice(0, maxLength));
        content = content.slice(maxLength);
    }

    for (let i = 0; i < chunks.length; i++) {
        let chunk = chunks[i];
        if (i === 0) {
            event.reply(chunk).complete();
        } else {
            cm.sendPrivateMessage(chunk);
        }
    }
}

function isNumeric(str) {
    return !isNaN(str) && str.trim() !== '';
}
