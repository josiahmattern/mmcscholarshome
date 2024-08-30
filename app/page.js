import Hero from "../components/Hero";
import Schedule from "../components/Schedule";

export default function Home() {
  return (
    <main>
      <Hero />
      <Schedule id="schedule" isAdmin={false} />
    </main>
  );
}
