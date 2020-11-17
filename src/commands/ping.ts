import { Command } from "../lib/structures/Command";
import { Message } from "discord.js";

export default class ConversatorCommand extends Command {

  constructor(options: CommandOptions) {
        super({ ...options,
          name: "ping" });
    }

    public async run(message: Message) {
        return message.channel.send(`🏓 Pong! Heartbeat: ${message.client.ws.ping.toLocaleString()}ms`);
    }

}
