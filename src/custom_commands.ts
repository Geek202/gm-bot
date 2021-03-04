import { CommandManager, GlobalContext } from './objects';

export function register_custom_commands(command_manager: CommandManager, context: GlobalContext) {
    // Use this for registering custom commands you don't want on git.
    // It is invoked immediately after the regular commands file.
}
