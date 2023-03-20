
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});
const webAppUrl = 'https://relaxed-rabanadas-61e839.netlify.app'

const PyrusUrl = "https://api.pyrus.com/v4"

let userData = {

}

const btnForm = {
    reply_markup: {
        keyboard: [
            [{text: 'Заполнить форму', web_app: {url: webAppUrl }}]
        ]
    }}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if(text === "/start"){
        await bot.sendMessage(chatId, "Ниже появиться кнопка, заполните форму", btnForm)
    }

    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            await bot.sendMessage(chatId, 'Ваше имя: ' + data?.fio);
            await bot.sendMessage(chatId, 'Ваш номер: ' + data?.number);
            await bot.sendMessage(chatId, 'Вы выбрали должность: ' + data?.jobTitle);
            await bot.sendMessage(chatId, 'Ваше гражданство: ' + data?.сship);
            await bot.sendMessage(chatId, 'Ваше сообщение: ' + data?.msg);
            userData = JSON.parse(msg?.web_app_data?.data)
            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Спасибо за обратную связь! С вами свяжется наш HR менеджер')
            }, 3000)
        } catch (e) {
            console.log(e);
            await bot.sendMessage(chatId, 'Что-то пошло не так ');
        }
    }
});




