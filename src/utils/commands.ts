import { REST, Routes } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import { Keys } from '../keys.js';
import * as commandModules from '../commands/index.js';

type Command = {
    data: SlashCommandBuilder,
}

const commands = [];

for (const command of Object.values<Command>(commandModules)) {
    commands.push(command.data);
}

const rest = new REST({ version: '9' }).setToken(Keys.clientToken);

(async () => {
	try {
		const data = await rest.put(
			Routes.applicationCommands(Keys.clientId),
			{ body: commands },
		)
        
        console.log('Successfully registered application commands.')
	} catch (error) {
		console.error(error);
	}
})();
