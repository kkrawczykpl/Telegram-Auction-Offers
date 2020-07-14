import fs from 'fs';

/**
 * Checks for Database file, if file does not exist, it creates one
 */
function getDatabase(): string {
    let file: string = "";
    if ( !fs.existsSync('./database.json') ) {
        fs.writeFileSync('./database.json', '{ "tasks": [] }', 'utf-8');
        return getDatabase();
    }else{
        file = fs.readFileSync('./database.json', 'utf-8');
    }
    return file;
}

async function saveDatabase(content: string): Promise<void> {
    try {
        fs.writeFileSync('./database.json', content, 'utf-8');
    } catch (err) {
        console.log(err);
        return;
    }
}

export { getDatabase, saveDatabase }