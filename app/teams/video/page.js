import YoutubeVideo from "@/components/YoutubeVideo";
import Nav from "@/components/Nav";

export default function VideoTeam() {
  const videos = ["eIAvEUFGnzI", "uw2Pfq3ryOs", "DH068Nm0bVM"];

  return (
    <main>
      <Nav />
      <h1 className="text-4xl font-bold text-center my-8">Video Team</h1>
      <div className="w-full text px-8">
        <p className="text-lg xl:text-xl mb-8 leading-relaxed">
          The MMC Digital Lab Video Team creates promotional video content for
          MMC Scholars, the Honors & Scholars Center, and other organizations
          within the Office of Academic Enrichment. Student employees are
          trained how to use a DSLR camera with manual settings, filming and
          directing techniques, and how to utilize audio equipment.
          Additionally, Video Team members train and work with Adobe Premiere
          Pro to assemble and edit projects. Video Team members are encouraged
          to explore their interests and learn additional Video-related
          software, such as Adobe After Effects and Adobe Audition.
        </p>
      </div>
      <div className="grid grid-cols-1 items-center">
        {videos.map((embedCode, index) => (
          <div key={index} className="px-4 py-2">
            <YoutubeVideo key={index} embedCode={embedCode} />
          </div>
        ))}
      </div>
    </main>
  );
}
