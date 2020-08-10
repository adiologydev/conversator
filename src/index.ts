import { Client } from "klasa";
import { token, prod, prefix } from "./config";

const conversator = new Client({
    prefix,
    production: prod,
    commandEditing: true,
    typing: true,
    createPiecesFolders: false,
    disabledCorePieces: ["commands"],
    pieceDefaults: {
      monitors: { ignoreOthers: false }
    },
    regexPrefix: /convo|hey convo/i,
    readyMessage: "Rock n Roll!"
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
conversator.login(token);
