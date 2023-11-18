import { Guild, GuildAuditLogs, GuildAuditLogsEntry } from "discord.js";
import { db } from "../../prisma/index.js";

export const getCreator = async (guild: Guild) => {
    const botId = process.env.BOT_ID as string;
    const auditLogs: GuildAuditLogs = await guild.fetchAuditLogs({
        type: 80,
    });
    const integrationCreateEntry: GuildAuditLogsEntry | undefined = auditLogs.entries.find((entry: GuildAuditLogsEntry) => entry.targetId === botId);

    const validCreator = await db.user.findUnique({
        where: {
            role: "CREATOR",
            discordUserId: integrationCreateEntry?.executor?.id,
        }
    })
    if(!validCreator) return null;

    return integrationCreateEntry?.executor || null;
}