module.exports = {
    name: 'duck',
    description: 'gives you a randomised cute duck photo yayayaya',
    async execute(client, message, args, Discord) {
        const fs = require('fs');
        const duckFiles = fs.readdirSync('./images/duck images/');
        const duckImagesArray = [];
        for(const duckImages of duckFiles){
            duckImagesArray.push(duckImages);
        };
        const duckImage = duckImagesArray[Math.floor(Math.random()*duckImagesArray.length)];
        const duckImageLocation = new Discord.MessageAttachment(String('images/duck images/' + duckImage), duckImage)

        const embed = new Discord.MessageEmbed()
        .setDescription('awwwww cute duck')
        .setTitle('Cute ducks')
        .setColor('AQUA')
        .setImage(`attachment://${duckImage}`)

        await message.reply({
            embeds: [embed],
            files: [duckImageLocation]
        })
    }
}