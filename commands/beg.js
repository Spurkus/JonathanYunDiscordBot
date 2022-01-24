const profileModel = require("../models/profileSchema");
module.exports = {
    name: "beg",
    aliases: [],
    description: "beg for coins",
    async execute(client, message, args, Discord, profileData){
        const randomNumber = Math.floor(Math.random() * 500) + 1;
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
    return message.reply(`${message.author.username}, you begged and received ${randomNumber} **coins**`);
  },
};

