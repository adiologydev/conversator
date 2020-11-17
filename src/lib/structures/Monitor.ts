import { Message } from "discord.js";

export abstract class Monitor {

    public abstract run(message: Message): Promise<void>;

}
