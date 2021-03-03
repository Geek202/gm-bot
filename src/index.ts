import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { MessageRecieved, MeetingStart } from './objects';
import { register_commands } from './commands';

const PORT = process.env.PORT || 9812;

const app = express();
const httpServer = http.createServer();
const server = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

app.use(express.json());

type Command = (message: MessageRecieved, send_message: (message: string) => void) => void;

const commands: Map<string, Command> = new Map();
const command_help: Map<string, string> = new Map();

function add_command(name: string, help: string, action: (m: MessageRecieved, s: (m: string) => void) => void) {
    commands.set(name, action);
    command_help.set(name, help);
}

register_commands(add_command, () => command_help);

server.on('connection', (socket: Socket) => {
    socket.on('meeting_start', (info: MeetingStart) => {
        console.log('joined meeting', info.meeting_id);
    });

    socket.emit('hello', 'o/');

    socket.on('chat_message_recieved', (message: MessageRecieved) => {
        if (message.user === 'You') {
            return;
        }

        // console.log('message', JSON.stringify(message));
        const command_parts = message.message.substring(1).split(' ');
        const command = command_parts[0];
        if (commands.get(command) !== undefined) {
            const cmd = commands.get(command) as Command;
            cmd(message, msg => socket.emit('send_message', msg));
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
