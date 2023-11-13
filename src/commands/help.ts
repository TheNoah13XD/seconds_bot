import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Replies with a help message!");

export const execute = async (interaction: CommandInteraction) => {
    await interaction.reply("Your saviour is here!");
}