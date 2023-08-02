const sendws = require(`${process.cwd()}/webapi/websocketmanager`);
const whoistoken = require(`${process.cwd()}/webapi/utils/tokenidentification`);
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
        if (isfriend(user_id, json.recipient_id)) {
            res.send
        }
        sendws({"e": "NEWMESSAGE", "d": {"content": json.content, "sender_id": user_id}}, json.recipient_id);
    }
};