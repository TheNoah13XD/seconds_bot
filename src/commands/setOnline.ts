import { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } from "discord.js";
import { db } from "../../prisma/index.js";

export const data = new SlashCommandBuilder()
    .setName("online")
    .setDescription("Announce your Seconds status.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const execute = async (interaction: CommandInteraction) => {
    const creator = await db.user.findFirst({
        where: {
            role: "CREATOR",
            discordUserId: interaction.user.id,
        }
    });
    
    if (!creator) {
        await interaction.reply({
            content: "You are not a Seconds creator.",
            ephemeral: true,
        });
        return;
    }

    await interaction.reply(`@${creator.username} is currently online on Seconds! Video call them now. https://seconds.link/${creator.username}`);
}
