"use client"
import Map from "@/app/components/map";
import Image from "next/image";
import ClosedShell from "../../../images/closedShell.png"
import OpenShell from "../../../images/openShell.png"
import { useState } from "react";
import { useParams } from "next/navigation";
import FlashCard from "@/app/components/flashCard";
import { useEffect } from "react";
import eventDetails from "../../../eventDetails.json"
import QuizCard from "@/app/components/quizCard";
import EndScreen from "@/app/components/endScreen";

export default function GameScreen() {
  const params = useParams<{ noOfPlayer: string }>();

  const rawParam = params?.noOfPlayer ?? "1&false";
  const decodedParam = decodeURIComponent(rawParam);

  // Support both "1&true" and legacy "1%26true" style values
  const separator = decodedParam.includes("&") ? "&" : "%26";
  const [playersPart, botPart] = decodedParam.split(separator);

  const initialPlayers = Number(playersPart || 1) || 1;
  const initialIsBot = botPart === "true";

  const [noOfPlayer] = useState(initialPlayers);
  const [botTurn, setBotTurn] = useState(false)
  const [isBot] = useState(initialIsBot);
  const [playerInfo, setPlayerInfo] = useState(() => {
    let list = Array.from({ length: noOfPlayer }, (_, i) => ({
      player: i + 1,
      eventNo: 1,
      isBot: false,
      eco: {
        gold: 2,
        silver: 5,
        bronze: 10,
      },
      visited: [0]
    }));
    if (isBot && list.length < 4) {
      const botsToAdd = 4 - list.length;
      for (let i = 0; i < botsToAdd; i++)
        list.push({
          player: list.length + 1,
          eventNo: 1,
          isBot: true,
          eco: {
            gold: 2,
            silver: 5,
            bronze: 10
          },
          visited: [0]
        });
    }
    return list;
  });


  const [flashCard, setFlashCard] = useState(true)
  const getInitialShells = (count: any) => {
    const shells = [];
    for (let i = 1; i <= count; i++) {
      shells.push({
        p: i,
        shells: [true, true, true, true]
      });
    }
    return shells;
  };

  const [pShells, setPShells] = useState(
    getInitialShells(isBot ? 4 : noOfPlayer)
  )
  const [currPlayer, setCurrPlayer] = useState(1);
  const randomShell = () => {
    const booleans = [true, false];
    const newShells = [
      booleans[Math.floor(Math.random() * 2)],
      booleans[Math.floor(Math.random() * 2)],
      booleans[Math.floor(Math.random() * 2)],
      booleans[Math.floor(Math.random() * 2)],
    ];
    setPShells(prev =>
      prev.map(player =>
        player.p === currPlayer ? { ...player, shells: newShells } : player
      )
    )

    noOfShells(newShells);
  }
  const getShellsFor = (playerIndex: number) => {
    const found = pShells.find(p => p.p === playerIndex);
    return found ? found.shells : [true, true, true, true];
  }
  const [quiz, setQuiz] = useState(false)
  const noOfShells = (arr: boolean[]) => {
    const trueCount = arr.filter(Boolean).length;
    if (!playerInfo[currPlayer - 1]) return;

    let player = playerInfo[currPlayer - 1];
    if (player.eventNo >= 30) return;
    const current = player.eventNo;
    const nextPosition = current + trueCount;

    const nextCheckpoint = Math.ceil(current / 6) * 6;
    const nextCP = nextCheckpoint === current ? current + 6 : nextCheckpoint;


    player.visited.push(nextPosition - 1)
    const newVisited = player.visited
    if (nextPosition >= nextCP) {
      setPlayerInfo(prev =>
        prev.map(p =>
          p.player === currPlayer ? { ...p, eventNo: nextCP, visited: newVisited } : p
        )
      );
      setEventDetailsNo(nextCP - 1);
      setQuiz(true)
      if (quiz) return
      if (!quiz) setFlashCard(true);
    } else {
      setPlayerInfo(prev =>
        prev.map(p =>
          p.player === currPlayer
            ? {
              ...p,
              eventNo: nextPosition,
              eco: {
                ...p.eco,
                gold: p.eco.gold + (eventDetails[p.eventNo].eco === "+" && nextPosition != current ? 2 : (eventDetails[p.eventNo].eco == "-" && nextPosition != current ? -2 : -1)),
              },
              visited: newVisited
            }
            : p
        )
      );
      if (!quiz) {
        setCurrPlayer(prev => {
          const next = prev + 1 > playerInfo.length ? 1 : prev + 1;
          if (isBot && playerInfo[next - 1].isBot) {
            setBotTurn(true);
          } else {
            setBotTurn(false);
          }
          return next;
        });
      }

      setEventDetailsNo(nextPosition - 1);
      if (trueCount >= 1 && !quiz) setTimeout(() => setFlashCard(true), 800);
    }
  };
  const handleQuizClose = () => {
    // close quiz immediately after an answer and advance turn deterministically
    setQuiz(false);
    setCurrPlayer(prev => {
      const next = prev + 1 > playerInfo.length ? 1 : prev + 1;
      if (isBot && playerInfo[next - 1].isBot) {
        setBotTurn(true);
      } else {
        setBotTurn(false);
      }
      return next;
    });
  };

  const [rotateShell, setRotateShell] = useState(0)
  useEffect(() => {
    if (!botTurn || flashCard || quiz) return;

    const timer = setTimeout(() => {
      const botPlayers = playerInfo.filter(p => p.isBot);
      const bot = playerInfo[currPlayer - 1];
      if (!bot?.isBot) return;

      const botIndex = bot.player;
      randomShell();
      if (bot.eventNo >= 30) return
      setRotateShell(botIndex)
      setTimeout(() => setRotateShell(0), 800);
    }, 900);

    return () => clearTimeout(timer);
  }, [botTurn, flashCard, currPlayer, quiz]);

  const [eventDetailsNo, setEventDetailsNo] = useState(playerInfo[currPlayer - 1].eventNo - 1)

  const handleQuizReward = (playerIndex: number, type: string, coins: number) => {
    if (type == "gold") {
      setPlayerInfo(prev =>
        prev.map(p =>
          p.player === playerIndex
            ? { ...p, eco: { ...p.eco, gold: p.eco.gold + coins } }
            : p
        )
      );
    } else if (type == "silver") {
      setPlayerInfo(prev =>
        prev.map(p =>
          p.player === playerIndex
            ? { ...p, eco: { ...p.eco, silver: p.eco.silver + coins } }
            : p
        )
      );
    } else if (type == "bronze") {
      setPlayerInfo(prev =>
        prev.map(p =>
          p.player === playerIndex
            ? { ...p, eco: { ...p.eco, bronze: p.eco.bronze + coins } }
            : p
        )
      );
    }
  };

  const [gameOver, setGameOver] = useState(false);
  const [finalPlayers, setFinalPlayers] = useState(playerInfo);

  useEffect(() => {
    if (playerInfo.length === 0) return;
    const allFinished = playerInfo.every((p) => p.eventNo >= 30);
    if (allFinished && !gameOver) {
      setGameOver(true);
      setBotTurn(false);
      setFinalPlayers(playerInfo);
    }
  }, [playerInfo, gameOver]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#990000]">
      {gameOver && <EndScreen players={finalPlayers} />}
      {flashCard && <FlashCard flashCard={flashCard} setFlashCard={setFlashCard} eventDetailsNo={eventDetailsNo} />}
      {quiz && !flashCard && <QuizCard
        eventNo={eventDetailsNo}
        onReward={handleQuizReward}
        setQuiz={setQuiz}
        currPlayer={currPlayer}
        isBot={playerInfo[currPlayer - 1].isBot}
        visited={playerInfo[currPlayer - 1].visited}
        handleQuizClose={handleQuizClose}
      />}

      <div className={`h-full w-full flex flex-col lg:flex-row select-none ${playerInfo[currPlayer - 1].isBot || gameOver ? "pointer-events-none" : ""}`}>
        {/* TOP/LEFT SIDEBAR */}
        <div className="h-[24vh] lg:h-screen bg-[#990000] border-b-2 lg:border-r-2 p-1 w-full lg:w-64 xl:w-72 shrink-0 transition-all duration-300">
          <div className="h-full mx-1 lg:mx-4 xl:mx-8 px-2 lg:px-4 py-1.5 lg:py-6 bg-linear-to-b from-[#d98911] to-[#ffcf6f] border-2 flex flex-row lg:flex-col justify-center lg:justify-around items-center lg:items-center gap-2 lg:gap-6 overflow-hidden">
            {(noOfPlayer >= 1 || isBot) && (
              <PlayerBox
                index={1}
                currPlayer={currPlayer}
                playerInfo={playerInfo}
                rotateShell={rotateShell}
                getShellsFor={getShellsFor}
                onClick={() => {
                  if (playerInfo[0].eventNo >= 30) return;
                  setRotateShell(1);
                  setTimeout(() => setRotateShell(0), 1000);
                  randomShell();
                }}
                gameOver={gameOver}
              />
            )}
            {(noOfPlayer >= 2 || isBot) && (
              <PlayerBox
                index={2}
                currPlayer={currPlayer}
                playerInfo={playerInfo}
                rotateShell={rotateShell}
                getShellsFor={getShellsFor}
                onClick={() => {
                  if (playerInfo[1].eventNo >= 30) return;
                  setRotateShell(2);
                  setTimeout(() => setRotateShell(0), 1000);
                  randomShell();
                }}
                gameOver={gameOver}
              />
            )}
          </div>
        </div>

        {/* MAP WRAPPER */}
        <div className="flex-1 relative bg-map-background bg-cover bg-center bg-no-repeat overflow-hidden">
          <Map pawnInfo={playerInfo} isBot={isBot} />
        </div>

        {/* BOTTOM/RIGHT SIDEBAR */}
        <div className="h-[24vh] lg:h-screen p-1 lg:p-2 border-t-2 lg:border-l-2 bg-[#990000] w-full lg:w-64 xl:w-72 shrink-0 transition-all duration-300">
          <div className="h-full border-2 bg-linear-to-b from-[#d98911] to-[#ffcf6f] mx-1 lg:mx-4 xl:mx-8 py-1.5 lg:py-6 overflow-hidden">
            <div className="h-full px-2 lg:px-4 flex flex-row lg:flex-col justify-center lg:justify-around items-center lg:items-center gap-2 lg:gap-6">
              {(noOfPlayer >= 3 || isBot) && (
                <PlayerBox
                  index={3}
                  currPlayer={currPlayer}
                  playerInfo={playerInfo}
                  rotateShell={rotateShell}
                  getShellsFor={getShellsFor}
                  onClick={() => {
                    if (playerInfo[2].eventNo >= 30) return;
                    setRotateShell(3);
                    setTimeout(() => setRotateShell(0), 1000);
                    randomShell();
                  }}
                  gameOver={gameOver}
                />
              )}
              {(noOfPlayer >= 4 || isBot) && (
                <PlayerBox
                  index={4}
                  currPlayer={currPlayer}
                  playerInfo={playerInfo}
                  rotateShell={rotateShell}
                  getShellsFor={getShellsFor}
                  onClick={() => {
                    if (playerInfo[3].eventNo >= 30) return;
                    setRotateShell(4);
                    setTimeout(() => setRotateShell(0), 1000);
                    randomShell();
                  }}
                  gameOver={gameOver}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- PLAYER BOX ---------- */
function PlayerBox({
  index,
  currPlayer,
  playerInfo,
  rotateShell,
  getShellsFor,
  onClick,
  gameOver,
}: {
  index: number;
  currPlayer: number;
  playerInfo: any[];
  rotateShell: number;
  getShellsFor: (p: number) => boolean[];
  onClick: () => void;
  gameOver: boolean;
}) {
  const p = playerInfo[index - 1];
  if (!p) return null;

  const isActive = currPlayer === index && !gameOver;

  return (
    <div
      className={`relative z-[100] border-2 md:border-3 h-[95%] lg:h-fit p-1.5 md:p-3 rounded-2xl md:rounded-[40px] border-[#fe6c07] select-none cursor-pointer
        ${isActive ? "" : "bg-[#f3b75e] opacity-70 pointer-events-none"}
        w-28 sm:w-36 md:w-44 lg:w-full max-w-[180px] mx-auto transition-transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center lg:justify-between gap-1 lg:gap-2 bg-linear-to-b from-[#e4ae5d] to-[#d98911] shadow-lg`}
      onClick={onClick}
    >
      <div className="aspect-square w-[55%] lg:w-full rounded-xl md:rounded-3xl border-2 md:border-4 border-[#d75a00] mx-auto shadow-[inset_0px_0px_8px_rgba(0,0,0,0.6)] md:shadow-[inset_0px_0px_20px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d] relative overflow-hidden">
        <div className="grid grid-cols-2 grid-rows-2 h-full w-full p-1 md:p-2">
          {getShellsFor(index).map((v, i) => (
            <div key={i} className="flex items-center justify-center">
              <Image
                className={`w-[90%] h-[90%] object-contain ${rotateShell === index ? "animate-spin" : ""}`}
                src={v ? OpenShell : ClosedShell}
                alt="Shell"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] sm:text-xs md:text-base font-black text-white leading-tight truncate drop-shadow-lg scale-110 lg:scale-100">
        Player {index} {p.isBot && "(Bot)"}
      </p>

      <div className="w-full px-1">
        <div className="flex flex-row lg:flex-row justify-around items-center gap-1 lg:gap-2">
          {[
            { icon: "bg-gold-coin", val: p.eco.gold },
            { icon: "bg-silver-coin", val: p.eco.silver },
            { icon: "bg-bronze-coin", val: p.eco.bronze }
          ].map((coin, i) => (
            <div key={i} className="flex flex-row lg:flex-col items-center gap-1 lg:gap-0.5 bg-black/10 lg:bg-transparent px-1.5 lg:px-0 py-0.5 lg:py-0 rounded-full lg:rounded-none">
              <div className={`h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 ${coin.icon} bg-cover shrink-0 drop-shadow-md`}></div>
              <div className="border border-[#9b0403] lg:border-2 bg-white px-1 lg:px-2 rounded-md text-[9px] sm:text-xs font-bold min-w-[16px] lg:min-w-[28px] text-center shadow-md">{coin.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
