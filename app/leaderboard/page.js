import Nav from "@/components/Nav";
import StudentLeaderboard from "@/components/StudentLeaderboard";

export default function Leaderboard() {
  return (
    <main>
      <Nav />
      <StudentLeaderboard isAdmin={false} />
    </main>
  );
}
