"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function ProjectCard(props) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef(null);

  // Check if overflow is occurring and adjust state accordingly
  useEffect(() => {
    const checkOverflow = () => {
      if (descriptionRef.current) {
        const isOverflow =
          descriptionRef.current.scrollHeight >
          descriptionRef.current.clientHeight;
        setIsOverflowing(isOverflow);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow); // Recheck on window resize

    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  // Hide the gradient when scrolled to the end
  const handleScroll = () => {
    if (descriptionRef.current) {
      const isAtBottom =
        descriptionRef.current.scrollHeight -
        descriptionRef.current.scrollTop ===
        descriptionRef.current.clientHeight;
      setIsOverflowing(!isAtBottom);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="card bg-base-100 shadow-md h-60 max-w-lg w-full">
        <div className="card-body flex flex-col h-full">
          <h2 className="card-title text-2xl text-primary mb-2 flex items-stretch">
            <Link
              className="hover:text-sky-300 flex items-center justify-start"
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.title}
              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
              </svg>
            </Link>
          </h2>
          <div
            ref={descriptionRef}
            onScroll={handleScroll}
            className="relative flex-grow overflow-auto"
          >
            <p>{props.desc}</p>
            {isOverflowing && (
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-base-100 to-transparent pointer-events-none"></div>
            )}
          </div>
          <div>
            <p className="text-accent">Length: {props.length} weeks</p>
          </div>
        </div>
      </div>
    </div >
  );
}
