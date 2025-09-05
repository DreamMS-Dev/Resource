/* global cm */

let itemId = 1140000;
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
        cm.sendSimple("請選擇:\r\n#L0#自訂勳章名稱#l\r\n#L1#移除自訂勳章名稱");
    } else if (status === 1) {
        if (selection === 1) {
            cmb.setNameTagText(itemId, "");
            cm.sendNext("移除完成");
            status = -1;
            cmb.updateNameTagText();
            cmb.removeNameTagText(itemId, false);
        } else {
            cm.sendGetText("請輸入名稱:");
        }
    } else if (status === 2) {
        cmb.setNameTagText(itemId, cm.getText());
        cm.sendNext("設置完成");
        status = -1;
        cmb.updateNameTagText();
    }
}
