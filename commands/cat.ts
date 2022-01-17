import { ICommand } from "wokcommands";
import Discord, { MessageAttachment, MessageEmbed } from "discord.js";
import fs from 'fs'

export default {
    category: 'Testing',
    description: 'gives you a randomised cute cat photo yayayaya',

    slash: false,
    testOnly: true,

    callback: async ({ message}) => {
        const catFiles = fs.readdirSync('./images/cat images/');
        const catImagesArray = [];
        for(const catImages of catFiles){
            catImagesArray.push(catImages);
        };
        const catImage = catImagesArray[Math.floor(Math.random()*catImagesArray.length)];
        const catImageLocation = new MessageAttachment(String('images/cat images/' + catImage), catImage)

        const embed = new MessageEmbed()
        .setDescription('awwwww cute cat')
        .setTitle('Cute cats')
        .setColor('AQUA')
        .setImage(`attachment://${catImage}`)

        await message.reply({
            embeds: [embed],
            files: [catImageLocation]
        })
    },
} as ICommand
