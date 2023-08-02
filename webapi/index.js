const express = require('express');
const app = express();
const http = require('http');
const ratelimits = require('./utils/ratelimits');
const server = http.createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });
const websockets = new Map();
const port = 3000;
wss.on('connection', (ws, req) => {
    const data = new Map();
    ws.on('message', (payload) => {
        payload = JSON.parse(payload);
        if (!payload.token) {
            ws.send({"e": "CONNEXION_ERROR", "d": "No token detected, please send the payload as this : {token: \"your token\""});
        }
        data.set("userID", whoistoken(payload.token));
    });
    ws.on('close', () => {
        webs = websockets.get(data.userID);
        webs.delete(ws);
        websockets.set(data.userID, webs);
    });
});

app.get('/:content', (req, res) => {
    if (ratelimits(req.ip)) {
        res.status(429).send("Too Many Requests, try again later, the amount of requests per minute second is 100, it resets every seconds, you are banned from the api for 10 minutes");
        return;
    }
    processreq(req, res, 'GET');
    worker.postMessage(Array.from(websockets));
});

app.post('/:content', (req, res) => {
    if (ratelimits(req.ip)) {
        res.status(429).send("Too Many Requests, try again later, the amount of requests per minute second is 100, it resets every seconds, you are banned from the api for 10 minutes");
        return;
    }
    processreq(req, res, 'POST');
    worker.postMessage(Array.from(websockets));
});

app.delete('/:content', (req, res) => {
    if (ratelimits(req.ip)) {
        res.status(429).send("Too Many Requests, try again later, the amount of requests per minute second is 100, it resets every seconds, you are banned from the api for 10 minutes");
        return;
    }
    processreq(req, res, 'DELETE');
    worker.postMessage(Array.from(websockets));
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

const worker = new Worker('websockets.js');

worker.addEventListener('message', (event) => {
    worker.postMessage(Array.from(websockets));
});

worker.postMessage(Array.from(websockets));

app.listen(port, () => {});