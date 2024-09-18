import Image from "next/image";

export default function DataTeam() {
  return (
    <main className="container mx-auto px-4">
      <div className="w-full text-center mb-8">
        <p className="text-lg leading-relaxed text-gray-700">
          The MMC Digital Lab Data Team creates surveys and conducts analysis
          for the MMC Digital Lab, MMC Scholars Program, and Honors & Scholars
          Center. Student employees are trained in multiple data software
          including Tableau, Qualtrics, and Python. With this expertise, Data
          Team members design surveys, analyze data, and craft visualizations
          from various data sources. Additionally, Data team members are highly
          encouraged to explore their interests and expand their data skills by
          training in more data software (e.g., SQL, Artificial Intelligence,
          RStudio).
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto pb-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="card bg-white shadow-md rounded-md flex justify-center items-center">
            <Image
              src="/dataTeam/1.png"
              width={688}
              height={387}
              alt="Data Team"
              className="rounded-lg w-full"
            />
          </div>
          <div className="card bg-white shadow-md rounded-md flex justify-center items-center">
            <Image
              src="/dataTeam/2.png"
              width={688}
              height={387}
              alt="Data Team"
              className="rounded-lg w-full"
            />
          </div>
          <div className="card bg-white shadow-md rounded-md flex justify-center items-center">
            <Image
              src="/dataTeam/3.png"
              width={688}
              height={387}
              alt="Data Team"
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
