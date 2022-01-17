import { ICommand } from "wokcommands";
import Discord, { MessageAttachment, MessageEmbed } from "discord.js";
import fs from 'fs'

export default {
    category: 'Testing',
    description: '50/50 chance of getting pets or feet pics',

    slash: false,
    testOnly: true,

    callback: async ({ message}) => {
        var petfeet = Math.random() < 0.5;
        if (petfeet === true){
            const petFiles = fs.readdirSync('./images/pet images/');
            const petImagesArray = [];
            for(const petImages of petFiles){
                petImagesArray.push(petImages);
            };
            const petImage = petImagesArray[Math.floor(Math.random()*petImagesArray.length)];
            const petImageLocation = new MessageAttachment(String('images/pet images/' + petImage), petImage)
    
            const embed = new MessageEmbed()
            .setDescription('awwwww cute pet')
            .setTitle('Cute pets')
            .setColor('AQUA')
            .setImage(`attachment://${petImage}`)
    
            await message.reply({
                embeds: [embed],
                files: [petImageLocation]
            })
        } else {
            const feetFiles = fs.readdirSync('./images/feet images/');
            const feetImagesArray = [];
            for(const feetImages of feetFiles){
                feetImagesArray.push(feetImages);
            };
            const feetImage = feetImagesArray[Math.floor(Math.random()*feetImagesArray.length)];
            const feetImageLocation = new MessageAttachment(String('images/feet images/' + feetImage), feetImage)


    
            const embed = new MessageEmbed()
            .setDescription('*mmmmmmmmmmmmm* feet is so hot *slurp slurp slurrrrp* yum yummyy')
            .setTitle('hot feet :hot_face: :hot_face:')
            .setColor('AQUA')
            .setImage(`attachment://${feetImage}`)
    
            await message.reply({
                embeds: [embed],
                files: [feetImageLocation]
            })
        }
    },
} as ICommand
