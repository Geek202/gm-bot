import { AddCommand, Command } from './objects';
import { format_millis, format_date } from './utils';
import { evaluate } from 'mathjs';
import { prime_factors, mean, infered_nth_term, linear_nth_term } from './maths';

// TODO: Use a library like https://www.npmjs.com/package/commander to handle commands.
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

    command('eval', 'Evaluate a mathmatical expression', (_, args, send_message) => {
        if (args.length == 0) {
            send_message('Usage: !eval <expression>');
            return;
        }
        try {
            const exp = args.join(' ');
            send_message(evaluate(exp));
        } catch (e) {
            send_message('Failed to evaluate expression: ' + JSON.stringify(e));
        }
    });

    command('prime_factors', 'List the prime factors of a number', (_, args, send_message) => {
        if (args.length == 0) {
            send_message('Usage: !prime_factors <number>');
            return;
        }

        const num = parseInt(args[0]);
        if (isNaN(num)) {
            send_message('Usage: !prime_factors <number>');
            return;
        }

        send_message(`Prime factors of ${num} are ${prime_factors(num)}`);
    });

    command('mean', 'Find the mean of a list of values', (_, args, send_message) => {
        if (args.length < 2) {
            send_message('Usage: !mean <list of 2 or more numbers>');
            return;
        }

        const values = args.map((arg) => parseFloat(arg));
        if (values.some((v) => isNaN(v))) {
            send_message('Usage: !mean <list of 2 or more numbers>');
            return;
        }

        send_message(`Mean: ${mean(values)}`)
    });

    command('nth_term', 'Compute the linear or quadratic nth term of a set of numbers', (_, args, send_message) => {
        if (args.length == 0) {
            send_message('Usage: !nth_term <list of 4 or more numbers>');
            return;
        }

        const infer_quadratic = args.length >= 3;

        console.log('args', args);

        let nth_term;
        if (infer_quadratic) {
            nth_term = infered_nth_term(args.map(arg => parseInt(arg)));
        } else {
            send_message('Note: nth term calculations require at least 3 numbers to infer if it is quadratic. Will assume this sequence is linear');
            nth_term = linear_nth_term(args.map(arg => parseInt(arg)));
        }

        send_message(`Nth term: ${nth_term}`);
    });
}
