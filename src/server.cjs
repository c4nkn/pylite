const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');
const { PythonLanguageServer } = require('pyright');

const app = express();

app.use(express.static(__dirname));

const server = createServer(app);
const wss = new WebSocket.Server({ server, path: '/python' });

wss.on('connection', (ws) => {
  const server = new PythonLanguageServer({
    argv: [],
    transport: {
      reader: ws,
      writer: ws,
    },
  });

  server.listen();
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});