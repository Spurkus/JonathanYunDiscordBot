"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
exports.default = {
    category: 'Testing',
    description: '50/50 chance of getting pets or feet pics',
    slash: false,
    testOnly: true,
    callback: ({ message }) => __awaiter(void 0, void 0, void 0, function* () {
        var petfeet = Math.random() < 0.5;
        if (petfeet === true) {
            const petFiles = fs_1.default.readdirSync('./images/pet images/');
            const petImagesArray = [];
            for (const petImages of petFiles) {
                petImagesArray.push(petImages);
            }
            ;
            const petImage = petImagesArray[Math.floor(Math.random() * petImagesArray.length)];
            const petImageLocation = new discord_js_1.MessageAttachment(String('images/pet images/' + petImage), petImage);
            const embed = new discord_js_1.MessageEmbed()
                .setDescription('awwwww cute pet')
                .setTitle('Cute pets')
                .setColor('AQUA')
                .setImage(`attachment://${petImage}`);
            yield message.reply({
                embeds: [embed],
                files: [petImageLocation]
            });
        }
        else {
            const feetFiles = fs_1.default.readdirSync('./images/feet images/');
            const feetImagesArray = [];
            for (const feetImages of feetFiles) {
                feetImagesArray.push(feetImages);
            }
            ;
            const feetImage = feetImagesArray[Math.floor(Math.random() * feetImagesArray.length)];
            const feetImageLocation = new discord_js_1.MessageAttachment(String('images/feet images/' + feetImage), feetImage);
            const embed = new discord_js_1.MessageEmbed()
                .setDescription('*mmmmmmmmmmmmm* feet is so hot *slurp slurp slurrrrp* yum yummyy')
                .setTitle('hot feet :hot_face: :hot_face:')
                .setColor('AQUA')
                .setImage(`attachment://${feetImage}`);
            yield message.reply({
                embeds: [embed],
                files: [feetImageLocation]
            });
        }
    }),
};
