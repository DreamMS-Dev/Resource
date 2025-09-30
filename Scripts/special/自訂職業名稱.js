/**
 * 自訂職業名稱，需要登入器配合
 * 2025.09.27
 * By Windyboy
 */

let status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode === 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status === 0) {
        let message = "[自訂職業名稱系統]\r\n";
        let nick = cmb.getJobNickText();
        if (nick != null) {
            message += "目前暱稱: #r" + nick + "#k\r\n\r\n";
        }
        message += "#L0##d修改暱稱#l\r\n";
        message += "#L1##r移除暱稱#l";
        cm.askMenu(message, 0);
    } else if (status === 1) {
        if (selection === 1) {
            cmb.removeJobNickText();
            cm.say("#r移除完成", false, true, 0);
            status = -1;
        } else {
            let nick = cmb.getJobNickText();
            if (nick == null) {
                nick = "";
            }
            cm.askText("#d請輸入名稱:", nick, 0, 0, 0);
        }
    } else if (status === 2) {
        cmb.setJobNickText(cm.getText());
        cm.say("#d修改完成", false, true, 0);
        status = -1;
    }
}
