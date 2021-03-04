import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { MessageRecieved, MeetingStart, GlobalContext, CommandManager, CommandHandler } from './objects';
import { register_commands } from './commands';
import { register_custom_commands } from './custom_commands';
import { load_config } from './config';
import { Command } from 'commander';

const PORT = process.env.PORT || 9812;

const app = express();
const httpServer = http.createServer();
const server = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

app.use(express.json());

const command_manager = new Command();
command_manager.exitOverride();
command_manager.configureOutput({});
const command_help: Map<string, string> = new Map();

const global_context: GlobalContext = {
    message: null,
    send_message: () => { }
}

command_manager.command('help')
    .description('See a list of commands')
    .action(() => {
        let help_message = 'GM-Bot 🤖 v1.0.0\n\nHere is a list of my commands:';
        for (const [name, help] of command_help.entries()) {
            help_message += `\n!${name} -> ${help}`;
        }
        global_context.send_message(help_message);
    });

const config = load_config();

const cmd_manager: CommandManager = {
    add_command<T>(name: string, desc: string, help: string, handler: CommandHandler<T>) {
        command_manager.command(desc)
            .description(help)
            .action((...args: any[]) => {
                handler(args[0] as T);
            });
        command_help.set(name, help);
    }
}

config.simple_commands.forEach(({name, help, message}) => {
    cmd_manager.add_command(name, name, help, () => {
        global_context.send_message(message);
    })
})

register_commands(cmd_manager, global_context);
register_custom_commands(cmd_manager, global_context);

server.on('connection', (socket: Socket) => {
    socket.on('meeting_start', (info: MeetingStart) => {
        console.log('joined meeting', info.meeting_id);
    });

    socket.emit('hello', 'o/');

    socket.on('chat_message_recieved', (message: MessageRecieved) => {
        if (message.user === 'You' && !config.allow_self) {
            return;
        }

        if (!message.message.startsWith('!')) {
            return;
        }

        const command_parts = message.message.substring(1).trim().split(' ');
        command_parts.unshift('!', '!'); // we do this to trick commander into using the right things.

        try {
            global_context.send_message = message => socket.emit('send_message', message);
            global_context.message = message;
            command_manager.parse(command_parts);
            global_context.message = null;
            global_context.send_message = () => {};
        } catch (e) {
            socket.emit('send_message', 'Failed to run command:\n' + e.message);
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
