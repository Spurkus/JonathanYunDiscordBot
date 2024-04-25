import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("compliment")
        .addStringOption((option) => {
            return option
                .setName("target")
                .setDescription("The person you want to compliment <3")
                .setRequired(true);
        })
        .setDescription("Gives you a random compliment :3"),
    execute: async (interaction) => {
        await interaction.deferReply();
        const compliments = [
            " is very cute :3",
            " is AMAZING!!!",
            " has a really nice smile :)",
            " is an incredible friend :)",
            " is soooo sexy ;)",
            " is almost as good as Jonathan Yun!",
            " has a special place in my heart╭( ๐ _๐)╮",
            ", here’s a hug ─=≡Σʕっ•ᴥ•ʔっ",
            ", whatever you're doing rn, you got this ᕦ(ò_óˇ)ᕤ",
            ", you'll get thru it ʕ•ᴥ•ʔ",
            ", here are some pats… ᵖᵃᵗ ᵖᵃᵗ ᵖᵃᵗ ",
            ", you make me blush O///O",
            ", 𝓴𝓲𝓼𝓼 𝓶𝒆 (´ ❥ `)ヽ⌒★",
            ", I hope you have a good morning and afternoon and night (ᴗᵔᴥᵔ)",
            ", I wish you the best :3",
            ", you give me butterflies (´ω｀*)",
            ", I have so much faith in you (∩`ω´)⊃))",
            ", I believe in you (・ω<)",
            ", I am proud of all your accomplishments ╰(ɵ̥̥ ˑ̫ ɵ̥̥ ╰)",
            ", you are doing amazing (＾＾)ｂ",
            ", you tried your best ʅ(́ ◡◝ )ʃ",
            ", (⌐■_■)--︻╦╤─ --- my love--- - --",
            ", heres a cat ฅ^•ﻌ•^ฅ",
            ", (𝒟𝓇𝒶𝓌 𝓂𝑒 𝓁𝒾𝓀𝑒 𝑜𝓃𝑒 𝑜𝒻 𝓎𝑜𝓊𝓇 𝒻𝓇𝑒𝓃𝒸𝒽 𝑔𝒾𝓇𝓁𝓈 )> ∠( ᐛ 」∠)",
            ", I appreciate you (*ˊᗜˋ*)",
            ", your pp must be 10 times the average size. 8====D",
            ", you’re the Jonathan to my Yun (-‿◦)",
        ];
        const compliment = compliments[Math.floor(Math.random() * compliments.length)];
        const target = interaction.options.getString("target");

        // Send the message to the same channel
        await interaction.editReply(`${target}${compliment}\nsent by ${interaction.member}`);
    },
    cooldown: 5,
};

export default command;
