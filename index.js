const TelegramBot = require('node-telegram-bot-api');

require('dotenv').config();
const token = process.env.TOKEN;

const axios = require('axios');
const webAppUrl = 'https://relaxed-rabanadas-61e839.netlify.app'

const PyrusUrl = "https://api.pyrus.com/v4"

const bot = new TelegramBot(token, {polling: true});




const btnForm = {
    reply_markup: {
        keyboard: [
            [{text: 'Заполнить форму', web_app: {url: webAppUrl }}]
        ]
    }};

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
            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Спасибо за обратную связь! С вами свяжется наш HR менеджер')
            }, 3000)


            const TempPyrusToken = await axios.post(PyrusUrl +"/auth", {
                login: `${process.env.LOGIN}`,
                security_key: `${process.env.PASS}`
              })
              let taskPyrus = {

                "form_id": 1080331,
               "fields": [
                {
                    "id": 1,
                    "value": `${data?.fio}`
                },
                {
                    "id": 7,
                    "value": `${data?.number}`
                },
                {
                    "id": 55,
                    "value": `${data?.jobTitle}`
                },
                {
                    "id": 54,
                    "value": `${data?.сship}`
                },
                {
                    "id": 34,
                    "value": `${data?.msg}`
                },
                ]
             }
            // console.log(TempPyrusToken.data.access_token)
            const sendForm = await axios.post(PyrusUrl + "/tasks", JSON.stringify(taskPyrus), {
               
                headers: {
                 'Content-Type': "application/json",
                 'Authorization': `Bearer ${TempPyrusToken.data.access_token}`
                },
                
             });
             console.log(sendForm.data)

        } catch (e) {
            console.log(e);
            await bot.sendMessage(chatId, 'Что-то пошло не так ');
        }
       
    }
});




