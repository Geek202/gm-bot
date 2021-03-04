export interface MessageRecieved {
    user: string,
    message: string,
    timestamp: number,
    meeting: MeetingDetails,
}

export interface MeetingStart {
    meeting_id: string,
    start_time: number,
}

interface MeetingDetails {
    id: string,
    start_time: number,
    member_count: number,
}

type SendMessage = (message: string) => void;
type CommandHandler = (message: MessageRecieved, send_message: SendMessage) => void;
type NewCommandHandler = (message: MessageRecieved, args: string[], send_message: SendMessage) => void;
export type AddCommand = (name: string, help: string, handler: CommandHandler) => void;
export type Command = (name: string, help: string, handler: NewCommandHandler) => void;
