// 2025/05/14 - 2025/06/01
// Discord腳本 - 獎勵名單登記請求快速審核
// By Windy
// 配套腳本: 每日推文 / 事前預約
// 配套SQL:
/*

CREATE TABLE `reward_claim_request`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `discord_user_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `discord_user_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `character_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `account_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `type_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `urls` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `time` bigint(20) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

 */

let enable = false; // true = 開啟 , false = 關閉
let defaultDeclineReason = "重複登記 / 日期錯誤 / 內容不符合要求"; // 點擊拒絕時預設填入理由
let list = [
    // {name: "獎勵名單名稱", isCharacterBased: 登記角色名稱填true,登記帳號填false},
    {name: "每日推文", isCharacterBased: false},
    {name: "事前預約", isCharacterBased: false}
];

let lastSelectedId = null;
let skipList = [];

function onMessageReceived(event, content) {
    if (!enable) {
        cm.dispose();
        return;
    }
    if (cm.getPermissionLevel() < 1) {
        cm.dispose();
        return;
    }
    let menuMessage = "";

    for (let i = 0; i < list.length; i++) {
        menuMessage += list[i].name + "::" + list[i].name + "###";
    }

    let menuData = [
        ["📋 請選擇要審核的名單：", "TypeMenu-Claim-Request"],
        ["⚠️ 清除指定名單待審核資料：", "TypeMenu-Remove-Type"]
    ];

    for (let i = 0; i < menuData.length; i++) {
        if ((i + 1) === menuData.length) {
            cm.sendPrivateMessage(menuData[i][0], cm.createStringSelectMenu(menuData[i][1], menuMessage, null), cm.createDangerButton("Dispose", "🛑 結束對話"));
        } else {
            cm.sendPrivateMessage(menuData[i][0], cm.createStringSelectMenu(menuData[i][1], menuMessage, null));
        }
    }

}

