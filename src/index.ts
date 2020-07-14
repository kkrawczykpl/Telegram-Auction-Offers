import { setupHelp } from './commands/help';
import { setupStart } from './commands/start';
import { bot } from './helpers/bot';
import { setupAdd } from './commands/add';

// Handle /start command
setupStart(bot);

// Handle /help && /pomoc command
setupHelp(bot);

// Handle /dodaj command
setupAdd(bot);

// Launch bot
bot.launch();