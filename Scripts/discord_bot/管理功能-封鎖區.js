// 2025/05/19 - 2025/05/20
// Discord腳本 - 管理功能-封鎖區
// By Windy

let enable = true; // true = 開放 , false = 關閉
let messageEvent = null;

function onMessageReceived(event, content) {
    if (!enable) {
        cm.dispose();
        return;
    }
    if (cm.getPermissionLevel() < 1) {
        cm.dispose();
        return;
    }
    messageEvent = event;

    cm.sendPrivateMessage("",
        cm.createPrimaryButton("Disconnect-Character", "📤 踢出角色（回登入畫面）"),
        cm.createDangerButton("Disconnect-Character-Client", "❌ 關閉角色客戶端"),
    );

    cm.sendPrivateMessage("",
        cm.createPrimaryButton("BanInfo-Character", "📛 取得角色封鎖資訊"),
        cm.createDangerButton("Ban-Character", "⛔ 封鎖角色"),
        cm.createSuccessButton("Unban-Character", "✅ 解封角色")
    );

    cm.sendPrivateMessage("",
        cm.createPrimaryButton("JailInfo-Character", "🧾 取得角色監禁資訊"),
        cm.createDangerButton("Jail-Character", "🚓 關進監獄"),
        cm.createSuccessButton("Unjail-Character", "🚪 移出監獄")
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
        cm.createStringSelectMenu("ScriptMenu", menuMessage, "Open-Script-管理功能-封鎖區"),
        cm.createDangerButton("Dispose", "❌ 結束對話")
    );
}

