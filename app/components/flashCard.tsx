import CloseIcon from "@/icons/closeIcon";
import eventDetails from "../../eventDetails.json";
import SpeakerIcons from "@/icons/speakerIcon";
import { useEffect, useMemo, useState } from "react";

export default function FlashCard({
  flashCard,
  setFlashCard,
  eventDetailsNo,
}: {
  flashCard: boolean;
  setFlashCard: (c: any) => void;
  eventDetailsNo: number;
}) {
  const [speech, setSpeech] = useState(false);

  const safeIndex = useMemo(() => {
    if (!Array.isArray(eventDetails) || eventDetails.length === 0) return 0;
    const clamped = Math.min(
      eventDetails.length - 1,
      Math.max(0, eventDetailsNo ?? 0),
    );
    return clamped;
  }, [eventDetailsNo]);

  const current = eventDetails[safeIndex];

  useEffect(() => {
    if (typeof window === "undefined") return;

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

    const text =
      "Key figures " +
      current.details.keyFigures +
      " Description " +
      current.details.narrative;

    const u1 = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices[10] ?? voices[0];
    if (preferredVoice) {
      u1.voice = preferredVoice;
    }
    u1.volume = 0.4;

    window.speechSynthesis.speak(u1);
  }, [speech, flashCard, current]);

  return (
    <div className="h-screen w-screen justify-center flex-row-reverse flex absolute z-999 bg-amber-50/50 font-sans">
      <div
        className="cursor-pointer p-5"
        onClick={() => {
          if (typeof window !== "undefined") {
            window.speechSynthesis.cancel();
          }
          setSpeech(false);
          setFlashCard(false);
        }}
      >
        <CloseIcon />
      </div>
      <div className="border-6 my-auto md:border-16 h-fit flex flex-col mx-auto max-w-[95vw] w-fit md:max-w-[85vw] lg:max-w-250  max-h-[96vh] items-center rounded-xl border-[#8e0000] bg-[#de9a35] shadow-[inset_0_0px_18px_rgba(0,0,0,0.6)] pb-4 md:pb-10 overflow-hidden">
        <div className="flex flex-col md:flex-row px-2 md:px-0">
          <div className="w-full md:mx-10 flex flex-col items-center">
            <div className="w-full md:w-auto md:min-w-[80%] h-fit py-1.5 px-6 text-red-800 text-sm md:text-xl lg:text-2xl rounded-full bg-white border-3 md:border-4 border-[#8e0000] text-center mt-3 md:mt-10 shadow-[inset_0_0px_14px_rgba(0,0,0,0.6)]">
              <div className="font-semibold text-shadow-lg text-shadow-gray-400 text-xs md:text-lg">
                Title :
              </div>
              <div className="break-words pb-1 leading-tight">{current.title}</div>
            </div>
            <div className="w-full md:w-auto md:min-w-[80%] px-4 md:px-10 py-1.5 h-fit border-3 md:border-4 text-red-800 text-sm md:text-xl lg:text-2xl text-center border-[#8e0000] bg-white rounded-full mt-2 md:mt-5 shadow-[inset_0_0px_14px_rgba(0,0,0,0.6)]">
              <div className="font-semibold text-shadow-lg text-shadow-gray-400 text-[10px] md:text-base lg:text-xl">
                Year / Location :
              </div>
              <div className="break-words leading-tight">
                {current.year} / {current.location}
              </div>
            </div>
          </div>

        </div>
        <div className="border-3 md:border-4 px-3 md:px-6 pb-2 md:pb-4 pt-2 md:pt-4 text-red-800 text-xs md:text-lg lg:text-xl rounded-2xl h-fit m-2 md:m-7 md:mx-10 bg-white border-[#8e0000] shadow-[inset_0_0_24px_rgba(0,0,0,0.9)] mt-3">
          <div
            className="px-1 md:px-2 py-0 pt-0.5 float-right cursor-pointer"
            onClick={() => setSpeech((c) => !c)}
          >
            <SpeakerIcons />
          </div>
          <div className="mt-1 md:mt-2">
            <div className="text-shadow-lg text-shadow-gray-400 font-semibold text-[10px] md:text-base">
              Key figures :
            </div>
            <div className="leading-snug">{current.details.keyFigures}</div>
          </div>
          <div className="mt-2 md:mt-4">
            <div className="font-semibold text-shadow-lg text-shadow-gray-400 text-[10px] md:text-base">
              Description :
            </div>
            <div className="leading-tight md:leading-relaxed line-clamp-4 md:line-clamp-none">{current.details.narrative}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
