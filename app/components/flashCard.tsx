import CloseIcon from "@/icons/closeIcon"

export default function FlashCard({setFlashCard, } :  {setFlashCard : (c: any) => void}) {
    return <div className="h-screen w-screen absolute z-999 bg-amber-50/50 font-sans">
                    <div className="cursor-pointer p-5" onClick={() => setFlashCard((c: any) => !c)}>
                        <CloseIcon />
                    </div>
            <div className="border-16 flex flex-col gap-4 mx-auto w-250 h-150 mt-15 rounded-xl border-[#8e0000] bg-[#de9a35] shadow-[inset_0_0px_18px_rgba(0,0,0,0.6)]">
                <div className="flex ">
                    <div className="w-125 mx-10">
                        <div className="w-100 mx-auto h-30  text-red-800 text-2xl rounded-full bg-white border-4 border-[#8e0000] text-center mt-10 shadow-[inset_0_0px_14px_rgba(0,0,0,0.6)]">
                            <div className="font-semibold text-shadow-lg text-shadow-gray-400">
                                Title :
                            </div>
                            
                        </div>
                        <div className="w-60 h-20 border-4 text-red-800 text-2xl text-center border-[#8e0000] bg-white rounded-full mx-auto mt-5 shadow-[inset_0_0px_14px_rgba(0,0,0,0.6)]">
                            <div className="font-semibold text-shadow-lg text-shadow-gray-400">
                                Date :
                            </div>
                            
                        </div>
                    </div>
                    <div className="w-full mx-10 ml-2 mt-10 rounded-2xl border-4 border-[#8e0000] bg-white shadow-[inset_0_0_14px_rgba(0,0,0,0.6)]">

                    </div>
                </div>
                <div className="border-4 px-6 pt-4 text-red-800 text-xl rounded-2xl h-full m-7 mx-10 bg-white border-[#8e0000] shadow-[inset_0_0_24px_rgba(0,0,0,0.9)]">
                    <div className="font-semibold text-shadow-lg text-shadow-gray-400">
                        Description :
                    </div>
                </div>
            </div>
      </div>
}