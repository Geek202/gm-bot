import { CommandManager, GlobalContext } from './objects';
import { format_millis, format_date } from './utils';
import { evaluate } from 'mathjs';
import { prime_factors, mean, infered_nth_term, linear_nth_term, hcf } from './maths';


export function register_commands(command_manager: CommandManager, context: GlobalContext) {
    command_manager.add_command('uptime', 'uptime', 'See how long I\'ve been in this meeting', () => {
        const now = new Date();
        const start_time_millis = context.message && context.message.meeting.start_time;
        if (start_time_millis !== null) {
            const start_time = new Date(start_time_millis);
            context.send_message(`I have been in this meeting for ${format_millis(now.valueOf() - start_time.valueOf())} and I joined at ⏰ ${format_date(start_time)}`);
        } else {
            context.send_message('😕 I don\'t remember when I joined this meeting!');
        }
    });

    command_manager.add_command('invite', 'invite', 'Get the invite link for this meeting', () => {
        context.send_message(`✉️ Invite link: https://meet.google.com/${context.message && context.message.meeting.id} (hint: you can copy this from the address bar in your browser :P)`);
    });

    command_manager.add_command('member_count', 'member_count', 'Get the member count of this meeting', () => {
        context.send_message(`There are ${context.message && context.message.meeting.member_count} 🧍 people in this meeting`);
    });

    command_manager.add_command('about', 'about', 'Get info about this bot', () => {
        context.send_message('Hello 👋\nI\'m GM-Bot, a simple bot for Google Meet chat.\n I was created by Tom_The_Geek and you can check out my code on GitHub at https://github.com/Geek202/gm-bot. You can use !help to get a list of commands if reading code isn\'t for you 🙃')
    });

    command_manager.add_command('eval', 'eval <expression...>', 'Evaluate a mathmatical expression', (args: string[]) => {
        if (args.length == 0) {
            context.send_message('Usage: !eval <expression...>');
            return;
        }

        const exp = args.join(' ');
        context.send_message(evaluate(exp));
    });

    command_manager.add_command('prime_factors', 'prime_factors <number>', 'List the prime factors of a number', (number: string) => {
        const num = parseInt(number);
        if (isNaN(num)) {
            context.send_message('Usage: !prime_factors <number>');
            return;
        }

        context.send_message(`Prime factors of ${num} are ${prime_factors(num).join(', ')}`);
    });

    command_manager.add_command('mean', 'mean <values...>', 'Find the mean of a list of values', (args: string[]) => {
        if (args.length < 2) {
            context.send_message('Usage: !mean <list of 2 or more numbers>');
            return;
        }

        const values: number[] = args.map(arg => parseFloat(arg));
        if (values.some((v) => isNaN(v))) {
            context.send_message('Usage: !mean <list of 2 or more numbers>');
            return;
        }

        context.send_message(`Mean: ${mean(values)}`)
    });

    command_manager.add_command('nth_term', 'nth_term <numbers...>', 'Compute the linear or quadratic nth term of a set of numbers', (values: string[]) => {
        if (values.length == 0) {
            context.send_message('Usage: !nth_term <list of 4 or more numbers>');
            return;
        }

        const infer_quadratic = values.length >= 3;

        let nth_term;
        if (infer_quadratic) {
            nth_term = infered_nth_term(values.map(arg => parseInt(arg)));
        } else {
            context.send_message('Note: nth term calculations require at least 3 numbers to infer if it is quadratic. Will assume this sequence is linear');
            nth_term = linear_nth_term(values.map(arg => parseInt(arg)));
        }

        context.send_message(`Nth term: ${nth_term}`);
    });

    command_manager.add_command('hcf', 'hcf <numbers...>', 'Find the Highest Common Factor of two numbers', (args: string[]) => {
        if (args.length !== 2) {
            context.send_message(`HCF requires exactly 2 numbers but ${args.length} were given!`);
            return;
        }

        context.send_message(`The HCF of ${args[0]} and ${args[1]} is ${hcf(parseInt(args[0]), parseInt(args[1]))}`);
    })
}
