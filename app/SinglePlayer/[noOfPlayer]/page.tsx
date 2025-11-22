"use client"
import Map from "@/app/components/map";
import Image from "next/image";
import ClosedShell from "../../../images/closedShell.png"
import OpenShell from "../../../images/openShell.png"
import { useState } from "react";
import { useParams } from "next/navigation";
export default function GameScreen() {
  const Players = useParams()
  const [noOfPlayer , ] = useState(Number(Players.noOfPlayer))
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

const [pShells , setPShells] = useState(getInitialShells(Number(Players.noOfPlayer)))
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
  const noOfShells = (arr : any) => {
    var trueCount = arr.filter(Boolean).length
  }
  const [rotateShell , setRotateShell] = useState(0)
  return (
    <div className="h-screen w-screen border-2 overflow-auto overflow-y-hidden flex select-none">
      <div className="h-screen bg-red-600 border-2 p-1 pb-2">
        <div className="h-full px-10 bg-orange-400 border-2 float-start flex flex-col justify-around">
        {noOfPlayer >= 1 && <div className={`border-2 h-fit p-2.5 rounded-3xl border-[#fe6c07] bg-[#f3b75e] select-none cursor-pointer ${currPlayer != 1 ? "pointer-events-none" : ""}`} onClick={() => {
                setRotateShell(1);
                randomShell();
                setCurrPlayer(prev => {
                  const next = prev + 1;
                  return next > noOfPlayer ? 1 : next;
                });
                setTimeout(() => setRotateShell(0),1000)
              }}>
            <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
              <div className="grid grid-cols-2 grid-rows-2 h-full w-full cursor-pointer">
                <div className={`border-r-2 border-b-2 flex items-center`}>
                  {<Image className={`p-2 ${rotateShell == 1 ? "animate-spin" : ""}`} src={getShellsFor(1)[0] ? OpenShell : ClosedShell} alt="Shell" />}
                </div>
                <div className="border-l-2 border-b-2 flex items-center">
                  {<Image className={`p-2 ${rotateShell == 1 ? "animate-spin" : ""}`} src={getShellsFor(1)[1] ? OpenShell : ClosedShell} alt="Shell" />}
                </div>
                <div className="border-r-2 border-t-2 flex items-center">
                  {<Image className={`p-2 ${rotateShell == 1 ? "animate-spin" : ""}`} src={getShellsFor(1)[2] ? OpenShell : ClosedShell} alt="Shell" />}
                </div>
                <div className="border-l-2 border-t-2 flex items-center">
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
                <div className="border-2 px-3">1</div>
                <div className="border-2 px-3">2</div>
                <div className="border-2 px-3">3</div>
              </div>
            </div>
          </div>
        </div>}
        {noOfPlayer >= 2 && <div>
          <div className="flex justify-evenly mt-10">
            <div className="border-2 px-3">1</div>
            <div className="border-2 px-3">2</div>
            <div className="border-2 px-3">3</div>
          </div>
            <div className="flex justify-evenly mt-2">
              <div className="h-10 w-9.5 bg-gold-coin bg-cover"></div>
              <div className="h-9 w-10 bg-silver-coin bg-cover"></div>
              <div className="h-9 w-10 bg-bronze-coin bg-cover"></div>
            </div>
          <div className={`border-2 h-fit p-3 mt-2 rounded-3xl border-[#fe6c07] bg-[#f3b75e] select-none cursor-pointer ${currPlayer != 2 ? "pointer-events-none" : ""}`} onClick={() => {
                setRotateShell(2);
                randomShell();
                setCurrPlayer(prev => {
                  const next = prev + 1;
                  return next > noOfPlayer ? 1 : next;
                });
                setTimeout(() => setRotateShell(0),1000)
              }}>
            <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
              <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                <div className="border-r-2 border-b-2 flex items-center">
                  <Image className={`p-2 ${rotateShell == 2 ? "animate-spin" : ""}`} src={getShellsFor(2)[0] ? OpenShell : ClosedShell} alt="Shell" />
                </div>
                <div className="border-l-2 border-b-2 flex items-center">
                  <Image className={`p-2 ${rotateShell == 2 ? "animate-spin" : ""}`} src={getShellsFor(2)[1] ? OpenShell : ClosedShell} alt="Shell" />
                </div>
                <div className="border-r-2 border-t-2 flex items-center">
                  <Image className={`p-2 ${rotateShell == 2 ? "animate-spin" : ""}`} src={getShellsFor(2)[2] ? OpenShell : ClosedShell} alt="Shell" />
                </div>
                <div className="border-l-2 border-t-2 flex items-center">
                  <Image className={`p-2 ${rotateShell == 2 ? "animate-spin" : ""}`} src={getShellsFor(2)[3] ? OpenShell : ClosedShell} alt="Shell" />
                </div>
              </div>
            </div>
          </div>
        </div>}

      </div>
      </div>
      <div className="w-full bg-cover">
          <Map />
      </div>
      <div className="p-2 border-2 h-screen">
        <div className={` border-2 float-end h-full mb-2 ${noOfPlayer <= 3 ? "w-80" : ""}`}>
          <div className="h-screen px-10 float-start flex flex-col justify-around">
          {noOfPlayer >= 3 && <div>
            <div className={`border-2 h-fit p-3 mt-2 rounded-3xl border-[#fe6c07] bg-[#f3b75e] select-none cursor-pointer ${currPlayer != 3 ? "pointer-events-none" : ""}`} onClick={() => {
                  setRotateShell(3);
                  randomShell();
                  setCurrPlayer(prev => {
                    const next = prev + 1;
                    return next > noOfPlayer ? 1 : next;
                  });
                  setTimeout(() => setRotateShell(0),1000)
                }}>
              <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
                <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                  <div className="border-r-2 border-b-2 flex items-center">
                    <Image className={`p-2 ${rotateShell == 3 ? "animate-spin" : ""}`} src={getShellsFor(3)[0] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                  <div className="border-l-2 border-b-2 flex items-center">
                    <Image className={`p-2 ${rotateShell == 3 ? "animate-spin" : ""}`} src={getShellsFor(3)[1] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                  <div className="border-r-2 border-t-2 flex items-center">
                    <Image className={`p-2 ${rotateShell == 3 ? "animate-spin" : ""}`} src={getShellsFor(3)[2] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                  <div className="border-l-2 border-t-2 flex items-center">
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
              <div className="border-2 px-3">1</div>
              <div className="border-2 px-3">2</div>
              <div className="border-2 px-3">3</div>
            </div>
          </div>}
          {noOfPlayer >= 4 && <div>
            <div className="flex justify-around">
              <div className="border-2 px-3">1</div>
              <div className="border-2 px-3">2</div>
              <div className="border-2 px-3">3</div>
            </div>
            <div className="flex justify-around mt-2">
                <div className="h-10 w-9.5 bg-gold-coin bg-cover"></div>
                <div className="h-9 w-10 bg-silver-coin bg-cover"></div>
                <div className="h-9 w-10 bg-bronze-coin bg-cover"></div>
            </div>
            <div className={`border-2 h-fit p-3 mt-2 rounded-3xl border-[#fe6c07] bg-[#f3b75e] select-none cursor-pointer ${currPlayer != 4 ? "pointer-events-none" : ""}`} onClick={() => {
                  setRotateShell(4);
                  randomShell();
                  setCurrPlayer(prev => {
                    const next = prev + 1;
                    return next > noOfPlayer ? 1 : next;
                  });
                  setTimeout(() => setRotateShell(0),1000)
                }}>
              <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
                <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                  <div className="border-r-2 border-b-2 flex items-center">
                    <Image className={`p-2 ${rotateShell == 4 ? "animate-spin" : ""}`} src={getShellsFor(4)[0] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                  <div className="border-l-2 border-b-2 flex items-center">
                    <Image className={`p-2 ${rotateShell == 4 ? "animate-spin" : ""}`} src={getShellsFor(4)[1] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                  <div className="border-r-2 border-t-2 flex items-center">
                    <Image className={`p-2 ${rotateShell == 4 ? "animate-spin" : ""}`} src={getShellsFor(4)[2] ? OpenShell : ClosedShell} alt="Shell" />
                  </div>
                  <div className="border-l-2 border-t-2 flex items-center">
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
  );
}
