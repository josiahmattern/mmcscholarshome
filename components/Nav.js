"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { auth, db } from "@/lib/firebaseConfig.js"; // Adjust this import path as needed

export default function Nav() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = ref(db, `admins/${currentUser.uid}`);
        const userSnap = await get(userRef);
        setIsAdmin(userSnap.exists());
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="w-full mx-auto px-4 ">
        <div className="flex justify-between h-16">
          <div className=" flex items-center">
            <Link href="/" className="text-3xl font-bold">
              <Image
                src="/MMCLOGO.png"
                alt="MMC Logo"
                width={100}
                height={100}
                className="mt-1"
              />
            </Link>
          </div>
          <div className="hidden md:flex items-center">
            {isAdmin && (
              <Link
                className="mr-6 font-bold text-red-600 hover:text-red-800"
                href="/admin"
              >
                Admin
              </Link>
            )}
            <Link
              className="mr-6 font-bold hover:text-gray-700"
              href="/leaderboard"
            >
              Leaderboard
            </Link>
            <Link
              className="mr-6 font-bold hover:text-gray-700"
              href="/projects"
            >
              Projects
            </Link>
            <Link className="mr-6 font-bold hover:text-gray-700" href="/teams">
              Our Teams
            </Link>
            {user ? (
              <button className="btn hover:bg-gray-200" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link className="btn hover:bg-gray-200" href="/login">
                Login
              </Link>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isAdmin && (
            <Link
              className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50"
              href="/admin"
            >
              Admin
            </Link>
          )}
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            href="/leaderboard"
          >
            Leaderboard
          </Link>
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            href="/projects"
          >
            Projects
          </Link>
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            href="/teams"
          >
            Our Teams
          </Link>
          {user ? (
            <button
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              href="/login"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
