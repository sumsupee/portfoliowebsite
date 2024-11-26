// Page.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PortfolioComponent() {
  const [typedText, setTypedText] = useState("");
  const [isRightLoaded, setIsRightLoaded] = useState(false);
  const [isNavFooterLoaded, setIsNavFooterLoaded] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fullText = "Contact";

  useEffect(() => {
    const typeCharacter = (index: number) => {
      if (index < fullText.length) {
        if (index === 7) {
          // Add a delay between "Sumedh" and "Supe"
          setTimeout(() => typeCharacter(index + 1), 500);
        } else {
          setTypedText(fullText.slice(0, index + 1));
          setTimeout(() => typeCharacter(index + 1), 50); // Faster typing speed
        }

        // Start fade-in animations when "Supe" starts typing
        
          setIsRightLoaded(true);
          setTimeout(() => {
            setIsNavFooterLoaded(true);
          }, 1000); // Delay of 1 second after right column starts fading in

        setIsContentLoaded(true);
      }
    };

    // Start typing effect from the first character
    typeCharacter(0);
  }, [fullText]);


  return (
    <div className="h-screen bg-[#1C1C1C] text-white grid grid-rows-8 grid-cols-8 relative">
      {/* Navigation */}
      <nav
        className={`w-full fixed top-0 left-0 flex items-center p-6 z-10 bg-[#1C1C1C] transition-opacity duration-1000 ${
          isNavFooterLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Brand on the left for large screens, hidden on small */}
        <Link href="/" className="text-sm font-medium hidden md:block">
          Sumedh Supe
        </Link>

        {/* Link Section */}
        <div className="flex flex-grow justify-between md:justify-end gap-6 ">
          <Link href="/" className="text-sm hover:text-gray-300 text-left md:hidden">
            Home
          </Link>
          <Link href="/contact" className="text-sm hover:text-gray-300 text-center md:text-right">
            Contact
          </Link>
          <Link href="/portfolio" className="text-sm hover:text-gray-300 text-right md:hidden">
            Portfolio
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="col-span-8 row-start-3 row-span-4 grid grid-cols-8 gap-4 px-6 pt-0">
        {/* Left Column - Align with Navbar */}
        <div className="md:col-span-3 md:col-start-1">
          <h1 className="text-[32px] font-medium leading-tight">
            {typedText}
          </h1>
        </div>

        {/* Right Column - Only visible on medium and larger screens */}
        <div
          className={`md:col-span-4 md:col-start-5 hidden md:block transition-opacity duration-1000 ${
            isRightLoaded ? 'opacity-100' : 'opacity-0'
          } `}
        >
          <h2 className="text-base font-medium leading-tight">
            <Link
              href="mailto:sumedh88@outlook.com?subject=Hello%20Sumedh&body=I%20came%20across%20your%20portfolio!"
              className="hover:text-gray-300 flex items-center group p-0 m-0"
              target="_blank"
            >
              sumedh88@outlook.com
              <svg
                className="ml-2 w-7 h-7 opacity-0 text-[#FFEA00] group-hover:opacity-100 transition-opacity duration-300 fill-current "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/in/sumedh-supe/"
              className="hover:text-gray-300  flex items-center group p-0 m-0"
            >
              {"in/sumedh-supe"}
              <svg
                className="ml-2 w-7 h-7 opacity-0 text-[#FFEA00] group-hover:opacity-100 transition-opacity duration-300 fill-current "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </h2>
        </div>
        <div className="text-right p-6 pl-0 row-start-2 col-span-8 col-start-1">
        <h2 className={`text-base w-full font-medium leading-tight md:hidden transition-opacity duration-1000 ${
            isRightLoaded ? 'opacity-100' : 'opacity-0'
          } `}>
            <Link
              href="mailto:sumedh88@outlook.com?subject=Hello%20Sumedh&body=I%20came%20across%20your%20portfolio!"
              className="hover:text-gray-300 flex group p-0 m-0"
              target="_blank"
            >
              sumedh88@outlook.com
              <svg
                className="ml-2 w-7 h-7 opacity-0 text-[#FFEA00] group-hover:opacity-100 transition-opacity duration-300 fill-current "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/in/sumedh-supe/"
              className="hover:text-gray-300 flex group p-0 m-0"
            >
              {"in/sumedh-supe/"}
              <svg
                className="ml-2 w-7 h-7 opacity-0 text-[#FFEA00] group-hover:opacity-100 transition-opacity duration-300 fill-current "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </h2>
        </div>
      </main>

        {/* Footer */}
        <footer
          className={`absolute bottom-0 right-0 w-full md:w-1/3 p-6 bg-[#1C1C1C] transition-opacity duration-1000 text-right ${
            isNavFooterLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        > 
  
          <p className="text-[12px] text-gray-300 leading-tight">
              I love meeting people, say{" "}
              <Link href="mailto:sumedh88@outlook.com?subject=Hello%20Sumedh&body=I%20came%20across%20your%20portfolio!" target="_blank" className="underline hover:text-white">
              hello
            </Link>
            {" "}:) 
            </p>
        </footer>
          
    </div>

  );
}
