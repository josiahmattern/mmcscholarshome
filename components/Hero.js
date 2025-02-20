"use client";
import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import Link from "next/link";

export default function Hero() {
  const LIGHT = "cmyk";
  const DARK = "darkcmyk";

  // State to manage the theme
  const [theme, setTheme] = useState(LIGHT);

  // useEffect to handle localStorage access on the client side
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || LIGHT;
    setTheme(savedTheme);
  }, []);

  return (
    <main className="relative flex flex-col min-h-screen overflow-hidden">
      {/* Navbar */}
      <div className="relative z-20">
        <Nav />
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <BackgroundAnimation theme={theme} />
      </div>

      {/* Hero Content */}
      <div className="relative flex-grow flex justify-center items-center z-10 px-4">
        <div className="hero-content text-center max-w-2xl w-full flex-col">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
            Hey Honors and Scholars!
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold mt-1 lg:mt-2 text-primary">
              Ready to get your geek on?
            </div>
          </h1>
          <p className="text-md md:text-xl max-w-md lg:max-w-2xl mb-6 mx-auto">
            The Digital Sandbox offers FREE project groups in graphic design,
            web, video, and audio production. Taught by students and open to
            Honors & Scholars, they begin February 24th with the first session
            online; some may later move in-person. No experience is necessary.
            For Zoom links, instructor email, and more information, click below.
          </p>

          <Link
            className="btn btn-secondary rounded-md w-44 mx-auto mb-8"
            href="https://go.osu.edu/sandboxsp25"
            prefetch={false}
          >
            More Information
          </Link>
        </div>

        {/* Scroll Down Indicator (optional) */}
        <div className="absolute bottom-6 md:bottom-12 left-1/2 transform -translate-x-1/2 text-center z-20">
          <div className="animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
}
