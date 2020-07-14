import { setupHelp } from './commands/help';
import { setupStart } from './commands/start';
import { setupAdd } from './commands/add';
import { bot } from './helpers/bot';
import { setupCronJob } from './helpers/cron';
import { setupSaved } from './commands/saved';
import { setupDelete } from './commands/delete';

// Handle /start command
setupStart(bot);

// Handle /pomoc & /help command
setupHelp(bot);

// Handle /dodaj & /add command
setupAdd(bot);

/// Handle delete
setupDelete(bot);

// Handle /zapisane & /saved command
setupSaved(bot);

// Handle CRON job
setupCronJob('*/5 * * * *', bot);

// Launch bot
bot.launch();