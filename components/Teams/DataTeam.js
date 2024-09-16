import Image from 'next/image';

export default function DataTeam() {
  return (
    <main>
      <div className="px-4 w-full text">
        <p className="text-lg">The MMC Digital Lab Data Team creates surveys and conducts analysis for the MMC Digital Lab, MMC Scholars Program, and Honors & Scholars Center.
          Student employees are trained in multiple data software including Tableau, Qualtrics, and Python. With this expertise, Data Team members design surveys,
          analyze data, and craft visualizations from various data sources. Additionally, Data team members are highly encouraged to explore their interests and
          expand their data skills by training in more data software (e.g., SQL, Artificial Intelligence, RStudio)</p>.
      </div>

      <div className="card w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-center">
          <Image src="/dataTeam/1.webp" width={688} height={387} alt="Data Team" />
          <Image src="/dataTeam/2.webp" width={688} height={387} alt="Data Team" />
          <Image src="/dataTeam/3.webp" width={688} height={387} alt="Data Team" />
        </div>
      </div>
    </main>
  );
}
