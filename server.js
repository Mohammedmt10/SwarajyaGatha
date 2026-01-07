const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

// Load event details for coin calculations
const eventDetailsPath = path.join(__dirname, "eventDetails.json");
const eventDetails = JSON.parse(fs.readFileSync(eventDetailsPath, "utf8"));

const rooms = new Map();

/* ---------- Helpers ---------- */
function createRoom() {
    return {
        state: {
            currPlayer: 1,
            lastRollPlayer: null,
            rollId: 0,
            playerInfo: [],
            pShells: [],
        },
        clients: new Map(), // clientId -> ws
        clientToPlayer: new Map(), // clientId -> playerIndex (persistent mapping)
    };
}

function broadcast(room) {
    const msg = JSON.stringify({ type: "state", state: room.state });
    for (const ws of room.clients.values()) {
        if (ws.readyState === WebSocket.OPEN) ws.send(msg);
    }
}

function normalizePlayers(room) {
    room.state.playerInfo.forEach((p, i) => (p.player = i + 1));
    room.state.pShells.forEach((p, i) => (p.p = i + 1));

    for (const ws of room.clients.values()) {
        ws.playerIndex = room.state.playerInfo.findIndex(
            (p) => p.player === ws.playerIndex
        ) + 1;
    }
}

/* ---------- WS ---------- */
wss.on("connection", (ws, req) => {
    const params = new URLSearchParams(req.url.replace("/?", ""));
    const roomId = params.get("room") || "default-room";
    const clientId = params.get("clientId");

    if (!clientId) return ws.close();

    if (!rooms.has(roomId)) rooms.set(roomId, createRoom());
    const room = rooms.get(roomId);

    /* ---- JOIN ---- */
    let playerIndex;

    // Check if this client is rejoining
    if (room.clientToPlayer.has(clientId)) {
        playerIndex = room.clientToPlayer.get(clientId);
        console.log(`Client ${clientId} rejoining as Player ${playerIndex}`);
    } else {
        // New player - find next available slot
        const existingIndices = new Set(room.state.playerInfo.map(p => p.player));
        playerIndex = 1;
        while (existingIndices.has(playerIndex)) {
            playerIndex++;
        }

        console.log(`New client ${clientId} joining as Player ${playerIndex}`);
        room.clientToPlayer.set(clientId, playerIndex);

        // Create new player data
        room.state.playerInfo.push({
            player: playerIndex,
            eventNo: 1,
            eco: {
                gold: 2,
                silver: 5,
                bronze: 10
            }
        });

        room.state.pShells.push({
            p: playerIndex,
            shells: [true, true, true, true],
        });
    }

    ws.clientId = clientId;
    ws.playerIndex = playerIndex;
    room.clients.set(clientId, ws);

    ws.send(
        JSON.stringify({
            type: "init",
            playerIndex,
            state: room.state,
        })
    );

    broadcast(room);

    /* ---- ROLL ---- */
    ws.on("message", (data) => {
        try {
            const msg = JSON.parse(data);
            console.log(`Received message type: ${msg.type} from Player ${ws.playerIndex}`);

            if (msg.type === "roll") {
                if (room.state.currPlayer !== ws.playerIndex) {
                    console.log(`Ignored roll: Turn is ${room.state.currPlayer}, sender is ${ws.playerIndex}`);
                    return;
                }

                console.log(`Processing roll for Player ${ws.playerIndex}`);

                const shellObj = room.state.pShells[ws.playerIndex - 1];
                shellObj.shells = shellObj.shells.map(() => Math.random() > 0.5);

                const moveBy = shellObj.shells.filter(Boolean).length;
                console.log(`Rolled ${moveBy}`);

                const player = room.state.playerInfo[ws.playerIndex - 1];
                const current = player.eventNo;
                if (current >= 30) {
                    console.log(`Player ${ws.playerIndex} already at end.`);
                    return;
                }
                let nextPosition = current + moveBy;
                if (nextPosition > 30) nextPosition = 30;

                // Calculate checkpoint (same logic as single player)
                const nextCheckpoint = Math.ceil(current / 6) * 6;
                const nextCP = nextCheckpoint === current ? current + 6 : nextCheckpoint;

                // Check if crossing checkpoint - if so, snap to checkpoint
                let finalPosition;
                if (nextPosition >= nextCP) {
                    finalPosition = nextCP; // Snap to checkpoint
                    console.log(`Player ${ws.playerIndex} crossed checkpoint, snapping to ${nextCP}`);
                } else {
                    finalPosition = nextPosition; // Normal move
                }

                // Capping final position at 30
                if (finalPosition > 30) finalPosition = 30;

                // Update position
                player.eventNo = finalPosition;

                // Apply coin changes based on event tile (matching single player logic)
                if (moveBy > 0 && finalPosition !== current) {
                    const eventIndex = current; // Current tile before move (0-indexed in array)
                    const tileData = eventDetails[eventIndex];

                    if (tileData && tileData.eco) {
                        if (tileData.eco === "+") {
                            // Positive event: gain 2 gold
                            player.eco.gold += 2;
                            console.log(`Player ${ws.playerIndex} gained 2 gold from tile ${eventIndex}`);
                        } else if (tileData.eco === "-") {
                            // Negative event: lose 2 gold
                            player.eco.gold -= 2;
                            console.log(`Player ${ws.playerIndex} lost 2 gold from tile ${eventIndex}`);
                        } else {
                            // Neutral or null: lose 1 gold (movement penalty)
                            player.eco.gold -= 1;
                            console.log(`Player ${ws.playerIndex} lost 1 gold (movement penalty)`);
                        }
                    } else {
                        // Default: lose 1 gold for movement
                        player.eco.gold -= 1;
                    }
                }

                room.state.lastRollPlayer = ws.playerIndex;
                room.state.rollId = (room.state.rollId || 0) + 1;
                room.state.currPlayer =
                    ws.playerIndex >= room.state.playerInfo.length
                        ? 1
                        : ws.playerIndex + 1;

                broadcast(room);
            }

            if (msg.type === "rewardCoins") {
                const { playerIndex, coinType, amount } = msg;
                const player = room.state.playerInfo[playerIndex - 1];

                if (player && player.eco) {
                    if (coinType === "gold") player.eco.gold += amount;
                    else if (coinType === "silver") player.eco.silver += amount;
                    else if (coinType === "bronze") player.eco.bronze += amount;

                    console.log(`Player ${playerIndex} received ${amount} ${coinType} coins`);
                    broadcast(room);
                }
            }
        } catch (e) {
            console.error("Server Message Error:", e);
        }
    });

    /* ---- LEAVE (REMOVE PLAYER) ---- */
    ws.on("close", () => {
        console.log(`Client ${ws.clientId} (Player ${ws.playerIndex}) disconnected`);

        // Remove from active clients
        room.clients.delete(ws.clientId);
        room.clientToPlayer.delete(ws.clientId);

        // Remove player data
        const infoIdx = room.state.playerInfo.findIndex(p => p.player === ws.playerIndex);
        if (infoIdx !== -1) room.state.playerInfo.splice(infoIdx, 1);

        const shellIdx = room.state.pShells.findIndex(p => p.p === ws.playerIndex);
        if (shellIdx !== -1) room.state.pShells.splice(shellIdx, 1);

        // Only delete room if no players left
        if (room.state.playerInfo.length === 0) {
            rooms.delete(roomId);
            console.log(`Room ${roomId} deleted (no players)`);
            return;
        }

        // Re-number remaining players to avoid gaps
        normalizePlayers(room);

        // Fix turn pointer
        if (room.state.currPlayer > room.state.playerInfo.length) {
            room.state.currPlayer = 1;
        }

        room.state.lastRollPlayer = null;
        broadcast(room);
    });
});

server.listen(3001, () =>
    console.log("WS server running on ws://localhost:3001")
);
