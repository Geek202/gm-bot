import { readFileSync } from 'fs';

interface SimpleCommand {
    name: string,
    help: string,
    message: string
}

interface Config {
    allow_self: boolean,
    simple_commands: SimpleCommand[],
}

export function load_config(): Config {
    return JSON.parse(readFileSync('config.json', 'utf-8'));
}
