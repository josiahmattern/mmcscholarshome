import Nav from "@/components/Nav";

export default function Hero() {
  return (
    <main className="flex flex-col h-screen">
      <Nav />
      <div className="flex-grow bg-base-200 flex flex-col justify-center items-center relative">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              Welcome to the&nbsp;
              <span className="text-yellow-400">M</span>
              <span className="text-primary">M</span>
              <span className="text-secondary">C</span>
              &nbsp;Digital Lab!
            </h1>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-sm mb-4">Scroll down to view schedule</p>
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
