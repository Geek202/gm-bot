import { AddCommand, Command } from './objects';
import { format_millis, format_date } from './utils';
import { evaluate } from 'mathjs';

export function register_commands(add_command: AddCommand, command: Command, help_getter: () => Map<string, string>) {
    add_command('help', 'You are here', (_, send_message) => {
        let help_message = 'GM-Bot v1.0.0\n\nHere is a list of my commands:';
        for (const [name, help] of help_getter().entries()) {
            help_message += `\n!${name} -> ${help}`;
        }
        send_message(help_message);
    });

    add_command('uptime', 'See how long I\'ve been in this meeting', (message, send_message) => {
        const now = new Date();
        const start_time_millis = message.meeting.start_time;
        if (start_time_millis !== undefined) {
            const start_time = new Date(start_time_millis);
            send_message(`I have been in this meeting for ${format_millis(now.valueOf() - start_time.valueOf())} and I joined at ⏰ ${format_date(start_time)}`);
        } else {
            send_message('😕 I don\'t remember when I joined this meeting!');
        }
    });

    add_command('invite', 'Get the invite link for this meeting', (message, send_message) => {
        send_message(`✉️ Invite link: https://meet.google.com/${message.meeting.id} (hint: you can copy this from the address bar in your browser :P)`);
    });

    add_command('member_count', 'Get the member count of this meeting', (message, send_message) => {
        send_message(`There are ${message.meeting.member_count} 🧍 people in this meeting`);
    });

    add_command('about', 'Get info about this bot', (_, send_message) => {
        send_message('Hello 👋\nI\'m GM-Bot, a simple bot for Google Meet chat.\n I was created by Tom_The_Geek and you can check out my code on GitHub at https://github.com/Geek202/gm-bot. You can use !help to get a list of commands if reading code isn\'t for you 🙃')
    });

    command('eval', 'Evaluate a mathmatical expression', (message, args, send_message) => {
        try {
            const exp = args.join(' ');
            send_message(evaluate(exp));
        } catch (e) {
            send_message('Failed to evaluate expression: ' + JSON.stringify(e));
        }
    });
}
