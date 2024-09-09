import Nav from "@/components/Nav";
import Image from "next/image";

export default function Hero() {
  return (
    <main className="flex flex-col h-screen">
      <Nav />
      <div className="flex-grow bg-[url('/splatters.png')] bg-cover flex flex-col justify-center items-center relative">
        <div className="hero-content text-center rounded-md bg-gray-300 bg-opacity-70">
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold">Welcome to the</h1>
            <Image
              src="/MMCScholars.png"
              alt="MMC Logo"
              width={390}
              height={390}
              className="inline"
            />
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
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
