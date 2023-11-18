import { Guild, User, GuildMember, Colors, Role } from 'discord.js';
import { event, Events } from '../utils/index.js';
import { getCreator } from '../utils/getCreator.js';
import { db } from '../../prisma/index.js';

export default event(Events.GuildCreate, async ({ log }, guild: Guild) => {
    const creator: User | null = await getCreator(guild);
    if(!creator) {
        guild.systemChannel?.send('No valid creator found! Please authenticate your Discord account with your Seconds creator account.');
        return;
    }

    const role: Role = await guild.roles.create({
        name: 'creator',
        color: Colors.Blue,
        reason: 'role for the creator in seconds',
    });

    if (creator) {
        const creatorMember: GuildMember = await guild.members.fetch(creator.id);
        await creatorMember.roles.add(role);

        const secondsCreator = await db.user.findFirst({
            where: {
                role: "CREATOR",
                discordUserId: creator.id,
            },
        });

        guild.systemChannel?.send(`Hello ${secondsCreator?.name}!`);
    }
});