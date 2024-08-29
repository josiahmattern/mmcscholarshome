import Navbar from "@/components/Navbar";
import StudentLeaderboard from "@/components/StudentLeaderboard";

export default function Leaderboard() {
  return (
    <main>
      <Navbar />
      <StudentLeaderboard isAdmin={false} />
    </main>
  );
}
