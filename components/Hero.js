import Nav from "@/components/Nav";
import Image from "next/image";
import BackgroundAnimation from "@/components/BackgroundAnimation";

export default function Hero() {
  return (
    <main className="relative flex flex-col h-screen overflow-hidden">
      {/* Navbar with higher z-index to keep it on top */}
      <div className="relative z-20">
        <Nav />
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <BackgroundAnimation />
      </div>

      {/* Hero Content */}
      <div className="relative flex-grow flex flex-col justify-center items-center z-10">
        <div className="hero-content text-center rounded-md bg-gray-300 bg-opacity-0 p-6">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold mb-6">Welcome to the</h1>
            <Image
              src="/MMCScholars.png"
              alt="MMC Logo"
              width={390}
              height={390}
              className="inline"
            />
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center z-20">
          <p className="text-md mb-4">Scroll down to view schedule</p>
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
