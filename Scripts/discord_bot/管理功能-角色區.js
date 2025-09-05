// 2025/05/21 - 2025/05/24
// Discord腳本 - 管理功能-角色區
// By Windy

let enable = true; // true = 開放 , false = 關閉
let messageEvent = null;
let characterId = -1;
let currentPage = 0;
let maxStatLimit = 32767; // 四屬最大值限制
let maxPopularityLimit = 30000; // 名聲最大/小值限制

function sendMenuMessage(event, page) {
    let character = cm.getChr(characterId);
    let characterName = cm.getCharacterNameById(characterId);
    let accountName = cm.getCharacterAccountNameByCharacterId(characterId);
    let accountId = cm.getAccountIdByCharacterId(characterId);
    let characterGuildId = getCharacterGuildId(characterId);
    let characterLevel = cm.getCharacterLevelById(characterId);
    let characterGMLevel = getCharacterGMLevel(characterId);
    let characterFieldId = getCharacterFieldId(characterId);
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

    let fieldString;
    let map = !characterOnline ? null : character.getMap();
    if (map != null) {
        fieldString = "`頻道[" + map.getChannel() + "] " + map.getStreetName() + " - " + map.getMapName() + "` (ID: `" + characterFieldId + "`)";
    } else {
        fieldString = "`" + cm.getMapName(characterFieldId) + "` (ID: `" + characterFieldId + "`)"
    }

    let message = "";

    if (guild != null) {
        message += "🏰 **公會：** `" + guild.getName() + "` (ID: `" + characterGuildId + "`)\n";
    }

    message +=
        "🌐 **IP 位址：** `" + (characterIp ? characterIp : "未知") + "`  " +
        "🔑 **MAC 位址：** `" + (characterMac ? characterMac : "未知") + "`\n" +

        "📡 **狀態：** " + (characterOnline ? "🟢 線上" : "🔴 離線") + "\n" +

        "🌍 **地圖：** " + fieldString + "\n" +

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

    if (event != null) {
        event.deferReply(true).complete();
        event.getHook().sendMessage(message).complete();
    } else {
        cm.sendPrivateMessage(message);
    }

    switch (page) {
        case 0:
            cm.sendPrivateMessage("",
                cm.createSuccessButton("Set-Name", "👤 改名稱"),
                cm.createPrimaryButton("Set-Level", "📈 改等級"),
                cm.createSuccessButton("Set-Reborn", "🔄 改轉生"),
                cm.createPrimaryButton("Set-Money", "💰 改楓幣"),
                cm.createSuccessButton("Set-Field", "🗺️ 改地圖")
            );

            cm.sendPrivateMessage("",
                cm.createSuccessButton("Set-Inventory-Equip-Slot", "🛡️ 改裝備欄位 (" + cm.getCharacterSlotLimit(characterName, 1) + "格)"),
                cm.createPrimaryButton("Set-Inventory-Use-Slot", "💊 改消耗欄位 (" + cm.getCharacterSlotLimit(characterName, 2) + "格)"),
                cm.createSuccessButton("Set-Inventory-Setup-Slot", "🎀 改裝飾欄位 (" + cm.getCharacterSlotLimit(characterName, 3) + "格)"),
                cm.createPrimaryButton("Set-Inventory-Etc-Slot", "📦 改其它欄位 (" + cm.getCharacterSlotLimit(characterName, 4) + "格)")
            );

            cm.sendPrivateMessage("",
                cm.createSuccessButton("Set-Gash", "💎 改Gash"),
                cm.createPrimaryButton("Set-MaplePoint", "🍁 改楓葉點數"),
                cm.createSuccessButton("Set-Pachinko", "🎰 改小鋼珠")
            );

            cm.sendPrivateMessage("",
                cm.createPrimaryButton("Get-Inventory-Item-Quantity", "🔍 查看背包指定道具數量"),
                cm.createSuccessButton("Give-Inventory-Item", "🎁 給予道具"),
                cm.createDangerButton("Remove-Inventory-Item", "🗑️ 刪除單一背包道具"),
                cm.createDangerButton("Remove-Inventory-All-Item-Id", "🧹 刪除背包所有指定道具")
            );

            break;
        case 1:
            cm.sendPrivateMessage("",
                cm.createPrimaryButton("Reset-Stat", "🧬 重置能力值"),
            );

            cm.sendPrivateMessage("",
                cm.createPrimaryButton("Set-Ability-Point", "🧮 改能力點"),
                cm.createSuccessButton("Set-Str", "💪 改力量"),
                cm.createPrimaryButton("Set-Dex", "🏃 改敏捷"),
                cm.createSuccessButton("Set-Int", "🧠 改智力"),
                cm.createPrimaryButton("Set-Luk", "🍀 改幸運"),
            );

            cm.sendPrivateMessage("",
                cm.createPrimaryButton("Set-Popularity", "🌟 改名聲"),
                cm.createSuccessButton("Set-Hair", "💇 改髮型"),
                cm.createPrimaryButton("Set-Face", "😊 改臉型"),
            );

            break;
    }

    // 翻頁按鈕區
    let pageButtons = [];
    if (page > 0) {
        pageButtons.push(cm.createPrimaryButton("Page-Previous-" + (page - 1), "⬅️ 上一頁"));
    }
    if (page < 1) { // 若有更多頁可改成 > 1
        pageButtons.push(cm.createPrimaryButton("Page-Next-" + (page + 1), "➡️ 下一頁"));
    }
    pageButtons.push(cm.createSuccessButton("Refresh", "🔄 刷新角色資訊"));
    pageButtons.push(cm.createSuccessButton("Get-Character-Id", "👤 切換角色資訊"));
    pageButtons.push(cm.createDangerButton("Dispose", "❌ 結束對話"));

    let menuMessage = "";
    menuMessage += "🛠️ 管理主頁區::Open-Script-管理功能###";
    menuMessage += "👤 管理角色區::Open-Script-管理功能-角色區###";
    menuMessage += "🔐 封鎖管理區::Open-Script-管理功能-封鎖區###";
    menuMessage += "📄 日誌管理區::Open-Script-管理功能-Log區###";
    menuMessage += "🧰 修復異常區::Open-Script-管理功能-修復區###";
    menuMessage += "🔑 商城序號區::Open-Script-管理功能-序號區###";

    cm.sendPrivateMessage("", cm.createStringSelectMenu("ScriptMenu", menuMessage, "Open-Script-管理功能-角色區"), ...pageButtons);
}

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

    if (characterId === -1) {
        cm.sendPrivateMessage("輸入角色名稱後可以開始操作", cm.createSuccessButton("Get-Character-Id", "🔎 輸入角色名稱"));
    } else {
        currentPage = 0;
        sendMenuMessage(null, 0);
    }
}

