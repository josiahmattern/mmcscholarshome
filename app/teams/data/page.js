import Image from "next/image";
import Nav from "@/components/Nav";

export default function DataTeam() {
  const images = [
    { src: "/dataTeam/1.png", width: 688, height: 387, alt: "Data Team 1" },
    { src: "/dataTeam/2.png", width: 688, height: 387, alt: "Data Team 2" },
    { src: "/dataTeam/3.png", width: 688, height: 387, alt: "Data Team 3" },
  ];

  return (
    <main>
      <Nav />
      <h1 className="text-4xl font-bold text-center my-8">Data Team</h1>

      <div className="px-8">

        <div className="w-full text-center mb-12">
          <p className="text-lg xl:text-xl leading-relaxed">
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
            {images.map((image, index) => (
              <div
                key={index}
                className="card bg-white shadow-lg rounded-md flex justify-center items-center border"
              >
                <Image
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  alt={image.alt}
                  className="rounded-lg w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
