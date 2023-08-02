const sendws = require(`${process.cwd()}/webapi/websocketmanager`);
const whoistoken = require(`${process.cwd()}/webapi/utils/tokenidentification`);
const getkey = require(`${process.cwd()}/webapi/utils/id_to_public_key`);
module.exports = {
    mode: "POST",
    json: {
        "content": String,
        "recipient_id": String
    },
    Header: {
        "token": String
    },
    run: function(req, res, json, header) {
        const user_id = whoistoken(header.token);
        if (!isfriend(user_id, json.recipient_id)) {
            res.status(400).send("Please add the person as friend before.");
            return;
        }
        if (json.content.replace(" ", '').replace("\n", '') === '') {
            res.status(400).send("Invalid content\nPlease write something more than spaces and newlines.");
            return;
        }
        sendws({"e": "NEWMESSAGE", "d": {"content": encrypt(json.content, getkey()), "sender_id": user_id}}, json.recipient_id);
    }
};