function onButtonInteraction(event, buttonId, buttonText) {
    if (cm.getPermissionLevel() < 1) {
        cm.dispose();
        messageEvent = null;
        return;
    }

    switch (buttonId) {
        case "Get-Character-Id":
            if (cm.getPermissionLevel() < 1) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Get-Character-Id-Modal", "🔎 取得操作角色", JSON.stringify([
                {
                    label: "角色名稱",
                    id: "characterName",
                    style: "short",
                    placeholder: "請輸入角色名稱",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Name":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Name-Modal", "改角色名稱", JSON.stringify([
                {
                    label: "新角色名稱",
                    id: "characterName",
                    style: "short",
                    defaultValue: cm.getCharacterNameById(characterId),
                    placeholder: "請輸入新角色名稱",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Level":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Level-Modal", "改角色等級", JSON.stringify([
                {
                    label: "新角色等級",
                    id: "level",
                    style: "short",
                    defaultValue: cm.getCharacterLevelById(characterId),
                    placeholder: "請輸入新角色等級",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Reborn":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Reborn-Modal", "改角色轉生次數", JSON.stringify([
                {
                    label: "新角色轉生次數",
                    id: "reborn",
                    style: "short",
                    defaultValue: cm.getCharacterRebornById(characterId),
                    placeholder: "請輸入新角色轉生次數",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Money":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Money-Modal", "改角色金錢", JSON.stringify([
                {
                    label: "新楓幣數量",
                    id: "money",
                    style: "short",
                    defaultValue: getCharacterMoney(characterId),
                    placeholder: "請輸入新楓幣數量",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Field": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").setEphemeral(true).queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Field-Modal", "地圖代碼", JSON.stringify([
                {
                    label: "地圖代碼",
                    id: "fieldId",
                    style: "short",
                    defaultValue: getCharacterFieldId(characterId),
                    placeholder: "要傳送的地圖代碼，如: 910000000",
                    required: true
                }
            ]))).queue();
            break;
        }
        case "Set-Inventory-Equip-Slot":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Inventory-Equip-Slot-Modal", "改`裝備`欄位數量", JSON.stringify([
                {
                    label: "新欄位數量",
                    id: "quantity",
                    style: "short",
                    defaultValue: cm.getCharacterSlotLimit(cm.getCharacterNameById(characterId), 1),
                    placeholder: "請輸入新欄位數量",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Inventory-Use-Slot":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Inventory-Use-Slot-Modal", "改`消耗`欄位數量", JSON.stringify([
                {
                    label: "新欄位數量",
                    id: "quantity",
                    style: "short",
                    defaultValue: cm.getCharacterSlotLimit(cm.getCharacterNameById(characterId), 2),
                    placeholder: "請輸入新欄位數量",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Inventory-Setup-Slot":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Inventory-Setup-Slot-Modal", "改`消耗`欄位數量", JSON.stringify([
                {
                    label: "新欄位數量",
                    id: "quantity",
                    style: "short",
                    defaultValue: cm.getCharacterSlotLimit(cm.getCharacterNameById(characterId), 3),
                    placeholder: "請輸入新欄位數量",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Inventory-Etc-Slot":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Inventory-Etc-Slot-Modal", "改`其它`欄位數量", JSON.stringify([
                {
                    label: "新欄位數量",
                    id: "quantity",
                    style: "short",
                    defaultValue: cm.getCharacterSlotLimit(cm.getCharacterNameById(characterId), 4),
                    placeholder: "請輸入新欄位數量",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Gash":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Gash-Modal", "改角色Gash", JSON.stringify([
                {
                    label: "新Gash數量",
                    id: "point",
                    style: "short",
                    defaultValue: getCharacterGash(characterId),
                    placeholder: "請輸入新Gash數量",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-MaplePoint":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-MaplePoint-Modal", "改角色楓葉點數", JSON.stringify([
                {
                    label: "新楓葉點數數量",
                    id: "point",
                    style: "short",
                    defaultValue: getCharacterMaplePoint(characterId),
                    placeholder: "請輸入新楓葉點數數量",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Pachinko":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Pachinko-Modal", "改角色小鋼珠", JSON.stringify([
                {
                    label: "新小鋼珠數量",
                    id: "point",
                    style: "short",
                    defaultValue: getCharacterPachinko(characterId),
                    placeholder: "請輸入新小鋼珠數量",
                    required: true
                }
            ]))).queue();
            break;
        case "Get-Inventory-Item-Quantity":
            if (cm.getPermissionLevel() < 1) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Get-Inventory-Item-Quantity-Modal", "查詢背包道具數量", JSON.stringify([
                {
                    label: "道具代碼",
                    id: "itemId",
                    style: "short",
                    placeholder: "要查詢道具代碼，如: 2450000",
                    required: true
                }
            ]))).queue();
            break;
        case "Give-Inventory-Item":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Give-Inventory-Item-Modal", "發送道具", JSON.stringify([
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
        case "Remove-Inventory-Item":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Remove-Inventory-Item-Modal", "刪除單一背包道具", JSON.stringify([
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
                    placeholder: "刪除數量",
                    required: true
                }
            ]))).queue();
            break;
        case "Remove-Inventory-All-Item-Id":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Remove-Inventory-All-Item-Id-Modal", "刪除背包所有指定道具", JSON.stringify([
                {
                    label: "道具代碼",
                    id: "itemId",
                    style: "short",
                    placeholder: "代碼",
                    required: true
                }
            ]))).queue();
            break;
        case "Reset-Stat": {
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").setEphemeral(true).queue();
                return;
            }

            let currentAbilityPoint = getCharacterAbilityPoint(characterId)
            let currentStr = getCharacterStr(characterId)
            let currentDex = getCharacterDex(characterId)
            let currentInt = getCharacterInt(characterId)
            let currentLuk = getCharacterLuk(characterId)
            let newAbilityPoint = (currentAbilityPoint + (currentStr - 4) + (currentDex - 4) + (currentInt - 4) + (currentLuk - 4));

            let character = cm.getChr(characterId);
            if (character != null) {
                character.changeStrDexIntLuk(4, 4, 4, 4, newAbilityPoint, false);
            } else {
                cm.executeSQL("UPDATE characters SET `str` = ?, `dex` = ?, `int` = ?, `luk` = ?, `ap` = ? WHERE id = ?", 4, 4, 4, 4, newAbilityPoint, characterId);
            }
            event.reply("✅ 已成功重置能力值，目前可分配能力點:`" + cm.numberWithCommas(newAbilityPoint) + "` 原始四屬: " + cm.numberWithCommas(currentStr) + "/" + cm.numberWithCommas(currentDex) + "/" + cm.numberWithCommas(currentInt) + "/" + cm.numberWithCommas(currentLuk) + " 原始能力點:`" + cm.numberWithCommas(currentAbilityPoint) + "`！").queue();
            break;
        }
        case "Set-Ability-Point":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Ability-Point-Modal", "改角色可分配能力點", JSON.stringify([
                {
                    label: "新能力點",
                    id: "value",
                    style: "short",
                    defaultValue: getCharacterAbilityPoint(characterId),
                    placeholder: "請輸入新能力點",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Str":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Str-Modal", "改角色力量", JSON.stringify([
                {
                    label: "新屬性值",
                    id: "value",
                    style: "short",
                    defaultValue: getCharacterStr(characterId),
                    placeholder: "請輸入新屬性值",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Dex":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Dex-Modal", "改角色敏捷", JSON.stringify([
                {
                    label: "新屬性值",
                    id: "value",
                    style: "short",
                    defaultValue: getCharacterDex(characterId),
                    placeholder: "請輸入新屬性值",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Int":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Int-Modal", "改角色智力", JSON.stringify([
                {
                    label: "新屬性值",
                    id: "value",
                    style: "short",
                    defaultValue: getCharacterInt(characterId),
                    placeholder: "請輸入新屬性值",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Luk":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Luk-Modal", "改角色幸運", JSON.stringify([
                {
                    label: "新屬性值",
                    id: "value",
                    style: "short",
                    defaultValue: getCharacterLuk(characterId),
                    placeholder: "請輸入新屬性值",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Popularity":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Popularity-Modal", "改角色名聲", JSON.stringify([
                {
                    label: "新名聲",
                    id: "value",
                    style: "short",
                    defaultValue: getCharacterPopularity(characterId),
                    placeholder: "請輸入新名聲值",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Hair":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Hair-Modal", "改角色髮型", JSON.stringify([
                {
                    label: "新髮型",
                    id: "value",
                    style: "short",
                    defaultValue: getCharacterHair(characterId),
                    placeholder: "請輸入新髮型代碼",
                    required: true
                }
            ]))).queue();
            break;
        case "Set-Face":
            if (cm.getPermissionLevel() < 4) {
                event.reply("❌ 權限不足").queue();
                return;
            }
            event.replyModal(cm.createModal("Set-Face-Modal", "改角色臉型", JSON.stringify([
                {
                    label: "新臉型",
                    id: "value",
                    style: "short",
                    defaultValue: getCharacterFace(characterId),
                    placeholder: "請輸入新臉型代碼",
                    required: true
                }
            ]))).queue();
            break;
        case "Refresh":
            sendMenuMessage(event, currentPage);
            break;
        case "Dispose":
        default:
            if (buttonId.startsWith("Page-Previous-") || buttonId.startsWith("Page-Next-")) {
                let parts = buttonId.split("-");
                let page = parseInt(parts[2]); // e.g., Page-Next-1 → 1
                currentPage = page;
                sendMenuMessage(event, page);
            } else {
                event.reply("對話已結束").queue();
                cm.dispose();
                messageEvent = null;
            }
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
        case "Get-Character-Id-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let character = cm.getChr(characterName);
            let localCharacterId = (character != null) ? character.getId() : cm.getCharacterIdByName(characterName);
            if (localCharacterId === -1) {
                event.reply("📛 **操作失敗**：角色名稱 `" + characterName + "` 不存在。").setEphemeral(true).queue();
            } else {
                characterId = localCharacterId;
                sendMenuMessage(event, currentPage);
            }
            break;
        }
        case "Set-Name-Modal": {
            let characterName = event.getValue("characterName").getAsString();
            let originalCharacterName = cm.getCharacterNameById(characterId);
            if (characterName.equals(originalCharacterName)) {
                event.reply("⚠️ **操作無效**：新舊名稱相同，無需變更。").setEphemeral(true).queue();
                break;
            }
            let failureReason = cm.changeCharacterName(originalCharacterName, characterName);
            if (failureReason === "") {
                event.reply("✏️ **角色名稱修改成功！** `" + originalCharacterName + "` ➜ `" + characterName + "`").queue();
            } else {
                event.reply("❌ **操作失敗**：" + failureReason).setEphemeral(true).queue();
            }
            break;
        }
        case "Set-Level-Modal": {
            let levelInString = event.getValue("level").getAsString();
            if (!isNumeric(levelInString)) {
                event.reply("❌ **操作失敗**：等級必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let originalLevel = cm.getCharacterLevelById(characterId);
            let level = parseInt(levelInString);

            if (originalLevel === level) {
                event.reply("⚠️ **操作無效**：新舊等級相同，無需變更。").setEphemeral(true).queue();
                break;
            }

            let character = cm.getChr(characterId);
            if (character != null) {
                character.changeLevel(level);
            } else {
                cm.executeSQL("UPDATE `characters` SET `level` = ? WHERE `id` = ?;", level, characterId);
                cm.removeCharacterCacheInfo(characterId);
            }
            event.reply("📈 **角色等級修改成功！** `" + cm.numberWithCommas(originalLevel) + "` ➜ `" + cm.numberWithCommas(level) + "`").queue();
            break;
        }
        case "Set-Reborn-Modal": {
            let rebornInString = event.getValue("reborn").getAsString();
            if (!isNumeric(rebornInString)) {
                event.reply("❌ **操作失敗**：轉生次數必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let originalReborn = cm.getCharacterRebornById(characterId);
            let reborn = parseInt(rebornInString);

            if (originalReborn === reborn) {
                event.reply("⚠️ **操作無效**：新舊轉生次數相同，無需變更。").setEphemeral(true).queue();
                break;
            }

            let character = cm.getChr(characterId);
            if (character != null) {
                character.setReborns(reborn);
            } else {
                cm.executeSQL("UPDATE `characters` SET `reborns` = ? WHERE `id` = ?;", reborn, characterId);
                cm.removeCharacterCacheInfo(characterId);
            }
            event.reply("🔄 **角色轉生次數修改成功！** `" + cm.numberWithCommas(originalReborn) + "` ➜ `" + cm.numberWithCommas(reborn) + "`").queue();
            break;
        }
        case "Set-Money-Modal": {
            let moneyInString = event.getValue("money").getAsString();
            if (!isNumeric(moneyInString)) {
                event.reply("❌ **操作失敗**：楓幣數量必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let originalMoney = getCharacterMoney(characterId);
            let money = parseInt(moneyInString);

            if (originalMoney === money) {
                event.reply("⚠️ **操作無效**：新舊楓幣數量相同，無需變更。").setEphemeral(true).queue();
                break;
            }

            let character = cm.getChr(characterId);
            if (character != null) {
                character.setMeso(money, true);
            } else {
                cm.executeSQL("UPDATE `characters` SET `meso` = ? WHERE `id` = ?;", money, characterId);
            }
            event.reply("💰 **角色楓幣數量修改成功！** `" + cm.numberWithCommas(originalMoney) + "` ➜ `" + cm.numberWithCommas(money) + "`").queue();
            break;
        }

        case "Set-Field-Modal": {
            let fieldIdInString = event.getValue("fieldId").getAsString();
            if (!isNumeric(fieldIdInString)) {
                event.reply("❌ **操作失敗**：地圖代碼必須輸入數字。").setEphemeral(true).queue();
                return;
            }

            let originalFieldId = getCharacterFieldId(characterId);
            let fieldId = parseInt(fieldIdInString);

            if (originalFieldId === fieldId) {
                event.reply("⚠️ **操作無效**：新舊地圖代碼相同，無需變更。").setEphemeral(true).queue();
                return;
            }

            if (cm.getMap(cm.getChannelServer(0, 1), fieldId) == null) {
                event.reply("❌ **操作失敗**：地圖代碼不存在: " + fieldId).setEphemeral(true).queue();
                return;
            }

            let character = cm.getChr(characterId);

            if (character != null) {
                character.changeMap(fieldId, 0);
            } else {
                cm.executeSQL("UPDATE `characters` SET `map` = ? WHERE `id` = ?;", fieldId, characterId);
            }

            event.reply("✏️ **地圖修改成功！** `" + cm.getMapName(originalFieldId) + "(" + originalFieldId + ")` ➜ `" + cm.getMapName(fieldId) + "(" + fieldId + ")" + "`").queue();
            break;
        }
        case "Set-Inventory-Equip-Slot-Modal": {
            let quantityInString = event.getValue("quantity").getAsString();
            if (!isNumeric(quantityInString)) {
                event.reply("❌ **操作失敗**：欄位數量必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let slotType = 1;
            let originalQuantity = cm.getCharacterSlotLimit(cm.getCharacterNameById(characterId), slotType);
            let quantity = parseInt(quantityInString);

            if (originalQuantity === quantity) {
                event.reply("⚠️ **操作無效**：新舊欄位數量相同，無需變更。").setEphemeral(true).queue();
                break;
            }

            let failureReason = cm.setCharacterSlotLimit(cm.getCharacterNameById(characterId), slotType, quantity);
            if (failureReason === "") {
                event.reply("✏️ **裝備欄位修改成功！** `" + originalQuantity + "` ➜ `" + quantity + "`").queue();
            } else {
                event.reply("❌ **操作失敗**：" + failureReason).setEphemeral(true).queue();
            }
            break;
        }
        case "Set-Inventory-Use-Slot-Modal": {
            let quantityInString = event.getValue("quantity").getAsString();
            if (!isNumeric(quantityInString)) {
                event.reply("❌ **操作失敗**：欄位數量必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let slotType = 2;
            let originalQuantity = cm.getCharacterSlotLimit(cm.getCharacterNameById(characterId), slotType);
            let quantity = parseInt(quantityInString);

            if (originalQuantity === quantity) {
                event.reply("⚠️ **操作無效**：新舊欄位數量相同，無需變更。").setEphemeral(true).queue();
                break;
            }

            let failureReason = cm.setCharacterSlotLimit(cm.getCharacterNameById(characterId), slotType, quantity);
            if (failureReason === "") {
                event.reply("✏️ **消耗欄位修改成功！** `" + originalQuantity + "` ➜ `" + quantity + "`").queue();
            } else {
                event.reply("❌ **操作失敗**：" + failureReason).setEphemeral(true).queue();
            }
            break;
        }
        case "Set-Inventory-Setup-Slot-Modal": {
            let quantityInString = event.getValue("quantity").getAsString();
            if (!isNumeric(quantityInString)) {
                event.reply("❌ **操作失敗**：欄位數量必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let slotType = 3;
            let originalQuantity = cm.getCharacterSlotLimit(cm.getCharacterNameById(characterId), slotType);
            let quantity = parseInt(quantityInString);

            if (originalQuantity === quantity) {
                event.reply("⚠️ **操作無效**：新舊欄位數量相同，無需變更。").setEphemeral(true).queue();
                break;
            }

            let failureReason = cm.setCharacterSlotLimit(cm.getCharacterNameById(characterId), slotType, quantity);
            if (failureReason === "") {
                event.reply("✏️ **裝飾欄位修改成功！** `" + originalQuantity + "` ➜ `" + quantity + "`").queue();
            } else {
                event.reply("❌ **操作失敗**：" + failureReason).setEphemeral(true).queue();
            }
            break;
        }
        case "Set-Inventory-Etc-Slot-Modal": {
            let quantityInString = event.getValue("quantity").getAsString();
            if (!isNumeric(quantityInString)) {
                event.reply("❌ **操作失敗**：欄位數量必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let slotType = 4;
            let originalQuantity = cm.getCharacterSlotLimit(cm.getCharacterNameById(characterId), slotType);
            let quantity = parseInt(quantityInString);

            if (originalQuantity === quantity) {
                event.reply("⚠️ **操作無效**：新舊欄位數量相同，無需變更。").setEphemeral(true).queue();
                break;
            }

            let failureReason = cm.setCharacterSlotLimit(cm.getCharacterNameById(characterId), slotType, quantity);
            if (failureReason === "") {
                event.reply("✏️ **其它欄位修改成功！** `" + originalQuantity + "` ➜ `" + quantity + "`").queue();
            } else {
                event.reply("❌ **操作失敗**：" + failureReason).setEphemeral(true).queue();
            }
            break;
        }
        case "Set-Gash-Modal": {
            let pointInString = event.getValue("point").getAsString();
            if (!isNumeric(pointInString)) {
                event.reply("❌ **操作失敗**：數量必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let originalPoint = getCharacterGash(characterId);
            let point = parseInt(pointInString);

            if (originalPoint === point) {
                event.reply("⚠️ **操作無效**：新舊Gash數量相同，無需變更。").setEphemeral(true).queue();
                break;
            }

            let character = cm.getChr(characterId);
            if (character != null) {
                character.setCash(1, point);
            } else {
                let accountId = cm.getAccountIdByCharacterId(characterId);
                character = cm.getOnlineCharacterByAccountId(accountId);
                if (character != null) {
                    character.setCash(1, point);
                } else {
                    cm.executeSQL("UPDATE `accounts` SET `nxCredit` = ? WHERE `id` = ?;", point, accountId);
                }
            }
            event.reply("✏️ **Gash修改成功！** `" + originalPoint + "` ➜ `" + point + "`").queue();
            break;
        }
        case "Set-MaplePoint-Modal": {
            let pointInString = event.getValue("point").getAsString();
            if (!isNumeric(pointInString)) {
                event.reply("❌ **操作失敗**：數量必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let originalPoint = getCharacterMaplePoint(characterId);
            let point = parseInt(pointInString);

            if (originalPoint === point) {
                event.reply("⚠️ **操作無效**：新舊楓葉點數數量相同，無需變更。").setEphemeral(true).queue();
                break;
            }

            let character = cm.getChr(characterId);
            if (character != null) {
                character.setCash(2, point);
            } else {
                let accountId = cm.getAccountIdByCharacterId(characterId);
                character = cm.getOnlineCharacterByAccountId(accountId);
                if (character != null) {
                    character.setCash(2, point);
                } else {
                    cm.executeSQL("UPDATE `accounts` SET `maplePoint` = ? WHERE `id` = ?;", point, accountId);
                }
            }
            event.reply("✏️ **楓葉點數修改成功！** `" + originalPoint + "` ➜ `" + point + "`").queue();
            break;
        }
        case "Set-Pachinko-Modal": {
            let pointInString = event.getValue("point").getAsString();
            if (!isNumeric(pointInString)) {
                event.reply("❌ **操作失敗**：數量必須輸入數字。").setEphemeral(true).queue();
                return;
            }
            let originalPoint = getCharacterPachinko(characterId);
            let point = parseInt(pointInString);

            if (originalPoint === point) {
                event.reply("⚠️ **操作無效**：新舊小鋼珠數量相同，無需變更。").setEphemeral(true).queue();
                break;
            }

            let character = cm.getChr(characterId);
            if (character != null) {
                character.setBean(point);
                character.updateBean();
            } else {
                let accountId = cm.getAccountIdByCharacterId(characterId);
                character = cm.getOnlineCharacterByAccountId(accountId);
                if (character != null) {
                    character.setBean(point);
                    character.updateBean();
                } else {
                    cm.executeSQL("UPDATE `accounts` SET `bean` = ? WHERE `id` = ?;", point, accountId);
                }
            }
            event.reply("✏️ **小鋼珠修改成功！** `" + originalPoint + "` ➜ `" + point + "`").queue();
            break;
        }
        case "Get-Inventory-Item-Quantity-Modal": {
            let itemIdInString = event.getValue("itemId").getAsString();
            if (!isNumeric(itemIdInString)) {
                event.reply("❌ **操作失敗**：道具代碼必須輸入數字。").setEphemeral(true).queue();
                return;
            }

            let itemId = parseInt(itemIdInString);
            let quantity = 0;
            let character = cm.getChr(characterId);

            if (character != null) {
                quantity += character.getItemQuantity(itemId, true);
            } else {
                let listResult = cm.selectSQL("SELECT `quantity` FROM `inventoryitems` WHERE characterid = ? AND itemid = ? AND type = 1", characterId, itemId);
                let iterator = listResult.iterator();
                while (iterator.hasNext()) {
                    let mapResult = iterator.next();
                    quantity += mapResult.get("quantity");
                }
            }

            event.reply("🔍 **道具 <" + cm.getItemName(itemId) + " (" + itemId + ")> 背包內共有 " + cm.numberWithCommas(quantity) + " 個！").queue();
            break;
        }
        case "Give-Inventory-Item-Modal": {
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
                let character = cm.getChr(characterId);
                let itemId = parseInt(itemIdInString);
                let itemQuantity = parseInt(itemQuantityInString);
                let itemType = parseInt(itemId / 1000000);

                if (character != null && itemType !== 5) {
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
                    let accountId = cm.getAccountIdByCharacterId(characterId);
                    code = cm.createCouponCode(20, itemList, 0, 0, 0, 0, 0, true, accountId, true, 1, -1);
                    event.reply(
                        "🟢 **角色不在線上，或是發送內容為寵物。已為指定角色產生專屬序號！**\n\n" +
                        "👤 **角色名稱：** `" + cm.getCharacterNameById(characterId) + "`\n" +
                        "🔐 **限定帳號領取**\n" +
                        "🔑 **兌換序號：** `" + code + "`\n" +
                        "🎁 **道具名稱：** `" + itemName + "`\n" +
                        "📦 **數量：** `" + itemQuantity + "`\n" +
                        "⏳ **期限：** `" + periodText + "`"
                    ).queue();
                    cm.sendMemo("管理員", cm.getCharacterNameById(characterId), "收到商城序號: " + code, 0, true);
                }
            }
            break;
        }
        case "Remove-Inventory-Item-Modal": {
            let itemIdInString = event.getValue("itemId").getAsString();
            let itemQuantityInString = event.getValue("itemQuantity").getAsString();

            if (!isNumeric(itemIdInString)) {
                event.reply("❌ **操作失敗**：道具代碼必須輸入數字。").setEphemeral(true).queue();
                return;
            } else if (!isNumeric(itemQuantityInString)) {
                event.reply("❌ **操作失敗**：道具數量必須輸入數字。").setEphemeral(true).queue();
                return;
            } else {
                let character = cm.getChr(characterId);
                let itemId = parseInt(itemIdInString);
                let itemQuantity = parseInt(itemQuantityInString);
                if (character != null) {
                    if (character.getItemQuantity(itemId, false) <= 0) {
                        event.reply("⚠️ 無法操作：角色身上沒有`" + cm.getItemName(itemId) + "(" + itemIdInString + ")`。").setEphemeral(true).queue();
                        return;
                    }
                    let removeQuantity = itemQuantity;
                    if (itemQuantity > character.getItemQuantity(itemId, false)) {
                        removeQuantity = character.getItemQuantity(itemId, false);
                    }
                    character.removeItem(itemId, removeQuantity, true);
                    event.reply(
                        "💰 **移除成功！**\n\n" +
                        "👤 **角色名稱：** `" + cm.getCharacterNameById(characterId) + "`\n" +
                        "🎁 **道具名稱：** `" + cm.getItemName(itemId) + "(" + itemIdInString + ")`\n" +
                        "📦 **移除數量：** `" + cm.numberWithCommas(itemQuantity) + "`" +
                        (removeQuantity !== itemQuantity ? " (實際只扣`" + cm.numberWithCommas(removeQuantity) + "`個)" : "") + "\n" +
                        "🎒 **當前背包數量：** `" + character.getItemQuantity(itemId, true) + "`"
                    ).queue();
                } else {
                    event.reply("⚠️ 無法操作：角色必須在線上才能使用此功能。").setEphemeral(true).queue();
                }
            }
            break;
        }
        case "Remove-Inventory-All-Item-Id-Modal": {
            let itemIdInString = event.getValue("itemId").getAsString();

            if (!isNumeric(itemIdInString)) {
                event.reply("❌ **操作失敗**：道具代碼必須輸入數字。").setEphemeral(true).queue();
                return;
            } else {
                let character = cm.getChr(characterId);
                let itemId = parseInt(itemIdInString);
                if (character != null) {
                    let quantity = character.getItemQuantity(itemId, true);
                    if (quantity > 0) {
                        character.removeAll(itemId);
                        event.reply(
                            "💰 **線上移除成功！**\n\n" +
                            "👤 **角色名稱：** `" + cm.getCharacterNameById(characterId) + "`\n" +
                            "🎁 **道具名稱：** `" + cm.getItemName(itemId) + "(" + itemId + ")`\n" +
                            "📦 **移除數量：** `" + cm.numberWithCommas(quantity) + "`\n" +
                            "🎒 **當前背包數量：** `" + character.getItemQuantity(itemId, true) + "`"
                        ).queue();
                    } else {
                        event.reply("⚠️ 無法操作：角色身上沒有`" + cm.getItemName(itemId) + "(" + itemId + ")`。").setEphemeral(true).queue();
                    }
                } else {
                    let rowCount = cm.executeSQL("DELETE FROM inventoryitems WHERE characterid = ? AND itemid = ? AND type = 1", characterId, itemId);
                    if (rowCount > 0) {
                        event.reply(
                            "💰 **離線移除所有指定道具成功！**\n\n" +
                            "👤 **角色名稱：** `" + cm.getCharacterNameById(characterId) + "`\n" +
                            "🎁 **道具名稱：** `" + cm.getItemName(itemId) + "(" + itemId + ")`\n" +
                            "📦 **移除數量：** `" + cm.numberWithCommas(rowCount) + "`"
                        ).queue();
                    } else {
                        event.reply("⚠️ 無法操作：角色身上沒有`" + cm.getItemName(itemId) + "(" + itemId + ")`。").setEphemeral(true).queue();
                    }
                }
            }
            break;
        }
        case "Set-Ability-Point-Modal": {
            let valueInString = event.getValue("value").getAsString();

            if (!isNumeric(valueInString)) {
                event.reply("❌ **操作失敗**：新的值必須輸入數字。").setEphemeral(true).queue();
                return;
            }

            let value = parseInt(valueInString);
            if (value < 0 || value > maxStatLimit) {
                event.reply("⚠️ **數值異常**：請輸入 0 到 " + cm.numberWithCommas(maxStatLimit) + " 之間的數字。").setEphemeral(true).queue();
                return;
            }

            let originalValue = getCharacterAbilityPoint(characterId);
            let character = cm.getChr(characterId);
            if (character != null) {
                character.changeStrDexIntLuk(-1, -1, -1, -1, value, false);
            } else {
                cm.executeSQL("UPDATE characters SET ap = ? WHERE id = ?", value, characterId);
            }
            event.reply("💰 **修改可分配能力點成功！** 數值：`" + cm.numberWithCommas(value) + "` 原始值：`" + cm.numberWithCommas(originalValue) + "`").queue();
            break;
        }
        case "Set-Str-Modal": {
            let valueInString = event.getValue("value").getAsString();

            if (!isNumeric(valueInString)) {
                event.reply("❌ **操作失敗**：新的值必須輸入數字。").setEphemeral(true).queue();
                return;
            }

            let value = parseInt(valueInString);
            if (value < 0 || value > maxStatLimit) {
                event.reply("⚠️ **數值異常**：請輸入 0 到 " + cm.numberWithCommas(maxStatLimit) + " 之間的數字。").setEphemeral(true).queue();
                return;
            }

            let originalValue = getCharacterStr(characterId);
            let character = cm.getChr(characterId);
            if (character != null) {
                character.changeStrDexIntLuk(value, -1, -1, -1, -1, false);
            } else {
                cm.executeSQL("UPDATE characters SET str = ? WHERE id = ?", value, characterId);
            }
            event.reply("💰 **修改力量成功！** 數值：`" + cm.numberWithCommas(value) + "` 原始值：`" + cm.numberWithCommas(originalValue) + "`").queue();
            break;
        }
        case "Set-Dex-Modal": {
            let valueInString = event.getValue("value").getAsString();

            if (!isNumeric(valueInString)) {
                event.reply("❌ **操作失敗**：新的值必須輸入數字。").setEphemeral(true).queue();
                return;
            }

            let value = parseInt(valueInString);
            if (value < 0 || value > maxStatLimit) {
                event.reply("⚠️ **數值異常**：請輸入 0 到 " + cm.numberWithCommas(maxStatLimit) + " 之間的數字。").setEphemeral(true).queue();
                return;
            }

            let originalValue = getCharacterDex(characterId);
            let character = cm.getChr(characterId);
            if (character != null) {
                character.changeStrDexIntLuk(-1, value, -1, -1, -1, false);
            } else {
                cm.executeSQL("UPDATE characters SET dex = ? WHERE id = ?", value, characterId);
            }
            event.reply("💰 **修改敏捷成功！** 數值：`" + cm.numberWithCommas(value) + "` 原始值：`" + cm.numberWithCommas(originalValue) + "`").queue();
            break;
        }
        case "Set-Int-Modal": {
            let valueInString = event.getValue("value").getAsString();

            if (!isNumeric(valueInString)) {
                event.reply("❌ **操作失敗**：新的值必須輸入數字。").setEphemeral(true).queue();
                return;
            }

            let value = parseInt(valueInString);
            if (value < 0 || value > maxStatLimit) {
                event.reply("⚠️ **數值異常**：請輸入 0 到 " + cm.numberWithCommas(maxStatLimit) + " 之間的數字。").setEphemeral(true).queue();
                return;
            }

            let originalValue = getCharacterInt(characterId);
            let character = cm.getChr(characterId);
            if (character != null) {
                character.changeStrDexIntLuk(-1, -1, value, -1, -1, false);
            } else {
                cm.executeSQL("UPDATE characters SET `int` = ? WHERE id = ?", value, characterId);
            }
            event.reply("💰 **修改智力成功！** 數值：`" + cm.numberWithCommas(value) + "` 原始值：`" + cm.numberWithCommas(originalValue) + "`").queue();
            break;
        }
        case "Set-Luk-Modal": {
            let valueInString = event.getValue("value").getAsString();

            if (!isNumeric(valueInString)) {
                event.reply("❌ **操作失敗**：新的值必須輸入數字。").setEphemeral(true).queue();
                return;
            }

            let value = parseInt(valueInString);
            if (value < 0 || value > maxStatLimit) {
                event.reply("⚠️ **數值異常**：請輸入 0 到 " + cm.numberWithCommas(maxStatLimit) + " 之間的數字。").setEphemeral(true).queue();
                return;
            }

            let originalValue = getCharacterLuk(characterId);
            let character = cm.getChr(characterId);
            if (character != null) {
                character.changeStrDexIntLuk(-1, -1, -1, value, -1, false);
            } else {
                cm.executeSQL("UPDATE characters SET `luk` = ? WHERE id = ?", value, characterId);
            }
            event.reply("💰 **修改幸運成功！** 數值：`" + cm.numberWithCommas(value) + "` 原始值：`" + cm.numberWithCommas(originalValue) + "`").queue();
            break;
        }
        case "Set-Popularity-Modal": {
            let valueInString = event.getValue("value").getAsString();

            if (!isNumeric(valueInString)) {
                event.reply("❌ **操作失敗**：新的值必須輸入數字。").setEphemeral(true).queue();
                return;
            }

            let value = parseInt(valueInString);
            if (value < -maxPopularityLimit || value > maxPopularityLimit) {
                event.reply("⚠️ **數值異常**：請輸入 -" + cm.numberWithCommas(maxPopularityLimit) + " 到 " + cm.numberWithCommas(maxPopularityLimit) + " 之間的數字。").setEphemeral(true).queue();
                return;
            }

            let originalValue = getCharacterPopularity(characterId);
            let character = cm.getChr(characterId);
            if (character != null) {
                character.gainFame(value - getCharacterPopularity(characterId));
            } else {
                cm.executeSQL("UPDATE characters SET `fame` = ? WHERE id = ?", value, characterId);
            }
            event.reply("💰 **修改名聲成功！** 數值：`" + cm.numberWithCommas(value) + "` 原始值：`" + cm.numberWithCommas(originalValue) + "`").queue();
            break;
        }
        case "Set-Hair-Modal": {
            let valueInString = event.getValue("value").getAsString();

            if (!isNumeric(valueInString)) {
                event.reply("❌ **操作失敗**：新的值必須輸入數字。").setEphemeral(true).queue();
                return;
            }

            let value = parseInt(valueInString);
            if (!cm.isHair(value)) {
                event.reply("⚠️ **數值異常**：請輸入正確的髮型代碼").setEphemeral(true).queue();
                return;
            }

            let originalValue = getCharacterHair(characterId);
            let character = cm.getChr(characterId);
            if (character != null) {
                character.setHair(value);
                character.updateAllStats();
                character.updateAvatarLook();
            } else {
                cm.executeSQL("UPDATE characters SET `hair` = ? WHERE id = ?", value, characterId);
            }
            event.reply("💰 **修改髮型成功！** 髮型：`" + cm.getItemName(value) + "(" + cm.numberWithCommas(value) + ")` 原始髮型：`" + cm.getItemName(originalValue) + "(" + cm.numberWithCommas(originalValue) + ")`").queue()
            break;
        }
        case "Set-Face-Modal": {
            let valueInString = event.getValue("value").getAsString();

            if (!isNumeric(valueInString)) {
                event.reply("❌ **操作失敗**：新的值必須輸入數字。").setEphemeral(true).queue();
                return;
            }

            let value = parseInt(valueInString);
            if (!cm.isFace(value)) {
                event.reply("⚠️ **數值異常**：請輸入正確的臉型代碼").setEphemeral(true).queue();
                return;
            }

            let originalValue = getCharacterFace(characterId);
            let character = cm.getChr(characterId);
            if (character != null) {
                character.setFace(value);
                character.updateAllStats();
                character.updateAvatarLook();
            } else {
                cm.executeSQL("UPDATE characters SET `face` = ? WHERE id = ?", value, characterId);
            }
            event.reply("💰 **修改臉型成功！** 髮型：`" + cm.getItemName(value) + "(" + cm.numberWithCommas(value) + ")` 原始髮型：`" + cm.getItemName(originalValue) + "(" + cm.numberWithCommas(originalValue) + ")`").queue()
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

function getCharacterFieldId(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getMapId();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `map` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("map"));
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

function getCharacterAbilityPoint(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getRemainingAp();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `ap` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("ap"));
    }
    return result;
}

function getCharacterStr(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getStr();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `str` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("str"));
    }
    return result;
}

function getCharacterDex(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getDex();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `dex` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("dex"));
    }
    return result;
}

function getCharacterInt(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getInt();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `int` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("int"));
    }
    return result;
}

function getCharacterLuk(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getLuk();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `luk` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("luk"));
    }
    return result;
}

function getCharacterPopularity(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getFame();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `fame` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("fame"));
    }
    return result;
}

function getCharacterFace(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getFace();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `face` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("face"));
    }
    return result;
}

function getCharacterHair(characterId) {
    let character = cm.getChr(characterId);
    if (character != null) {
        return character.getHair();
    }
    let result = 0;
    let listResult = cm.selectSQL("SELECT `hair` FROM `characters` WHERE id = ?", characterId); // List<Map<String, Object>>
    if (listResult.size() > 0) {
        let mapResult = listResult.get(0);
        result = parseInt(mapResult.get("hair"));
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

function isNumeric(str) {
    return !isNaN(str) && str.trim() !== '';
}
