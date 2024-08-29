const net = require("net");
const readline = require("readline/promises");
let id;

const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
});

const clearLine = (dir) => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => {
            resolve();
        });
    });
}

const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve();
        });
    })
}

const socket = net.createConnection({host: "127.0.0.1", port: 3008}, async () =>{
    console.log("Connected to the server");

    const ask = async () => {
        const message = await rl.question("Enter a message -> ");

        //moves cursor one line up
        await moveCursor(0, -1);
        //clears current line
        await clearLine(0);
        socket.write(`${id}-message-${message}`);
    };
    
    

    socket.on("data", async (data) => {
        if (data.toString("utf-8").substring(0,2) === "id") {
            //For getting an ID
            id = data.toString('utf-8').substring(3)

            console.log(`Your id is ${id}!\n`);
            console.log();
            await moveCursor(0,-1);
            await clearLine(0);
        } else {
            console.log();
            await moveCursor(0,-1);
            await clearLine(0);
            console.log(data.toString("utf-8"));
            ask();
        }

        ask();
        
    });
});



socket.on("close", () => {
    console.log("Closed!");
});

 