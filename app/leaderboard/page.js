import Nav from "@/components/Nav";
import StudentLeaderboard from "@/components/StudentLeaderboard";
import BackgroundAnimation from "@/components/BackgroundAnimation";

export default function Leaderboard() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Navigation */}
      <div className="relative z-10">
        <Nav />
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 -z-10">
        {/* <BackgroundAnimation /> */}
      </div>

      {/* Student Leaderboard */}
      <div className="relative z-10">
        <StudentLeaderboard isAdmin={false} />
      </div>
    </main>
  );
}
