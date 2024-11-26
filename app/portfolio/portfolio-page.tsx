"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProjectData } from "../../lib/types";
import { useState, useEffect } from "react";
import Head from "next/head";

export default function Component({
  projects,
}: {
  projects: Omit<ProjectData, "content">[];
}) {
  const [hoveredProject, setHoveredProject] =
    useState<null | Omit<ProjectData, "content">>(null);

  // State for typing effect and animations
  const [typedText, setTypedText] = useState("");
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const [isNavLoaded, setIsNavLoaded] = useState(false);
  const fullText = "Portfolio";

  useEffect(() => {
    const typeCharacter = (index: number) => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        setTimeout(() => typeCharacter(index + 1), 50); // Typing speed
      } else {
        // Typing effect is complete
        setIsContentLoaded(true);
        setTimeout(() => {
          setIsNavLoaded(true);
        }, 500); // Delay before navbar appears
      }
    };

    // Start typing effect
    typeCharacter(1);
  }, []);

  return (
    <>
    {/* <Head>
      <title>Portfolio</title>
    </Head> */}
    <div className="bg-[#1C1C1C] text-white relative">
      {/* Navbar */}
      <nav
        className={`w-full fixed top-0 left-0 flex items-center p-6 z-10 bg-[#1C1C1C] transition-opacity duration-1000 ${
          isNavLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <Link href="/" className="text-sm hover:text-gray-300 font-medium hidden md:block">
          Sumedh Supe
        </Link>

        <div className="flex flex-grow justify-between md:justify-end gap-6">
          <Link
            href="/"
            className="text-sm hover:text-gray-300 text-left md:hidden"
          >
            Home
          </Link>
          <Link
            href="/contact"
            className="text-sm hover:text-gray-300 text-center md:text-right"
          >
            Contact
          </Link>
          <Link
            href="/portfolio"
            className="text-sm hover:text-gray-300 text-right md:hidden"
          >
            Portfolio
          </Link>
        </div>
      </nav>

      {/* Large Screen Layout */}
      <div className="hidden md:grid md:grid-rows-8 md:grid-cols-12 md:h-screen">
        {/* Left Columns - Title and Project Titles */}
        <div className="md:col-span-3 md:row-start-3 md:row-end-9 grid grid-rows-8">
          {/* Title */}
          <div className="p-6 md:px-6 md:pt-0 md:row-span-1">
            <h1 className="text-[32px] font-medium leading-tight mb-2">
              {typedText}
            </h1>
          </div>
        </div>

        <div className="md:col-span-4 md:row-start-3 md:row-end-9 grid grid-rows-8">
                      {/* Project Titles */}
          <div
            className={`p-6 md:pt-0 md:pl-0 flex flex-col gap-0 mt-4 md:mt-0 md:row-span-7 transition-opacity duration-1000 ${
              isContentLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            {projects.map((project) => (
              <div key={project.id}>
                <Link
                  href={`/portfolio/${project.id}`}
                  onMouseEnter={() => isContentLoaded && setHoveredProject(project)}
                  onMouseLeave={() => isContentLoaded && setHoveredProject(null)}
                  className="md:text-sm md:font-medium md:text-white md:hover:text-gray-300 md:transition flex items-center group m-0"
                >
                  {project.title}
                  <svg
                    className="ml-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#FFEA00"
                  >
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-1 md:row-start-3 md:row-end-9 grid grid-rows-8"></div>

        {/* Right Column - Hover Card */}
        <div className={`md:col-span-4 md:row-start-1 md:row-end-9 z-10 grid grid-rows-8 ${
    hoveredProject ? "bg-[#2d2d2d] pointer-events-auto" : "bg-transparent pointer-events-none"
  }`}>
        <div className="md:row-start-3 md:row-end-9 ">
            {hoveredProject && (
                <div className=" w-full transition-opacity duration-300">
                {/* Image Container */}
                <div className="relative w-full aspect-[3/2] overflow-hidden ">
                    <Image
                    src={hoveredProject.image || "/placeholder.svg"}
                    alt={hoveredProject.title}
                    layout="fill"
                    objectFit="cover"
                    // className="aspect-auto"
                    />
                </div>
                {/* Title and Description below Image */}
                <div className="p-4">
                    {/* <p className="text-base font-medium text-zinc-400 mb-2">
                    {hoveredProject.title}
                    </p> */}
                    <p className="text-base text-gray-100 mb-4">
                    {hoveredProject.description}
                    </p>
                    <p className="text-sm text-gray-100 font-bold" >
                    {hoveredProject.tags}
                    </p>
                    <p className="text-sm text-gray-100 italic">
                    {hoveredProject.other}
                    </p>
                    <p className="text-sm text-gray-100 italic">
                    {hoveredProject.duration}
                    </p>
                </div>
                </div>
            )}
            </div>
            </div>

        {/* Footer */}
        <footer
          className={`absolute bottom-0 right-0 w-full md:w-1/3 p-6 transition-opacity duration-1000 text-right ${
            isNavLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-[12px] text-gray-300 leading-tight">
            © 2024{" "}
            <Link href="/" className="underline hover:text-white">
              Sumedh Supe
            </Link>
          </p>
        </footer>
      </div>

      {/* Small Screen Layout */}
        <div className="md:hidden bg-[#1C1C1C] min-h-screen">
        {/* Grid Container for Top Viewport */}
        <div className="grid grid-rows-8 grid-cols-8 h-screen">
            {/* Title with Typing Effect starting from row 2 */}
            <div className="col-span-8 row-start-3 px-6">
            <h1 className="text-[32px] font-medium leading-tight mb-2 p-0">
                {typedText} {/* This should be your typed text effect */}
            </h1>
            </div>

            {/* Subtitle and Project Cards */}
            {isContentLoaded && (
            <div className="col-span-8 row-start-4 px-6 m-0">
                {/* Subtitle */}
                {/* <p className="text-sm text-gray-300 leading-tight mb-4">
                Explore a selection of projects that showcase my work and skills.
                </p> */}
                <br />
                {/* Project Cards with Staggered Fade-In */}
                <div>
                {projects.map((project, index) => (
                    <div
                    key={project.id}
                    className="bg-[#2d2d2d] rounded-lg overflow-hidden mb-4 w-full transition-transform duration-300 hover:scale-105"
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
                        <p className="text-sm text-white">
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


      {/* Hovered Project Image and Description - Large Screens Only */}
      {/* {hoveredProject && (
        <div className="fixed bottom-6 left-6 bg-[#111111] rounded-lg w-[500px] transition-opacity duration-300 hidden md:flex shadow-lg p-2">
          <div className="relative h-80 w-2/3 overflow-hidden rounded-lg">
            <Image
              src={hoveredProject.image || "/placeholder.svg"}
              alt={hoveredProject.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-start w-1/3 p-4">
            <p className="text-base font-medium text-zinc-400 mb-2">
              {hoveredProject.title}
            </p>
            <p className="text-sm text-zinc-400 mb-2">
              {hoveredProject.description}
            </p>
          </div>
        </div>
      )} */}
    </div>
    </>
  );
}
