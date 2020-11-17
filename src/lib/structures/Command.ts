import { Message } from "discord.js";

export abstract class Command {

    public name: string;

    constructor(options: CommandOptions) {
        this.name = options.name;
    }

    public abstract run(message: Message, params: unknown[]): Promise<Message | Message[] | null>;

}
