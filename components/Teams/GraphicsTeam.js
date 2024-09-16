import Image from 'next/image';

export default function GraphicsTeam() {
  return (
    <main>
      <div className="px-4 w-full text">
        <p className="text-lg">
          The MMC Digital Lab Graphics Team creates digital and physical media for the MMC Digital Lab and MMC Scholars program.
          Student employees are trained in multiple programs within the Adobe Suite, including Adobe Illustrator, Photoshop,
          and InDesign. With this expertise, Graphics Team members learn how to create physical items such as stickers, buttons,
          and t-shirts with various tools (Button Maker Machine, Cricut Explore 3, etc.). Additionally, Graphics team members are
          highly encouraged to explore their interests and expand their skills by learning additional creative software and
          techniques (e.g., motion graphics, infographics, design for social media).
        </p>
      </div>
      <div className="card w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-center">
          <Image src="/graphicsTeam/MMCMorrill.jpg" width={300} height={387} alt="Graphics Team" />
          <Image src="/graphicsTeam/morrillbear.png" width={400} height={387} alt="Graphics Team" />
          <Image src="/graphicsTeam/MMCPowerStrip.png" width={600} height={387} alt="Graphics Team" />
        </div>
      </div>


    </main>
  );
}
