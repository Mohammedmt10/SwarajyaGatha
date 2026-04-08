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
      `https://swarajyagatha-1.onrender.com?room=${roomId}&clientId=${clientId}`
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
    <div className="h-screen w-screen overflow-hidden bg-[#990000]">
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

      <div className={`h-full w-full flex flex-col lg:flex-row select-none ${showQuiz ? "pointer-events-none" : ""}`}>
        {/* TOP SIDEBAR (Mobile) / LEFT SIDEBAR (Desktop) */}
        <div className="h-[24vh] lg:h-screen bg-[#990000] border-b-2 lg:border-r-2 p-1 w-full lg:w-64 xl:w-72 shrink-0 transition-all duration-300">
          <div className="h-full mx-1 lg:mx-4 xl:mx-8 px-2 lg:px-4 py-1.5 lg:py-6 bg-linear-to-b from-[#d98911] to-[#ffcf6f] border-2 flex flex-row lg:flex-col justify-center lg:justify-around items-center lg:items-center gap-2 lg:gap-6 overflow-hidden">
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

        {/* MAP WRAPPER (Remaining Space) */}
        <div className="flex-1 relative bg-map-background bg-cover bg-center bg-no-repeat overflow-hidden">
          <Map pawnInfo={playerInfo} />
        </div>

        {/* BOTTOM SIDEBAR (Mobile) / RIGHT SIDEBAR (Desktop) */}
        <div className="h-[24vh] lg:h-screen p-1 lg:p-2 border-t-2 lg:border-l-2 bg-[#990000] w-full lg:w-64 xl:w-72 shrink-0 transition-all duration-300">
          <div className="h-full border-2 bg-linear-to-b from-[#d98911] to-[#ffcf6f] mx-1 lg:mx-4 xl:mx-8 py-1.5 lg:py-6 overflow-hidden">
            <div className="h-full px-2 lg:px-4 flex flex-row lg:flex-col justify-center lg:justify-around items-center lg:items-center gap-2 lg:gap-6">
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
      className={`relative z-[100] border-2 md:border-3 h-[95%] lg:h-fit p-1.5 md:p-3 rounded-2xl md:rounded-[40px] border-[#fe6c07] select-none cursor-pointer
        ${canRoll ? "" : "bg-[#f3b75e] opacity-70"}
        ${isYou ? "ring-2 md:ring-4 ring-green-500" : ""}
        w-28 sm:w-36 md:w-44 lg:w-full max-w-[180px] mx-auto transition-transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center lg:justify-between gap-1 lg:gap-2 bg-linear-to-b from-[#e4ae5d] to-[#d98911] shadow-lg`}
      onClick={() => {
        if (!canRoll) return;
        onClick();
      }}
    >
      <div className="aspect-square w-[55%] lg:w-full rounded-xl md:rounded-3xl border-2 md:border-4 border-[#d75a00] mx-auto shadow-[inset_0px_0px_8px_rgba(0,0,0,0.6)] md:shadow-[inset_0px_0px_20px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d] relative overflow-hidden">
        <div className="grid grid-cols-2 grid-rows-2 h-full w-full p-1 md:p-2">
          {getShellsFor(index).map((v, i) => (
            <div
              key={i}
              className="flex items-center justify-center"
            >
              <Image
                className={`w-[90%] h-[90%] object-contain ${rotateShell === index ? "animate-spin" : ""
                  }`}
                src={v ? OpenShell : ClosedShell}
                alt="Shell"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] sm:text-xs md:text-base font-black text-white leading-tight truncate drop-shadow-lg scale-110 lg:scale-100">
        Player {index} {isYou && "(You)"}
      </p>

      {eco && (
        <div className="w-full px-1">
          <div className="flex flex-row lg:flex-row justify-around items-center gap-1 lg:gap-2">
            {[
              { icon: "bg-gold-coin", val: eco.gold },
              { icon: "bg-silver-coin", val: eco.silver },
              { icon: "bg-bronze-coin", val: eco.bronze }
            ].map((coin, i) => (
              <div key={i} className="flex flex-row lg:flex-col items-center gap-1 lg:gap-0.5 bg-black/10 lg:bg-transparent px-1.5 lg:px-0 py-0.5 lg:py-0 rounded-full lg:rounded-none">
                <div className={`h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 ${coin.icon} bg-cover shrink-0 drop-shadow-md`}></div>
                <div className="border border-[#9b0403] lg:border-2 bg-white px-1 lg:px-2 rounded-md text-[9px] sm:text-xs font-bold min-w-[16px] lg:min-w-[28px] text-center shadow-md">{coin.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
