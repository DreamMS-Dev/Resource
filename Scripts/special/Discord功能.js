let status = -1, sel = -1, sel2 = -1;
let info = null;
let pendingId = null;
let pendingNick = null;

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
    if (status < 0) {
        cm.dispose();
    } else if (status === 0) {
        let message = "歡迎使用Discord功能區\r\n\r\n";
        if (cm.getClient().getDiscordId() == null) {
            message += "#L0#我要#b查看#k申請綁定的Discord帳號列表#l\r\n";
            message += "#L1#我要#r移除#k所有申請綁定的Discord帳號列表#l\r\n";
        } else {
            message += "#L100#我要#r解除#k綁定Discord帳號#l\r\n";
            message += "#L101#修改Discord二組密碼開關 (目前已" + (cm.getClient().isDiscordOtp() ? "#r開啟#k" : "#b關閉#k") + ")#l\r\n";
            message += "#L102#修改Discord登入提示開關 (目前已" + (cm.getClient().isDiscordLoginNotice() ? "#r開啟#k" : "#b關閉#k") + ")#l\r\n";
            message += "#L103#修改精靈商人#d購買#k提示開關 (目前已" + (cmb.isEntrustedShopPurchasedDiscordPrivateNotice() ? "#r開啟#k" : "#b關閉#k") + ")#l\r\n";
            message += "#L104#修改精靈商人#d過期#k提示開關 (目前已" + (cmb.isEntrustedShopClosedDiscordPrivateNotice() ? "#r開啟#k" : "#b關閉#k") + ")#l\r\n";
        }
        cm.sendSimple(message);
    } else if (status === 1) {
        if (mode === 1) {
            sel = selection;
        }
        if (sel <= 1 && cm.getClient().getDiscordId() != null) {
            cm.sendNext("#r發生未知錯誤1");
            cm.dispose();
            return;
        } else if (sel >= 100 && cm.getClient().getDiscordId() == null) {
            cm.sendNext("#r發生未知錯誤2");
            cm.dispose();
            return;
        }
        if (sel === 0) {
            info = cm.getDiscordApplyInfo(cm.getPlayer().getId());
            if (info.isEmpty()) {
                cm.sendNext("#d目前沒有任何申請綁定的Discord帳號");
                status = -1;
                sel = -1;
                info = null;
                return;
            }
            let message = "目前申請列表:\r\n\r\n";
            let iter = info.entrySet().iterator();
            let i = 0;
            while (iter.hasNext()) {
                let next = iter.next();
                let discordId = next.getKey();
                let discordNick = next.getValue();
                message += "#L" + i + "#綁定Discord: #r" + discordNick + "#k#l\r\n";
                i++;
            }
            cm.sendSimple(message);
        } else if (sel === 1) {
            cm.removeDiscordAllApplyInfoByCharacterId(cm.getPlayer().getId());
            cm.sendNext("#d移除所有#b申請綁定的Discord帳號列表#r完成");
            status = -1;
            sel = -1;
        } else if (sel === 100) {
            cm.sendNext("#d是否確認要#b解除綁定Discord帳號#d?");
        } else if (sel === 101) {
            cm.getClient().setDiscordOtp(!cm.getClient().isDiscordOtp());
            status = -1;
            sel = -1;
            action(1, 0, 0);
        } else if (sel === 102) {
            cm.getClient().setDiscordLoginNotice(!cm.getClient().isDiscordLoginNotice());
            status = -1;
            sel = -1;
            action(1, 0, 0);
        } else if (sel === 103) {
            cmb.setEntrustedShopPurchasedDiscordPrivateNotice(!cmb.isEntrustedShopPurchasedDiscordPrivateNotice());
            status = -1;
            sel = -1;
            action(1, 0, 0);
        } else if (sel === 104) {
            cmb.setEntrustedShopClosedDiscordPrivateNotice(!cmb.isEntrustedShopClosedDiscordPrivateNotice());
            status = -1;
            sel = -1;
            action(1, 0, 0);
        } else {
            cm.dispose();
        }
    } else if (status === 2) {
        if (mode === 1) {
            sel2 = selection;
        }
        if (sel === 0) {
            let iter = info.entrySet().iterator();
            let i = 0;
            while (iter.hasNext()) {
                let next = iter.next();
                if (i === sel2) {
                    pendingId = next.getKey();
                    pendingNick = next.getValue();
                    break;
                } else {
                    i++;
                }
            }
            cm.sendYesNo("是否確認綁定Discord: #r" + pendingNick);
        } else if (sel === 100) {
            cm.sendGetText("#d確認要#b解除綁定Discord帳號#d的話，必須輸入二組密碼來確認");
        } else {
            cm.dispose();
        }
    } else if (status === 3) {
        if (sel === 0) {
            cm.sendGetText("#d確認要#b綁定Discord[" + pendingNick + "]#d的話，必須輸入二組密碼來確認");
        } else if (sel === 100) {
            if (cm.getClient().checkSecondPassword(cm.getText())) {
                cm.sendYesNo("第二組密碼已驗證完成，最終確認是否#r解除綁定Discord帳號#k?")
            } else {
                cm.sendNext("#d由於第二組密碼輸入錯誤，解除綁定#r失敗");
                status = -1;
                sel = -1;
                sel2 = -1;
            }
        } else {
            cm.dispose();
        }
    } else if (status === 4) {
        if (sel === 0) {
            if (cm.getClient().checkSecondPassword(cm.getText())) {
                cm.sendYesNo("第二組密碼已驗證完成，最終確認是否\r\n#r綁定Discord" + pendingNick + "(" + pendingId + ")#k?")
            } else {
                cm.sendNext("#d由於第二組密碼輸入錯誤，綁定#r失敗");
                status = -1;
                sel = -1;
                sel2 = -1;
                pendingNick = null;
                pendingId = null;
            }
        } else if (sel === 100) {
            cm.sendNext("#r解除綁定Discord帳號#d完成")
            cm.sendDiscordPrivateMessage(cm.getClient().getDiscordId(), cm.getReadableTime() + " 角色[" + cm.getPlayer().getName() + "]已經解除與此Discord綁定");
            cm.removeDiscordBinding(cm.getPlayer());
            cm.getClient().setDiscordOtp(false);
            cm.getClient().setDiscordLoginNotice(false);
            status = -1;
            sel = -1;
            sel2 = -1;
        } else {
            cm.dispose();
        }
    } else if (status === 5) {
        if (sel === 0) {
            cm.removeDiscordAllApplyInfoByCharacterId(cm.getPlayer().getId());
            cm.addDiscordBinding(cm.getPlayer(), pendingId);
            cm.sendNext("#r綁定Discord帳號[" + pendingNick + "]#d完成!");
            cm.sendDiscordPrivateMessage(pendingId, cm.getReadableTime() + " 角色[" + cm.getPlayer().getName() + "]已經綁定本Discord");
            cm.getClient().setDiscordLoginNotice(true);
            status = -1;
            sel = -1;
            sel2 = -1;
            pendingNick = null;
            pendingId = null;
        }
    }

}


