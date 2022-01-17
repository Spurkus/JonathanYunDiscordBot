import { ICommand } from "wokcommands";
import Discord, { MessageAttachment, MessageEmbed } from "discord.js";
import fs from 'fs'

export default {
    category: 'Testing',
    description: 'gives you a randomised cute duck photo yayayaya',

    slash: false,
    testOnly: true,

    callback: async ({ message}) => {
        const duckFiles = fs.readdirSync('./images/duck images/');
        const duckImagesArray = [];
        for(const duckImages of duckFiles){
            duckImagesArray.push(duckImages);
        };
        const duckImage = duckImagesArray[Math.floor(Math.random()*duckImagesArray.length)];
        const duckImageLocation = new MessageAttachment(String('images/duck images/' + duckImage), duckImage)

        const embed = new MessageEmbed()
        .setDescription('awwwww cute duck')
        .setTitle('Cute ducks')
        .setColor('AQUA')
        .setImage(`attachment://${duckImage}`)

        await message.reply({
            embeds: [embed],
            files: [duckImageLocation]
        })
    },
} as ICommand
