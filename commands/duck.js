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
    description: 'gives you a randomised cute duck photo yayayaya',
    slash: false,
    testOnly: true,
    callback: ({ message }) => __awaiter(void 0, void 0, void 0, function* () {
        const duckFiles = fs_1.default.readdirSync('./images/duck images/');
        const duckImagesArray = [];
        for (const duckImages of duckFiles) {
            duckImagesArray.push(duckImages);
        }
        ;
        const duckImage = duckImagesArray[Math.floor(Math.random() * duckImagesArray.length)];
        const duckImageLocation = new discord_js_1.MessageAttachment(String('images/duck images/' + duckImage), duckImage);
        const embed = new discord_js_1.MessageEmbed()
            .setDescription('awwwww cute duck')
            .setTitle('Cute ducks')
            .setColor('AQUA')
            .setImage(`attachment://${duckImage}`);
        yield message.reply({
            embeds: [embed],
            files: [duckImageLocation]
        });
    }),
};