function onButtonInteraction(event, buttonId, buttonText) {
    if (cm.getPermissionLevel() < 1) {
        event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
        cm.dispose();
        messageEvent = null;
        return;
    }

    switch (buttonId) {
        case "Disconnect-Character":
            if (cm.getPermissionLevel() < 2) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Disconnect-Character-Modal", "📤 踢出角色（回登入畫面）", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                }
            ]))).queue();
            break;
        case "Disconnect-Character-Client":
            if (cm.getPermissionLevel() < 2) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Disconnect-Character-Client-Modal", "❌ 關閉角色客戶端", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                }
            ]))).queue();
            break;
        case "BanInfo-Character":
            event.replyModal(cm.createModal("BanInfo-Character-Modal", "📛 取得角色封鎖資訊", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                }
            ]))).queue();
            break;
        case "Ban-Character":
            if (cm.getPermissionLevel() < 2) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Ban-Character-Modal", "⛔ 封鎖角色", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                },
                {
                    label: "廣播 (是/否)",
                    id: "broadcast",
                    style: "short",
                    defaultValue: "是",
                    required: true
                },
                {
                    label: "封鎖原因",
                    id: "reason",
                    style: "paragraph",
                    placeholder: "請輸入封鎖原因",
                    required: true
                },
            ]))).queue();
            break;
        case "Unban-Character":
            if (cm.getPermissionLevel() < 2) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Unban-Character-Modal", "✅ 解封角色", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                }
            ]))).queue();
            break;
        case "JailInfo-Character":
            event.replyModal(cm.createModal("JailInfo-Character-Modal", "🧾 取得角色監禁資訊", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                }
            ]))).queue();
            break;
        case "Jail-Character":
            if (cm.getPermissionLevel() < 2) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Jail-Character-Modal", "🚓 關進監獄", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                },
                {
                    label: "持續時間",
                    id: "minute",
                    style: "short",
                    placeholder: "分鐘數，如果原本已經在監獄內則會延長",
                    required: true
                },
            ]))).queue();
            break;
        case "Unjail-Character":
            if (cm.getPermissionLevel() < 2) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Unjail-Character-Modal", "🚪 移出監獄", JSON.stringify([
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
    if (cm.getPermissionLevel() < 1) {
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
    if (cm.getPermissionLevel() < 1) {
        event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
        cm.dispose();
        messageEvent = null;
        return;
    }

    switch (modalId) {
        case "Disconnect-Character-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let character = cm.getChr(characterName);

            if (character == null) {
                event.reply("📛 **操作失敗**：線上找不到角色 `" + characterName + "`，請確認名稱是否正確。").setEphemeral(true).queue();
                return;
            }

            if (cm.disconnectCharacter(characterName, false)) {
                event.reply("✅ **操作成功**：角色 `" + characterName + "` 已經下線並退回登入畫面。").queue();
            } else {
                event.reply("📛 **操作失敗**：角色 `" + characterName + "`離線失敗，請確認名稱是否正確。").setEphemeral(true).queue();
            }
            break;
        }
        case "Disconnect-Character-Client-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let character = cm.getChr(characterName);
            if (character == null) {
                event.reply("📛 **操作失敗**：線上找不到角色 `" + characterName + "`，請確認名稱是否正確。").setEphemeral(true).queue();
                return;
            }
            if (cm.disconnectCharacter(characterName, true)) {
                event.reply("✅ **操作成功**：角色 `" + characterName + "` 已經下線並關閉客戶端。").queue();
            } else {
                event.reply("📛 **操作失敗**：角色 `" + characterName + "`離線失敗，請確認名稱是否正確。").setEphemeral(true).queue();
            }
            break;
        }
        case "BanInfo-Character-Modal": {
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
            event.reply(cm.getCharacterBannedInfo(characterName)).queue();
            break;
        }
        case "Ban-Character-Modal": {
            let broadcast = event.getValue("broadcast").getAsString() === "是";
            let reason = event.getValue("reason").getAsString();
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
            if (cm.banCharacter("[DiscordBotScript] " + event.getUser().getName() + "(" + event.getUser().getId() + ")", characterName, reason, broadcast, -1)) {
                event.reply("✅ **操作成功**：角色 `" + characterName + "` 已經被封鎖。").queue();
            } else {
                event.reply("📛 **操作失敗**：" + failureReason).setEphemeral(true).queue();
            }
            break;
        }
        case "Unban-Character-Modal": {
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

            let failureReason = cm.unbanCharacter(characterName);
            if (failureReason === "") {
                event.reply("✅ **操作成功**：角色 `" + characterName + "` 已成功解除封鎖。").queue();
            } else {
                event.reply("📛 **操作失敗**：" + failureReason).setEphemeral(true).queue();
            }
            break;
        }
        case "JailInfo-Character-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let character = cm.getChr(characterName);
            let characterId = -1;

            if (character != null) {
                characterId = character.getId();
            } else {
                characterId = cm.getCharacterIdByName(characterName);
                if (characterId === -1) {
                    event.reply("📛 **查詢失敗**：找不到角色 `" + characterName + "`，請確認名稱是否正確。").setEphemeral(true).queue();
                    return;
                }
            }

            let expiration = getCharacterJailExpiration(characterId);
            if (expiration === -1) {
                event.reply("❌ **查詢失敗**：發生未知錯誤，請稍後再試。").setEphemeral(true).queue();
            } else if (expiration === 0) {
                event.reply("✅ **查詢成功**：角色 `" + characterName + "` 目前未被關押。").queue();
            } else {
                event.reply("✅ **查詢成功**：角色 `" + characterName + "` 可出獄時間為 `" + cm.getReadableTime(expiration) + "`。").queue();
            }
            break;
        }
        case "Jail-Character-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let minuteInString = event.getValue("minute").getAsString();

            if (!isNumeric(minuteInString)) {
                event.reply("❌ **操作失敗**：請輸入正確的分鐘數（數字格式）。").setEphemeral(true).queue();
                return;
            }

            let minute = parseInt(minuteInString);
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

            let failureReason = cm.jailCharacter(characterId, minute);
            if (failureReason === "") {
                event.reply("✅ **監禁成功**：角色 `" + characterName + "` 已被關入監獄，預計出獄時間為 `" + cm.getReadableTime(getCharacterJailExpiration(characterId)) + "`。").queue();
            } else {
                event.reply("📛 **監禁失敗**：" + failureReason).setEphemeral(true).queue();
            }
            break;
        }
        case "Unjail-Character-Modal": {
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

            let failureReason = cm.releaseCharacterFromJail(characterId);
            if (failureReason === "") {
                event.reply("✅ **釋放成功**：角色 `" + characterName + "` 已成功從監獄中釋放。").queue();
            } else {
                event.reply("📛 **釋放失敗**：" + failureReason).setEphemeral(true).queue();
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

function getCharacterJailExpiration(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getJailExpiration();
    } else {
        return cm.getCharacterJailExpiration(characterId);
    }
}

function isNumeric(str) {
    return !isNaN(str) && str.trim() !== '';
}