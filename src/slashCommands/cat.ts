import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { imageFinder } from "../utility/functions";
import { SlashCommand } from "../utility/types";
import { TheCatAPI } from "@thatapicompany/thecatapi";

const catApiKey = process.env.CATAPI_KEY;
if (!catApiKey) {
    throw new Error("CATAPI_KEY is not defined in environment variables.");
}

const theCatAPI = new TheCatAPI(catApiKey);

const command: SlashCommand = {
    command: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("You get a randomised cute cat photo yayay!! but sometimes you get james corden cat o.o")
    ,
    execute: async interaction => {

        theCatAPI.images
            .searchImages({
              limit: 1,
            })
            .then((images) => {
                const embed = new EmbedBuilder()
                .setDescription("awwwww cute car")
                .setTitle("Cute cats")
                .setImage(`${images[0].url}`)
                .setColor(`Aqua`)
        
                interaction.reply({
                    embeds: [embed],
            })
            .catch((error) => {
              console.log("error cat")
            });

        
        })
    },
    cooldown: 5
}

export default command