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
      <div className="border-16 flex-col overflow-auto mx-auto w-250 h-fit mt-15 rounded-xl border-[#8e0000] bg-[#de9a35] shadow-[inset_0_0px_18px_rgba(0,0,0,0.6)]">
        <div className="flex">
          <div className="w-full mx-10">
            <div className="w-100 mx-auto h-fit py-2 text-red-800 text-2xl rounded-full bg-white border-4 border-[#8e0000] text-center mt-10 shadow-[inset_0_0px_14px_rgba(0,0,0,0.6)]">
              <div className="font-semibold text-shadow-lg text-shadow-gray-400">
                Title :
              </div>
              <div>{current.title}</div>
            </div>
            <div className="w-fit px-10 h-fit border-4 text-red-800 text-2xl text-center border-[#8e0000] bg-white rounded-full mx-auto mt-5 shadow-[inset_0_0px_14px_rgba(0,0,0,0.6)]">
              <div className="font-semibold text-shadow-lg text-shadow-gray-400">
                Year / Location :
              </div>
              <div>
                {current.year} / {current.location}
              </div>
            </div>
          </div>
          {current.imgUrl && (
            <div className="w-full mx-10 ml-2 mt-10 rounded-2xl border-4 h-45 border-[#8e0000] bg-white shadow-[inset_0_0_14px_rgba(0,0,0,0.6)]">
              <img
                src={current.imgUrl}
                className="h-full mx-auto rounded-xl"
                alt={current.title || "Event image"}
              />
            </div>
          )}
        </div>
        <div className="border-4 px-6 pb-4 pt-4 text-red-800 text-xl rounded-2xl h-full m-7 mx-10 bg-white border-[#8e0000] shadow-[inset_0_0_24px_rgba(0,0,0,0.9)]">
          <div
            className="px-3 py-0 pt-2 float-right cursor-pointer"
            onClick={() => setSpeech((c) => !c)}
          >
            <SpeakerIcons />
          </div>
          <div>
            <div className="text-shadow-lg text-shadow-gray-400 font-semibold">
              Key figures :
            </div>
            <div>{current.details.keyFigures}</div>
          </div>
          <div className="font-semibold text-shadow-lg text-shadow-gray-400">
            Description :
          </div>
          <div>{current.details.narrative}</div>
        </div>
      </div>
    </div>
  );
}
