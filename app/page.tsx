"use client";
import Image from 'next/image';
import BackgroundImage from '../images/Background.jpg';
import Menu from '../images/Menu.png';
import Logo from '../images/logo.png';
import BackgroundImageDesktop from '../images/BackgroundDesktopVersion.png';
import { useState } from 'react';

export default function Home() {
  const [isMenu , SetIsMenu] = useState(true);
  return (
    <div className="w-screen h-screen relative flex pl-8 items-center overflow-hidden">
      
      {/* Foreground Elements */}
      <div className="float-start z-99 translate-y-15">
        <div className="absolute lg:-translate-y-45 -translate-y-55 translate-x-8 lg:translate-x-13">
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
        {/* Logo */}    

        {/* Clickable transparent boxes */}
        {isMenu && <div onClick={() => {
          SetIsMenu(c => !c)
        }} className='z-999 border-2 h-12 lg:h-14 absolute w-46 lg:w-56 translate-x-20 translate-y-29 lg:translate-x-24 lg:translate-y-35 bg-transparent cursor-pointer'></div>} 
        {isMenu && <div className='z-999 border-2 h-12 lg:h-14 absolute w-45 lg:w-55 translate-x-20 lg:translate-x-24 translate-y-50 lg:translate-y-60 bg-transparent cursor-pointer'></div>} 
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
      </div>

      {/* Background for Mobile */}
      <div className="block lg:hidden absolute inset-0">
        <Image
          src={BackgroundImage}
          alt="Warriors looking at a fort"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Background for Desktop */}
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
