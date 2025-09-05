// 2025/05/19 - 2025/05/20
// Discord腳本 - 管理功能-Log區
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
        cm.createSuccessButton("Get-Character-Log", "🔎 取得角色Log"),
        cm.createPrimaryButton("Set-Character-Log", "🧍 設定角色Log"),
        cm.createDangerButton("Remove-Character-Log", "🧹 移除角色Log"),
    );

    cm.sendPrivateMessage("",
        cm.createSuccessButton("Get-Account-Log", "📂 取得帳號Log"),
        cm.createPrimaryButton("Set-Account-Log", "👤 設定帳號Log"),
        cm.createDangerButton("Remove-Account-Log", "🗑️ 移除帳號Log")
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
        cm.createStringSelectMenu("ScriptMenu", menuMessage, "Open-Script-管理功能-Log區"),
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
        case "Get-Character-Log":
            event.replyModal(cm.createModal("Get-Character-Log-Modal", "🔎 取得角色Log", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                },
                {
                    label: "Log名稱",
                    id: "logName",
                    style: "short",
                    placeholder: "請輸入要取得內容的Log名稱，輸入*可取得Log列表",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Character-Log":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Character-Log-Modal", "🧍 設定角色Log", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                },
                {
                    label: "Log名稱",
                    id: "logName",
                    style: "short",
                    placeholder: "請輸入要新增或是修改的Log名稱",
                    required: true
                },
                {
                    label: "Log值",
                    id: "logValue1",
                    style: "short",
                    placeholder: "請輸入要新增或是修改的Log值",
                    required: true
                },
                {
                    label: "Log期限",
                    id: "logExpiration",
                    style: "short",
                    placeholder: "請輸入期限，-1為永久，單位為UNIX毫秒時間戳",
                    required: true
                },
            ]))).queue();
            break;
        case "Remove-Character-Log":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Remove-Character-Log-Modal", "🧹 移除角色Log", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                },
                {
                    label: "Log名稱",
                    id: "logName",
                    style: "short",
                    placeholder: "請輸入要移除的Log名稱",
                    required: true
                },
            ]))).queue();
            break;
        case "Get-Account-Log":
            event.replyModal(cm.createModal("Get-Account-Log-Modal", "📂 取得帳號Log", JSON.stringify([
                {
                    label: "帳號",
                    id: "account",
                    style: "short",
                    placeholder: "請輸入帳號",
                    required: true
                },
                {
                    label: "Log名稱",
                    id: "logName",
                    style: "short",
                    placeholder: "請輸入要取得內容的Log名稱，輸入*可取得Log列表",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Account-Log":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Account-Log-Modal", "👤 設定帳號Log", JSON.stringify([
                {
                    label: "帳號",
                    id: "account",
                    style: "short",
                    placeholder: "請輸入帳號",
                    required: true
                },
                {
                    label: "Log名稱",
                    id: "logName",
                    style: "short",
                    placeholder: "請輸入要新增或是修改的Log名稱",
                    required: true
                },
                {
                    label: "Log值",
                    id: "logValue1",
                    style: "short",
                    placeholder: "請輸入要新增或是修改的Log值",
                    required: true
                },
                {
                    label: "Log期限",
                    id: "logExpiration",
                    style: "short",
                    placeholder: "請輸入期限，-1為永久，單位為UNIX毫秒時間戳",
                    required: true
                },
            ]))).queue();
            break;
        case "Remove-Account-Log":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Remove-Account-Log-Modal", "🗑️ 移除帳號Log", JSON.stringify([
                {
                    label: "帳號",
                    id: "account",
                    style: "short",
                    placeholder: "請輸入帳號",
                    required: true
                },
                {
                    label: "Log名稱",
                    id: "logName",
                    style: "short",
                    placeholder: "請輸入要移除的Log名稱",
                    required: true
                },
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
        case "Get-Character-Log-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let logName = event.getValue("logName").getAsString();

            let character = cm.getChr(characterName);
            let characterId = (character != null) ? character.getId() : cm.getCharacterIdByName(characterName);

            if (characterId === -1) {
                event.reply("📛 **操作失敗**：角色名稱 `" + characterName + "` 不存在。").setEphemeral(true).queue();
                return;
            }
            if (logName === "*") {
                let list = fetchAllLogInfo(true, characterId);
                if (list.length > 0) {
                    let message = "👤 **" + characterName + "的 Log 查詢結果：**\n\n";
                    let chunks = [];

                    for (let i = 0; i < list.length; i++) {
                        let info = list[i];
                        let line = "`" + info.key + "` = `" + info.value + "`\n";
                        if ((message.length + line.length) > 2000) {
                            chunks.push(message);
                            message = "";
                        }
                        message += line;
                    }
                    if (message.length > 0) {
                        chunks.push(message);
                    }
                    event.reply(chunks[0]).complete();
                    for (let i = 1; i < chunks.length; i++) {
                        event.getHook().sendMessage(chunks[i]).complete();
                    }
                    cm.dispose();
                    cm.openScript(cm.getScriptName(), messageEvent);
                    messageEvent = null;
                } else {
                    event.reply("⚠️ **查詢失敗！** 可能是指定角色沒有任何Log或是未知的錯誤。").setEphemeral(true).queue();
                }
            } else {
                let logInfo = cm.getCharacterMapleLog(characterId, logName);
                if (logInfo != null) {
                    event.reply(
                        "📄 **Log 查詢成功！**\n\n" +
                        "👤 **角色名稱：** `" + characterName + "` (`" + characterId + "`)\n" +
                        "📘 **Log 名稱：** `" + logInfo.getKey() + "`\n" +
                        "🔹 **Log 值1：** `" + logInfo.getValue() + "`\n" +
                        "🔸 **Log 值2：** `" + logInfo.getValue2() + "`\n" +
                        "🔹 **Log 值3：** `" + logInfo.getValue3() + "`\n" +
                        "⏳ **Log 期限：** `" + cm.getReadableTime(logInfo.getExpiration()) + "` (`" + logInfo.getExpiration() + "`)"
                    ).queue();
                } else {
                    event.reply("⚠️ **Log [" + logName + "] 查詢失敗！** 可能是指定角色沒有該Log或是未知的錯誤。").setEphemeral(true).queue();
                }
            }
            break;
        }
        case "Set-Character-Log-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let characterName = event.getValue("characterName").getAsString();
            let logName = event.getValue("logName").getAsString();
            let logValue1 = event.getValue("logValue1").getAsString();
            let expirationInString = event.getValue("logExpiration").getAsString();

            if (!isNumeric(expirationInString)) {
                event.reply("❌ **操作失敗**：期限必須輸入數字。").setEphemeral(true).queue();
                return;
            }

            let expiration = parseInt(expirationInString);
            let character = cm.getChr(characterName);
            let characterId = (character != null) ? character.getId() : cm.getCharacterIdByName(characterName);

            if (characterId === -1) {
                event.reply("📛 **操作失敗**：角色名稱 `" + characterName + "` 不存在。").setEphemeral(true).queue();
                return;
            }
            if (cm.setCharacterLog(characterId, logName, logValue1, null, null, expiration)) {
                event.reply(
                    "✅ **Log 設定成功！**\n\n" +
                    "👤 **角色名稱：** `" + characterName + "` (`" + characterId + "`)\n" +
                    "📝 **Log 名稱：** `" + logName + "`\n" +
                    "📦 **Log 值：** `" + logValue1 + "`\n" +
                    "⏳ **期限：** `" + (expiration === -1 ? "永久" : cm.getReadableTime(expiration)) + "` (`" + expiration + "`)"
                ).queue();
            } else {
                event.reply("⚠️ **Log 設定失敗！** 發生未知錯誤。").queue();
            }
            break;
        }
        case "Remove-Character-Log-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let characterName = event.getValue("characterName").getAsString();
            let logName = event.getValue("logName").getAsString();

            let character = cm.getChr(characterName);
            let characterId = (character != null) ? character.getId() : cm.getCharacterIdByName(characterName);

            if (characterId === -1) {
                event.reply("📛 **操作失敗**：角色名稱 `" + characterName + "` 不存在。").setEphemeral(true).queue();
                return;
            }

            if (cm.removeCharacterLog(characterId, logName)) {
                event.reply(
                    "🗑️ **Log 刪除成功！**\n\n" +
                    "👤 **角色名稱：** `" + characterName + "` (`" + characterId + "`)\n" +
                    "📝 **Log 名稱：** `" + logName + "`"
                ).queue();
            } else {
                event.reply("⚠️ **Log 刪除失敗！** 可能是指定角色沒有該Log或是未知的錯誤。").queue();
                return;
            }
            break;
        }
        case "Get-Account-Log-Modal": {
            let account = event.getValue("account").getAsString();
            let logName = event.getValue("logName").getAsString();
            let accountId = cm.getAccountIdByName(account);
            if (accountId === -1) {
                event.reply("📛 **操作失敗**：帳號名稱 `" + account + "` 不存在。").setEphemeral(true).queue();
                return;
            }
            if (logName === "*") {
                let list = fetchAllLogInfo(false, accountId);
                if (list.length > 0) {
                    let message = "👤 **" + account + "的 Log 查詢結果：**\n\n";
                    let chunks = [];

                    for (let i = 0; i < list.length; i++) {
                        let info = list[i];
                        let line = "`" + info.key + "` = `" + info.value + "`\n";
                        if ((message.length + line.length) > 2000) {
                            chunks.push(message);
                            message = "";
                        }
                        message += line;
                    }
                    if (message.length > 0) {
                        chunks.push(message);
                    }
                    event.reply(chunks[0]).complete();
                    for (let i = 1; i < chunks.length; i++) {
                        event.getHook().sendMessage(chunks[i]).complete();
                    }
                    cm.dispose();
                    cm.openScript(cm.getScriptName(), messageEvent);
                    messageEvent = null;
                } else {
                    event.reply("⚠️ **查詢失敗！** 可能是指定帳號沒有任何Log或是未知的錯誤。").setEphemeral(true).queue();
                }
            } else {
                let logInfo = cm.getAccountMapleLog(accountId, logName);
                if (logInfo != null) {
                    event.reply(
                        "📄 **Log 查詢成功！**\n\n" +
                        "👤 **帳號名稱：** `" + account + "` (`" + accountId + "`)\n" +
                        "📘 **Log 名稱：** `" + logInfo.getKey() + "`\n" +
                        "🔹 **Log 值1：** `" + logInfo.getValue() + "`\n" +
                        "🔸 **Log 值2：** `" + logInfo.getValue2() + "`\n" +
                        "🔹 **Log 值3：** `" + logInfo.getValue3() + "`\n" +
                        "⏳ **Log 期限：** `" + cm.getReadableTime(logInfo.getExpiration()) + "` (`" + logInfo.getExpiration() + "`)"
                    ).queue();
                } else {
                    event.reply("⚠️ **Log [" + logName + "] 查詢失敗！** 可能是指定帳號沒有該Log或是未知的錯誤。").queue();
                }
            }
            break;
        }
        case "Set-Account-Log-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let account = event.getValue("account").getAsString();
            let logName = event.getValue("logName").getAsString();
            let logValue1 = event.getValue("logValue1").getAsString();
            let expirationInString = event.getValue("logExpiration").getAsString();

            if (!isNumeric(expirationInString)) {
                event.reply("❌ **操作失敗**：期限必須輸入數字。").setEphemeral(true).queue();
                return;
            }

            let expiration = parseInt(expirationInString);
            let accountId = cm.getAccountIdByName(account);

            if (accountId === -1) {
                event.reply("📛 **操作失敗**：帳號名稱 `" + account + "` 不存在。").setEphemeral(true).queue();
                return;
            }
            if (cm.setAccountLog(accountId, logName, logValue1, null, null, expiration)) {
                event.reply(
                    "✅ **Log 設定成功！**\n\n" +
                    "👤 **帳號名稱：** `" + account + "` (`" + accountId + "`)\n" +
                    "📝 **Log 名稱：** `" + logName + "`\n" +
                    "📦 **Log 值：** `" + logValue1 + "`\n" +
                    "⏳ **期限：** `" + (expiration === -1 ? "永久" : cm.getReadableTime(expiration)) + "` (`" + expiration + "`)"
                ).queue();
            } else {
                event.reply("⚠️ **Log 設定失敗！** 發生未知錯誤。").queue();
            }
            break;
        }
        case "Remove-Account-Log-Modal": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
                cm.dispose();
                messageEvent = null;
                return;
            }
            let account = event.getValue("account").getAsString();
            let logName = event.getValue("logName").getAsString();
            let accountId = cm.getAccountIdByName(account);
            if (accountId === -1) {
                event.reply("📛 **操作失敗**：帳號名稱 `" + account + "` 不存在。").setEphemeral(true).queue();
                return;
            }
            if (cm.removeAccountLog(accountId, logName)) {
                event.reply(
                    "🗑️ **Log 移除成功！**\n\n" +
                    "👤 **帳號名稱：** `" + account + "` (`" + accountId + "`)\n" +
                    "📝 **Log 名稱：** `" + logName + "`"
                ).queue();
            } else {
                event.reply("⚠️ **Log 移除失敗！** 發生未知錯誤。").queue();
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

function fetchAllLogInfo(isCharacter, id) {
    if (isCharacter) {
        let character = cm.getChr(id);
        if (character != null) {
            return fetchAllLogInfoFromOnline(isCharacter, id);
        } else {
            return fetchAllLogInfoFromDatabase(isCharacter, id);
        }
    } else {
        let character = cm.getOnlineCharacterByAccountId(id);
        if (character != null) {
            return fetchAllLogInfoFromOnline(isCharacter, id);
        } else {
            return fetchAllLogInfoFromDatabase(isCharacter, id);
        }
    }
}

function fetchAllLogInfoFromOnline(isCharacter, id) {
    let listResult = null;
    if (isCharacter) {
        let character = cm.getChr(id);
        if (character != null) {
            listResult = character.getAllMapleLog();
        }
    } else {
        let character = cm.getOnlineCharacterByAccountId(id);
        if (character != null) {
            listResult = character.getAllMapleLog();
        }
    }
    let result = [];
    if (listResult != null) {
        let iterator = listResult.iterator();
        while (iterator.hasNext()) {
            let info = iterator.next();
            let key = info.getKey();
            let expiration = info.getExpiration();
            if (key.startsWith("BOSS_")) {
                continue;
            }
            result.push({
                key: key,
                value: info.getValue(),
                value2: info.getValue2(),
                value3: info.getValue3(),
                expiration: expiration,
                time: cm.getReadableTime(expiration)
            });
        }
        result.sort(function (a, b) {
            if (a.key < b.key) return -1;
            if (a.key > b.key) return 1;
            return 0;
        });
    }
    return result;
}

function fetchAllLogInfoFromDatabase(isCharacter, id) {
    let listResult;
    if (isCharacter) {
        listResult = cm.selectSQL("SELECT `key`, `value`, `value2`, `value3`, `expiration` FROM `characters_log` WHERE cid = ? AND `key` NOT LIKE 'BOSS_%' ORDER BY `key`", id);
    } else {
        listResult = cm.selectSQL("SELECT `key`, `value`, `value2`, `value3`, `expiration` FROM `accounts_log` WHERE accid = ? AND `key` NOT LIKE 'BOSS_%' ORDER BY `key`", id);
    }

    let result = [];

    for (let i = 0; i < listResult.size(); i++) {
        let row = listResult.get(i);
        let expiration = row.get("expiration");

        result.push({
            key: row.get("key"),
            value: row.get("value"),
            value2: row.get("value2"),
            value3: row.get("value3"),
            expiration: expiration,
            time: cm.getReadableTime(parseInt(expiration))
        });
    }

    return result;
}

function isNumeric(str) {
    return !isNaN(str) && str.trim() !== '';
}
