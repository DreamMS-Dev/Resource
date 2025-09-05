// 2025/05/16 - 2025/05/20
// Discord 腳本 - 登記按鈕腳本
// By Windy

// 選項陣列：id為按鈕ID，script為開啟腳本，label為按鈕顯示文字，permissionLevel為該按鈕所需最低權限
let menuOptions = [
    {id: "reviewList", script: "獎勵名單審核", label: "🧾 名單審核", permissionLevel: 6},
    {id: "dailyTweet", script: "每日推文", label: "📝 登記【每日推文】獎勵", permissionLevel: 0},
    {id: "preReserve", script: "事前預約", label: "📦 登記【事前預約】獎勵", permissionLevel: 0},
    // 你可以繼續在這裡加選項
];

let enable = false; // true = 開放, false = 關閉
let messageEvent = null;

function sendButtons(event) {
    let buttons = [];

    for (let i = 0; i < menuOptions.length; i++) {
        if (cm.getPermissionLevel() >= menuOptions[i].permissionLevel) {
            buttons.push({ id: menuOptions[i].id, label: menuOptions[i].label });
        }
    }

    let maxPerMessage = 5;
    let chunks = [];
    for (let i = 0; i < buttons.length; i += maxPerMessage) {
        chunks.push(buttons.slice(i, i + maxPerMessage));
    }

    for (let i = 0; i < chunks.length; i++) {
        let rowButtons = [];
        let chunk = chunks[i];
        // 這裡根據位置給不同按鈕樣式
        for (let j = 0; j < chunk.length; j++) {
            let btn = chunk[j];
            if (j === 0 || j === 4) {
                rowButtons.push(cm.createPrimaryButton(btn.id, btn.label));
            } else if (j === 1 || j === 3) {
                rowButtons.push(cm.createSuccessButton(btn.id, btn.label));
            } else if (j === 2) {
                rowButtons.push(cm.createSecondaryButton(btn.id, btn.label));
            }
        }

        if (i === 0) {
            if (event != null) {
                event.reply("📋 **請選擇您要執行的操作：**")
                    .addActionRow(...rowButtons)
                    .queue();
            } else {
                cm.sendPrivateMessage("📋 **請選擇您要執行的操作：**", ...rowButtons);
            }
        } else {
            cm.sendPrivateMessage("", ...rowButtons);
        }
    }

    let endButton = cm.createDangerButton("Dispose", "🛑 結束對話");
    cm.sendPrivateMessage("", endButton);
}

function onMessageReceived(event, content) {
    if (!enable) {
        cm.dispose();
        return;
    }
    messageEvent = event;
    sendButtons(null);
}

function onButtonInteraction(event, buttonId, buttonText) {
    if (!enable) {
        event.reply("❌ 發生未知錯誤，**對話已結束。**").queue();
        messageEvent = null;
        cm.dispose();
        return;
    }

    if (buttonId.equals("Dispose")) {
        event.reply("🛑 **對話已結束。**").queue();
        messageEvent = null;
        cm.dispose();
        return;
    }

    for (let i = 0; i < menuOptions.length; i++) {
        if (buttonId.equals(menuOptions[i].id)) {
            if (cm.getPermissionLevel() < menuOptions[i].permissionLevel) {
                event.reply("❌ 權限不足。").queue();
                return;
            }
            event.reply("🔄 正在打開 **" + menuOptions[i].label + "**，請稍候...").complete();
            cm.openScript(menuOptions[i].script, messageEvent);
            messageEvent = null;
            return;
        }
    }
    event.reply("⚠️ 未知操作，請重新輸入指令。").queue();
}

function onStringSelectInteraction(event, menuId, selectedId) {
    event.reply("本次對話已結束").queue();
    cm.dispose();
}

function onModalInteraction(event, modalId) {
    event.reply("本次對話已結束").queue();
    cm.dispose();
}