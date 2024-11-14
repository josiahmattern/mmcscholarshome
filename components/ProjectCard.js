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
          <h2 className="card-title text-2xl text-primary mb-2 flex items-center">
            <Link
              className="hover:text-sky-300 flex items-center"
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.title}
              <svg
                className="ml-2 w-5 h-5"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5 3v18l15-9L5 3z" />
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
    </div>
  );
}
