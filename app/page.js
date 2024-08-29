import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Schedule from "../components/Schedule";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Schedule isAdmin={false} />
    </main>
  );
}
