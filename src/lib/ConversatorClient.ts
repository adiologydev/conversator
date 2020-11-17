/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection, Client, ClientOptions } from "discord.js";
import CleverBot from "./CleverBot";
import { readdirSync } from "fs";
import { join } from "path";
import { Timestamp } from "@sapphire/time-utilities";

export class ConversatorClient extends Client {
    public commands: Collection<string, any>;
    public monitors: Collection<string, any>;
    public clever: CleverBot;

    constructor(options?: ClientOptions) {
        super(options);

        this.commands = new Collection();
        this.monitors = new Collection();
        this.clever = new CleverBot();
    }

    public async initCommands() {
        const commandFiles = await readdirSync(join(__dirname, "..", "commands")).filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const command = require(join(__dirname, "..", "commands", file));
            this.commands.set(file.split(".")[0], new command.default());
        }

        console.log(`[${new Timestamp("HH:MM:SS-YYYY").display(Date.now())}] Loaded ${commandFiles.length} commands.`);
    }

    public async initMonitors() {
        const monitorFiles = await readdirSync(join(__dirname, "..", "monitors")).filter(file => file.endsWith(".js"));

        for (const file of monitorFiles) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const monitor = require(join(__dirname, "..", "monitors", file));
            this.monitors.set(file.split(".")[0], new monitor.default());
        }

        console.log(`[${new Timestamp("HH:MM:SS-YYYY").display(Date.now())}] Loaded ${monitorFiles.length} monitors.`);
    }

    public async start(token: string) {
        await this.initCommands();
        await this.initMonitors();

        return super.login(token);
    }
}
