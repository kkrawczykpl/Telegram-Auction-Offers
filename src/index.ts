import { setupHelp } from './commands/help';
import { setupStart } from './commands/start';
import { setupAdd } from './commands/add';
import { bot } from './helpers/bot';
import { setupCronJob } from './helpers/cron';

// Handle /start command
setupStart(bot);

// Handle /help && /pomoc command
setupHelp(bot);

// Handle /dodaj command
setupAdd(bot);

setupCronJob('*/5 * * * *', bot);

// Launch bot
bot.launch();