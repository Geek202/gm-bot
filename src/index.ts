import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { MessageRecieved, MeetingStart } from './objects';
import { register_commands } from './commands';
import { register_custom_commands } from './custom_commands';
import { load_config } from './config';

const PORT = process.env.PORT || 9812;

const app = express();
const httpServer = http.createServer();
const server = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

app.use(express.json());

type Command = (message: MessageRecieved, args: string[], send_message: (message: string) => void) => void;

const commands: Map<string, Command> = new Map();
const command_help: Map<string, string> = new Map();

// Leave this as a wrapper so that old commands dont need to change.
function add_command(name: string, help: string, action: (m: MessageRecieved, s: (m: string) => void) => void) {
    command(name, help, (m, _, s) => action(m, s));
}

function command(name: string, help: string, action: Command) {
    commands.set(name, action);
    command_help.set(name, help);
}

const config = load_config();

config.simple_commands.forEach(({name, help, message}) => {
    add_command(name, help, (_, send_message) => send_message(message));
})

register_commands(add_command, command, () => command_help);
register_custom_commands(add_command, command, () => command_help);

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

        // console.log('message', JSON.stringify(message));
        const command_parts = message.message.substring(1).split(' ');
        const command = command_parts[0];
        if (commands.get(command) !== undefined) {
            const cmd = commands.get(command) as Command;
            cmd(message, command_parts.slice(1), msg => socket.emit('send_message', msg));
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
