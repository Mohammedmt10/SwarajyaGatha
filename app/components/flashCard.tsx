import CloseIcon from "@/icons/closeIcon"
import eventDetails from "../../eventDetails.json"
import SpeakerIcons from "@/icons/speakerIcon"
import { useEffect, useState } from "react"

export default function FlashCard({flashCard , setFlashCard, eventDetailsNo }: {flashCard : boolean , setFlashCard: (c: any) => void, eventDetailsNo: number }) {

  const [speech, setSpeech] = useState(false)
  useEffect(() => {
    if (!speech) {
        window.speechSynthesis.cancel();
        return;
    }

    if (!flashCard) {
        window.speechSynthesis.cancel();
        setSpeech(false);
        return;
    }

    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();

    const u1 = new SpeechSynthesisUtterance(
        "Key figures " +
        eventDetails[eventDetailsNo].details.keyFigures +
        " Description " +
        eventDetails[eventDetailsNo].details.narrative
    );

    const voice = window.speechSynthesis.getVoices()[10];
    u1.voice = voice;
    u1.volume = 0.4;

    window.speechSynthesis.speak(u1);
}, [speech, flashCard, eventDetailsNo]);



  
  return (
    <div className="h-screen w-screen absolute z-999 bg-amber-50/50 font-sans">
      <div className="cursor-pointer p-5" onClick={() => {
  window.speechSynthesis.cancel(); // stop voice instantly
  setSpeech(false);
  setFlashCard(false);
}}
>
        <CloseIcon />
      </div>
      <div className="border-16 flex-col overflow-auto mx-auto w-250 h-fit mt-15 rounded-xl border-[#8e0000] bg-[#de9a35] shadow-[inset_0_0px_18px_rgba(0,0,0,0.6)]">
        <div className="flex">
          <div className="w-full mx-10">
            <div className="w-100 mx-auto h-fit py-2 text-red-800 text-2xl rounded-full bg-white border-4 border-[#8e0000] text-center mt-10 shadow-[inset_0_0px_14px_rgba(0,0,0,0.6)]">
              <div className="font-semibold text-shadow-lg text-shadow-gray-400">
                Title :
              </div>
              <div>
                {eventDetails[eventDetailsNo].title}
              </div>
            </div>
            <div className="w-fit px-10 h-fit border-4 text-red-800 text-2xl text-center border-[#8e0000] bg-white rounded-full mx-auto mt-5 shadow-[inset_0_0px_14px_rgba(0,0,0,0.6)]">
              <div className="font-semibold text-shadow-lg text-shadow-gray-400">
                Year / Location :
              </div>
              <div>
                {eventDetails[eventDetailsNo].year} / {eventDetails[eventDetailsNo].location}
              </div>
            </div>
          </div>
          {eventDetails[eventDetailsNo].imgUrl == "" && <div className="w-full mx-10 ml-2 mt-10 rounded-2xl border-4 h-45 border-[#8e0000] bg-white shadow-[inset_0_0_14px_rgba(0,0,0,0.6)]">
            <img src={eventDetails[eventDetailsNo].imgUrl} className="h-full mx-auto rounded-xl" alt="" />
          </div>}
        </div>
        <div className="border-4 px-6 pb-4 pt-4 text-red-800 text-xl rounded-2xl h-full m-7 mx-10 bg-white border-[#8e0000] shadow-[inset_0_0_24px_rgba(0,0,0,0.9)]">
          <div className="px-3 py-0 pt-2 float-right cursor-pointer" onClick={() => setSpeech(c => !c)}>
            <SpeakerIcons />
          </div>
          <div>
            <div className="text-shadow-lg text-shadow-gray-400 font-semibold">
              Key figures :
            </div>
            <div>
              {eventDetails[eventDetailsNo].details.keyFigures}
            </div>
          </div>
          <div className="font-semibold text-shadow-lg text-shadow-gray-400">
            Description :
          </div>
          <div>
            {eventDetails[eventDetailsNo].details.narrative}
          </div>
        </div>
      </div>
    </div>
  );
}
