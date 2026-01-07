"use client";

import Map from "@/app/components/map";
import Image from "next/image";
import ClosedShell from "../../images/closedShell.png";
import OpenShell from "../../images/openShell.png";
import FlashCard from "@/app/components/flashCard";
import QuizCard from "@/app/components/quizCard";
import EndScreen from "@/app/components/endScreen";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

/* ---------- TYPES ---------- */
type PlayerInfo = {
  player: number;
  eventNo: number;
  eco: {
    gold: number;
    silver: number;
    bronze: number;
  };
};
type PShell = { p: number; shells: boolean[] };

type GameState = {
  currPlayer: number;
  lastRollPlayer: number | null;
  playerInfo: PlayerInfo[];
  pShells: PShell[];
};

export default function GameScreen() {
  const params = useParams();
  const roomId = params.roomId as string;

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const [playerIndex, setPlayerIndex] = useState<number | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    currPlayer: 1,
    lastRollPlayer: null,
    playerInfo: [],
    pShells: [],
  });

  const [rotateShell, setRotateShell] = useState(0);
  const rotateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playerIndexRef = useRef<number | null>(null);

  const [flashCard, setFlashCard] = useState(false);
  const [flashCardDetailsNo, setFlashCardDetailsNo] = useState(0);

  const lastProcessedRollId = useRef(0);

  const [showQuiz, setShowQuiz] = useState(false);
  const [eventDetailsNo, setEventDetailsNo] = useState(0);
  // Initialize with some event IDs to allow random quizzes to work
  const [visited, setVisited] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const [gameOver, setGameOver] = useState(false);

  /* ---------- SYNC REF ---------- */
  useEffect(() => {
    playerIndexRef.current = playerIndex;
  }, [playerIndex]);

  /* ---------- ROOM-SCOPED CLIENT ID ---------- */
  useEffect(() => {
    const key = `clientId:${roomId}`;
    let id = localStorage.getItem(key);

    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }

    setClientId(id);
  }, [roomId]);

  /* ---------- WEBSOCKET ---------- */
  useEffect(() => {
    if (!clientId) return;

    const ws = new WebSocket(
      `ws://localhost:3001?room=${roomId}&clientId=${clientId}`
    );

    setSocket(ws);
    ws.onopen = () => setConnected(true);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "init") {
        setPlayerIndex(msg.playerIndex);
        playerIndexRef.current = msg.playerIndex; // Sync immediately
        setGameState(msg.state);
        return;
      }

      if (msg.type === "state") {
        const newState: any = msg.state;
        const myIndex = playerIndexRef.current;

        // ONLY trigger roll logic if it's a NEW roll
        const isNewRoll = newState.rollId && newState.rollId !== lastProcessedRollId.current;

        if (isNewRoll && newState.lastRollPlayer) {
          if (rotateTimeoutRef.current)
            clearTimeout(rotateTimeoutRef.current);

          setRotateShell(newState.lastRollPlayer);
          rotateTimeoutRef.current = setTimeout(
            () => setRotateShell(0),
            900
          );

          // Update processed ID immediately
          lastProcessedRollId.current = newState.rollId;

          // Match single player logic: Quiz/Flashcard triggers
          if (newState.lastRollPlayer === myIndex) {
            const shells =
              newState.pShells.find((p: any) => p.p === myIndex)?.shells ?? [];
            const moveBy = shells.filter(Boolean).length;

            if (moveBy > 0) {
              const player = newState.playerInfo[myIndex! - 1];
              const current = player.eventNo - moveBy; // Previous position
              const nextPosition = player.eventNo; // Current position after move

              // Calculate next checkpoint (same logic as single player)
              const nextCheckpoint = Math.ceil(current / 6) * 6;
              const nextCP = nextCheckpoint === current ? current + 6 : nextCheckpoint;

              // Update visited array (add the position we just moved to)
              const newVisited = [...visited, nextPosition - 1];
              setVisited(newVisited);

              // Check if we crossed a checkpoint
              if (nextPosition >= nextCP) {
                // At checkpoint: Show FLASHCARD first, then quiz (matching single player)
                setEventDetailsNo(nextCP - 1);
                setFlashCardDetailsNo(nextCP - 1);
                setShowQuiz(true); // Mark that quiz should show after flashcard
                if (!showQuiz) {
                  setFlashCard(true); // Show flashcard immediately
                }
              } else {
                // Normal move: Show flashcard after delay
                setEventDetailsNo(nextPosition - 1);
                setFlashCardDetailsNo(nextPosition - 1);
                setTimeout(() => setFlashCard(true), 800);
              }
            }
          }
        }

        setGameState(newState);
      }
    };

    ws.onerror = (err) => {
      console.error("WS Error:", err);
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
      setSocket(null);
    };

    return () => ws.close();
  }, [clientId, roomId]);

  useEffect(() => {
    if (gameState.playerInfo.length === 0) return;
    const allFinished = gameState.playerInfo.every((p) => p.eventNo >= 30);
    if (allFinished && !gameOver) {
      setGameOver(true);
    }
  }, [gameState.playerInfo, gameOver]);

  /* ---------- HELPERS ---------- */
  const getShellsFor = (player: number) =>
    gameState.pShells.find((p) => p.p === player)?.shells ?? [
      true,
      true,
      true,
      true,
    ];

  const handleQuizClose = () => {
    // Close quiz and ensure flashcard doesn't reopen
    setShowQuiz(false);
    setFlashCard(false);
  };

  const handleQuizReward = (playerIdx: number, coinType: string, amount: number) => {
    // Send reward to server for syncing across all clients
    if (socket && connected) {
      socket.send(JSON.stringify({
        type: "rewardCoins",
        playerIndex: playerIdx,
        coinType,
        amount
      }));
    }
  };

  const handleRoll = (player: number) => {
    // ✅ LOGIC GUARDS ONLY — NO CSS BLOCKING
    if (!connected || !socket) return;
    if (playerIndex !== player) return;
    if (gameState.currPlayer !== player) return;

    socket.send(JSON.stringify({ type: "roll" }));
  };

  const playerInfo = gameState.playerInfo;

  return (
    <div>
      {gameOver && <EndScreen players={gameState.playerInfo} />}
      {flashCard && (
        <FlashCard
          flashCard={flashCard}
          setFlashCard={setFlashCard}
          eventDetailsNo={flashCardDetailsNo}
        />
      )}

      {showQuiz && !flashCard && (
        <QuizCard
          eventNo={eventDetailsNo}
          onReward={handleQuizReward}
          setQuiz={setShowQuiz}
          currPlayer={playerIndex ?? 1}
          visited={visited}
          isBot={false}
          handleQuizClose={handleQuizClose}
        />
      )}

      <div className={`h-screen w-screen border-2 overflow-auto overflow-y-hidden flex select-none ${showQuiz ? "pointer-events-none" : ""}`}>
        {/* LEFT */}
        <div className="h-screen bg-[#990000] border-2 p-1 pb-2 w-85">
          <div className="h-full mx-10 px-10 bg-linear-to-b from-[#d98911] to-[#ffcf6f] border-2 flex flex-col justify-around">
            {playerInfo
              .filter((p) => p.player <= 2)
              .map((p) => (
                <PlayerBox
                  key={p.player}
                  index={p.player}
                  currPlayer={gameState.currPlayer}
                  rotateShell={rotateShell}
                  getShellsFor={getShellsFor}
                  onClick={() => handleRoll(p.player)}
                  isYou={playerIndex === p.player}
                  eco={p.eco}
                />
              ))}
          </div>
        </div>

        {/* MAP WRAPPER */}
        <div className="flex-1 bg-cover bg-center flex justify-center bg-map-background items-center overflow-hidden">
          <Map pawnInfo={playerInfo} />
        </div>

        {/* RIGHT */}
        <div className="p-2 border-2 h-screen bg-[#990000] w-86">
          <div className="border-2 bg-linear-to-b from-[#d98911] to-[#ffcf6f] mx-10 h-full w-65">
            <div className="h-screen px-10 flex flex-col justify-around">
              {playerInfo
                .filter((p) => p.player > 2)
                .map((p) => (
                  <PlayerBox
                    key={p.player}
                    index={p.player}
                    currPlayer={gameState.currPlayer}
                    rotateShell={rotateShell}
                    getShellsFor={getShellsFor}
                    onClick={() => handleRoll(p.player)}
                    isYou={playerIndex === p.player}
                    eco={p.eco}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- PLAYER BOX (FIXED) ---------- */
function PlayerBox({
  index,
  currPlayer,
  rotateShell,
  getShellsFor,
  onClick,
  isYou,
  eco,
}: {
  index: number;
  currPlayer: number;
  rotateShell: number;
  getShellsFor: (p: number) => boolean[];
  onClick: () => void;
  isYou?: boolean;
  eco?: { gold: number; silver: number; bronze: number };
}) {
  const canRoll = isYou && currPlayer === index;

  return (
    <div
      className={`relative z-[100] border-2 h-fit p-2.5 rounded-3xl border-[#fe6c07] select-none cursor-pointer
        ${canRoll ? "" : "bg-[#f3b75e] opacity-70"}
        ${isYou ? "ring-4 ring-green-500" : ""}`}
      onClick={() => {
        if (!canRoll) return;
        onClick();
      }}
    >
      <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
        <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
          {getShellsFor(index).map((v, i) => (
            <div
              key={i}
              className="flex items-center"
            >
              <Image
                className={`p-2 ${rotateShell === index ? "animate-spin" : ""
                  }`}
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

      {eco && (
        <div className="mt-2">
          <div className="flex justify-around">
            <div className="h-6 w-6 bg-gold-coin bg-cover"></div>
            <div className="h-6 w-6 bg-silver-coin bg-cover"></div>
            <div className="h-6 w-6 bg-bronze-coin bg-cover"></div>
          </div>
          <div className="flex justify-around mt-1">
            <div className="border px-2 bg-white border-[#9b0403] rounded text-xs">{eco.gold}</div>
            <div className="border px-2 bg-white border-[#9b0403] rounded text-xs">{eco.silver}</div>
            <div className="border px-2 bg-white border-[#9b0403] rounded text-xs">{eco.bronze}</div>
          </div>
        </div>
      )}
    </div>
  );
}
