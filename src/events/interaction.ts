import { event, Events } from '../utils/index.js';
import * as commandModules from '../commands/index.js';

const commands = Object(commandModules)

export default event(Events.InteractionCreate, ({ log }, interaction) => {
    if(!interaction.isCommand()) return;

    const { commandName } = interaction;

    commands[commandName].execute(interaction);

    return log(`Interaction: ${interaction.commandName}`);
});
