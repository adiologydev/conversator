import { get, post } from "chainfetch";
import * as crypto from "crypto";

const md5 = (contents: string) => crypto.createHash("md5").update(contents).digest("hex");

export default class CleverBot {
    private cookies!: string | null;

    async init(): Promise<void> {
        if (this.cookies) return;
        await get("https://www.cleverbot.com/").then(res => {
            this.cookies = res.headers.get("set-cookie")!.substring(0, 21);
        });
    }

    async talk(text: string, context: Array<string>) {
        const payload = `stimulus=${escape(text).includes("%u") ? escape(escape(text).replace(/%u/g, "|")) : escape(text)}&cb_settings_scripting=no&islearning=1&icognoid=wsf&icognocheck=`;
        const data = md5(payload.substring(7, 33));
        const handledContext = this.handleContext(context);

        const req = await post("https://www.cleverbot.com/webservicemin?uc=UseOfficialCleverbotAPI")
            .set("Cookie", this.cookies!)
            .set("type", "text/plain")
            .send(`${payload}${data}${handledContext}`);
        return decodeURIComponent(req.headers.get("cboutput")!);
    }

    private handleContext(context: Array<string>) {
        const cloned = context.slice().reverse();
        for (let i = 0; i < cloned.length; i++) return `&vText${i + 2}=${escape(cloned[i]).includes("%u") ? escape(escape(cloned[i]).replace(/%u/g, "|")) : escape(cloned[i])}`;
    }
}
