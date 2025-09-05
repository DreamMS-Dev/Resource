// 2025/05/14 - 2025/05/20
// Discord腳本 - 獎勵名單登記請求
// By Windy

let inputCharacterName = "", inputAccountName = "";
let urlList = [];

let enable = false; // true = 開放 , false = 關閉
let verifyCharacterNameExists = false; // 驗證角色名稱是否存在 true = 驗證 , false = 不驗證
let verifyAccountNameExists = false; // 驗證帳號名稱是否存在 true = 驗證 , false = 不驗證 (驗證對資料庫負擔會較大)
let verifyCharacterInAccount = false; // 驗證角色是否在該帳號下是否存在 true = 驗證 , false = 不驗證
let verifyDuplicateList = true; // 驗證帳號或角色是否已經在名單內 true = 驗證 , false = 不驗證
let notifyChannelId = "-1"; // 提示管理員用的頻道編號，不提示則填入 "-1"
// 都開啟時將驗證帳號是否已在名單內，否則為驗證角色名稱
let isAccountRequired = true; // 是否需要輸入帳號
let isCharacterNameRequired = false;  // 是否需要輸入角色名稱

let rewardListName = "每日推文"; // 獎勵名單名稱

let localModalId = "reward-modal";  // 跳出式對話框標題Id
let modalName = "每日推文"; // 跳出式對話框標題
let modalFields = [
    {
        label: "角色名稱 (請注意大小寫)",
        id: "characterName",
        style: "short",
        defaultValue: (isCharacterNameRequired ? "修改為您的角色名稱" : " (非必填)"),
        required: isCharacterNameRequired
    },
    {
        label: "帳號 (請注意大小寫)",
        id: "accountName",
        style: "short",
        defaultValue: (isAccountRequired ? "修改為您的帳號" : " (非必填)"),
        required: isAccountRequired
    }
];

function onMessageReceived(event, content) {
    if (!enable) {
        cm.dispose();
        return;
    }
    if ((!isCharacterNameRequired || inputCharacterName.length > 0) && (!isAccountRequired || inputAccountName.length > 0) && event != null && event.getMessage().getAttachments().size() > 0) {
        let iterator = event.getMessage().getAttachments().iterator();
        while (iterator.hasNext()) {
            let attachment = iterator.next();
            if (attachment.isImage()) {
                urlList.push(attachment.getUrl());
            }
        }
        let message = "✅ 最終確認 - " + rewardListName + "\n\n";
        if (isCharacterNameRequired) {
            message += "📌 角色名稱: \"" + inputCharacterName + "\"\n";
        }
        if (isAccountRequired) {
            message += "👤 帳號名稱: \"" + inputAccountName + "\"\n";
        }
        message += "🖼️ 上傳截圖:";

        for (let i = 0; i < urlList.length; i++) {
            message += "\n" + urlList[i];
        }

        cm.sendPrivateMessage(message,
            cm.createPrimaryButton("Send", "發送資料"),
            cm.createSuccessButton("Edit", "修改資料"),
            cm.createDangerButton("Dispose", "結束對話"),
        );
    } else {
        cm.sendPrivateMessage("請選擇操作",
            cm.createPrimaryButton("Request", "登記[每日推文]"),
            cm.createDangerButton("Dispose", "結束對話"),
        );
    }
}

function onButtonInteraction(event, buttonId, buttonText) {
    if (buttonId.equals("Request")) {
        event.replyModal(cm.createModal(localModalId, modalName, JSON.stringify(modalFields))).queue();
    } else if (buttonId.equals("notifyAdmin") && notifyChannelId !== "-1") {
        event.reply("📨 **已經提示管理員。**\n🛑 **本次對話已結束。**").queue();
        let message = "📬 已提示名單申請【" + rewardListName + "】";
        if (isCharacterNameRequired) {
            message += " ｜🎮 角色：\"" + inputCharacterName + "\"";
        }
        if (isAccountRequired) {
            message += " ｜🧾 帳號：\"" + inputAccountName + "\"";
        }
        message += "，請注意查看！";
        cm.sendDiscordMessage(notifyChannelId, message);
        cm.dispose();
    } else if (buttonId.equals("Send") && (!isCharacterNameRequired || inputCharacterName.length > 0) && (!isAccountRequired || inputAccountName.length > 0)) {
        cm.executeSQL("INSERT INTO `reward_claim_request` (`discord_user_id`, `discord_user_name`, `character_name`, `account_name`, `type_name`, `urls`, `time`) VALUES (?, ?, ?, ?, ?, ?, ?);", event.getUser().getId(), event.getUser().getName(), inputCharacterName, inputAccountName, rewardListName, JSON.stringify(urlList), cm.getCurrentTimeMillis());
        if (notifyChannelId !== "-1") {
            event.reply("📨 **申請已成功發送，請耐心等待審核。**")
                .addActionRow(
                    cm.createPrimaryButton("notifyAdmin", "📢 提示管理員"),
                    cm.createDangerButton("Dispose", "🛑 結束對話")
                )
                .queue();
        } else {
            event.reply("📨 **申請已成功發送，請耐心等待審核。**\n🛑 **本次對話已結束。**").queue();
            cm.dispose();
        }
    } else if (buttonId.equals("Edit") && (!isCharacterNameRequired || inputCharacterName.length > 0) && (!isAccountRequired || inputAccountName.length > 0)) {
        event.reply("請再次點選登記按鈕").queue();
        inputCharacterName = "";
        inputAccountName = "";
        urlList = [];
        onMessageReceived(null, null);
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
    if (modalId.equals(localModalId)) {
        let characterName = event.getValue("characterName").getAsString();
        let accountName = event.getValue("accountName").getAsString();
        let characterId = isCharacterNameRequired ? cm.getCharacterIdByName(characterName) : -1;
        let accountId = isAccountRequired ? cm.getAccountIdByName(accountName) : -1;
        if (isAccountRequired && verifyAccountNameExists && accountId === -1) {
            event.reply("❌ **帳號名稱錯誤**\n請再次點擊登記按鈕，輸入正確的帳號名稱。").setEphemeral(true).queue();
            return;
        } else if (isCharacterNameRequired && verifyCharacterNameExists && characterId === -1) {
            event.reply("❌ **角色名稱錯誤**\n請再次點擊登記按鈕，輸入正確的角色名稱。").setEphemeral(true).queue();
            return;
        }

        if (isAccountRequired && isCharacterNameRequired && verifyCharacterInAccount) {
            let characterIdList = cm.getCharacterIdsInAccount(accountId, -1);
            if (!characterIdList.contains(characterId)) {
                event.reply("⚠️ **驗證失敗**\n帳號中找不到角色：`<" + characterName + ">`，請確認後重新輸入。").setEphemeral(true).queue();
                return;
            }
        }

        if (verifyDuplicateList && cm.hasCustomRewardList(rewardListName, isAccountRequired ? accountName : characterName, true)) {
            event.reply("⚠️ **偵測到重複申請！**\n該" + (isAccountRequired ? "帳號" : "角色") + "已存在於名單中，請確認是否重複申請。").setEphemeral(true).queue();
            return;
        }

        inputCharacterName = isCharacterNameRequired ? characterName : "";
        inputAccountName = isAccountRequired ? accountName : "";
        event.reply("✅ **基本資料驗證成功！**\n請上傳相關截圖以完成登記。").queue();
    } else {
        event.reply("本次對話已結束").queue();
        cm.dispose();
    }
}