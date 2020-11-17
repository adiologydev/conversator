import { Message } from "discord.js";
import { Monitor } from "lib/structures/Monitor";
import { token, prefix } from "./config";
import { ConversatorClient } from "./lib/ConversatorClient";

const conversator = new ConversatorClient();

// Command Handler
conversator.on("message", async (message: Message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()!.toLowerCase();
    if (!conversator.commands.has(command)) return;

    try {
      await conversator.commands.get(command).run(message, args);
    } catch (error) {
        console.error(error);
        return message.channel.send("There was an error trying to execute that command! Please try again.");
    }
});

// Monitors
conversator.on("message", (message: Message) => {
  conversator.monitors.forEach(async (monitor: Monitor) => {
    await monitor.run(message);
  });
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
conversator.start(token);
