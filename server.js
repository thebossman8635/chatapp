const net = require("net");

const server = net.createServer();

// Array of client sockets
const clients = [];

server.on("connection", (socket) => {
    const clientId = clients.length + 1;
    socket.write(`id-${clientId}`);
    console.log("A new connection to the server has been made");

    // Broadcast connection message
    clients.map((client) => {
        client.socket.write(`User ${clientId} joined!`);
    });

    socket.on("data", (data) => {
        const dataString = data.toString('utf-8')
        const id = data.toString('utf-8').substring(0, dataString.indexOf("-"));
        const message = dataString.substring(dataString.indexOf("-message-") + 9);
        clients.map((client) => {
            client.socket.write(`> User ${id}: ${message}`);
        });
    });

    // Broadcast disconnect message
    socket.on('end', () => {
        clients.map((client) => {
            clients.socket.write(`User ${cleintId} left!`);
        })
    });

    socket.on("error", () => {
        clients.map((client) => {
            client.socket.write(`User ${clientId} left!`);
        });
    });

    clients.push({id: clientId.toString(), socket});
})

server.listen(3008, "127.0.0.1", () => {
    console.log("Server opened on ", server.address());
});
