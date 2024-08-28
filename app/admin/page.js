import Navbar from "/components/Navbar";

export default function Admin() {
  return (
    <main>
      <Navbar />
      <div className="w-screen flex border items-center justify-center">
        <div className="font-bold text-3xl">Edit Schedule</div>
      </div>
      <div className="w-screen flex border items-center justify-center">
        <div className="font-bold text-3xl">Edit Leaderboard</div>
      </div>
    </main>
  );
}
