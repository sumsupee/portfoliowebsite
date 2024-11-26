// app/portfolio/[id]/page.tsx
'use client';

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import TTSButton from '../../components/TTSButton'; // Adjust the path as necessary
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProjectData } from '../../../lib/types'; // Adjust the import path
import Head from "next/head"


export default function ProjectPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [orderedProjectIds, setOrderedProjectIds] = useState<string[]>([]);
  const [allProjects, setAllProjects] = useState<ProjectData[]>([]);
  const [hasLoadedAll, setHasLoadedAll] = useState<boolean>(false);

  const params = useParams();
  const currentId = Array.isArray(params.id) ? params.id[0] : params.id;

  const projectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isLoadingRef = useRef(false);
  const lastUpdatedIdRef = useRef<string | null>(null);
  const visibleSectionsRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    // Initialize SpeechSynthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      console.warn('Text-to-Speech is not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const projectsData: ProjectData[] = await res.json();
        setAllProjects(projectsData);

        // Generate ordered list of project IDs starting from currentId
        const currentIndex = projectsData.findIndex(
          (proj) => String(proj.id) === String(currentId)
        );

        const orderedIds = [
          ...projectsData.slice(currentIndex),
          ...projectsData.slice(0, currentIndex),
        ].map((proj) => String(proj.id));

        setOrderedProjectIds(orderedIds);
      } catch (error) {
        console.error('Error fetching all projects:', error);
      }
    };

    fetchAllProjects();
  }, [currentId]);

  useEffect(() => {
    const fetchProject = async (id: string) => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setProjects([data]);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    if (currentId) {
      fetchProject(currentId);
    }
  }, [currentId]);

  // Modified loadNextProject Function
  const loadNextProject = useCallback(async () => {
    if (isLoadingRef.current || hasLoadedAll) return;
    isLoadingRef.current = true;

    try {
      const loadedProjectIds = projects.map((proj) => String(proj.id));
      const nextIndex = loadedProjectIds.length;

      if (nextIndex >= orderedProjectIds.length) {
        // All projects have been loaded
        setHasLoadedAll(true);
        return;
      }

      const nextProjectId = orderedProjectIds[nextIndex];
      const res = await fetch(`/api/projects/${nextProjectId}`);
      const data = await res.json();

      setProjects((prev) => [...prev, data]);
    } catch (error) {
      console.error('Error loading next project:', error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [projects, orderedProjectIds, hasLoadedAll]);

  // Update scroll handler for infinite scrolling
  useEffect(() => {
    if (hasLoadedAll) return;

    const handleScroll = async () => {
      const buffer = 1000;
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - buffer;

      if (nearBottom) {
        await loadNextProject();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadNextProject, hasLoadedAll]);

  useLayoutEffect(() => {
    const elements = Object.values(projectRefs.current).filter(Boolean);
    if (elements.length === 0) return;

    const updateURL = (projectId: string) => {
      if (lastUpdatedIdRef.current !== projectId) {
        const newPath = `/portfolio/${projectId}`;
        window.history.replaceState({}, '', newPath);
        lastUpdatedIdRef.current = projectId;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          const projectId = section.getAttribute('data-id');
          if (!projectId) return;

          // Add fade-in animation
          if (entry.isIntersecting) {
            section.classList.add('fade-in');

            // Calculate visibility percentage
            const visiblePercentage =
              (entry.intersectionRect.height * entry.intersectionRect.width) /
              (section.offsetHeight * section.offsetWidth);

            // Update visible sections
            visibleSectionsRef.current[projectId] = visiblePercentage;
          } else {
            // Remove section when not intersecting
            delete visibleSectionsRef.current[projectId];
          }
        });

        // Determine the section with the highest visibility
        const visibleSectionIds = Object.keys(visibleSectionsRef.current);
        if (visibleSectionIds.length > 0) {
          let mostVisibleId = visibleSectionIds[0];
          let maxVisibility = visibleSectionsRef.current[mostVisibleId];
          visibleSectionIds.forEach((id) => {
            if (visibleSectionsRef.current[id] > maxVisibility) {
              maxVisibility = visibleSectionsRef.current[id];
              mostVisibleId = id;
            }
          });
          updateURL(mostVisibleId);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: Array.from(Array(101).keys()).map((i) => i / 100),
      }
    );

    elements.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [projects]);

  const handleShare = async () => {
    try {
      const pageURL = window.location.href;
      await navigator.clipboard.writeText(pageURL);
      toast.success('Link copied to clipboard, just paste and share!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      toast.error('Failed to copy URL. Please try again.');
    }
  };

  return (
    <>
    <Head>
      <title>Portfolio</title>
    </Head>
      <div className="bg-[#1C1C1C] text-white relative">
        {/* Toast Container
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        /> */}

        {/* Navbar */}
        <nav className="w-full fixed top-0 left-0 md:flex p-0 z-10 bg-[#1C1C1C]">
          {/* Left Column */}
          <div className="md:w-1/2 md:flex md:items-center md:p-6">
            <Link href="/" className="text-sm hover:text-gray-300 font-medium hidden md:block">
              Sumedh Supe
            </Link>
          </div>

          {/* Right Column */}
          <div className="md:w-1/2 w-full flex justify-between md:justify-end gap-6 p-6 md:bg-[#2d2d2d]">
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
              style={{ textAlign: 'left' }}
            >
              Portfolio
            </Link>
          </div>
        </nav>

        {/* Projects */}
        <div className="min-h-screen">
          {projects.map((project, index) => (
            <section
              key={`${project.id}-${index}`}
              ref={(el: HTMLDivElement | null) => {
                projectRefs.current[project.id] = el;
              }}
              data-id={project.id}
              className="relative"
            >
              {/* Project content */}
              <div className="grid grid-cols-8">
                {/* Left Column */}
                <div className="col-span-8 md:col-span-4 md:p-6 pt-0 relative">
                  {/* Container for Back Button and Title */}

                  <div className="md:sticky md:top-[calc(25vh-2.7rem)]">
                    {/* Back Button */}
                    <div className="h-[calc(15vh)] md:hidden"></div>
                    <Link href="/portfolio" passHref>
                      <button
                        className="flex items-center m-0 p-0 pl-6 md:pl-0 text-[#FFEA00] focus:outline-none group"
                        aria-label="Back to Portfolio"
                      >
                        {/* Back Button SVG */}
                        <svg
                          className="w-7 h-7 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 12H5M11 18l-6-6 6-6" />
                        </svg>
                        {/* Portfolio Text on Hover */}
                        <span className="ml-0 opacity-0 text-gray-300 group-hover:opacity-100 transition-opacity duration-200">
                          Portfolio
                        </span>
                      </button>
                    </Link>
                    <div className="h-[1rem]" />
                    <div className="md:hidden h-[0.5rem]" />
                    <div className="md:hidden">
                      <img
                        src={project.image || '/placeholder.svg'}
                        alt={project.title}
                        className="relative aspect-auto overflow-hidden w-full"
                      />
                    </div>
                    <div className="md:hidden h-[5vh]" />
                    {/* Title */}
                    <div className="md:grid md:grid-cols-8 p-6 pb-0 md:p-0">
                      <div className="md:col-span-5">
                        {/* Title */}
                        <h1 className="text-[32px] font-medium leading-tight mb-2">
                          {project.title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base text-gray-300 leading-tight">
                          {project.description}
                        </p>
                        <p className="text-sm pt-3 text-gray-300 leading-tight font-bold">
                          {project.tags}
                        </p>
                        <p className="text-sm text-gray-300 leading-tight italic">
                          {project.other}
                        </p>
                        <p className="text-sm text-gray-300 leading-tight italic">
                          {project.duration}
                        </p>
                      </div>
                    </div>
                    {/* TTS Controls Button */}
                    <div className="pl-6 pt-6 md:pl-0">
                      <TTSButton
                        projectTitle={project.title}
                        content={project.title + ' ' + project.content}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-span-8 md:col-span-4 p-6 pt-16 md:bg-[#2d2d2d]">
                  {/* Project Content */}
                  <div>
                    <img
                      src={project.image || '/placeholder.svg'}
                      alt={project.title}
                      className="aspect-auto hidden md:block pt-6 pb-12"
                    />
                  </div>
                  <div
                    className="prose prose-invert max-w-none text-white"
                    dangerouslySetInnerHTML={{ __html: project.content }}
                  />
                </div>
              </div>
              <hr className="md:hidden"></hr>
              <div className="w-full h-6 bg-[#1c1c1c] m-0"></div>
            </section>
          ))}
            {hasLoadedAll && <div className="flex justify-start md:justify-end p-6 pt-0">
              <p className="text-[12px] text-gray-300">
                You've viewed all projects © 2024{" "}
                <Link href="/" className="underline hover:text-white">
                  Sumedh Supe
                </Link>
              </p>
            </div>}
        </div>
      </div>

      {/* Global Styles for Fade-in Animation */}
      <style jsx global>{`
        /* Base styles for project sections */
        .prose section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        /* Fade-in animation */
        .fade-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        /* YouTube iframe fallback */
        .aspect-video {
          position: relative;
          background: #2c2c2c;
          margin-bottom: 0.5rem;
        }

        .aspect-video iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: opacity 0.3s ease;
        }

        .aspect-video iframe:not([loaded]) {
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .aspect-video iframe:not([loaded])::after {
          content: '↗ Watch on YouTube';
          color: #ffea00;
          text-decoration: none;
          position: absolute;
          cursor: pointer;
        }

        /* Caption styles */
        .caption {
          text-align: center;
          font-size: 0.875rem;
          color: #9ca3af;
          margin-top: 0.5rem;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </>
  );
}
