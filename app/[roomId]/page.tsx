import Image from "next/image";
import Banner from "../../images/Banners.png";
import Block from "../../images/block.png";

export default function GameScreen() {
  return (
    <div className="h-screen w-screen flex items-center justify-center gap-10 overflow-hidden px-4">

      {/* LEFT BANNER WITH BLOCKS */}
      <div className="relative w-[45vw] max-w-[600px]">
        <Image
          src={Banner}
          alt="Banner"
          className="w-full h-auto object-contain"
        />

        {/* Block 1 */}
        <Image
          src={Block}
          alt="Block"
          className="absolute top-[15%] left-1/2 -translate-x-8/12 w-[28%] object-contain"
        />

        {/* Block 2 */}
        <Image
          src={Block}
          alt="Block"
          className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[28%] object-contain"
        />
      </div>

      {/* RIGHT BANNER WITH BLOCKS */}
      <div className="relative w-[45vw] max-w-[450px]">
        <Image
          src={Banner}
          alt="Banner"
          className="w-full float-end h-auto object-contain"
        />

        {/* Block 1 */}
        <Image
          src={Block}
          alt="Block"
          className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[28%] object-contain"
        />

        {/* Block 2 */}
        <Image
          src={Block}
          alt="Block"
          className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[28%] object-contain"
        />
      </div>

    </div>
  );
}
