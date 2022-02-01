const profileModel = require("../models/profileSchema");
module.exports = {
    name: "beg",
    aliases: [],
    cooldown: 10,
    description: "beg for coins",
    async execute(client, message, args, Discord, profileData){
        const randomChance = Math.floor(Math.random() * 100);
        if(randomChance <= 15){
            var randomNumber = 0;
            message.reply(`${message.author.username}, you begged and nobody likes you so recieved nothing LMAOO. ¥${randomNumber} **YunBucks** was added`);
        } else if(randomChance <= 25 && profileData.coins > 200){
            var randomNumber = -Math.floor(Math.random() * 200) + 1;
            var pos = randomNumber * -1;
            message.reply(`${message.author.username}, you begged and someone hates you so they decided to rob you L. ¥${pos} **YunBucks** was taken from your wallet`);
        } else {
            var randomNumber = Math.floor(Math.random() * 500) + 1;
            message.reply(`${message.author.username}, you begged and recieved ¥${randomNumber} **YunBucks**.`);
        }
        const response = await profileModel.findOneAndUpdate(
            {
                userID: message.author.id,
            },
            {
                $inc: {
                    coins: randomNumber,
                },
            }
        );
  },
};

