import OpenAI from "openai";
import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../utility/types";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("ask")
        .addStringOption((option) =>
            option
                .setName("question")
                .setDescription("The message to generate a response from")
                .setRequired(true)
        )
        .setDescription("Ask a question to the great and wise Jonathan Yun."),
    execute: async (interaction) => {
        const message = interaction.options.getString("question");

        try {
            if (!message) {
                // Handle the case where message is null
                await interaction.reply({
                    content: "Please provide a message.",
                    ephemeral: true,
                });
                return;
            }

            await interaction.deferReply();
            const completion = await openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [{ role: "user", content: message + process.env.AI_PROMPT }],
            });

            const response = completion.choices[0]?.message.content ?? null;

            if (response !== null) {
                return await interaction.editReply(
                    `${interaction.user}: ${message}\n\n**Jonathan Yun**: ${response}`
                );
            } else {
                return await interaction.editReply({
                    content: "No response from the AI.",
                });
            }
        } catch (error) {
            console.error(error);
            return await interaction.editReply({
                content: "Sorry, there was an error processing your request!",
            });
        }
    },
    cooldown: 5,
};

export default command;
