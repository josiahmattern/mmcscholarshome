import Nav from "@/components/Nav";
import YoutubeVideo from "@/components/YoutubeVideo";

export default function MotionGraphicsTeam() {
  const videos = ["sDbsSd3lwgc", "5hGkQOu5XTM", "XYE3gUovefU"];

  return (
    <main>
      <Nav />
      <h1 className="text-4xl font-bold text-center my-8">
        Motion Graphics Team
      </h1>
      <div className="w-full text">
        <p className="text-lg xl:text-xl px-8 mb-4">
          The MMC Digital Lab Motion Graphics Team designs animated graphics to
          be used in videos for the MMC Digital Lab, MMC Scholars program, and
          the Honors & Scholars Center. Motion Graphics team members are
          promoted from either Video or Graphics team and have a strong
          foundation in the software learned on that team. Motion Graphics team
          members train exclusively with Adobe After Effects to create stunning
          motion graphics that align with required branding guidelines and
          elements. Additionally, Motion Graphics team members learn to work
          with the Ohio State Digital Asset Management system, multiple audio
          formats (background music and voiceovers), and more.
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
