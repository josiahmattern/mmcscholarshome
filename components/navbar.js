import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-screen flex justify-between items-center p-2">
      <Link href="/" className="text-3xl font-bold ml-2">
        <span className="text-yellow-400">M</span>
        <span className="text-sky-500">M</span>
        <span className="text-red-600">C</span>
      </Link>
      <div>
        <Link className="mr-6 font-bold text-red-600" href="/admin">
          Admin
        </Link>
        <Link className="mr-6 font-bold" href="/leaderboard">
         Leaderboard 
        </Link>
        <Link className="btn mr-1" href="/login">
          Login
        </Link>
      </div>
    </div>
  );
}
