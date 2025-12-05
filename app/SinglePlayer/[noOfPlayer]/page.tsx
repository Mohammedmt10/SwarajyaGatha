"use client"
import Map from "@/app/components/map";
import Image from "next/image";
import ClosedShell from "../../../images/closedShell.png"
import OpenShell from "../../../images/openShell.png"
import { useState , useMemo } from "react";
import { useParams } from "next/navigation";
import FlashCard from "@/app/components/flashCard";
import { useEffect } from "react";
import eventDetails from "../../../eventDetails.json"
import QuizCard from "@/app/components/quizCard";

export default function GameScreen() {
  

  const params = useParams()
  const Players = params.noOfPlayer ? params.noOfPlayer[0]?.split("%26")[0] : 1
  const [noOfPlayer , ] = useState(Number(Players))
  const [botTurn , setBotTurn] = useState(false)
  //@ts-ignore
  const [isBot , ] = useState(params.noOfPlayer ? params.noOfPlayer?.split("%26")[1] == "true" : false)
  const [playerInfo, setPlayerInfo] = useState(() => {
  let list = Array.from({ length: noOfPlayer }, (_, i) => ({
    player: i + 1,
    eventNo: 1,
    isBot: false, 
    eco : {
      gold : 2,
      silver : 5,
      bronze : 10,
    },
    visited : [0]
  }));
  if (isBot && list.length < 4) {
    const botsToAdd = 4 - list.length;
    for (let i = 0; i < botsToAdd; i++)
      list.push({
        player: list.length + 1, 
        eventNo: 1, 
        isBot: true , 
        eco : {
          gold : 2 , 
          silver : 5 , 
          bronze : 10
        },
        visited : [0]
      });
  }
  return list;
});


  const [flashCard, setFlashCard]= useState(true)
  const getInitialShells = (count : any) => {
  const shells = [];
    for (let i = 1; i <= count; i++) {
      shells.push({
        p: i,
        shells: [true, true, true, true]
      });
    }
     return shells;
   };

const [pShells , setPShells] = useState(getInitialShells(isBot ? 4 : Number(Players)))
  const [currPlayer , setCurrPlayer] = useState(1);
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
  const [quiz , setQuiz] = useState(false)
  const noOfShells = (arr: boolean[]) => {
  const trueCount = arr.filter(Boolean).length;
  if (!playerInfo[currPlayer - 1]) return;

  let player = playerInfo[currPlayer - 1];
  if(player.eventNo >= 30) return;
  const current = player.eventNo;
  const nextPosition = current + trueCount;

  const nextCheckpoint = Math.ceil(current / 6) * 6;
  const nextCP = nextCheckpoint === current ? current + 6 : nextCheckpoint;


  player.visited.push(nextPosition - 1)
  const newVisited = player.visited
  if (nextPosition >= nextCP) {
    setPlayerInfo(prev =>
      prev.map(p  =>
        p.player === currPlayer ? { ...p, eventNo: nextCP , visited : newVisited } : p
    )
  );
    setEventDetailsNo(nextCP - 1);
    setQuiz(true)
    if(quiz) return
    if(!quiz) setFlashCard(true);
  } else {
    setPlayerInfo(prev =>
    prev.map(p =>
      p.player === currPlayer
        ? {
            ...p,
            eventNo: nextPosition,
            eco: {
              ...p.eco,
              gold: p.eco.gold + (eventDetails[p.eventNo].eco  === "+" && nextPosition != current ? 2 : (eventDetails[p.eventNo].eco == "-" && nextPosition != current ? -2  : -1)),
            },
            visited : newVisited
          }
        : p
    )
  );
  if(!quiz) {
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
  if (trueCount >= 1 && !quiz) setTimeout(() => setFlashCard(true) , 800);
  } 
};
const handleQuizClose = () => {
  setTimeout(() => setQuiz(false) , 1000)
  setCurrPlayer(prev => {
    const next = prev + 1 > playerInfo.length ? 1 : prev + 1;
    if (isBot && playerInfo[next - 1].isBot) {
      setBotTurn(true);
    } else {
      setBotTurn(false);
    }
    return next;
  }); // small delay feels natural
};

  const [rotateShell , setRotateShell] = useState(0)
  useEffect(() => {
  if (!botTurn || flashCard || quiz) return;

  const timer = setTimeout(() => {
    const botPlayers = playerInfo.filter(p => p.isBot);
    const bot = playerInfo[currPlayer - 1];
if (!bot?.isBot) return;

const botIndex = bot.player;
    randomShell(); 
    if(bot.eventNo >= 30) return
    setRotateShell(botIndex)
    setTimeout(() => setRotateShell(0) , 800);
  }, 900);

  return () => clearTimeout(timer);
}, [botTurn, flashCard , currPlayer , quiz]);

const [eventDetailsNo , setEventDetailsNo] = useState(playerInfo[currPlayer - 1].eventNo - 1)

const handleQuizReward = (playerIndex: number, type : string , coins: number) => {
  if(type == "gold") {
    setPlayerInfo(prev =>
      prev.map(p =>
        p.player === playerIndex
          ? { ...p, eco: { ...p.eco, gold: p.eco.gold + coins } }
          : p
      )
    );
  } else if(type == "silver") {
    setPlayerInfo(prev =>
      prev.map(p =>
        p.player === playerIndex
          ? { ...p, eco: { ...p.eco, silver: p.eco.silver + coins } }
          : p
      )
    );
  } else if(type == "bronze") {
    setPlayerInfo(prev =>
      prev.map(p =>
        p.player === playerIndex
          ? { ...p, eco: { ...p.eco, bronze: p.eco.bronze + coins } }
          : p
      )
    );
  }
};

return (
    <div>
      {flashCard && <FlashCard flashCard={flashCard} setFlashCard={setFlashCard} eventDetailsNo={eventDetailsNo} />}
      {quiz && !flashCard && <QuizCard 
      eventNo={eventDetailsNo} 
      onReward={handleQuizReward} 
      setQuiz={setQuiz} 
      currPlayer={currPlayer} 
      isBot={playerInfo[currPlayer - 1].isBot} 
      visited={playerInfo[currPlayer -1].visited}
      handleQuizClose={handleQuizClose}
      />}
      <div className={`h-screen w-screen border-2 overflow-auto overflow-y-hidden flex select-none ${playerInfo[currPlayer - 1].isBot ? "pointer-events-none" : ""}`}>
      
      <div className="h-screen bg-[#990000] border-2 p-1 pb-2 w-85">
        <div className="h-full mx-10 px-10 bg-linear-to-b from-[#d98911] to-[#ffcf6f] border-2 float-start flex flex-col justify-around">
        {(noOfPlayer >= 1 || isBot) && <div className={`border-2 h-fit p-2.5 rounded-3xl border-[#fe6c07] bg-[#f3b75e] select-none cursor-pointer ${currPlayer != 1 ? "pointer-events-none" : ""}`} onClick={() => {
                if(playerInfo[0].eventNo >= 30) return
                setRotateShell(1);
                setTimeout(() => setRotateShell(0),1000)
                randomShell();
              }}>
            <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
              <div className="grid grid-cols-2 grid-rows-2 h-full w-full cursor-pointer">
                <div className={`flex items-center`}>
                  {<Image className={`p-2 ${rotateShell == 1 ? "animate-spin" : ""}`} src={getShellsFor(1)[0] ? OpenShell : ClosedShell} alt="Shell" />}
                </div>
                <div className="flex items-center">
                  {<Image className={`p-2 ${rotateShell == 1 ? "animate-spin" : ""}`} src={getShellsFor(1)[1] ? OpenShell : ClosedShell} alt="Shell" />}
                </div>
                <div className="flex items-center">
                  {<Image className={`p-2 ${rotateShell == 1 ? "animate-spin" : ""}`} src={getShellsFor(1)[2] ? OpenShell : ClosedShell} alt="Shell" />}
                </div>
                <div className="flex items-center">
                  {<Image className={`p-2 ${rotateShell == 1 ? "animate-spin" : ""}`} src={getShellsFor(1)[3] ? OpenShell : ClosedShell} alt="Shell" />}
                </div>
            </div>
            <div>
              <div className="flex justify-around mt-5">
                <div className="h-10 w-9.5 bg-gold-coin bg-cover"></div>
                <div className="h-9 w-10 bg-silver-coin bg-cover"></div>
                <div className="h-9 w-10 bg-bronze-coin bg-cover"></div>
              </div>
              <div className="flex justify-around mt-2">
                <div className="border-2 px-3.5 bg-white border-[#9b0403] rounded-lg">{playerInfo[0].eco.gold}</div>
                <div className="border-2 px-3.5 bg-white border-[#9b0403] rounded-lg">{playerInfo[0].eco.silver}</div>
                <div className="border-2 px-3.5 bg-white border-[#9b0403] rounded-lg">{playerInfo[0].eco.bronze}</div>
              </div>
            </div>
          </div>
        </div>}
        {(noOfPlayer >= 2 || isBot) && <div>
          <div className="flex justify-evenly mt-10">
            <div className="border-2 px-3.5 bg-white border-[#9b0403] rounded-lg">{playerInfo[1].eco.gold}</div>
            <div className="border-2 px-3.5 bg-white border-[#9b0403] rounded-lg">{playerInfo[1].eco.silver}</div>
            <div className="border-2 px-3.5 bg-white border-[#9b0403] rounded-lg">{playerInfo[1].eco.bronze}</div>
          </div>
            <div className="flex justify-evenly mt-2">
              <div className="h-10 w-9.5 bg-gold-coin bg-cover"></div>
              <div className="h-9 w-10 bg-silver-coin bg-cover"></div>
              <div className="h-9 w-10 bg-bronze-coin bg-cover"></div>
            </div>
          <div className={`border-2 h-fit p-3 mt-2 rounded-3xl border-[#fe6c07] bg-[#f3b75e] select-none cursor-pointer ${currPlayer != 2 ? "pointer-events-none" : ""}`} onClick={() => {
                if(playerInfo[1].eventNo >= 30) return
                setRotateShell(2);
                randomShell();
                setTimeout(() => setRotateShell(0),1000)
              }}>
            <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
              <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                <div className="flex items-center">
                  <Image className={`p-2 ${rotateShell == 2 ? "animate-spin" : ""}`} src={getShellsFor(2)[0] ? OpenShell : ClosedShell} alt="Shell" />
                </div>
                <div className="flex items-center">
                  <Image className={`p-2 ${rotateShell == 2 ? "animate-spin" : ""}`} src={getShellsFor(2)[1] ? OpenShell : ClosedShell} alt="Shell" />
                </div>
                <div className="flex items-center">
                  <Image className={`p-2 ${rotateShell == 2 ? "animate-spin" : ""}`} src={getShellsFor(2)[2] ? OpenShell : ClosedShell} alt="Shell" />
                </div>
                <div className="flex items-center">
                  <Image className={`p-2 ${rotateShell == 2 ? "animate-spin" : ""}`} src={getShellsFor(2)[3] ? OpenShell : ClosedShell} alt="Shell" />
                </div>
              </div>
            </div>
          </div>
        </div>}

      </div>
      </div>
      <div className="w-255 bg-cover object-contain bg-center  flex justify-around bg-map-background items-center">
          <Map pawnInfo={playerInfo} isBot={isBot} />
      </div>
      <div className="p-2 border-2 h-screen bg-[#990000] w-86">
        <div className={` border-2 bg-linear-to-b from-[#d98911] to-[#ffcf6f] mx-10 float-end h-full mb-2 w-65`}>
          <div className="h-screen  px-10 float-start flex flex-col justify-around">
          {(noOfPlayer >= 3 || isBot) && <div>
            <div className={`border-2 h-fit p-3 mt-2 rounded-3xl border-[#fe6c07] bg-[#f3b75e] select-none cursor-pointer ${currPlayer != 3 ? "pointer-events-none" : ""}`} onClick={() => {
              if(playerInfo[2].eventNo >= 30) return
              setRotateShell(3);
              randomShell();
                  setTimeout(() => setRotateShell(0),1000)
                }}>
              <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
                <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                  <div className="flex items-center">
                    <Image className={`p-2 ${rotateShell == 3 ? "animate-spin" : ""}`} src={getShellsFor(3)[0] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                  <div className="flex items-center">
                    <Image className={`p-2 ${rotateShell == 3 ? "animate-spin" : ""}`} src={getShellsFor(3)[1] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                  <div className="flex items-center">
                    <Image className={`p-2 ${rotateShell == 3 ? "animate-spin" : ""}`} src={getShellsFor(3)[2] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                  <div className="flex items-center">
                    <Image className={`p-2 ${rotateShell == 3 ? "animate-spin" : ""}`} src={getShellsFor(3)[3] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-around mt-2">
                <div className="h-10 w-9.5 bg-gold-coin bg-cover"></div>
                <div className="h-9 w-10 bg-silver-coin bg-cover"></div>
                <div className="h-9 w-10 bg-bronze-coin bg-cover"></div>
            </div>
            <div className="flex justify-around mt-2">
            <div className="border-2 px-3.5 bg-white border-[#9b0403] rounded-lg">{playerInfo[2].eco.gold}</div>
            <div className="border-2 px-3.5 bg-white border-[#9b0403] rounded-lg">{playerInfo[2].eco.silver}</div>
            <div className="border-2 px-3.5 bg-white border-[#9b0403] rounded-lg">{playerInfo[2].eco.bronze}</div>
            </div>
          </div>}
          {(noOfPlayer >= 4 || isBot) && <div>
            <div className="flex justify-around">
            <div className="border-2 px-3.5 bg-white border-[#9b0403] rounded-lg">{playerInfo[3].eco.gold}</div>
            <div className="border-2 px-3.5 bg-white border-[#9b0403] rounded-lg">{playerInfo[3].eco.silver}</div>
            <div className="border-2 px-3.5 bg-white border-[#9b0403] rounded-lg">{playerInfo[3].eco.bronze}</div>
            </div>
            <div className="flex justify-around mt-2">
                <div className="h-10 w-9.5 bg-gold-coin bg-cover"></div>
                <div className="h-9 w-10 bg-silver-coin bg-cover"></div>
                <div className="h-9 w-10 bg-bronze-coin bg-cover"></div>
            </div>
            <div className={`border-2 h-fit p-3 mt-2 rounded-3xl border-[#fe6c07] bg-[#f3b75e] select-none cursor-pointer ${currPlayer != 4 ? "pointer-events-none" : ""}`} onClick={() => {
                  if(playerInfo[3].eventNo >= 30) return
                  setRotateShell(4);
                  randomShell();
 if(quiz) return;
                  setTimeout(() => setRotateShell(0),1000)
                  
                  
                }}>
              <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
                <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                  <div className="flex items-center">
                    <Image className={`p-2 ${rotateShell == 4 ? "animate-spin" : ""}`} src={getShellsFor(4)[0] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                  <div className="flex items-center">
                    <Image className={`p-2 ${rotateShell == 4 ? "animate-spin" : ""}`} src={getShellsFor(4)[1] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                  <div className="flex items-center">
                    <Image className={`p-2 ${rotateShell == 4 ? "animate-spin" : ""}`} src={getShellsFor(4)[2] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                  <div className="flex items-center">
                    <Image className={`p-2 ${rotateShell == 4 ? "animate-spin" : ""}`} src={getShellsFor(4)[3] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                </div>
              </div>
            </div>
          </div>}
        </div>
        </div>
      </div>
    </div>
    </div>
  );
}
