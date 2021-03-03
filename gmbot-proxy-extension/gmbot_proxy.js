function tomthegeek_gmbot_getChatContainer() {
    return document.querySelector(".z38b6");
}

function tomthegeek_gmbot_getChatMessageBox() {
    return document.querySelector('div > div > div > div > div > div > div[data-is-persistent=\"true\"] > div > div > span > div[data-reverse-order=\"false\"] > div > div > div > div > textarea');
}

function tomthegeek_gmbot_getSendMessageButton() {
    return document.querySelector('div.uArJ5e.Y5FYJe.cjq2Db.IOMpW.Cs0vCd.RDPZE');
}

function log(...message) {
    console.log('[GMBot Proxy Extension]', ...message);
}

function send_message(message) {
    const message_box = tomthegeek_gmbot_getChatMessageBox();
    const send_button = tomthegeek_gmbot_getSendMessageButton();

    if (message_box === null || send_button === null) {
        return;
    }

    const old_value = message_box.value;
    message_box.value = message;
    send_button.ariaDisabled = null;
    send_button.click();
    message_box.value = old_value;
}

function get_member_count() {
    const member_count_string = document.querySelector('span.rua5Nb').innerText;
    const member_count = parseInt(member_count_string.substring(1, member_count_string.length - 1));
    return member_count;
}

async function tomthegeek_gmbot_check_for_new_messages() {
    const chat_container = tomthegeek_gmbot_getChatContainer();
    if (chat_container !== null) {
        const new_messages = [];
        const message_blocks = chat_container.children;
        for (let i = 0; i < message_blocks.length; i++) {
            const message_block = message_blocks[i];
            const author = message_block.dataset.senderName;
            const timestamp = parseInt(message_block.dataset.timestamp);
            const message_elements = message_block.children[1].children;
            for (let i = 0; i < message_elements.length; i++) {
                const message_element = message_elements[i];
                const message_content = message_element.dataset.messageText;
                new_messages.push({
                    user: author,
                    message :message_content,
                    timestamp,
                });
            }
        }
        const old_messages = window.gmbot_data.messages;
        const created_messages = _.differenceWith(new_messages, old_messages, _.isEqual);
        const member_count = get_member_count();
        created_messages.forEach((message) => {
            console.log(message);
            window.gmbot_data.socket.emit('chat_message_recieved', {...message, meeting: {
                id: window.location.pathname.substring(1),
                start_time: window.start_time,
                member_count: member_count
            }});
        })
        window.gmbot_data.messages = new_messages;
    }
}

async function tomthegeek_gmbot_message_check_loop() {
    setInterval(tomthegeek_gmbot_check_for_new_messages, 100);
}

async function tomthegeek_gmbot_initialise() {
    log('Waiting to join call...');
    // Wait until in call
    while (document.querySelector(".d7iDfe") !== null) {
        await new Promise((r) => setTimeout(r, 500));
    }

    window.start_time = new Date().valueOf();
    const socket = io('http://localhost:9812/');
    socket.on('connect', () => {
        log('connected!');
        socket.emit('meeting_start', {
            start_time: window.start_time,
            meeting_id: window.location.pathname.substring(1),
        });
    });

    socket.on('hello', (msg) => {
        log('[server]', msg);
    });

    socket.on('send_message', (message) => {
        console.log('[server]', '[send message]', message);
        send_message(message);
    });

    window.gmbot_data = {
        messages: [],
        socket,
    };
    tomthegeek_gmbot_message_check_loop();
}

tomthegeek_gmbot_initialise();
