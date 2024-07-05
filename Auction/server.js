const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');

const PORT = 8080;
let clients = [];
let bestBid = 0;
let winningClient = null;
let auctionTimeout;

//Create an HTTP server
const html = fs.readFileSync('./index.html');

const server = http.createServer(function (request, response) {
  response.writeHead(200, { "Content-Type": "text/html" });
  response.write(html);
  response.end();
}).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  resetAuctionTimeout();
});

//Create a WebSocket server
const wss = new WebSocket.Server({ server });

//Handle new WebSocket connections
wss.on('connection', (ws) => {
  clients.push(ws);
  const clientId = clients.length;
  console.log(`Client no. ${clientId + 1} connected.`);
  handleConnection(ws, clientId);
});

//Function to handle new client connection
function handleConnection(ws, clientId) {
  ws.on('message', (message) => {
    const bidAmount = parseInt(message, 10);
    console.log(`Received bid ${bidAmount} from client ${clientId}`);

    if (bidAmount > bestBid) {
      bestBid = bidAmount;
      winningClient = clientId;
      const msg = `New best bid: ${bestBid} (Client: ${winningClient})`;
      broadcast(msg);
      console.log(msg);
      resetAuctionTimeout();
    } else {
      const msg = `Received lower bid. Best bid remains at: ${bestBid}`;
      ws.send(msg);
      console.log(msg);
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected: ${clientId}`);
    clients[clientId] = null;
  });
}

//Function to broadcast a message to all connected clients
function broadcast(message) {
  clients.forEach((client) => {
    if (client) {
      client.send(message);
    }
  });
}

//Function to end the auction
function endAuction() {
  const msg = `Auction finished. Winning bid: ${bestBid}, winner: client no. ${winningClient}`;
  broadcast(msg);
  console.log(msg);
  process.exit(0);
}

//Function to reset the auction timeout
function resetAuctionTimeout() {
  if (auctionTimeout) {
    clearTimeout(auctionTimeout);
  }
  auctionTimeout = setTimeout(endAuction, 20000);
}



