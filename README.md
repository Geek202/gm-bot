# GM-Bot
GM-Bot is a bot for Google Meet chat, written in TypeScript (server) and JavaScript (extension).
It features a simple command system, and provides access to metadata about the meeting such as member count and ID.
## How it works:
### Chrome Extension
The bot uses a small extension for interacting with the Google Meet web client,
it uses [socket.io](https://socket.io) for communicating with the backend, and
it also uses a [custom build](https://lodash.com/custom-builds) of [lodash](https://lodash.com)
for some utility functions.
### Backend
The backend is written in TypeScript and sets itself up as a socket.io server to
communicate with the chrome extension. The server handles commands and sends messages
back to the Chrome extension that then sends messages into the chat.
## Commands
Name | Description
---|---
`!help` | You are here
`!uptime` | See how long I've been in this meeting
`!dab` | dab
`!invite` | Get the invite link for this meeting
`!member_count` | Get the member count of this meeting
`!about` | Get info about this bot

## Why
Why not :P
