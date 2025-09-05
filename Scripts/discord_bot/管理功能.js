// 2025/04/29 - 2025/05/21
// Discord腳本 - 管理功能
// By Windy

let enable = true; // true = 開放 , false = 關閉
let messageEvent = null;

function onMessageReceived(event, content) {
    if (!enable) {
        cm.dispose();
        messageEvent = null;
        return;
    }
    if (cm.getPermissionLevel() < 1) {
        cm.dispose();
        messageEvent = null;
        return;
    }
    messageEvent = event;

    cm.sendPrivateMessage("👥️ 線上人數 **" + cm.numberWithCommas(cm.getRealOnlinePlayerCount()) + "** 人",
        cm.createPrimaryButton("Reload-Script", "📦 重新載入DC機器人腳本列表"),
        cm.createSuccessButton("Broadcast-With-Prefix", "📢 發送伺服器公告（藍）"),
        cm.createPrimaryButton("Only-Admin-Login", "🔐 管理員限定登入開關（目前：" + (cm.isOnlyAdminLogin() ? "🟢 開啟" : "🔴 關閉") + "）")
    );

    cm.sendPrivateMessage("",
        cm.createPrimaryButton("Shutdown", cm.hasShutdownSchedule() ? "🕒 修改關服剩餘分鐘數" : "📴 預約關服"),
        cm.createSuccessButton("Cancel-Shutdown", "🚫 取消關服"),
        cm.createPrimaryButton("Register-Account", "🆕 註冊帳號"),
        cm.createSuccessButton("Change-Name", "✏️ 改角色名稱"),
        cm.createPrimaryButton("Get-Character-Info", "🔍 取得角色資訊")
    );

    cm.sendPrivateMessage("",
        cm.createSuccessButton("Give-Money", "💰 發送楓幣"),
        cm.createSuccessButton("Give-Online-Money", "🌐 發送線上人楓幣"),
        cm.createPrimaryButton("Give-Pachinko", "🎰 發送小鋼珠"),
        cm.createPrimaryButton("Give-Online-Pachinko", "🌐 發送線上人小鋼珠")
    );

    cm.sendPrivateMessage("",
        cm.createSuccessButton("Give-Gash", "💳 發送 GASH 點"),
        cm.createSuccessButton("Give-Online-Gash", "🌐 發送線上人 GASH"),
        cm.createPrimaryButton("Give-MaplePoint", "🍁 發送楓葉點數"),
        cm.createPrimaryButton("Give-Online-MaplePoint", "🌐 發送線上人楓葉點數")
    );

    cm.sendPrivateMessage("",
        cm.createSuccessButton("Give-Item", "🎁 發送道具"),
        cm.createDangerButton("Give-Donate", "💎 發送贊助"),
        cm.createPrimaryButton("Give-GuildPoint", "🏅 發送公會點數")
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
        cm.createStringSelectMenu("ScriptMenu", menuMessage, "Open-Script-管理功能"),
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
        case "Reload-Script":
            if (cm.getPermissionLevel() < 1) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            cm.reloadScriptList();
            event.reply("📦 **腳本已重新載入成功！** Discord 腳本清單已更新。").queue();
            break;
        case "Broadcast-With-Prefix":
            if (cm.getPermissionLevel() < 2) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Broadcast-With-Prefix-Modal", "📢 發送公告", JSON.stringify([
                {
                    label: "公告內容",
                    id: "message",
                    style: "paragraph",
                    placeholder: "請輸入公告內容，例如：伺服器將於今晚維護。",
                    required: true
                }
            ]))).queue();
            break;
        case "Only-Admin-Login":
            if (cm.getPermissionLevel() < 7) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            cm.toggleAdminOnlyLogin();
            event.reply("🔐 **管理員限定登入已切換！** 目前狀態：" + (cm.isOnlyAdminLogin() ? "🟢 開啟" : "🔴 關閉") + "。").setEphemeral(true).queue();
            onMessageReceived(messageEvent, null);
            break;
        case "Shutdown":
            if (cm.getPermissionLevel() < 7) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Shutdown-Modal", "📴 關服操作", JSON.stringify([
                {
                    label: cm.hasShutdownSchedule() ? "修改關閉剩餘分鐘數" : "預約關閉分鐘數",
                    id: "minutes",
                    style: "short",
                    placeholder: "請輸入分鐘數（0 為立刻關閉）",
                    required: true
                }
            ]))).queue();
            break;
        case "Cancel-Shutdown":
            if (cm.getPermissionLevel() < 7) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            if (cm.hasShutdownSchedule()) {
                cm.cancelShutdown();
                event.reply("🚫 **預約關服已取消！**").queue();
                onMessageReceived(messageEvent, null);
            } else {
                event.reply("⚠️ **目前沒有已預約的關閉伺服器。**").queue();
            }
            break;
        case "Register-Account":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Register-Account-Modal", "🆕 註冊帳號", JSON.stringify([
                {
                    label: "帳號名稱",
                    id: "account",
                    style: "short",
                    placeholder: "請輸入帳號名稱",
                    minLength: 4,
                    maxLength: 15,
                    required: true
                },
                {
                    label: "密碼",
                    id: "password",
                    style: "short",
                    placeholder: "請輸入密碼",
                    required: true
                }
            ]))).queue();
            break;
        case "Change-Name":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Change-Name-Modal", "✏️ 改角色名稱", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    maxLength: 15,
                    required: true
                },
                {
                    label: "新名稱",
                    id: "newCharacterName",
                    style: "short",
                    placeholder: "請輸入新的角色名稱",
                    maxLength: 15,
                    required: true
                },
            ]))).queue();
            break;
        case "Get-Character-Info":
            if (cm.getPermissionLevel() < 1) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Get-Character-Info-Modal", "🔍 取得角色資訊", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    maxLength: 15,
                    required: true
                }
            ]))).queue();
            break;
        case "Give-Money":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Give-Money-Modal", "💰 發送楓幣", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                },
                {
                    label: "楓幣",
                    id: "money",
                    style: "short",
                    placeholder: "請輸入發送的數量",
                    required: true
                },
            ]))).queue();
            break;
        case "Give-Online-Money":
            if (cm.getPermissionLevel() < 5) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Give-Online-Money-Modal", "🌐 發送線上人楓幣", JSON.stringify([
                {
                    label: "楓幣",
                    id: "money",
                    style: "short",
                    placeholder: "發送數量",
                    required: true
                },
            ]))).queue();
            break;
        case "Give-Pachinko":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Give-Pachinko-Modal", "🎰 發送小鋼珠", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                },
                {
                    label: "小鋼珠",
                    id: "pachinko",
                    style: "short",
                    placeholder: "發送數量",
                    required: true
                },
            ]))).queue();
            break;
        case "Give-Online-Pachinko":
            if (cm.getPermissionLevel() < 5) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Give-Online-Pachinko-Modal", "🌐 發送線上人小鋼珠", JSON.stringify([
                {
                    label: "小鋼珠",
                    id: "pachinko",
                    style: "short",
                    placeholder: "發送數量",
                    required: true
                },
            ]))).queue();
            break;
        case "Give-Gash":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Give-Gash-Modal", "💳 發送 GASH 點", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                },
                {
                    label: "Gash",
                    id: "gash",
                    style: "short",
                    placeholder: "發送數量",
                    required: true
                },
            ]))).queue();
            break;
        case "Give-Online-Gash":
            if (cm.getPermissionLevel() < 5) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Give-Online-Gash-Modal", "🌐 發送線上人 GASH", JSON.stringify([
                {
                    label: "Gash",
                    id: "gash",
                    style: "short",
                    placeholder: "發送數量",
                    required: true
                },
            ]))).queue();
            break;
        case "Give-MaplePoint":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Give-MaplePoint-Modal", "🍁 發送楓葉點數", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                },
                {
                    label: "楓葉點數",
                    id: "maplePoint",
                    style: "short",
                    placeholder: "發送數量",
                    required: true
                },
            ]))).queue();
            break;
        case "Give-Online-MaplePoint":
            if (cm.getPermissionLevel() < 5) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Give-Online-MaplePoint-Modal", "🌐 發送線上人楓葉點數", JSON.stringify([
                {
                    label: "楓葉點數",
                    id: "maplePoint",
                    style: "short",
                    placeholder: "發送數量",
                    required: true
                },
            ]))).queue();
            break;
        case "Give-Item":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Give-Item-Modal", "🎁 發送道具", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                },
                {
                    label: "道具代碼",
                    id: "itemId",
                    style: "short",
                    placeholder: "代碼",
                    required: true
                },
                {
                    label: "道具數量",
                    id: "itemQuantity",
                    style: "short",
                    placeholder: "發送數量",
                    required: true
                },
                {
                    label: "道具可用時長",
                    id: "itemPeriod",
                    style: "short",
                    placeholder: "小時，-1為永久",
                    required: true
                },
            ]))).queue();
            break;
        case "Give-Donate":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Give-Donate-Modal", "💎 發送贊助", JSON.stringify([
                {
                    label: "帳號名稱",
                    id: "account",
                    style: "short",
                    placeholder: "請輸入帳號名稱",
                    required: true
                },
                {
                    label: "贊助點數",
                    id: "point",
                    style: "short",
                    placeholder: "發送數量",
                    required: true
                }
            ]))).queue();
            break;
        case "Give-GuildPoint":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Give-GuildPoint-Modal", "🏅 發送公會點數", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                },
                {
                    label: "公會點數",
                    id: "point",
                    style: "short",
                    placeholder: "發送數量",
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
        case "Broadcast-With-Prefix-Modal": {
            let message = event.getValue("message").getAsString();
            if (message.isEmpty()) {
                event.reply("❌ **操作失敗：必須輸入內容。").setEphemeral(true).queue();
            } else {
                event.reply("✅ **操作成功！**已發送公告: " + message).queue();
                cm.serverMessage(0, message);
            }
            break;
        }
        case "Shutdown-Modal": {
            let minutesInString = event.getValue("minutes").getAsString();
            if (!isNumeric(minutesInString) || parseInt(minutesInString) < 0) {
                event.reply("❌ **格式錯誤：請輸入有效的數字** 請重新點擊按鈕並輸入正確資料。").setEphemeral(true).queue();
                return;
            }
            let minutes = parseInt(minutesInString);
            if (cm.hasShutdownSchedule()) {
                cm.changeShutdownMinute(minutes);
                event.reply("✅ **修改成功！** 伺服器關閉剩餘時間已調整為：" + minutes + " 分鐘。").queue();
                onMessageReceived(messageEvent, null);
            } else {
                cm.scheduleShutdown(minutes);
                event.reply("✅ **操作成功！** 伺服器將在 " + minutes + " 分鐘後關閉。").queue();
                onMessageReceived(messageEvent, null);
            }
            break;
        }
        case "Register-Account-Modal": {
            let account = event.getValue("account").getAsString();
            let password = event.getValue("password").getAsString();
            let failureReason = cm.registerAccount(account, password);
            if (failureReason === "") {
                event.reply("🆕 **帳號註冊成功！**：`" + account + "`").queue();
            } else {
                event.reply("❌ **操作失敗**： " + failureReason).setEphemeral(true).queue();
            }
            break;
        }
        case "Get-Character-Info-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let characterId = cm.getCharacterIdByName(characterName);

            if (characterId === -1) {
                event.reply("❌ **操作失敗**：角色名稱 `" + characterName + "` 不存在。").setEphemeral(true).queue();
                return;
            }

            let character = cm.getChr(characterId);
            characterName = cm.getCharacterNameById(characterId);
            let accountName = cm.getCharacterAccountNameByCharacterId(characterId);
            let accountId = cm.getAccountIdByCharacterId(characterId);
            let characterGuildId = getCharacterGuildId(characterId);
            let characterLevel = cm.getCharacterLevelById(characterId);
            let characterGMLevel = getCharacterGMLevel(characterId);
            let characterReborn = cm.getCharacterRebornById(characterId);
            let characterMoney = getCharacterMoney(characterId);
            let characterStatDamage = getCharacterStatDamageValue(characterId);
            let characterJobId = cm.getCharacterJobById(characterId);
            let characterGender = cm.getCharacterGenderById(characterId);
            let characterGash = getCharacterGash(characterId);
            let characterMaplePoint = getCharacterMaplePoint(characterId);
            let characterPachinko = getCharacterPachinko(characterId);
            let characterIp = getCharacterIP(characterId);
            let characterMac = getCharacterMac(characterId);

            let characterOnline = (character != null);
            let guild = characterGuildId <= 0 ? null : cm.getGuild(characterGuildId);
            let genderString = characterGender === 0 ? "男" : characterGender === 1 ? "女" : "異常(" + characterGender + ")";

            let message = "🧾 **查詢結果如下**\n";

            if (guild != null) {
                message += "🏰 **公會：** `" + guild.getName() + "` (ID: `" + characterGuildId + "`)\n";
            }

            message +=
                "🌐 **IP 位址：** `" + (characterIp ? characterIp : "未知") + "`  " +
                "🔑 **MAC 位址：** `" + (characterMac ? characterMac : "未知") + "`\n" +

                "📡 **狀態：** " + (characterOnline ? "🟢 線上" : "🔴 離線") + "\n" +

                "👤 **角色：** `" + characterName + "` (ID: `" + characterId + "`)  " +
                "🧬 **性別：** `" + genderString + "`  " +
                "🎓 **職業代碼：** `" + characterJobId + "`  " +
                "🔰 **權限：** `" + characterGMLevel + "`\n" +

                "👨‍💻 **帳號：** `" + accountName + "` (ID: `" + accountId + "`)\n" +

                "📈 **等級：** `" + cm.numberWithCommas(characterLevel) + "`  " +
                "🔄 **轉生：** `" + cm.numberWithCommas(characterReborn) + "`\n" +

                "📊 **表功：** `" + cm.numberWithCommas(characterStatDamage) + "`\n" +

                "💰 **金錢：** `" + cm.numberWithCommas(characterMoney) + "`  " +
                "🎰 **小鋼珠：** `" + cm.numberWithCommas(characterPachinko) + "`\n" +

                "💎 **Gash：** `" + cm.numberWithCommas(characterGash) + "`  " +
                "🍁 **楓點：** `" + cm.numberWithCommas(characterMaplePoint) + "`\n";

            if (characterOnline) {
                let map = character.getMap();
                if (map != null) {
                    message += "🌍 **位置：** 頻道[" + map.getChannel() + "] " + map.getStreetName() + " - " + map.getMapName();
                }
            }

            event.reply(message).queue();
            onMessageReceived(messageEvent, null);
            break;
        }

        case "Give-Money-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let moneyInString = event.getValue("money").getAsString();

            if (!isNumeric(moneyInString)) {
                event.reply("❌ **操作失敗**：楓幣必須輸入數字。").setEphemeral(true).queue();
                return;
            } else {
                let character = cm.getChr(characterName);
                let characterId = -1;

                if (character != null) {
                    characterId = character.getId();
                    character.gainMeso(parseInt(moneyInString), true);

                    event.reply(
                        "💰 **發送成功！**\n" +
                        "👤 角色名稱：`" + character.getName() + "`\n" +
                        "📤 發送金額：`" + cm.numberWithCommas(parseInt(moneyInString)) + "` 楓幣\n" +
                        "💼 現有金額：`" + cm.numberWithCommas(getCharacterMoney(characterId)) + "` 楓幣"
                    ).queue();
                } else {
                    characterId = cm.getCharacterIdByName(characterName);
                    if (characterId !== -1) {
                        cm.executeSQL("UPDATE `characters` SET `meso` = ? WHERE `id` = ?;",
                            (getCharacterMoney(characterId) + parseInt(moneyInString)), characterId);

                        event.reply(
                            "💰 **發送成功！**\n" +
                            "👤 角色名稱：`" + characterName + "`\n" +
                            "📤 發送金額：`" + cm.numberWithCommas(parseInt(moneyInString)) + "` 楓幣\n" +
                            "💼 現有金額：`" + cm.numberWithCommas(getCharacterMoney(characterId)) + "` 楓幣"
                        ).queue();
                    } else {
                        event.reply("📛 **操作失敗**：角色名稱 `" + characterName + "` 不存在。").setEphemeral(true).queue();
                        return;
                    }
                }
            }
            onMessageReceived(messageEvent, null);
            break;
        }
        case "Change-Name-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let newCharacterName = event.getValue("newCharacterName").getAsString();
            if (cm.getCharacterIdByName(characterName) === -1) {
                event.reply("❌ **操作失敗**：找不到角色名稱 `" + characterName + "`，請確認是否輸入正確。").setEphemeral(true).queue();
                break;
            } else if (characterName.equals(newCharacterName)) {
                event.reply("⚠️ **操作無效**：新舊名稱相同，無需變更。").setEphemeral(true).queue();
                break;
            }
            let failureReason = cm.changeCharacterName(characterName, newCharacterName);
            if (failureReason === "") {
                event.reply("✏️ **角色名稱修改成功！** `" + characterName + "` ➜ `" + newCharacterName + "`").queue();
            } else {
                event.reply("❌ **操作失敗**：" + failureReason).setEphemeral(true).queue();
            }
            break;
        }
        case "Give-Online-Money-Modal": {
            let moneyInString = event.getValue("money").getAsString();

            if (!isNumeric(moneyInString)) {
                event.reply("❌ **操作失敗**：楓幣必須輸入數字。").setEphemeral(true).queue();
                return;
            } else {
                let count = 0;
                let sum = 0;
                let characterList = cm.getAllCharactersInThisServer();
                let iterator = characterList.iterator();

                while (iterator.hasNext()) {
                    let character = iterator.next();
                    if (character != null) {
                        character.gainMeso(parseInt(moneyInString), true);
                        count++;
                        sum += parseInt(moneyInString);
                    }
                }

                event.reply(
                    "📢 **線上楓幣發送成功！**\n" +
                    "👥 受益角色數：`" + count + "` 名\n" +
                    "📤 每人獲得：`" + cm.numberWithCommas(parseInt(moneyInString)) + "` 楓幣\n" +
                    "💰 總發送金額：`" + cm.numberWithCommas(sum) + "` 楓幣"
                ).queue();
            }
            onMessageReceived(messageEvent, null);
            break;
        }
        case "Give-Pachinko-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let pachinkoInString = event.getValue("pachinko").getAsString();

            if (!isNumeric(pachinkoInString)) {
                event.reply("❌ **操作失敗**：小鋼珠必須輸入數字。").setEphemeral(true).queue();
                return;
            } else {
                let character = cm.getChr(characterName);
                let characterId = -1;

                if (character != null) {
                    characterId = character.getId();
                    character.gainBean(parseInt(pachinkoInString));

                    event.reply(
                        "💰 **發送成功！**\n" +
                        "👤 角色名稱：`" + character.getName() + "`\n" +
                        "📤 發送金額：`" + cm.numberWithCommas(parseInt(pachinkoInString)) + "` 小鋼珠\n" +
                        "💼 現有金額：`" + cm.numberWithCommas(getCharacterPachinko(characterId)) + "` 小鋼珠"
                    ).queue();
                } else {
                    characterId = cm.getCharacterIdByName(characterName);
                    if (characterId !== -1) {
                        let accountId = cm.getAccountIdByCharacterId(characterId);
                        character = cm.getOnlineCharacterByAccountId(accountId);
                        if (character != null) {
                            character.gainBean(parseInt(pachinkoInString));
                        } else {
                            cm.executeSQL("UPDATE `accounts` SET `bean` = ? WHERE `id` = ?;",
                                (getCharacterPachinko(characterId) + parseInt(pachinkoInString)), characterId);
                        }
                        event.reply(
                            "💰 **發送成功！**\n" +
                            "👤 角色名稱：`" + characterName + "`\n" +
                            "📤 發送金額：`" + cm.numberWithCommas(parseInt(pachinkoInString)) + "` 小鋼珠\n" +
                            "💼 現有金額：`" + cm.numberWithCommas(getCharacterPachinko(characterId)) + "` 小鋼珠"
                        ).queue();
                    } else {
                        event.reply("📛 **操作失敗**：角色名稱 `" + characterName + "` 不存在。").setEphemeral(true).queue();
                    }
                }
            }
            onMessageReceived(messageEvent, null);
            break;
        }
        case "Give-Online-Pachinko-Modal": {
            let pachinkoInString = event.getValue("pachinko").getAsString();

            if (!isNumeric(pachinkoInString)) {
                event.reply("❌ **操作失敗**：小鋼珠必須輸入數字。").setEphemeral(true).queue();
                return;
            } else {
                let count = 0;
                let sum = 0;
                let characterList = cm.getAllCharactersInThisServer();
                let iterator = characterList.iterator();

                while (iterator.hasNext()) {
                    let character = iterator.next();
                    if (character != null) {
                        character.gainBean(parseInt(pachinkoInString));
                        count++;
                        sum += parseInt(pachinkoInString);
                    }
                }

                event.reply(
                    "📢 **線上小鋼珠發送成功！**\n" +
                    "👥 受益角色數：`" + count + "` 名\n" +
                    "📤 每人獲得：`" + cm.numberWithCommas(parseInt(pachinkoInString)) + "` 小鋼珠\n" +
                    "💰 總發送金額：`" + cm.numberWithCommas(sum) + "` 小鋼珠"
                ).queue();
            }
            onMessageReceived(messageEvent, null);
            break;
        }
        case "Give-Gash-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let gashInString = event.getValue("gash").getAsString();

            if (!isNumeric(gashInString)) {
                event.reply("❌ **操作失敗**：Gash必須輸入數字。").setEphemeral(true).queue();
                return;
            } else {
                let character = cm.getChr(characterName);
                let characterId = -1;

                if (character != null) {
                    characterId = character.getId();
                    character.gainCash(1, parseInt(gashInString));

                    event.reply(
                        "💰 **發送成功！**\n" +
                        "👤 角色名稱：`" + character.getName() + "`\n" +
                        "📤 發送金額：`" + cm.numberWithCommas(parseInt(gashInString)) + "` Gash\n" +
                        "💼 現有金額：`" + cm.numberWithCommas(getCharacterGash(characterId)) + "` Gash"
                    ).queue();
                } else {
                    characterId = cm.getCharacterIdByName(characterName);
                    if (characterId !== -1) {
                        let accountId = cm.getAccountIdByCharacterId(characterId);
                        character = cm.getOnlineCharacterByAccountId(accountId);
                        if (character != null) {
                            character.gainCash(1, parseInt(gashInString));
                        } else {
                            cm.executeSQL("UPDATE `accounts` SET `nxCredit` = ? WHERE `id` = ?;",
                                (getCharacterGash(characterId) + parseInt(gashInString)), characterId);
                        }
                        event.reply(
                            "💰 **發送成功！**\n" +
                            "👤 角色名稱：`" + characterName + "`\n" +
                            "📤 發送金額：`" + cm.numberWithCommas(parseInt(gashInString)) + "` Gash\n" +
                            "💼 現有金額：`" + cm.numberWithCommas(getCharacterGash(characterId)) + "` Gash"
                        ).queue();
                    } else {
                        event.reply("📛 **操作失敗**：角色名稱 `" + characterName + "` 不存在。").setEphemeral(true).queue();
                        return;
                    }
                }
            }
            onMessageReceived(messageEvent, null);
            break;
        }
        case "Give-Online-Gash-Modal": {
            let gashInString = event.getValue("gash").getAsString();

            if (!isNumeric(gashInString)) {
                event.reply("❌ **操作失敗**：Gash必須輸入數字。").setEphemeral(true).queue();
                return;
            } else {
                let count = 0;
                let sum = 0;
                let characterList = cm.getAllCharactersInThisServer();
                let iterator = characterList.iterator();

                while (iterator.hasNext()) {
                    let character = iterator.next();
                    if (character != null) {
                        character.gainCash(1, parseInt(gashInString));
                        count++;
                        sum += parseInt(gashInString);
                    }
                }

                event.reply(
                    "📢 **線上Gash發送成功！**\n" +
                    "👥 受益角色數：`" + count + "` 名\n" +
                    "📤 每人獲得：`" + cm.numberWithCommas(parseInt(gashInString)) + "` Gash\n" +
                    "💰 總發送金額：`" + cm.numberWithCommas(sum) + "` Gash"
                ).queue();
            }
            onMessageReceived(messageEvent, null);
            break;
        }
        case "Give-MaplePoint-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let maplePointInString = event.getValue("maplePoint").getAsString();

            if (!isNumeric(maplePointInString)) {
                event.reply("❌ **操作失敗**：楓葉點數必須輸入數字。").setEphemeral(true).queue();
                return;
            } else {
                let maplePoint = parseInt(maplePointInString);
                let character = cm.getChr(characterName);
                let characterId = -1;

                if (character != null) {
                    characterId = character.getId();
                    character.gainCash(2, maplePoint);

                    event.reply(
                        "💰 **發送成功！**\n" +
                        "👤 角色名稱：`" + character.getName() + "`\n" +
                        "📤 發送金額：`" + cm.numberWithCommas(maplePoint) + "` 楓葉點數\n" +
                        "💼 現有金額：`" + cm.numberWithCommas(getCharacterMaplePoint(characterId)) + "` 楓葉點數"
                    ).queue();
                } else {
                    characterId = cm.getCharacterIdByName(characterName);
                    if (characterId !== -1) {
                        let accountId = cm.getAccountIdByCharacterId(characterId);
                        character = cm.getOnlineCharacterByAccountId(accountId);
                        if (character != null) {
                            character.gainCash(2, maplePoint);
                        } else {
                            cm.executeSQL("UPDATE `accounts` SET `maplePoint` = `maplePoint` + ? WHERE `id` = ?;", maplePoint, characterId);
                        }
                        event.reply(
                            "💰 **發送成功！**\n" +
                            "👤 角色名稱：`" + characterName + "`\n" +
                            "📤 發送金額：`" + cm.numberWithCommas(maplePoint) + "` 楓葉點數\n" +
                            "💼 現有金額：`" + cm.numberWithCommas(getCharacterMaplePoint(characterId)) + "` 楓葉點數"
                        ).queue();
                    } else {
                        event.reply("📛 **操作失敗**：角色名稱 `" + characterName + "` 不存在。").setEphemeral(true).queue();
                        return;
                    }
                }
            }
            onMessageReceived(messageEvent, null);
            break;
        }
        case "Give-Online-MaplePoint-Modal": {
            let maplePointInString = event.getValue("maplePoint").getAsString();

            if (!isNumeric(maplePointInString)) {
                event.reply("❌ **操作失敗**：楓葉點數必須輸入數字。").setEphemeral(true).queue();
                return;
            } else {
                let maplePoint = parseInt(maplePointInString);
                let count = 0;
                let sum = 0;
                let characterList = cm.getAllCharactersInThisServer();
                let iterator = characterList.iterator();

                while (iterator.hasNext()) {
                    let character = iterator.next();
                    if (character != null) {
                        character.gainCash(2, maplePoint);
                        count++;
                        sum += maplePoint;
                    }
                }

                event.reply(
                    "📢 **線上楓葉點數發送成功！**\n" +
                    "👥 受益角色數：`" + count + "` 名\n" +
                    "📤 每人獲得：`" + cm.numberWithCommas(maplePoint) + "` 楓葉點數\n" +
                    "💰 總發送金額：`" + cm.numberWithCommas(sum) + "` 楓葉點數"
                ).queue();
            }
            onMessageReceived(messageEvent, null);
            break;
        }
        case "Give-Item-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let itemIdInString = event.getValue("itemId").getAsString();
            let itemQuantityInString = event.getValue("itemQuantity").getAsString();
            let itemPeriodInString = event.getValue("itemPeriod").getAsString();

            if (!isNumeric(itemIdInString)) {
                event.reply("❌ **操作失敗**：道具代碼必須輸入數字。").setEphemeral(true).queue();
                return;
            } else if (!isNumeric(itemQuantityInString)) {
                event.reply("❌ **操作失敗**：道具數量必須輸入數字。").setEphemeral(true).queue();
                return;
            } else if (!isNumeric(itemPeriodInString)) {
                event.reply("❌ **操作失敗**：道具持續時長必須輸入數字。").setEphemeral(true).queue();
                return;
            } else if (!cm.itemExists(parseInt(itemIdInString))) {
                event.reply("❌ **操作失敗**：道具代碼[" + itemIdInString + "]不存在。").setEphemeral(true).queue();
                return;
            } else {
                let character = cm.getChr(characterName);
                let characterId = -1;
                let itemId = parseInt(itemIdInString);
                let itemQuantity = parseInt(itemQuantityInString);
                let itemType = parseInt(itemId / 1000000);

                if (character != null && itemType !== 5) {
                    characterId = character.getId();
                    if (itemType === 1) {
                        for (let i = 0; i < itemQuantity; i++) {
                            let item = cm.getEquipById(itemId);
                            item.setExpiration(itemPeriodInString.equals("-1") ? -1 : (cm.getCurrentTimeMillis() + parseInt(itemPeriodInString) * 60 * 60 * 1000));
                            cm.addFromDrop(character.getClient(), item, true);
                        }
                    } else {
                        let item = cm.getNewItem(itemId, 1, itemQuantity);
                        item.setExpiration(itemPeriodInString.equals("-1") ? -1 : (cm.getCurrentTimeMillis() + parseInt(itemPeriodInString) * 60 * 60 * 1000));
                        cm.addFromDrop(character.getClient(), item, true);
                    }
                    event.reply(
                        "💰 **發送成功！**\n\n" +
                        "👤 **角色名稱：** `" + character.getName() + "`\n" +
                        "🎁 **道具名稱：** `" + cm.getItemName(itemId) + "(" + itemIdInString + ")`\n" +
                        "📦 **發送數量：** `" + itemQuantityInString + "`\n" +
                        "🎒 **當前背包數量：** `" + character.getItemQuantity(itemId, true) + "`\n" +
                        "⏳ **期限：** `" + (itemPeriodInString.equals("-1") ? "永久" : itemPeriodInString + " 小時") + "`"
                    ).queue();

                } else {
                    characterId = cm.getCharacterIdByName(characterName);
                    let itemList = cm.getNewArrayList();
                    let itemPeriod = parseInt(itemPeriodInString) * 60 * 60 * 1000; // 毫秒
                    if (itemType === 1 || itemType === 5) {
                        for (let i = 0; i < itemQuantity; i++) {
                            let itemInfo = cm.createCouponItemInfo(itemId, 1, itemPeriod);
                            itemList.add(itemInfo);
                        }
                    } else {
                        let itemInfo = cm.createCouponItemInfo(itemId, itemQuantity, itemPeriod);
                        itemList.add(itemInfo);
                    }

                    let code;
                    let itemName = cm.getItemName(itemId) + "(" + itemId + ")";
                    let periodText = itemPeriodInString === "-1" ? "永久" : itemPeriodInString + " 小時";

                    if (characterId !== -1) {
                        // 角色存在 ➜ 限定帳號才能使用
                        let accountId = cm.getAccountIdByCharacterId(characterId);
                        code = cm.createCouponCode(20, itemList, 0, 0, 0, 0, 0, true, accountId, true, 1, -1);
                        event.reply(
                            "🟢 **角色不在線上，或是發送內容為寵物。已為指定角色產生專屬序號！**\n\n" +
                            "👤 **角色名稱：** `" + characterName + "`\n" +
                            "🔐 **限定帳號領取**\n" +
                            "🔑 **兌換序號：** `" + code + "`\n" +
                            "🎁 **道具名稱：** `" + itemName + "`\n" +
                            "📦 **數量：** `" + itemQuantity + "`\n" +
                            "⏳ **期限：** `" + periodText + "`"
                        ).queue();
                    } else {
                        // 角色不存在 ➜ 通用序號
                        code = cm.createCouponCode(20, itemList, 0, 0, 0, 0, 0, false, -1, true, 1, -1);
                        event.reply(
                            "📛 **操作失敗**：找不到角色 `" + characterName + "`，改為產生 **通用序號**。\n\n" +
                            "🔑 **兌換序號：** `" + code + "`\n" +
                            "🎁 **道具名稱：** `" + itemName + "`\n" +
                            "📦 **數量：** `" + itemQuantity + "`\n" +
                            "⏳ **期限：** `" + periodText + "`"
                        ).queue();
                    }
                }

            }
            onMessageReceived(messageEvent, null);
            break;
        }
        case "Give-Donate-Modal": {
            let accountName = event.getValue("account").getAsString();
            let pointInString = event.getValue("point").getAsString();
            if (!isNumeric(pointInString)) {
                event.reply("❌ **操作失敗**：請輸入有效的贊助點數數字。").setEphemeral(true).queue();
                return;
            } else {
                let accountId = cm.getAccountIdByName(accountName);
                if (accountId === -1) {
                    event.reply("❌ **操作失敗**：帳號 `" + accountName + "` 不存在。").setEphemeral(true).queue();
                    return;
                } else {
                    let point = parseInt(pointInString);
                    let newTotal = point + getHyPay(accountName);
                    updateHyPay(accountName, newTotal);
                    event.reply(
                        "💎 **贊助點數發送成功！**\n\n" +
                        "👤 **帳號名稱：** `" + accountName + "`\n" +
                        "📤 **發送點數：** `" + cm.numberWithCommas(point) + "`\n" +
                        "💰 **總贊助點數：** `" + cm.numberWithCommas(newTotal) + "`"
                    ).queue();
                }
            }
            onMessageReceived(messageEvent, null);
            break;
        }
        case "Give-GuildPoint-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let pointInString = event.getValue("point").getAsString();

            if (!isNumeric(pointInString)) {
                event.reply("❌ **操作失敗**：請輸入有效的公會點數數字。").setEphemeral(true).queue();
                return;
            }

            let character = cm.getChr(characterName);
            let guildId = -1;

            if (character === null) {
                let characterId = cm.getCharacterIdByName(characterName);
                if (characterId === -1) {
                    event.reply("❌ **操作失敗**：角色 `" + characterName + "` 不存在。").setEphemeral(true).queue();
                    return;
                } else {
                    guildId = getCharacterGuildId(characterId);
                }
            } else {
                guildId = character.getGuildId();
            }

            if (guildId <= 0) {
                event.reply("❌ **操作失敗**：角色 `" + characterName + "` 沒有加入任何公會。").setEphemeral(true).queue();
                return;
            }

            let guild = cm.getGuild(guildId);
            if (guild == null) {
                event.reply("❌ **操作失敗**：無法找到公會，ID 為 `" + guildId + "`。").setEphemeral(true).queue();
                return;
            }

            let point = parseInt(pointInString);
            guild.gainGP(point, true);

            event.reply(
                "🏅 **公會點數發送成功！**\n" +
                "🏰 **公會名稱：** `" + guild.getName() + "`\n" +
                "👤 **角色名稱：** `" + characterName + "`\n" +
                "📤 **發送點數：** `" + cm.numberWithCommas(point) + "`\n" +
                "📊 **目前總點數：** `" + cm.numberWithCommas(guild.getGP()) + "`"
            ).queue();

            onMessageReceived(messageEvent, null);
            break;
        }
        default:
            event.reply("對話已結束").queue();
            cm.dispose();
            messageEvent = null;
            return;
    }
}

