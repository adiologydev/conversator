import { Monitor, KlasaMessage } from "klasa";
import CleverBot from "../lib/CleverBot";
import { Message } from "discord.js";
import { channel } from "../config";

const cb = new CleverBot();

export default class extends Monitor {

    async run(message: KlasaMessage) {
        if (message.channel.type !== "text" || message.channel.id !== channel) return;

        const lastArray = message.channel.messages.array().slice(-10, -0);
        const contextContent = this.getLastContent(lastArray);
        const output = await cb.talk(message.cleanContent, contextContent);
        return message.reply(output);
    }

    async init(): Promise<void> {
        return cb.init();
    }

    private getLastContent(messages: Message[]) {
        const content = [];
        for (const m of messages) content.push(m.cleanContent);
        return content;
    }

}
