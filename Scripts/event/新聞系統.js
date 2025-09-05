let maxLoopTime = 50;
let setupTask;
let lastMessageList = [];

function init() {
    if (cm.getChannel() === 1) {
        scheduleNew();
    }
}

function scheduleNew() {
    setupTask = cm.schedule("start", 1 * 60 * 1000);
}

function cancelSchedule() {
    if (setupTask != null && setupTask !== undefined) {
        setupTask.cancel(false);
        setupTask = null;
    }
}

function start() {
    scheduleNew();

    let currentCount = 0;
    let list = cm.getAllNews();
    let newMessage = cm.getLatestNews();

    if (newMessage == null || newMessage === undefined) {
        newMessage = list[Math.floor(Math.random() * list.length)];
    }

    if (newMessage !== undefined) {
        while (lastMessageList.indexOf(newMessage.substring(0, newMessage.indexOf(" - "))) !== -1) {
            currentCount++;
            newMessage = list[Math.floor(Math.random() * list.length)];
            if (currentCount >= maxLoopTime) {
                break;
            }
        }

        if (newMessage !== undefined) {
            cm.setWeekEventMessage("[最新新聞] " + newMessage);
            if (lastMessageList.length >= 10) {
                lastMessageList = [];
            }
            lastMessageList.push(newMessage.substring(0, newMessage.indexOf(" - ")));
        }
    }
}