function onButtonInteraction(event, buttonId, buttonText) {
    if (cm.getPermissionLevel() < 1) {
        event.reply("🛑 **對話已結束。**").setEphemeral(true).queue();
        cm.dispose();
        return;
    } else if (buttonId.equals("Dispose")) {
        event.reply("🛑 **對話已結束。**").setEphemeral(true).queue();
        cm.dispose();
        return;
    } else if (buttonId.equals("Accept-Remove-Type")) {
        if (lastSelectedId == null) {
            event.reply("🛑 **對話已結束。**\r\n未選擇名單就刪除資料").setEphemeral(true).queue();
            cm.dispose();
            return;
        }
        cm.executeSQL("DELETE FROM `reward_claim_request` WHERE `type_name` = ?", lastSelectedId);
        event.reply("✅ 已成功清除所有" + lastSelectedId + "的待審核資料。").complete();
        onMessageReceived(null, null)
        return;
    } else if (buttonId.equals("Decline-Remove-Type")) {
        event.reply("").setEphemeral(true).complete();
        onMessageReceived(null, null)
        return;
    }
    if (buttonId.startsWith("Accept")) {
        let id = buttonId.split(":")[1];
        let info = fetchRewardRequest(id);
        if (info != null) {
            let content = isCharacterBasedByName(info.typeName) ? info.characterName : info.accountName;
            cm.sendDiscordPrivateMessage(
                info.discordUserId,
                "📅 **" + info.time + "** 的申請類型：**" + info.typeName + "**\n" +
                "✅ 審核結果：**通過！** 🎉\n" +
                "📦 獎勵可以領取前往了。"
            );
            cm.addCustomRewardList(info.typeName, content);
            cm.executeSQL("DELETE FROM `reward_claim_request` WHERE id = ?", id);
            event.reply(
                "✅ **審核完成** ｜ 📅 " + info.time +
                " ｜ 🏷️ " + info.typeName +
                " ｜ 🧑 " + info.discordUserName +
                " ｜ 🎮 " + content +
                " ｜ 📢 已通知玩家 **審核通過**"
            ).queue();
            onStringSelectInteraction(null, "TypeMenu-Claim-Request", lastSelectedId);
        } else {
            event.reply("⚠️ 找不到該筆資料，可能是其他管理員已經處理完成。").setEphemeral(true).queue();
            onStringSelectInteraction(null, "TypeMenu-Claim-Request", lastSelectedId);
        }
    } else if (buttonId.startsWith("DeclineWithReason")) {
        let modalFields = [
            {
                label: "原因",
                id: "reason",
                style: "paragraph",
                defaultValue: defaultDeclineReason,
                required: true
            }
        ];
        event.replyModal(cm.createModal(buttonId, "拒絕原因", JSON.stringify(modalFields))).queue();
    } else if (buttonId.startsWith("Decline")) {
        let id = buttonId.split(":")[1];
        let info = fetchRewardRequest(id);
        if (info != null) {
            cm.sendDiscordPrivateMessage(
                info.discordUserId,
                "📅 **" + info.time + "** 的申請類型：**" + info.typeName + "**\n" +
                "❌ 審核結果：**未通過**\n" +
                "📬 如有疑問，請聯繫管理員。"
            );
            cm.executeSQL("DELETE FROM `reward_claim_request` WHERE id = ?", id);
            event.reply(
                "✅ **審核完成** ｜ 📅 " + info.time +
                " ｜ 🏷️ " + info.typeName +
                " ｜ 🧑 " + info.discordUserName +
                " ｜ 🎮 " + info.characterName +
                " ｜ 🧾 " + info.accountName +
                " ｜ 📢 已通知玩家 **審核未通過**"
            ).complete();
            onStringSelectInteraction(null, "TypeMenu-Claim-Request", lastSelectedId);
        } else {
            event.reply("⚠️ 找不到該筆資料，可能是其他管理員已經處理完成。").complete();
            onStringSelectInteraction(null, "TypeMenu-Claim-Request", lastSelectedId);
        }
    } else if (buttonId.startsWith("Skip")) {
        let id = buttonId.split(":")[1];
        skipList.push(parseInt(id));
        event.reply("即將尋找下一筆資料").setEphemeral(true).complete();
        onStringSelectInteraction(null, "TypeMenu-Claim-Request", lastSelectedId);
    } else if (buttonId.startsWith("RemoveCharacterInType")) {
        let parts = buttonId.split(":");
        if (parts.length < 3) {
            event.reply("❌ 參數格式錯誤，無法執行刪除。").setEphemeral(true).queue();
            return;
        }

        let typeName = parts[1];
        let character = parts[2];

        let rowCount = cm.executeSQL(
            "DELETE FROM `reward_claim_request` WHERE `type_name` = ? AND `character_name` = ?",
            typeName, character
        );

        event.reply("🧹 已成功清除「" + character + "」於類型「" + typeName + "」的所有待審核資料(" + rowCount + "筆)。").complete();
        onStringSelectInteraction(null, "TypeMenu-Claim-Request", lastSelectedId);
    } else if (buttonId.startsWith("RemoveAccountInType")) {
        let parts = buttonId.split(":");
        if (parts.length < 3) {
            event.reply("❌ 參數格式錯誤，無法執行刪除。").setEphemeral(true).queue();
            return;
        }

        let typeName = parts[1];
        let account = parts[2];

        let rowCount = cm.executeSQL(
            "DELETE FROM `reward_claim_request` WHERE `type_name` = ? AND `account_name` = ?",
            typeName, account
        );

        event.reply("🧹 已成功清除「" + account + "」於類型「" + typeName + "」的所有待審核資料(" + rowCount + "筆)。").complete();
        onStringSelectInteraction(null, "TypeMenu-Claim-Request", lastSelectedId);

    } else if (buttonId.startsWith("RemoveDiscordIdInType")) {
        let parts = buttonId.split(":");
        if (parts.length < 3) {
            event.reply("❌ 參數格式錯誤，無法執行刪除。").setEphemeral(true).queue();
            return;
        }

        let typeName = parts[1];
        let discordId = parts[2];

        let rowCount = cm.executeSQL(
            "DELETE FROM `reward_claim_request` WHERE `type_name` = ? AND `discord_user_id` = ?",
            typeName, discordId
        );

        event.reply("🧹 已成功清除「" + discordId + "」於類型「" + typeName + "」的所有待審核資料(" + rowCount + "筆)。").complete();
        onStringSelectInteraction(null, "TypeMenu-Claim-Request", lastSelectedId);

    } else {
        event.reply("🛑 **對話已結束。**").setEphemeral(true).queue();
        cm.dispose();
    }
}

