/**
 * 此功能需要搭配系統使用 - 解放者/控制器/系列/道具/裝備/欄位穿戴限制
 *
 */

let status = -1, sel = -1;
let info = [
    {
        "name": "盾牌",
        "slot": 10,
        "item": {
            "id": 4000000,
            "quantity": 1
        }
    },
    {
        "name": "武器",
        "slot": 11,
        "item": {
            "id": 4000001,
            "quantity": 1
        }
    }
];

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

    if (status <= -1) {
        cm.dispose();
    } else if (status === 0) {
        let message = "我可以開通裝備欄位，請選擇要開通的欄位\r\n\r\n";
        for (let i = 0; i < info.length; i++) {
            let inList = cmb.hasEquipmentSlotRequirementAvailableSlot(info[i].slot);
            let item = info[i].item;
            message += "#L" + i + "##b" + info[i].name + "#k 需要#d#v" + item.id + "##t" + item.id + "# x " + item.quantity + "#k";
            if (inList) {
                message += " (已開通)";
            }
            message += "\r\n";
        }
        cm.sendSimple(message);
    } else if (status === 1) {
        if (mode === 1) {
            sel = selection;
        }
        if (cmb.hasEquipmentSlotRequirementAvailableSlot(info[sel].slot)) {
            cm.sendNext("#r此欄位已經開通了!")
            sel = -1;
            status = -1;
            return;
        }
        let item = info[sel].item;
        cm.sendYesNo("是否確認要開通#b" + info[sel].name + "欄位?\r\n需要#d#v" + item.id + "##t" + item.id + "# x " + item.quantity + "#k")
    } else if (status === 2) {
        let item = info[sel].item;
        if (!cm.haveItem(item.id, item.quantity)) {
            cm.sendNext("需求道具不足");
            cm.dispose();
            return;
        }
        if (cmb.addEquipmentSlotRequirementAvailableSlot(info[sel].slot)) {
            cm.gainItem(item.id, -item.quantity);
            cm.sendNext("#r" + info[sel].name + "欄位開通成功!");
        }
        cm.dispose();
    }
}
