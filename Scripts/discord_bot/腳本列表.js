// 2025/05/16 - 2025/05/20
// Discord腳本 - 可以查看目前所有腳本並開啟
// By Windy

let enable = false;
let mode = 2; // 1 = 顯示選單, 2 = 顯示按鈕
let messageEvent = null;
let currentPage = 0;
let buttonsPerLine = 5; // 一行最多5個按鈕
let scriptsPerPage = 15; // 選單最多15個項目
let scripts = null;

function sendScriptMenu(page) {
    if (scripts == null || scripts.length === 0) {
        cm.sendPrivateMessage("⚠️ **目前沒有可用的腳本。**", cm.createDangerButton("Dispose", "🛑 結束對話"));
        return;
    }
    if (mode === 1) {
        let totalPages = Math.ceil(scripts.length / scriptsPerPage);
        if (page < 0) page = 0;
        if (page >= totalPages) page = totalPages - 1;
        currentPage = page;

        let start = page * scriptsPerPage;
        let end = Math.min(start + scriptsPerPage, scripts.length);
        let menuMessage = "";

        for (let i = start; i < end; i++) {
            let name = scripts[i];
            menuMessage += "📜 " + name + "::" + name + "###";
        }

        let buttons = [];
        if (page > 0) {
            buttons.push(cm.createPrimaryButton("PrevPage", "⬅️ 上一頁"));
        }
        if (page < totalPages - 1) {
            buttons.push(cm.createPrimaryButton("NextPage", "➡️ 下一頁"));
        }
        buttons.push(cm.createDangerButton("Dispose", "🛑 結束對話"));

        cm.sendPrivateMessage(
            "📋 **請選擇您要執行的腳本（第 " + (page + 1) + " / " + totalPages + " 頁）：**",
            cm.createStringSelectMenu("ScriptMenu", menuMessage, null),
            ...buttons
        );
    } else if (mode === 2) {
        let row = [];
        let rows = [];
        for (let i = 0; i < scripts.length; i++) {
            let name = scripts[i];
            let posInRow = i % buttonsPerLine;
            let button;

            if (posInRow === 0 || posInRow === 4) {
                button = cm.createPrimaryButton(name, name);
            } else if (posInRow === 1 || posInRow === 3) {
                button = cm.createSuccessButton(name, name);
            } else if (posInRow === 2) {
                button = cm.createSecondaryButton(name, name);
            }

            row.push(button);
            if (row.length === buttonsPerLine) {
                rows.push(row);
                row = [];
            }
        }


        if (row.length > 0) {
            rows.push(row);
            cm.sendPrivateMessage("📋 **請選擇要執行的腳本：**");
        }
        for (let i = 0; i < rows.length; i++) {
            cm.sendPrivateMessage("", ...rows[i]);
        }
        cm.sendPrivateMessage("", cm.createDangerButton("Dispose", "🛑 結束對話"));
    }
}

function onMessageReceived(event, content) {
    if (!enable || cm.getPermissionLevel() < 6) {
        cm.dispose();
        return;
    }
    messageEvent = event;
    if (scripts == null) {
        scripts = cm.getScriptList(); // List<String>
    }
    sendScriptMenu(0);
}

function onButtonInteraction(event, buttonId, buttonText) {
    if (!enable || cm.getPermissionLevel() < 6) {
        event.reply("🛑 **對話已結束。**").queue();
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
    if (mode === 1) {
        if (buttonId.equals("PrevPage")) {
            event.deferReply(true).queue();
            sendScriptMenu(currentPage - 1);
        } else if (buttonId.equals("NextPage")) {
            event.deferReply(true).queue();
            sendScriptMenu(currentPage + 1);
        }
        return;
    }
    if (mode === 2 && scripts.contains(buttonId)) {
        event.deferReply(true).complete();
        cm.openScript(buttonId, messageEvent);
        messageEvent = null;
    } else {
        event.reply("🛑 **對話已結束。**").queue();
        messageEvent = null;
        cm.dispose();
    }
}

function onStringSelectInteraction(event, menuId, selectedId) {
    if (!enable || cm.getPermissionLevel() < 6 || !scripts.contains(selectedId)) {
        event.reply("🛑 **對話已結束。**").queue();
        messageEvent = null;
        cm.dispose();
        return;
    }
    if (messageEvent == null) {
        event.reply("⚠️ **發生未知錯誤，請稍後再試。**").queue();
        cm.dispose();
        return;
    }
    if (mode === 1 && menuId.equals("ScriptMenu")) {
        event.deferReply(true).complete();
        cm.openScript(selectedId, messageEvent);
        messageEvent = null;
    } else {
        event.reply("🛑 **對話已結束。**").queue();
        messageEvent = null;
        cm.dispose();
    }
}
