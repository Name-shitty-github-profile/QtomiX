let to_do = [];
let websockets;

module.export = function(data, ids) {
    for (let i = 0; i < ids.length; i++) {
        to_do.push({userID: ids[i], data: data});
    }
}

function send_one_event(data) {
    const ws = websockets.get(data.userID)
    ws.send(JSON.stringify({data: data.data, event: data.event}));
}

self.addEventListener('message', event => {
    websockets = Object.fromEntries(event);
    tasks = to_do.map(send_one_event);
    to_do = [];
    Promise.all(tasks)
        .then(() => {
            self.postMessage('Task completed!');
        })
        .catch((error) => {
            self.postMessage('Task failed: ' + error);
        });
});