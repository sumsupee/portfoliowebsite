// Page.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import Head from "next/head"
import { useEffect, useState } from "react";
import type { ProjectData } from "../lib/types";

export default function PortfolioComponent() {
  const [projects, setProjects] = useState<Omit<ProjectData, "content">[] | null>(null);
  const [typedText, setTypedText] = useState("");
  const [isRightLoaded, setIsRightLoaded] = useState(false);
  const [isNavFooterLoaded, setIsNavFooterLoaded] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fullText = "Sumedh Supe";

  useEffect(() => {
    // Fetch projects data here
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects'); // Adjust the endpoint as needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Omit<ProjectData, "content">[] = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects([]); // Fallback to empty array to prevent errors
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const typeCharacter = (index: number) => {
      if (index < fullText.length) {
        if (index === 6) {
          // Add a delay between "Sumedh" and "Supe"
          setTimeout(() => typeCharacter(index + 1), 500);
        } else {
          setTypedText(fullText.slice(0, index + 1));
          setTimeout(() => typeCharacter(index + 1), 50); // Faster typing speed
        }

        // Start fade-in animations when "Supe" starts typing
        if (index === 6) {
          setIsRightLoaded(true);
          setTimeout(() => {
            setIsNavFooterLoaded(true);
          }, 1000); // Delay of 1 second after right column starts fading in
        }
      } else {
        // All text typed, content is loaded
        setIsContentLoaded(true);
      }
    };

    // Start typing effect from the first character
    typeCharacter(0);
  }, [fullText]);

  if (!projects) {
    return <div>Loading...</div>; // Handle loading state
  }

  return (
    <>
    {/* <Head>
      <title>Sumedh Supe</title>
    </Head> */}
    <div className="h-screen bg-[#1C1C1C] text-white grid grid-rows-8 grid-cols-8 relative">
      {/* Navigation */}
      <nav
        className={`w-full fixed top-0 left-0 flex items-center p-6 z-10 bg-[#1C1C1C] transition-opacity duration-1000 md:hidden ${
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
      <main className="col-span-8 row-start-3 row-span-1 grid grid-cols-8 gap-4 px-6 pt-0">
        {/* Left Column - Align with Navbar */}
        <div className="col-span-3 col-start-1">
          <h1 className="text-[32px] font-medium leading-tight">
            {typedText.slice(0, 6)}
            <br />  
            {typedText.slice(6)}
          </h1>
        </div>

        {/* Right Column - Only visible on medium and larger screens */}
        <div
          className={`col-span-3 col-start-5 transition-opacity duration-1000 ${
            isRightLoaded ? 'opacity-100' : 'opacity-0'
          } hidden md:block`}
        >
          <h2 className="text-[32px] font-medium leading-tight">
            <Link
              href="/portfolio"
              className="hover:text-gray-300 flex items-center group p-0 m-0"
            >
              Portfolio
              <svg
                className="ml-2 w-7 h-7 opacity-0 text-[#FFEA00] group-hover:opacity-100 transition-opacity duration-300 fill-current "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="hover:text-gray-300  flex items-center group p-0 m-0"
            >
              Contact
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
        className={`absolute bottom-0 right-0 w-full md:w-1/3 p-6 bg-[#1C1C1C] transition-opacity duration-1000 ${
          isNavFooterLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="mb-4">
          <Image
            src="/Sumedh_into.gif"
            alt="Sumedh exploring a tulip field, moving GIF"
            width={200}
            height={150}
            className="bg-[#1c1c1c]"
          />
        </div>
        <p className="text-sm text-gray-300 leading-tight">
        I am a Human-Computer Interaction technologist with expertise in automating complex workflows through human-centered design and technology. Positioned at the intersection of design and business, I specialize in integrating AI tools into existing workflows for practical, impactful solutions. I thrive on observing, interacting, and building to solve real-world problems. My scrappiness fuels rapid prototyping and effective validation of what works. 
      {" "}
          {/* <Link href="/more" className="underline hover:text-white">
            [more...]
          </Link> */}
          <button
  onClick={() => setIsExpanded(!isExpanded)}
  className="underline hover:text-white text-[#FFEA00]"
>
  {isExpanded ? "" : "[more...]"}
</button>
        </p>
        {isExpanded && (
  <p className="bg-[#1C1C1C] text-sm text-gray-300 leading-tight p-0"><br></br>
    I study my tools really well, this has enabled me to get the best out of them, even in resource scarce settings. I also love working with people, and just like 
    my tools I study them well too to ensure that whatever I build has a real-world impact. 
    I am an electronics engineer by background and a post-graduate student trained in HCI. I have been using human-centered techniques to solve problems technologically for explainability of AI, healthtech, forestry and films. 
    <br></br>
    <br></br>
    I can talk to people, do UX, craft designs, test antennas, write code all while telling a story. 
    
      
    <button
  onClick={() => setIsExpanded(!isExpanded)}
  className="underline hover:text-white text-[#FFEA00]"
>
  {isExpanded ? "[...less]" : ""}
</button>
  </p>
)}
        <div className="flex justify-center md:hidden items-center h-5">
  <svg
    className="w-7 h-7 text-[#FFEA00] animate-pulse fill-current p-0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <g transform="rotate(-90 12 12)">
      <path d="M19 12h-14m6-6-6 6 6 6" />
  </g>
  </svg>
</div>

      </footer>
     

      {/* Small Screen Layout */}
      <div className="md:hidden w-full col-span-8 pt-[100vh] p-6">
        {/* Grid Container for Top Viewport */}
        <div>
          {/* Title with Typing Effect starting from row 2 */}
          {/* Subtitle and Project Cards */}  
          {isContentLoaded && (
            <div>
              <br />
              <div className="h-[7.5vh]"></div>
              <div className="col-span-3 col-start-1">
                <h1 className="text-[32px] font-medium leading-tight">
                Portfolio
                </h1>
              </div>
              <div className="h-[10.5vh]"></div>
              {/* Project Cards with Staggered Fade-In */}
              <div>
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    className="bg-zinc-900 rounded-lg overflow-hidden mb-4 w-full transition-transform duration-300 hover:scale-105"
                    style={{
                      opacity: 0,
                      transform: 'translateY(20px)',
                      animation: `fadeInUp 0.6s forwards`,
                      animationDelay: `${index * 0.2}s`,
                    }}
                  >
                    <Link href={`/portfolio/${project.id}`}>
                      <div className="relative w-full h-48">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className="p-4">
                        <h2 className="text-lg font-semibold text-white">
                          {project.title}
                        </h2>
                        <p className="text-sm text-zinc-400">
                          {project.description}
                        </p>
                        <br></br>
                        <p className="text-xs text-white font-bold">
                            {project.tags}
                        </p>
                        <p className="text-xs text-white italic">
                            {project.other}
                        </p>
                        <p className="text-xs text-white italic">
                            {project.duration}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <footer className="p-6">
                      <p className="text-[12px] text-gray-300">
            © 2024{" "}
            <Link href="/" className="underline hover:text-white">
              Sumedh Supe
            </Link>
          </p>
              </footer>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
    </>
  );
}
