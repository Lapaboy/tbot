const TelegramBot = require('node-telegram-bot-api');
const TOKEN = require('./access').TOKEN;
const exec = require('child_process').exec;

const ERRORS = {
    NOT_PRIVATE: 'Chat should be private!'
}

const bot = new TelegramBot(TOKEN, {polling: true});

bot.onText(/(.*)/, function (msg, match) {
    const userId = msg.from.id;
    if (msg.chat.type === 'private') {
        //log request from chat
        bot.sendMessage(userId, ERRORS.NOT_PRIVATE);
        return;
    }

    //escape here
    exec(`id -u ${msg.from.username}`, (err, stdout) => {
        if (typeof parseInt(stdout) !== 'number') {
            createUser(msg.from.username, userId);
        } else {
            //log existed user reqesting url
            showUrl(msg.from.username, userId);
        }
    });
});

function createUser(username, userId) {
    //escape here
    exec(`echo ${username} | passwd ${username} --stdin`, (err, stdout) => {
        //log usercreated
        console.log('user created?\n', stdout);
        showUrl(username, userId);
    });
};

function showUrl(username, usrId) {
    const url = getFormattedUrl(username);
    bot.sendMessage(userId, url);
}