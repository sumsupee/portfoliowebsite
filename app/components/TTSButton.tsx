// app/components/TTSButton.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useReadingSpeed } from '../context/ReadingSpeedContext';
import { useTTS } from '../context/TTSContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TTSButtonProps {
  content: string; // The HTML content to read
  projectTitle: string; // The title of the project for the share message
}

const TTSButton: React.FC<TTSButtonProps> = ({ content, projectTitle }) => {
  const { readingSpeed, setReadingSpeed } = useReadingSpeed();
  const { activeTTSId, setActiveTTSId } = useTTS();
  const [isReading, setIsReading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isCancelling, setIsCancelling] = useState(false);

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const readButtonRef = useRef<HTMLButtonElement | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const settingsButtonRef = useRef<HTMLButtonElement | null>(null);
  const shareButtonRef = useRef<HTMLButtonElement | null>(null);
  const buttonIdRef = useRef<string>(`tts-button-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (synth) {
      const populateVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
      };

      populateVoices();
      synth.onvoiceschanged = populateVoices;
    }
  }, [synth]);

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node) &&
        settingsButtonRef.current &&
        !settingsButtonRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  // Manage focus when modal opens
  useEffect(() => {
    if (isSettingsOpen && settingsRef.current) {
      const firstInput = settingsRef.current.querySelector('input');
      (firstInput as HTMLElement)?.focus();
    }
  }, [isSettingsOpen]);

  // Function to extract text from HTML
  const extractTextFromHTML = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Function to handle reading content
  const handleRead = () => {
    if (!synth) return;

    // If another TTSButton is active, it should stop reading
    if (activeTTSId && activeTTSId !== buttonIdRef.current) {
      // Setting activeTTSId to this button will signal others to stop
      setActiveTTSId(buttonIdRef.current);
    } else if (!activeTTSId) {
      setActiveTTSId(buttonIdRef.current);
    }

    setIsLoading(true);

    // Extract text from HTML content
    const textToRead = extractTextFromHTML(content);

    if (!textToRead.trim()) {
      console.warn('No valid text available for speech synthesis.');
      setIsLoading(false);
      return;
    }

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utteranceRef.current = utterance;

    // Set speech rate
    utterance.rate = readingSpeed;

    // Set selected voice if any
    if (voices.length > 0) {
      utterance.voice = voices[0]; // Default to the first voice
    }

    // Optionally, set pitch, etc.
    utterance.pitch = 1; // Normal pitch

    // Event listeners
    utterance.onstart = () => {
      setIsReading(true);
      setIsLoading(false);
    };

    utterance.onend = () => {
      setIsReading(false);
      setIsCancelling(false);
      setActiveTTSId(null);
    };

    utterance.onerror = (event) => {
      if (isCancelling) {
        // Reset the cancellation flag
        setIsCancelling(false);
        // Do not log an error since this was an intentional cancellation
        return;
      }
      console.error('Speech synthesis encountered an error:', event.error);
      setIsReading(false);
      setIsLoading(false);
      setActiveTTSId(null);
    };

    // Speak the text
    synth.speak(utterance);
  };

  // Function to handle stopping speech
  const handleStop = () => {
    if (synth && isReading) {
      setIsCancelling(true); // Indicate that cancellation is intentional
      synth.cancel();
      setIsReading(false);
      setActiveTTSId(null);
    }
  };

  // Listen for changes in activeTTSId to stop if another button starts reading
  useEffect(() => {
    if (activeTTSId !== buttonIdRef.current && isReading) {
      handleStop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTTSId]);

  // Function to handle settings change
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReadingSpeed(parseFloat(e.target.value));
  };

  // Function to close settings and return focus
  const closeSettings = () => {
    setIsSettingsOpen(false);
    settingsButtonRef.current?.focus();
  };

  // Function to handle Share button click
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
    <div className="relative inline-flex items-center space-x-1">
      {/* Toast Container
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // You can change the theme to 'light', 'dark', or 'colored'
      /> */}

      {/* Share Button */}
      <button
        ref={shareButtonRef}
        onClick={handleShare}
        className={`p-1 rounded hover:bg-gray-700  transition-colors duration-300 cursor-pointer `}
        aria-label="Share Project URL"
      >
        {/* Share Icon (Converted SVG) */}
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-current transform transition-transform duration-300"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Read/Stop Button */}
      <button
        ref={readButtonRef}
        onClick={isReading ? handleStop : handleRead}
        className={`p-1 rounded hover:bg-gray-700  transition-colors duration-300 ${
          synth
            ? 'cursor-pointer '
            : 'cursor-not-allowed opacity-50'
        }`}
        disabled={!synth || isLoading}
        aria-label={isReading ? 'Stop Text-to-Speech' : 'Start Text-to-Speech'}
      >
        {/* SVG Icons with Transition */}
        <div className="flex items-center justify-center h-5 w-5">
          {isLoading ? (
            // Loading Spinner
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin h-5 w-5 text-current"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                strokeWidth="3"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : isReading ? (
            // Stop Icon (Custom Stop SVG)
            <svg
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-current transform transition-transform duration-300"
            >
              <path
                d="M48.227 65.473c0-9.183 7.096-16.997 16.762-17.51 9.666-.513 116.887-.487 125.094-.487 8.207 0 17.917 9.212 17.917 17.71 0 8.499.98 117.936.49 126.609-.49 8.673-9.635 15.995-17.011 15.995-7.377 0-117.127-.327-126.341-.327-9.214 0-17.472-7.793-17.192-16.1.28-8.306.28-116.708.28-125.89zm15.951 4.684c-.153 3.953 0 112.665 0 116.19 0 3.524 3.115 5.959 7.236 6.156 4.12.198 112.165.288 114.852 0 2.686-.287 5.811-2.073 5.932-5.456.12-3.383-.609-113.865-.609-116.89 0-3.025-3.358-5.84-6.02-5.924-2.662-.085-110.503 0-114.155 0-3.652 0-7.083 1.972-7.236 5.924z"
                fillRule="evenodd"
                fill="currentColor"
              />
            </svg>
          ) : (
            // Read Aloud Icon (New Custom Read Aloud SVG)
            <svg
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-current transform transition-transform duration-300"
            >
              <g fill="currentColor">
                <path d="M8 1.333L4.5 5H1.87S1 5.893 1 8.001C1 10.11 1.87 11 1.87 11H4.5L8 14.667z" />
                <path d="M10.524 4.926l-.707.707.354.354a2.999 2.999 0 0 1 0 4.242l-.354.353.707.707.354-.353a4 4 0 0 0 0-5.656z" />
                <path d="M12.645 2.805l-.707.707.354.353a5.999 5.999 0 0 1 0 8.485l-.354.353.707.707.354-.353a7 7 0 0 0 0-9.899z" />
              </g>
            </svg>
          )}
        </div>
      </button>

      {/* Settings Button */}
      <button
        ref={settingsButtonRef}
        onClick={() => setIsSettingsOpen((prev) => !prev)}
        className={`p-1 rounded hover:bg-gray-700 transition-colors duration-300 ${
          synth
            ? 'cursor-pointer '
            : 'cursor-not-allowed opacity-50'
        }`}
        disabled={!synth}
        aria-label="Open Text-to-Speech Settings"
      >
        {/* Gear (Settings) Icon (Custom Settings SVG) */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-current transform transition-transform duration-300"
        >
          <path
            d="M12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12H7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 12H22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Settings Modal with Smooth Transitions */}
      <div
        ref={settingsRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        className={`absolute top-12 left-0 mt-2 w-64 bg-white bg-[#2d2d2d] rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
          isSettingsOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        aria-hidden={!isSettingsOpen}
      >
        <div className="p-4 relative">
          {/* Close Button */}
          <button
            onClick={closeSettings}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            aria-label="Close Settings"
          >
            &#10005;
          </button>

          <h3 id="settings-modal-title" className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Settings
          </h3>

          {/* Reading Speed Slider */}
          <div className="mb-4">
            <label
              htmlFor="readingSpeed"
              className="block text-gray-700 dark:text-gray-200 mb-2"
            >
              Reading Speed: {readingSpeed.toFixed(1)}x
            </label>
            <input
              type="range"
              id="readingSpeed"
              name="readingSpeed"
              min="0.5"
              max="2.5"
              step="0.1"
              value={readingSpeed}
              onChange={handleSpeedChange}
              className="w-full accent-[#FFFFFF]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TTSButton;
