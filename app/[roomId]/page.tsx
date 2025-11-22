import Image from "next/image";
import OpenShell from "../../images/openShell.png"
export default function GameScreen() {
  return (
    <div className="h-screen w-screen border-2 overflow-auto overflow-y-hidden flex">
      <div className="h-screen bg-red-600 border-2 p-1 pb-2">
        <div className="h-full px-10 bg-orange-400 border-2 float-start flex flex-col justify-around">
        <div className="border-2 h-fit p-2.5 rounded-3xl border-[#fe6c07] bg-[#f3b75e]">
            <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
              <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                <div className="border-r-2 border-b-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
                <div className="border-l-2 border-b-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
                <div className="border-r-2 border-t-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
                <div className="border-l-2 border-t-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
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
        </div>
        <div>
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
          <div className="p-3 border-2 mt-2 rounded-3xl border-[#fe6c07] bg-[#f3b75e]">
            <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
              <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                <div className="border-r-2 border-b-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
                <div className="border-l-2 border-b-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
                <div className="border-r-2 border-t-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
                <div className="border-l-2 border-t-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>
      <div className="w-full  bg-cover"></div>
      <div className="h-screen border-2 float-end">
        <div className="h-screen px-10 float-start flex flex-col justify-around">
        <div>
          <div className="border-2 border-[#d75a00] rounded-3xl p-3 bg-[#f3b75e]">
            <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
              <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                <div className="border-r-2 border-b-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
                <div className="border-l-2 border-b-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
                <div className="border-r-2 border-t-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
                <div className="border-l-2 border-t-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
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
        </div>
        <div>
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
          <div className="border-2 mt-2 border-[#d75a00] rounded-3xl p-3 bg-[#f3b75e]">
            <div className="h-35 w-35 rounded-2xl border-3 border-[#d75a00] mx-auto shadow-[inset_0px_0px_15px_rgba(0,0,0,0.6)] bg-radial from-[#e1731d] via-50% via-[#e4ae5d] to-[#e4ae5d]">
              <div className="grid grid-cols-2 grid-rows-2 h-full w-full">
                <div className="border-r-2 border-b-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
                <div className="border-l-2 border-b-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
                <div className="border-r-2 border-t-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
                <div className="border-l-2 border-t-2 flex items-center">
                  <Image className="p-2" src={OpenShell} alt="Shell" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