function getCharacterMoney(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getMeso();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `meso` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("meso"));
    }
    return result;
}

function getCharacterStatDamageValue(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getStatDamageValue();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `stat_damage_value` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("stat_damage_value"));
    }
    return result;
}

function getCharacterGuildId(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getGuildId();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `guildid` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("guildid"));
    }
    return result;
}

function getCharacterGMLevel(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getGMLevel();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `gm` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("gm"));
    }
    return result;
}

function getCharacterGash(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getCSPoints(1);
    }
    let accountId = cm.getAccountIdByCharacterId(characterId);
    character = cm.getOnlineCharacterByAccountId(accountId);
    if (character != null) {
        return character.getCSPoints(1);
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `nxCredit` FROM `accounts` WHERE id = ?", accountId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("nxCredit"));
    }
    return result;
}

function getCharacterMaplePoint(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getCSPoints(2);
    }
    let accountId = cm.getAccountIdByCharacterId(characterId);
    character = cm.getOnlineCharacterByAccountId(accountId);
    if (character != null) {
        return character.getCSPoints(2);
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `maplePoint` FROM `accounts` WHERE id = ?", accountId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("maplePoint"));
    }
    return result;
}

function getCharacterPachinko(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getBean();
    }
    let accountId = cm.getAccountIdByCharacterId(characterId);
    character = cm.getOnlineCharacterByAccountId(accountId);
    if (character != null) {
        return character.getBean();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `bean` FROM `accounts` WHERE id = ?", accountId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("bean"));
    }
    return result;
}

function getCharacterIP(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getClient().getSessionIP();
    }
    let accountId = cm.getAccountIdByCharacterId(characterId);
    character = cm.getOnlineCharacterByAccountId(accountId);
    if (character != null) {
        return character.getClient().getSessionIP();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `last_session_ip` FROM `accounts` WHERE id = ?", accountId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = mapResult.get("last_session_ip");
    }
    return result;
}

function getCharacterMac(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getClient().getMacs();
    }
    let accountId = cm.getAccountIdByCharacterId(characterId);
    character = cm.getOnlineCharacterByAccountId(accountId);
    if (character != null) {
        return character.getClient().getMacs();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `macs` FROM `accounts` WHERE id = ?", accountId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = mapResult.get("macs");
    }
    return result;
}

function getHyPay(accountName) {
    let pay = 0;
    let listResult = cm.selectSQL("SELECT pay FROM hypay WHERE accname = ?", accountName); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        pay = parseInt(mapResult.get("pay"));
    }
    return pay;
}

function updateHyPay(accountName, newPay) {
    cm.executeSQL("UPDATE hypay SET pay = ? WHERE accname = ?", newPay, accountName);
}

function isNumeric(str) {
    return !isNaN(str) && str.trim() !== '';
}
