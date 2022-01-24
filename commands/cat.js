module.exports = {
    name: 'cat',
    description: 'you get a randomised cute cat photo yayay!! but sometimes you get james corden cat o.o',
    async execute(client, message, args, Discord) {
        const fs = require('fs');
        const catFiles = fs.readdirSync('./images/cat images/');
        const catImagesArray = [];
        for(const catImages of catFiles){
            catImagesArray.push(catImages);
        };
        const catImage = catImagesArray[Math.floor(Math.random()*catImagesArray.length)];
        const catImageLocation = new Discord.MessageAttachment(String('images/cat images/' + catImage), catImage)

        const embed = new Discord.MessageEmbed()
        .setDescription('awwwww cute cat')
        .setTitle('Cute cats')
        .setColor('AQUA')
        .setImage(`attachment://${catImage}`)

        await message.reply({
            embeds: [embed],
            files: [catImageLocation]
        })
    }
}