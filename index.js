const TelegramBot = require('node-telegram-bot-api');
const {TOKEN, IP_ADRESS, PORT} = require('./access');
const exec = require('child_process').exec;

const ERRORS = {
    NOT_PRIVATE: 'Chat should be private!'
}

const bot = new TelegramBot(TOKEN, {polling: true});

bot.onText(/(.*)/, function (msg, match) {
    const userId = msg.from.id;
    if (match[1] === 'ping') {
        bot.sendMessage(userId, '200');
        return;
    }
    
    if (msg.chat.type !== 'private') {
        //log request from chat
        bot.sendMessage(userId, ERRORS.NOT_PRIVATE);
        return;
    }

    //escape here
    exec(`id -u ${msg.from.username}`, (err, stdout) => {
        console.log('length:', stdout.length);
        if (!stdout.length) {
            createUser(msg.from.username, userId);
        } else {
            //log existed user reqesting url
            showUrl(msg.from.username, userId);
            console.log('EXIST!', stdout);
        }
    });
});

function createUser(username, userId) {
    //escape here
    exec(`useradd -MNs /bin/false ${username}`, (err, stdout) => {
        //log usercreated
        showUrl(username, userId);
    });

    exec(`sudo echo "${username}:${username}" | chpasswd`);

    
    // exec(`sudo echo ${username} | passwd ${username} --stdin`, (err, stdout) => {
    //     //log usercreated
    //     showUrl(username, userId);
    // });
};

function showUrl(username, userId) {
    const url = getFormattedUrl(username);
    bot.sendMessage(userId, url);
}

function getFormattedUrl(name) {
    return `https://t.me/socks?server=${IP_ADRESS}&port=${PORT}&user=${name}&pass=${name}`;
};