"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import Notification from "./Notification";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyA5RmKXcwcIQl7s23PxmytmSgEFtaJwhQI",
  authDomain: "mmc-data-93bf3.firebaseapp.com",
  projectId: "mmc-data-93bf3",
  storageBucket: "mmc-data-93bf3.appspot.com",
  messagingSenderId: "435887892180",
  appId: "1:435887892180:web:d060cc06f60d08bedd7d41",
  measurementId: "G-Q3VDQJNV3W",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function Nav() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "admins", currentUser.uid));
        setIsAdmin(userDoc.exists());
        if (userDoc.exists()) {
          toast.success("Login Successful!!!", {
            position: "top-right",
          });
        }
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
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
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
            {user ? (
              <button
                className="btn mr-1 hover:bg-gray-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link className="btn mr-1 hover:bg-gray-200" href="/login">
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
      <Notification />
    </nav>
  );
}
