import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-screen flex justify-between p-4">
      <Link href="/" className="text-2xl font-bold">
        MMC
      </Link>
      <Link className="" href="/">
        Login
      </Link>
    </div>
  );
}
