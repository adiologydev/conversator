import { Guild, Message } from "discord.js";
import { Monitor } from "lib/structures/Monitor";
import { token, prefix } from "./config";
import { ConversatorClient } from "./lib/ConversatorClient";

const conversator = new ConversatorClient();

// Command Handler
conversator.on("message", async (message: Message) => {
    if ((!message.guild && !message.content.startsWith(prefix)) || message.author.bot) return;
    if (message.guild && await makeGuildSettings(message.guild)) {
      const data = await conversator.prisma.guild.findOne({ where: { id: message.guild.id } });
      if (message.content.toLowerCase().startsWith(data!.prefix)) return;
    }

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

async function makeGuildSettings(guild: Guild) {
  if (await conversator.prisma.guild.findFirst({ where: { id: { equals: guild.id } } })) return true;
  return conversator.prisma.guild.create({
      data: {
        id: guild.id,
        prefix
      }
    });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
conversator.start(token);
