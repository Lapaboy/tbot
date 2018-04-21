const TelegramBot = require('node-telegram-bot-api');
const {TOKEN, IP_ADRESS, PORT} = require('./access');
const exec = require('child_process').exec;

const ERRORS = {
    NOT_PRIVATE: 'Chat should be private!'
}

const bot = new TelegramBot(TOKEN, {polling: true});

bot.onText(/(.*)/, function (msg, match) {
    const userId = msg.from.id;
    if (msg.chat.type !== 'private') {
        //log request from chat
        bot.sendMessage(userId, ERRORS.NOT_PRIVATE);
        return;
    }

    //escape here
    exec(`id -u ${msg.from.username}`, (err, stdout) => {
        console.log('This is stdout>>');
        console.log('length:', stdout.length);
        if (!stdout.length) {
            console.log('CREATE', stdout);
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
    exec(`echo -e '${username}\n${username}\n' | sudo passwd ${username}`, (err, stdout) => {
        //log usercreated
        showUrl(username, userId);
    });
};

function showUrl(username, userId) {
    const url = getFormattedUrl(username);
    bot.sendMessage(userId, url);
}

function getFormattedUrl(name) {
    return `https://t.me/socks?server=${IP_ADRESS}&port=${PORT}&user=${name}&pass=${name}`;
};