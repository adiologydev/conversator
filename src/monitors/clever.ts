import CleverBot from "../lib/CleverBot";
import { Message } from "discord.js";
import { Monitor } from "../lib/structures/Monitor";
import { channels } from "../config";

const cb = new CleverBot();

export default class extends Monitor {

    async run(message: Message) {
      if (message.author.bot) return;
      if (message.channel.type !== "text" || !channels.includes(message.channel.id)) return;

      const lastArray = message.channel.messages.cache.array().slice(-10, -0);
      const contextContent = this.getLastContent(lastArray);
      const output = await cb.talk(message.cleanContent, contextContent);

      await message.reply(output);
    }

    private getLastContent(messages: Message[]) {
      const content = [];
      for (const m of messages) content.push(m.cleanContent);
      return content;
    }

}