function onStringSelectInteraction(event, menuId, selectedId) {
    if (cm.getPermissionLevel() < 1) {
        event.reply("🛑 **對話已結束。**").setEphemeral(true).queue();
        cm.dispose();
        return;
    }

    if (menuId.equals("TypeMenu-Claim-Request")) {
        lastSelectedId = selectedId;
        let list = fetchRewardRequests(selectedId);
        if (list.length <= 0 || skipList.length === list.length) {
            if (event != null) {
                event.reply(selectedId + " 目前沒有任何待審核的申請，對話已結束。").setEphemeral(true).queue();
            } else {
                cm.sendPrivateMessage(selectedId + " 目前沒有任何待審核的申請，對話已結束。");
            }
            cm.dispose();
            return;
        }
        if (event != null) {
            event.reply(selectedId + " 正在載入資訊").setEphemeral(true).complete();
        } else {
            cm.sendPrivateMessage(selectedId + " 正在載入資訊");
        }
        for (let i = 0; i < list.length; i++) {
            let info = list[i];
            let id = info.id;
            let discordUserName = info.discordUserName;
            let discordUserId = info.discordUserId;
            let characterName = info.characterName;
            let accountName = info.accountName;
            let urls = JSON.parse(info.urls);
            let time = info.time;
            let basedOnCharacter = isCharacterBasedByName(selectedId);
            let inList = cm.hasCustomRewardList(selectedId, basedOnCharacter ? characterName : accountName, true);

            let message = "🔍 **申請審核資訊**\n"
                + "━━━━━━━━━━━━━━\n"
                + "🕒 申請時間: " + time + "\n"
                + "🆔 流水號：" + id + "\n"
                + "📌 類型：" + selectedId + "\n"
                + "👤 Discord ID: " + discordUserName + " (" + discordUserId + ")\n"
                + "🎮 角色名稱: " + characterName + "\n"
                + "🧾 帳號名稱: " + accountName + "\n"
                + (inList ? "⚠️ **偵測到重複申請！** 已在名單中\n" : "")
                + "🖼️ 截圖：";

            for (let j = 0; j < urls.length; j++) {
                message += "\n" + urls[j];
            }
            if (inArray(skipList, id)) {
                continue;
            }
            cm.sendPrivateMessage(message,
                cm.createSuccessButton("Accept:" + id, "✅ 通過"),
                cm.createDangerButton("Decline:" + id, "❌ 拒絕"),
                cm.createDangerButton("DeclineWithReason:" + id, "📝 拒絕並填寫原因"),
                cm.createPrimaryButton("Skip:" + id, "⏭️ 跳過")
            );
            cm.sendPrivateMessage(
                "",
                basedOnCharacter
                    ? cm.createDangerButton("RemoveCharacterInType:" + selectedId + ":" + characterName, "🧍 清除本類型中角色名稱為「" + characterName + "」的資料")
                    : cm.createDangerButton("RemoveAccountInType:" + selectedId + ":" + accountName, "👤 清除本類型中帳號名稱為「" + accountName + "」的資料"),
                cm.createDangerButton("RemoveDiscordIdInType:" + selectedId + ":" + discordUserId, "💬 清除本類型中 Discord 使用者「" + discordUserId + "」的資料"),
                cm.createSecondaryButton("Dispose", "🛑 結束對話")
            );

            break; // 只顯示第一筆，若要多筆請移除 break 並改為 queue 機制處理
        }
    } else if (menuId.equals("TypeMenu-Remove-Type")) {
        lastSelectedId = selectedId;
        event.deferReply(true).complete();
        let count = fetchRewardRequestCount(selectedId);
        if (count <= 0) {
            event.getHook().sendMessage("「" + selectedId + "」沒有任何待審核資料！").complete();
            onMessageReceived(null, null);
        } else {
            let rowButtons = [];
            rowButtons.push(cm.createSuccessButton("Accept-Remove-Type", "✅ 是的，請清除"));
            rowButtons.push(cm.createDangerButton("Decline-Remove-Type", "❌ 不要清除"));
            rowButtons.push(cm.createSecondaryButton("Dispose", "🛑 結束對話"));
            event.getHook().sendMessage(
                "⚠️ 確認清除所有「" + selectedId + "」的待審核資料，共 " + count + " 筆，操作不可逆！"
            ).addActionRow(...rowButtons).queue();
        }
    } else {
        event.reply("🛑 **對話已結束。**").setEphemeral(true).queue();
        cm.dispose();
    }
}

