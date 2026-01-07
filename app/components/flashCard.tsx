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
    <div className="h-screen w-screen absolute z-999 bg-amber-50/50 font-sans">
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
      <div className="border-8 md:border-16 flex flex-col overflow-y-auto mx-auto w-[95vw] md:w-[85vw] lg:w-250 h-fit max-h-[85vh] mt-6 md:mt-15 rounded-xl border-[#8e0000] bg-[#de9a35] shadow-[inset_0_0px_18px_rgba(0,0,0,0.6)] pb-6 md:pb-10">
        <div className="flex flex-col md:flex-row px-4 md:px-0">
          <div className="w-full md:w-1/2 md:mx-10 flex flex-col items-center">
            <div className="w-full md:w-auto md:min-w-[80%] h-fit py-2 px-4 text-red-800 text-lg md:text-xl lg:text-2xl rounded-full bg-white border-4 border-[#8e0000] text-center mt-6 md:mt-10 shadow-[inset_0_0px_14px_rgba(0,0,0,0.6)]">
              <div className="font-semibold text-shadow-lg text-shadow-gray-400">
                Title :
              </div>
              <div className="break-words">{current.title}</div>
            </div>
            <div className="w-full md:w-auto md:min-w-[80%] px-6 md:px-10 py-2 h-fit border-4 text-red-800 text-lg md:text-xl lg:text-2xl text-center border-[#8e0000] bg-white rounded-full mt-4 md:mt-5 shadow-[inset_0_0px_14px_rgba(0,0,0,0.6)]">
              <div className="font-semibold text-shadow-lg text-shadow-gray-400 text-sm md:text-base lg:text-xl">
                Year / Location :
              </div>
              <div className="break-words">
                {current.year} / {current.location}
              </div>
            </div>
          </div>
          {current.imgUrl && (
            <div className="w-full md:w-1/2 mx-auto mt-6 md:mt-10 rounded-2xl border-4 h-40 md:h-45 border-[#8e0000] bg-white shadow-[inset_0_0_14px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden">
              <img
                src={current.imgUrl}
                className="h-full object-contain rounded-xl"
                alt={current.title || "Event image"}
              />
            </div>
          )}
        </div>
        <div className="border-4 px-4 md:px-6 pb-4 pt-4 text-red-800 text-sm md:text-lg lg:text-xl rounded-2xl h-fit m-4 md:m-7 md:mx-10 bg-white border-[#8e0000] shadow-[inset_0_0_24px_rgba(0,0,0,0.9)] mt-6">
          <div
            className="px-2 py-0 pt-1 float-right cursor-pointer"
            onClick={() => setSpeech((c) => !c)}
          >
            <SpeakerIcons />
          </div>
          <div className="mt-2">
            <div className="text-shadow-lg text-shadow-gray-400 font-semibold">
              Key figures :
            </div>
            <div>{current.details.keyFigures}</div>
          </div>
          <div className="mt-4">
            <div className="font-semibold text-shadow-lg text-shadow-gray-400">
              Description :
            </div>
            <div className="leading-relaxed">{current.details.narrative}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
