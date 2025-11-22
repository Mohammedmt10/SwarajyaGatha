"use client";
import Image from 'next/image';
import BackgroundImage from '../images/Background.jpg';
import Menu from '../images/Menu.png';
import Logo from '../images/logo.png';
import BackgroundImageDesktop from '../images/BackgroundDesktopVersion.png';
import { useState } from 'react';
import Multiplayer from "../images/MultiplayerScreen.png"
import Singleplayer from "../images/SinglePlayer.png"
import { useRouter } from "next/navigation";

export default function Home() {
  const [isMenu , SetIsMenu] = useState(true);
  const [isMultiplayer,SetIsMultiplayer] = useState(false);
  const [isSingleplayer,SetIsSingleplayer] = useState(false);
  const [botsEnabled , SetBotsEnabled] = useState(false);
  const [noOfPeople , SetNoOfPeople] = useState(1);
  const [result , SetResult] = useState("");
  const router = useRouter();

  function randomString(length : number) { 
    var res = "";
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) { 
        res += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    SetResult(res); 
  }

  return (
    <div className="w-screen h-screen relative flex pl-8 items-center overflow-hidden">
      <div className="float-start z-99 translate-y-15">
        <div className="absolute -translate-y-50 translate-x-16">
          <Image 
            src={Logo}
            alt="Logo"
            height={400}
            className='block not-lg:hidden'
          />
        </div>
        <div className="absolute -translate-y-35 translate-x-16">
          <Image 
            src={Logo}
            alt="Logo"
            height={300}
            className='block lg:hidden'
          />
        </div>
        {isMenu && <div onClick={() => {
          SetIsMenu(c => !c);
          SetIsSingleplayer(c => !c)
        }} className='z-999 border-2 h-12 lg:h-14 absolute w-46 lg:w-56 translate-x-20 translate-y-29 lg:translate-x-24 lg:translate-y-35 bg-transparent cursor-pointer'></div>} 
        {isMenu && <div onClick={() => {
          SetIsMenu(c => !c);
          SetIsMultiplayer(c => !c)
        }} className='z-999 border-2 h-12 lg:h-14 absolute w-45 lg:w-55 translate-x-20 lg:translate-x-24 translate-y-50 lg:translate-y-60 bg-transparent cursor-pointer'></div>} 
        {isMenu && <div className='z-999 border-2 h-12 lg:h-14 absolute w-30 lg:w-36 translate-x-27 lg:translate-x-33 translate-y-70 lg:translate-y-84 bg-transparent cursor-pointer'></div>} 
        {isMenu && <div className='z-999 border-2 h-10 lg:h-12 absolute w-15 lg:w-18 translate-x-35 lg:translate-x-42 translate-y-88 lg:translate-y-105 bg-transparent cursor-pointer'></div>}

        {/* Menu images */}
        {isMenu && <Image 
          src={Menu}
          alt="Menu"
          height={600}
          className="hidden lg:block"
        />}
        {isMenu && <Image 
          src={Menu}
          alt="Menu"
          height={500}
          className="block lg:hidden"
        />}
        {isMultiplayer && <div>
          <input type="text" className='absolute translate-y-48.5 lg:translate-y-58 translate-x-17.5 lg:translate-x-20.5 h-7 lg:h-8.5 w-50 lg:w-60.5 outline-0 rounded px-2 z-999' value={result} onChange={(event) => {SetResult(event.currentTarget.value)}} />
          <div onClick={() => randomString(5)} className='absolute hover:border-2 border-yellow-300 h-9 lg:h-11 w-19 lg:w-22 rounded-xl lg:rounded-2xl cursor-pointer translate-x-31 lg:translate-x-38 translate-y-77 lg:translate-y-92'></div>
          <div onClick={() => router.push(`/${result}`)} className='absolute hover:border-2 border-yellow-300 h-12 lg:h-13.5 w-28 lg:w-33.5 rounded-3xl lg:rounded-3xl cursor-pointer translate-x-26.5 lg:translate-x-32 translate-y-93 lg:translate-y-112'></div> 
          <div onClick={() => {
            SetIsMenu(c => !c)
            SetIsMultiplayer(c => !c)
          }} className='absolute hover:border-2 border-yellow-300 h-11 lg:h-12.5 w-11 lg:w-12.5 rounded-full cursor-pointer translate-x-13 lg:translate-x-16 translate-y-94 lg:translate-y-113'></div>
        </div>}
        {isMultiplayer && <Image 
          src={Multiplayer}
          alt="Menu"
          height={600}
          className="hidden lg:block"
        />}
        {isMultiplayer && <Image 
          src={Multiplayer}
          alt="Menu"
          height={500}
          className="block lg:hidden"
        />}

        {isSingleplayer && <div>
            {botsEnabled && <div className='bg-yellow-300 rounded-full h-3 lg:h-3.5 translate-x-48 lg:translate-x-58 translate-y-41 lg:translate-y-49 w-3 lg:w-3.5 absolute'></div>}
            <div onClick={() => {
              SetBotsEnabled(c => !c)
            }} className="absolute h-11.5 w-29 lg:h-15 lg:w-34 rounded-4xl cursor-pointer border-2 translate-y-36 lg:translate-y-43 translate-x-28 lg:translate-x-34"></div>
            <div onClick={() => {
              SetNoOfPeople(1)
            }} className={`absolute h-19 lg:h-22.5 w-20 lg:w-23.5 cursor-pointer ${noOfPeople == 1 ? "border-2 border-yellow-300" : ""} rounded-2xl translate-y-50 lg:translate-y-60 translate-x-20.5 lg:translate-x-25`}></div>
            <div onClick={() => {
              SetNoOfPeople(2)
            }} className={`absolute h-19 lg:h-22.5 w-20.5 lg:w-23.5 cursor-pointer ${noOfPeople == 2 ? "border-2 border-yellow-300" : ""} rounded-2xl translate-y-50 lg:translate-y-60 translate-x-41 lg:translate-x-50`}></div>
            <div onClick={() => {
              SetNoOfPeople(3)
            }} className={`absolute h-19 lg:h-22.5 w-20  lg:w-23.5 cursor-pointer ${noOfPeople == 3 ? "border-2 border-yellow-300" : ""} rounded-2xl translate-y-71.5 lg:translate-y-86 translate-x-20.5 lg:translate-x-25`}></div>
            <div onClick={() => {
              SetNoOfPeople(4)
            }} className={`absolute h-19 lg:h-22.5 w-19  lg:w-23.5 cursor-pointer ${noOfPeople == 4 ? "border-2 border-yellow-300" : ""} rounded-2xl translate-y-72 translate-x-42 lg:translate-y-86 lg:translate-x-50`}></div>
            <div onClick={() => {
              SetIsMenu(true)
              SetIsSingleplayer(false)
            }} className='hover:border-2 border-yellow-300 h-10 w-10 lg:h-13 lg:w-13 rounded-full cursor-pointer absolute translate-y-94.5 lg:translate-y-113 translate-x-13 lg:translate-x-15'></div>
            
          <div onClick={() => {
            router.push(`/SinglePlayer/${noOfPeople}`)
          }} className='absolute hover:border-2 border-yellow-300 h-12 lg:h-13.5 w-28 lg:w-33.5 rounded-3xl lg:rounded-3xl cursor-pointer translate-x-26.5 lg:translate-x-32 translate-y-93 lg:translate-y-112'></div> 
        </div>}

        {isSingleplayer && <Image 
          src={Singleplayer}
          alt="Menu"
          height={600}
          className="hidden lg:block"
        />}
        {isSingleplayer && <Image 
          src={Singleplayer}
          alt="Menu"
          height={500}
          className="block lg:hidden"
        />}

      </div>
      <div className="block lg:hidden absolute inset-0">
        <Image
          src={BackgroundImage}
          alt="Warriors looking at a fort"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      <div className="hidden lg:block absolute inset-0">
        <Image 
          src={BackgroundImageDesktop}
          alt="Warriors looking at a fort"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
    </div>
  );
}
