import Pawns from "@/icons/pawns";
import Image from "next/image";
import Pawn1 from "../../images/greenPawn.png"
import Pawn2 from "../../images/YellowPawn.png"
import Pawn3 from "../../images/OrangePawn.png"
import Pawn4 from "../../images/BluePawn.png"
export default function Map({
  pawnInfo,
  isBot
}: {
  pawnInfo: { player: any; eventNo?: any }[],
  isBot ?: boolean
}) 
{
    const eventCounts: any[] = []
    pawnInfo.forEach(({ eventNo }) => {
    if (!eventNo || eventNo === "bot") return;
    eventCounts[eventNo] = (eventCounts[eventNo] || 0) + 1;
});
    return <div className="flex flex-col-reverse items-start w-220 h-fit pr-5">
        <div className="flex flex-col-reverse items-end w-fit">
        <div className="flex w-full items-end ">
        <div className="h-fit pt-3 pl-2 bg-[#c36d08] rounded-l-xl">
            <div className="grid grid-cols-8 grid-rows-1 px-2  gap-3">
                <div className="grid grid-cols-2 grid-rows-2 gap-2">
                <div className="h-9 bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]">
                        <div id={`event1`} className="border-2 border-[#e69f1f] bg-[#c47a01] h-11 w-11 translate-x-4 translate-y-3 rounded">
                            <div className="items-center -translate-x-2">
                            {pawnInfo.map(({ player, eventNo }) => (
                            typeof eventNo === "number" && eventNo == 1 && <div key={player - 1} className={`relative justify-around`}>
                                    {player == 1 && <Image 
                                        src={Pawn1}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "10px" }}
                                        className={`absolute h-14 -translate-y-5 -translate-x-3 w-9 z-999`}
                                    />}
                                    {player == 2 && <Image 
                                        src={Pawn2}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "0px" }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-3 w-9 z-999`}
                                    />}
                                    {player == 3 && <Image 
                                        src={Pawn3}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "0px" }}
                                        className={`absolute h-14 -translate-y-5 -translate-x-3 w-9 z-999`}
                                    />}
                                    {player == 4 && <Image 
                                        src={Pawn4}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "0px" }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-3 w-9 z-999`}
                                    />}
                                    
                                </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
                    <div className="bg-[#063f33] h-5 shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
                    <div className="bg-[#063f33] h-5 shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
                </div>
                {[ 2 , 3 , 4 , 5 , 6, 7 , 8].map((no) => (
                    <div key={no} className="grid grid-cols-2 grid-rows-2 gap-2">
                <div className="h-9 bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]">
                        <div id={`event${no}`} className={`${no%6 == 0 ? "bg-radial from-[#990000] to-[#e4ae5d]" : "" } border-2 border-[#e69f1f] bg-[#c47a01] h-9.5 w-9.5 translate-x-5 translate-y-4 rounded`}>
                            <div className="items-center">
                            {pawnInfo.map(({ player, eventNo }) => (
                                eventNo == no && <div key={player - 1} style={{ paddingLeft: eventCounts[eventNo] > 1 ? `${player * 3}px` : "0px" }}  className={`relative justify-around`}>
                                    {player == 1 && <Image 
                                        src={Pawn1}
                                        alt=""
                                        className={`absolute h-12 w-8 -translate-y-4 pr-${player * 2}`}
                                    />}
                                    {player == 2 && <Image 
                                        src={Pawn2}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : `${25}px` }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 3 && <Image 
                                        src={Pawn3}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "25px" }}
                                        className={`absolute h-14 -translate-y-5 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 4 && <Image 
                                        src={Pawn4}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "33px" }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-8 w-9 z-999`}
                                    />}
                                </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
                    <div className="bg-[#063f33] h-5 shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
                    <div className="bg-[#063f33] h-5 shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
                </div>
                ))}
            </div>
        </div>
        <div className="grid grid-cols-1 grid-rows-3 gap-2 bg-[#c36d08] pl-3 rounded-br-2xl  float-end">
            {[11 , 10 , 9].map((no) => (
                <div key={no} className="grid grid-cols-2 grid-rows-2 gap-2">
                <div className="h-9 bg-[#063f33]">
                    <div id={`event${no}`} className="border-2 border-[#e69f1f] bg-[#c47a01] rounded-md h-10 w-10 translate-x-2 translate-y-3">
                        <div className="items-center">
                           {pawnInfo.map(({ player, eventNo }) => (
                                eventNo == no && <div key={player - 1} style={{ paddingLeft: eventCounts[eventNo] > 1 ? `${player * 3}px` : "0px" }}  className={`relative justify-around`}>
                                    {player == 1 && <Image 
                                        src={Pawn1}
                                        alt=""
                                        className={`absolute h-12 w-8 -translate-y-4 pr-${player * 2}`}
                                    />}
                                    {player == 2 && <Image 
                                        src={Pawn2}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : `${25}px` }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 3 && <Image 
                                        src={Pawn3}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "25px" }}
                                        className={`absolute h-14 -translate-y-5 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 4 && <Image 
                                        src={Pawn4}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "33px" }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-8 w-9 z-999`}
                                    />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)] w-5"></div>
                <div className={`bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)] ${no == 9 ? "h-5" : ""} `}></div>
                <div className={`bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)] ${no == 9 ? "h-5" : ""} w-5`}></div>
            </div>))}
        </div>
    </div>
    <div className="flex flex-row-reverse bg-[#c36d08] rounded-tr-2xl rounded-bl-2xl pl-1 py-1">
        <div className="grid grid-cols-2 grid-rows-2 p-2 pr-0 gap-2">
        <div className="h-9 bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]">
                <div id={`event12`} className={`bg-radial from-[#990000] to-[#e4ae5d] border-2 border-[#e69f1f] bg-[#c47a01] rounded-md h-10 w-10 translate-x-4 translate-y-4.5`}>
                        <div className="items-center">
                            {pawnInfo.map(({ player, eventNo }) => (
                                eventNo == 12 && <div key={player - 1} style={{ paddingLeft: eventCounts[eventNo] > 1 ? `${player * 3}px` : "0px" }}  className={`relative justify-around`}>
                                    {player == 1 && <Image 
                                        src={Pawn1}
                                        alt=""
                                        className={`absolute h-12 w-8 -translate-y-4 pr-${player * 2}`}
                                    />}
                                    {player == 2 && <Image 
                                        src={Pawn2}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : `${25}px` }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 3 && <Image 
                                        src={Pawn3}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "25px" }}
                                        className={`absolute h-14 -translate-y-5 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 4 && <Image 
                                        src={Pawn4}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "33px" }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-8 w-9 z-999`}
                                    />}
                                </div>
                            ))}
                        </div>
                    </div>
            </div>
            <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)] w-6"></div>
            <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
            <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)] w-6"></div>
        </div>
        {[ 13 , 14 , 15 , 16 , 17 , 18 , 19].map((no) => (
            <div key={no} className="grid grid-cols-2 grid-rows-2 p-2 gap-2">
            <div className="h-9 bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]">
                <div id={`event${no}`} className={`${no%6 == 0 ? "bg-radial from-[#990000] to-[#e4ae5d]" : "" } border-2 border-[#e69f1f] bg-[#c47a01] rounded-md h-10 w-10 translate-x-5.5 translate-y-4.5`}>
                        <div className="items-center">
                            {pawnInfo.map(({ player, eventNo }) => (
                                eventNo == no && <div key={player - 1} style={{ paddingLeft: eventCounts[eventNo] > 1 ? `${player * 3}px` : "0px" }}  className={`relative justify-around`}>
                                    {player == 1 && <Image 
                                        src={Pawn1}
                                        alt=""
                                        className={`absolute h-12 w-8 -translate-y-4 pr-${player * 2}`}
                                    />}
                                    {player == 2 && <Image 
                                        src={Pawn2}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : `${25}px` }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 3 && <Image 
                                        src={Pawn3}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "25px" }}
                                        className={`absolute h-14 -translate-y-5 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 4 && <Image 
                                        src={Pawn4}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "33px" }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-8 w-9 z-999`}
                                    />}
                                </div>
                            ))}
                        </div>
                    </div>
            </div>
            <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
            <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
            <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
        </div>
        ))}
    </div>
    </div>
    <div className=" bg-[#c36d08] px-1 translate-x-8">
        {[20 , 21].map((no) => (
        <div key={no} className="grid grid-cols-2 grid-rows-2 p-2 pt-0 gap-2">
        <div className="h-9.5 w-9.5 bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]">
                <div id={`event${no}`} className="border-2 border-[#e69f1f] bg-[#c47a01] rounded-md h-10 w-10 translate-x-5 translate-y-4.5">
                        <div className="items-center">
                            {pawnInfo.map(({ player, eventNo }) => (
                                eventNo == no && <div key={player - 1} style={{ paddingLeft: eventCounts[eventNo] > 1 ? `${player * 3}px` : "0px" }}  className={`relative justify-around`}>
                                    {player == 1 && <Image 
                                        src={Pawn1}
                                        alt=""
                                        className={`absolute h-12 w-8 -translate-y-4 pr-${player * 2}`}
                                    />}
                                    {player == 2 && <Image 
                                        src={Pawn2}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : `${25}px` }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 3 && <Image 
                                        src={Pawn3}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "25px" }}
                                        className={`absolute h-14 -translate-y-5 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 4 && <Image 
                                        src={Pawn4}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "33px" }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-8 w-9 z-999`}
                                    />}
                                </div>
                            ))}
                        </div>
                    </div>
            </div>
            <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
            <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
            <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
        </div>))}
        
    </div>
    <div className="grid grid-cols-9 grid-rows-1 bg-[#c36d08] pt-1 px-1 rounded-r-xl rounded-tl-xl translate-x-8
    ">
        {[22 , 23 , 24 , 25 , 26 , 27 , 28 , 29].map((no) => (
        <div key={no} className="grid grid-cols-2 grid-rows-2 p-2 pb-0 gap-2">
        <div className={`${no == 30 ? "h-11 w-11" : "h-10 w-10"} bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]`}>
                <div id={`event${no}`} className={`${no%6 == 0 ? "bg-radial from-[#990000] to-[#e4ae5d]" : "" } border-2 border-[#e69f1f] bg-[#c47a01] rounded-md h-10 w-10 translate-x-5 translate-y-4.5`}>
                        <div className="items-center">
                            {pawnInfo.map(({ player, eventNo }) => (
                                eventNo == no && <div key={player - 1} style={{ paddingLeft: eventCounts[eventNo] > 1 ? `${player * 3}px` : "0px" }}  className={`relative justify-around`}>
                                    {player == 1 && <Image 
                                        src={Pawn1}
                                        alt=""
                                        className={`absolute h-12 w-8 -translate-y-4 pr-${player * 2}`}
                                    />}
                                    {player == 2 && <Image 
                                        src={Pawn2}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : `${25}px` }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 3 && <Image 
                                        src={Pawn3}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "25px" }}
                                        className={`absolute h-14 -translate-y-5 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 4 && <Image 
                                        src={Pawn4}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "33px" }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-8 w-9 z-999`}
                                    />}
                                </div>
                            ))}
                        </div>
                    </div>
            </div>
            <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
            <div className={`bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)] ${no != 22 ? "h-7" : "h-8.5"}`}></div>
            <div className={`bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)] ${no != 22 ? "h-7" : "h-8.5"}`}></div>
        </div>))}
        <div className="grid grid-cols-2 grid-rows-2 gap-2 mt-2 mr-2">
                <div className="h-11 bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]">
                        <div id={`event30`} className={`${30%6 == 0 ? "bg-radial from-[#990000] to-[#e4ae5d]" : "" } border-2 border-[#e69f1f] bg-[#c47a01] h-11 w-11 translate-x-4.5 translate-y-3.5 rounded`}>
                            <div className="items-center">
                            {pawnInfo.map(({ player, eventNo }) => (
                                eventNo >= 30 && <div key={player - 1} style={{ paddingLeft: eventCounts[eventNo] > 1 ? `${player * 3}px` : "0px" }}  className={`relative justify-around`}>
                                    {player == 1 && <Image 
                                        src={Pawn1}
                                        alt=""
                                        className={`absolute h-12 w-8 -translate-y-4 pr-${player * 2}`}
                                    />}
                                    {player == 2 && <Image 
                                        src={Pawn2}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : `${25}px` }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 3 && <Image 
                                        src={Pawn3}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "25px" }}
                                        className={`absolute h-14 -translate-y-5 -translate-x-6 w-9 z-999`}
                                    />}
                                    {player == 4 && <Image 
                                        src={Pawn4}
                                        alt=""
                                        style={{ marginLeft: eventCounts[eventNo] > 1 ? `${player + 9 * player - 1}px` : "33px" }}
                                        className={`absolute h-16 -translate-y-6 -translate-x-8 w-9 z-999`}
                                    />}
                                </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    <div className="bg-[#063f33] shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
                    <div className="bg-[#063f33] h-7 shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
                    <div className="bg-[#063f33] h-7 shadow-[inset_0_1px_8px_rgba(0,0,0,0.6)]"></div>
                </div>
    </div>
    </div>
}