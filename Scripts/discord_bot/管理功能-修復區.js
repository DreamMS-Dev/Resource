// 2025/05/19 - 2025/05/20
// Discord腳本 - 管理功能-修復區
// By Windy

let enable = true; // true = 開放 , false = 關閉
let messageEvent = null;

function onMessageReceived(event, content) {
    if (!enable) {
        cm.dispose();
        return;
    }
    if (cm.getPermissionLevel() < 3) {
        event.reply("❌ 權限不足，**對話已結束。**").queue();
        cm.dispose();
        return;
    }
    messageEvent = event;

    cm.sendPrivateMessage("",
        cm.createPrimaryButton("Fix-Hair", "💇‍♂️ 修正異常髮型"),
        cm.createSuccessButton("Fix-Face", "🧑‍ 修正異常臉型"),
        cm.createPrimaryButton("Fix-Map", "🗺️ 修正卡地圖"),
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
        cm.createStringSelectMenu("ScriptMenu", menuMessage, "Open-Script-管理功能-修復區"),
        cm.createDangerButton("Dispose", "❌ 結束對話")
    );
}

function onButtonInteraction(event, buttonId, buttonText) {
    if (cm.getPermissionLevel() < 3) {
        event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
        cm.dispose();
        messageEvent = null;
        return;
    }

    switch (buttonId) {
        case "Fix-Hair":
            event.replyModal(cm.createModal("Fix-Hair-Modal", "💇‍♂️ 修正異常髮型", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                }
            ]))).queue();
            break;
        case "Fix-Face":
            event.replyModal(cm.createModal("Fix-Face-Modal", "🧑‍ 修正異常臉型", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                }
            ]))).queue();
            break;
        case "Fix-Map":
            event.replyModal(cm.createModal("Fix-Map-Modal", "🗺️ 修正異常地圖", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
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
    if (cm.getPermissionLevel() < 3) {
        event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
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
    if (cm.getPermissionLevel() < 3) {
        event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
        cm.dispose();
        messageEvent = null;
        return;
    }

    switch (modalId) {
        case "Fix-Hair-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let character = cm.getChr(characterName);
            let characterId = -1;

            if (character != null) {
                characterId = character.getId();
            } else {
                characterId = cm.getCharacterIdByName(characterName);
                if (characterId === -1) {
                    event.reply("📛 **操作失敗**：找不到角色 `" + characterName + "`，請確認名稱是否正確。").setEphemeral(true).queue();
                    return;
                }
            }

            if (cm.fixCharacterHair(characterId)) {
                event.reply("✅ **操作成功**：角色 `" + characterName + "` 的髮型已根據性別調整為預設樣式。").setEphemeral(true).queue();
            } else {
                event.reply("📛 **操作失敗**：角色 `" + characterName + "` 髮型修正失敗，可能是資料異常或無法存取。").setEphemeral(true).queue();
            }
            break;
        }
        case "Fix-Face-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let character = cm.getChr(characterName);
            let characterId = -1;

            if (character != null) {
                characterId = character.getId();
            } else {
                characterId = cm.getCharacterIdByName(characterName);
                if (characterId === -1) {
                    event.reply("📛 **操作失敗**：找不到角色 `" + characterName + "`，請確認名稱是否正確。").setEphemeral(true).queue();
                    return;
                }
            }

            if (cm.fixCharacterFace(characterId)) {
                event.reply("✅ **操作成功**：角色 `" + characterName + "` 的臉型已根據性別調整為預設樣式。").setEphemeral(true).queue();
            } else {
                event.reply("📛 **操作失敗**：角色 `" + characterName + "` 臉型修正失敗，可能是資料異常或無法存取。").setEphemeral(true).queue();
            }
            break;
        }
        case "Fix-Map-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let character = cm.getChr(characterName);
            let characterId = -1;

            if (character != null) {
                characterId = character.getId();
            } else {
                characterId = cm.getCharacterIdByName(characterName);
                if (characterId === -1) {
                    event.reply("📛 **操作失敗**：找不到角色 `" + characterName + "`，請確認名稱是否正確。").setEphemeral(true).queue();
                    return;
                }
            }

            if (cm.fixCharacterField(characterName)) {
                event.reply("✅ **操作成功**：角色 `" + characterName + "` 已被傳送至自由市場。").setEphemeral(true).queue();
            } else {
                event.reply("📛 **操作失敗**：角色 `" + characterName + "` 修正卡地圖失敗，可能是資料異常或無法存取。").setEphemeral(true).queue();
            }
            break;
        }
        default:
            event.reply("對話已結束").queue();
            cm.dispose();
            messageEvent = null;
            return;
    }
}