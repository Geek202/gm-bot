import { AddCommand, Command } from './objects';

export function register_custom_commands(add_command: AddCommand, command: Command, help_getter: () => Map<string, string>) {
    // Use this for registering custom commands you don't want on git.
    // It is invoked immediately after the regular commands file.
}
