"use client";
import Map from "@/app/components/map";
import Image from "next/image";
import ClosedShell from "../../images/closedShell.png";
import OpenShell from "../../images/openShell.png";
import FlashCard from "@/app/components/flashCard";
import { useEffect, useRef, useState } from "react";

type PlayerInfo = { player: number; eventNo: number };
type PShell = { p: number; shells: boolean[] };

type GameState = {
  currPlayer: number;
  lastRollPlayer: number | null;
  playerInfo: PlayerInfo[];
  pShells: PShell[];
};

export default function GameScreen() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [playerIndex, setPlayerIndex] = useState<number | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    currPlayer: 1,
    lastRollPlayer: null,
    playerInfo: [],
    pShells: [],
  });

  const [rotateShell, setRotateShell] = useState(0);
  const rotateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [flashCard, setFlashCard] = useState(false);
  const [flashCardDetailsNo, setFlashCardDetailsNo] = useState<number>(0);

  const roomId = "default-room";

  /* ---------------- WebSocket Connection ---------------- */
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3001?room=${roomId}`);
    setSocket(ws);

    ws.onopen = () => setConnected(true);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "init") {
        setPlayerIndex(msg.playerIndex);
        setGameState(msg.state);
      }

      if (msg.type === "state") {
        const newState: GameState = msg.state;

        /* 🔥 Always spin shells whenever a roll happens */
        if (newState.lastRollPlayer) {
          if (rotateTimeoutRef.current) clearTimeout(rotateTimeoutRef.current);
          setRotateShell(newState.lastRollPlayer);
          rotateTimeoutRef.current = setTimeout(() => setRotateShell(0), 900);
        }

        /* 🔥 Checkpoint logic (ported from single-player) */
        if (newState.lastRollPlayer !== null) {
          const last = newState.lastRollPlayer;
          const shellsForLast =
            newState.pShells.find((p) => p.p === last)?.shells ?? [];
          const trueCount = shellsForLast.filter(Boolean).length;

          if (trueCount > 0) {
            const idx = last - 1;
            const player = newState.playerInfo[idx];

            if (player) {
              // movedPosition = what server sent after applying simple move
              const movedPosition = player.eventNo;

              // infer previous position (before this roll)
              const prevPosition = Math.max(1, movedPosition - trueCount);

              const current = prevPosition;
              const nextPosition = current + trueCount; // == movedPosition

              const nextCheckpoint = Math.ceil(current / 6) * 6;
              const nextCP =
                nextCheckpoint === current ? current + 6 : nextCheckpoint;

              if (nextPosition >= nextCP) {
                // crossed checkpoint → snap to checkpoint
                player.eventNo = nextCP;
              } else {
                // normal move (already at nextPosition)
                player.eventNo = nextPosition;
              }

              // FLASHCARD: use final eventNo (index = eventNo - 1)
              setFlashCardDetailsNo(player.eventNo - 1);
              setFlashCard(true);
            }
          }
        }

        setGameState(newState);
      }

      if (msg.type === "error") {
        alert(msg.message);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      setSocket(null);
    };

    return () => ws.close();
  }, []);

  /* ---------------- Helpers ---------------- */
  const getShellsFor = (player: number) => {
    return (
      gameState.pShells.find((p) => p.p === player)?.shells ?? [
        true,
        true,
        true,
        true,
      ]
    );
  };

  const handleRoll = (player: number) => {
    if (!connected) return;
    if (!socket) return;
    if (playerIndex !== player) return;
    if (gameState.currPlayer !== player) return;
    socket.send(JSON.stringify({ type: "roll" }));
  };

  const playerInfo = gameState.playerInfo;

  /* ---------------- Rendering ---------------- */
  return (
    <div>
      {/* FLASHCARD POPUP */}
      {flashCard && (
        <FlashCard
          flashCard={flashCard}
          setFlashCard={setFlashCard}
          eventDetailsNo={flashCardDetailsNo}
        />
      )}

      <div className="h-screen w-screen border-2 overflow-auto overflow-y-hidden flex select-none">
        {/* LEFT (Player 1 & 2) */}
        <div className="h-screen bg-[#990000] border-2 p-1 pb-2 w-85">
          <div className="h-full mx-10 px-10 bg-linear-to-b from-[#d98911] to-[#ffcf6f] border-2 float-start flex flex-col justify-around">
            {playerInfo[0] && (
              <PlayerBox
                index={playerInfo[0].player}
                currPlayer={gameState.currPlayer}
                rotateShell={rotateShell}
                getShellsFor={getShellsFor}
                onClick={() => handleRoll(playerInfo[0].player)}
                isYou={playerIndex === playerInfo[0].player}
              />
            )}

            {playerInfo[1] && (
              <PlayerBox
                index={playerInfo[1].player}
                currPlayer={gameState.currPlayer}
                rotateShell={rotateShell}
                getShellsFor={getShellsFor}
                onClick={() => handleRoll(playerInfo[1].player)}
                isYou={playerIndex === playerInfo[1].player}
              />
            )}
          </div>
        </div>

        {/* MAP */}
        <div className="w-255 bg-cover object-contain bg-center flex justify-around bg-map-background items-center">
          <Map pawnInfo={playerInfo} />
        </div>

        {/* RIGHT (Player 3 & 4) */}
        <div className="p-2 border-2 h-screen bg-[#990000] w-86">
          <div className="border-2 bg-linear-to-b from-[#d98911] to-[#ffcf6f] mx-10 float-end h-full mb-2 w-65">
            <div className="h-screen px-10 float-start flex flex-col justify-around">
              {playerInfo[2] && (
                <PlayerBox
                  index={playerInfo[2].player}
                  currPlayer={gameState.currPlayer}
                  rotateShell={rotateShell}
                  getShellsFor={getShellsFor}
                  onClick={() => handleRoll(playerInfo[2].player)}
                  isYou={playerIndex === playerInfo[2].player}
                />
              )}

              {playerInfo[3] && (
                <PlayerBox
                  index={playerInfo[3].player}
                  currPlayer={gameState.currPlayer}
                  rotateShell={rotateShell}
                  getShellsFor={getShellsFor}
                  onClick={() => handleRoll(playerInfo[3].player)}
                  isYou={playerIndex === playerInfo[3].player}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DEBUG FOOTER */}
      <div className="fixed bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
        {connected ? "WS: connected" : "WS: disconnected"} | You:{" "}
        {playerIndex ?? "-"} | Turn: {gameState.currPlayer}
      </div>
    </div>
  );
}

/* ---------------- Player UI Component ---------------- */
function PlayerBox({
  index,
  currPlayer,
  rotateShell,
  getShellsFor,
  onClick,
  isYou,
}: {
  index: number;
  currPlayer: number;
  rotateShell: number;
  getShellsFor: (p: number) => boolean[];
  onClick: () => void;
  isYou?: boolean;
}) {
  return (
    <div
      className={`relative z-50 border-2 h-fit p-2.5 rounded-3xl border-[#fe6c07] bg-[#f3b75e] select-none cursor-pointer
        ${currPlayer !== index ? "pointer-events-none opacity-70" : ""}
        ${isYou ? "ring-4 ring-green-500" : ""}`}
      onClick={onClick}
    >
      <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
        <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
          {getShellsFor(index).map((v, i) => (
            <div key={i} className="flex items-center">
              <Image
                className={`p-2 ${rotateShell === index ? "animate-spin" : ""}`}
                src={v ? OpenShell : ClosedShell}
                alt="Shell"
              />
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-sm mt-2 font-bold text-white">
        Player {index} {isYou && "(You)"}
      </p>
    </div>
  );
}