function onModalInteraction(event, modalId) {
    if (cm.getPermissionLevel() < 1) {
        event.reply("🛑 **對話已結束。**").setEphemeral(true).queue();
        cm.dispose();
        return;
    }
    if (modalId.startsWith("DeclineWithReason")) {
        let id = modalId.split(":")[1];
        let reason = event.getValue("reason").getAsString();
        let info = fetchRewardRequest(id);
        if (info != null) {
            cm.sendDiscordPrivateMessage(
                info.discordUserId,
                "📅 **" + info.time + "** 的申請類型：**" + info.typeName + "**\n" +
                "❌ 審核結果：**未通過**\n" +
                "📝 **原因說明：**\n```\n" + reason + "\n```\n" +
                "📬 如有疑問，請聯繫管理員。"
            );
            cm.executeSQL("DELETE FROM `reward_claim_request` WHERE id = ?", id);
            event.reply(
                "✅ **審核完成** ｜ 📅 " + info.time +
                " ｜ 🏷️ " + info.typeName +
                " ｜ 🧑 " + info.discordUserName +
                " ｜ 🎮 " + info.characterName +
                " ｜ 🧾 " + info.accountName +
                " ｜ 📢 已通知玩家 **審核未通過**"
            ).queue();
            onStringSelectInteraction(null, "TypeMenu-Claim-Request", lastSelectedId);
        } else {
            event.reply("⚠️ 找不到該筆資料，可能是其他管理員已經處理完成。").setEphemeral(true).queue();
            onStringSelectInteraction(null, "TypeMenu-Claim-Request", lastSelectedId);
        }
    } else {
        event.reply("🛑 **對話已結束。**").setEphemeral(true).queue();
        cm.dispose();
    }
}

function fetchRewardRequests(typeName) {
    let results = [];

    let listResult = cm.selectSQL(
        "SELECT `id`, `discord_user_id`, `discord_user_name`, `character_name`, `account_name`, `type_name`, `urls`, `time` FROM `reward_claim_request` WHERE type_name = ?",
        typeName
    ); // List<Map<String, Object>>

    let iterator = listResult.iterator();
    while (iterator.hasNext()) {
        let mapResult = iterator.next();
        results.push({
            id: parseInt(mapResult.get("id")),
            discordUserId: mapResult.get("discord_user_id"),
            discordUserName: mapResult.get("discord_user_name"),
            characterName: mapResult.get("character_name"),
            accountName: mapResult.get("account_name"),
            typeName: mapResult.get("type_name"),
            urls: mapResult.get("urls"),
            time: cm.getReadableTime(parseInt(mapResult.get("time")))
        });
    }

    return results;
}

function fetchRewardRequest(id) {
    let listResult = cm.selectSQL(
        "SELECT `id`, `discord_user_id`, `discord_user_name`, `character_name`, `account_name`, `type_name`, `urls`, `time` FROM `reward_claim_request` WHERE id = ?",
        id
    ); // List<Map<String, Object>>

    if (listResult.size() === 0) {
        return null;
    }

    let mapResult = listResult.get(0);
    return {
        id: parseInt(mapResult.get("id")),
        discordUserId: mapResult.get("discord_user_id"),
        discordUserName: mapResult.get("discord_user_name"),
        characterName: mapResult.get("character_name"),
        accountName: mapResult.get("account_name"),
        typeName: mapResult.get("type_name"),
        urls: mapResult.get("urls"),
        time: cm.getReadableTime(parseInt(mapResult.get("time")))
    };
}

function fetchRewardRequestCount(typeName) {
    let listResult = cm.selectSQL(
        "SELECT COUNT(*) AS count FROM reward_claim_request WHERE `type_name` = ?", typeName
    ); // List<Map<String, Object>>

    if (listResult.size() === 0) {
        return 0;
    }

    let mapResult = listResult.get(0);
    return parseInt(mapResult.get("count"));
}


function isCharacterBasedByName(name) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].name === name) {
            return list[i].isCharacterBased;
        }
    }
    return false;
}

function inArray(array, element) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === element) {
            return true;
        }
    }
    return false;
}