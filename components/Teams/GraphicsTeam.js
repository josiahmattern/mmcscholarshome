import Image from "next/image";

export default function GraphicsTeam() {
  return (
    <main className="container mx-auto w-full border">
      <div className="w-full text-center mb-8">
        <p className="text-lg leading-relaxed text-gray-700">
          The MMC Digital Lab Graphics Team creates digital and physical media
          for the MMC Digital Lab and MMC Scholars program. Student employees
          are trained in multiple programs within the Adobe Suite, including
          Adobe Illustrator, Photoshop, and InDesign. With this expertise,
          Graphics Team members learn how to create physical items such as
          stickers, buttons, and t-shirts with various tools (Button Maker
          Machine, Cricut Explore 3, etc.). Additionally, Graphics team members
          are highly encouraged to explore their interests and expand their
          skills by learning additional creative software and techniques (e.g.,
          motion graphics, infographics, design for social media).
        </p>
      </div>

      <div className="w-full max-w-lg md:max-w-2xl mx-auto pb-8 ">
        <div className="flex flex-col md:flex-row">
          <div className="flex-grow-1 md:mr-6 mb-6 md:mb-0 card bg-white shadow-md rounded-md flex justify-center items-center">
            <Image
              src="/graphicsTeam/MMCMorrill.jpg"
              width={688}
              height={387}
              alt="Graphics Team"
              className="rounded-lg w-full"
            />
          </div>
          <div className="flex flex-col flex-grow-2">
            {/* "morrillbear.png" always visible */}
            <div className="card bg-white shadow-md rounded-md flex justify-center items-center mb-6 md:mb-8 ">
              <Image
                src="/graphicsTeam/morrillbear.png"
                width={688}
                height={387}
                alt="Graphics Team"
                className="rounded-lg w-full"
              />
            </div>

            {/* Show "pw.png" on medium and up, hide on small */}
            <div className="card bg-white shadow-md rounded-md  justify-center items-center hidden md:flex">
              <Image
                src="/graphicsTeam/pw.png"
                width={688}
                height={387}
                alt="Graphics Team"
                className="rounded-lg w-10/12"
              />
            </div>

            {/* Show "power.png" on small, hide on medium and up */}
            <div className="card bg-white shadow-md rounded-md flex justify-center items-center md:hidden">
              <Image
                src="/graphicsTeam/power.png"
                width={688}
                height={387}
                alt="Graphics Team"
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
