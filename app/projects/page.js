import Nav from "@/components/Nav";
import YoutubeEmbed from "@/components/ProjectCard";

export default function Projects() {
  return (
    <main>
      <Nav />
      <YoutubeEmbed
        id={"https://www.youtube.com/embed/ogfYd705cRs"}
        title={"default"}
      />
      <YoutubeEmbed
        id={"https://www.youtube.com/embed/iYMnkLS-NPI?si=Z4k_7Tu1Qx32zgZm"}
        title={"After Effects"}
      />
    </main>
  );
}
