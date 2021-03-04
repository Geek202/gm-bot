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

export interface GlobalContext {
    send_message(message: string): void;
    message: MessageRecieved | null;
}

export type CommandHandler<T> = (args: T) => void;
export interface CommandManager {
    add_command<T>(name: string, desc: string, help: string, handler: CommandHandler<T>): void
}
// export type AddCommand<T> = (name: string, desc: string, help: string, handler: CommandHandler<T>) => void;
