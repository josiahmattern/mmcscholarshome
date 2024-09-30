"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { auth, db } from "@/lib/firebaseConfig.js"; // Adjust this import path as needed
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Nav() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTeamsDropdownOpen, setIsTeamsDropdownOpen] = useState(false); // For desktop dropdown
  const [isMobileTeamsDropdownOpen, setIsMobileTeamsDropdownOpen] =
    useState(false); // For mobile dropdown
  const router = useRouter();
  const teamsDropdownRef = useRef(null);

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

  const toggleTeamsDropdown = () => {
    setIsTeamsDropdownOpen(!isTeamsDropdownOpen);
  };

  const toggleMobileTeamsDropdown = () => {
    setIsMobileTeamsDropdownOpen(!isMobileTeamsDropdownOpen);
  };

  // Handle clicks outside the Teams dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        teamsDropdownRef.current &&
        !teamsDropdownRef.current.contains(event.target)
      ) {
        setIsTeamsDropdownOpen(false);
      }
    };

    if (isTeamsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTeamsDropdownOpen]);

  return (
    <nav className="bg-base-100 shadow-sm">
      <div className="w-full mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
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
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            {isAdmin && (
              <div className="px-2 py-1 hover:bg-base-200 rounded-lg">
                <Link className="font-bold text-red-600" href="/admin">
                  Admin
                </Link>
              </div>
            )}
            <div className="px-2 py-1 hover:bg-base-200 rounded-lg">
              <Link
                className="font-bold text-bg-base-200 hover:text-bg-base-200"
                href="/leaderboard"
              >
                Leaderboard
              </Link>
            </div>
            <div className="px-2 py-1 hover:bg-base-200 rounded-lg">
              <Link
                className="font-bold text-bg-base-200 hover:text-bg-base-200"
                href="/projects"
              >
                Projects
              </Link>
            </div>
            {/* Our Teams Dropdown */}
            <div
              className="relative px-2 py-1 hover:bg-base-200 rounded-lg"
              ref={teamsDropdownRef}
            >
              <button
                className="font-bold inline-flex items-center"
                onClick={toggleTeamsDropdown}
              >
                Our Teams
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isTeamsDropdownOpen && (
                <div className="absolute mt-2 w-40 bg-base-100 rounded-lg shadow-lg z-50 overflow-hidden">
                  <Link
                    href="/teams/webdev"
                    className="block px-4 py-2 hover:bg-base-200"
                  >
                    Web Dev
                  </Link>
                  <Link
                    href="/teams/data"
                    className="block px-4 py-2 hover:bg-base-200"
                  >
                    Data
                  </Link>
                  <Link
                    href="/teams/vr"
                    className="block px-4 py-2 hover:bg-base-200"
                  >
                    VR
                  </Link>
                  <Link
                    href="/teams/video"
                    className="block px-4 py-2 hover:bg-base-200"
                  >
                    Video
                  </Link>
                  <Link
                    href="/teams/graphics"
                    className="block px-4 py-2 hover:bg-base-200"
                  >
                    Graphics
                  </Link>
                  <Link
                    href="/teams/motiongraphics"
                    className="block px-4 py-2 hover:bg-base-200"
                  >
                    Motion Graphics
                  </Link>
                </div>
              )}
            </div>
            {/* Theme Switcher */}
            <ThemeSwitcher />
            {/* Auth Buttons */}
            {user ? (
              <button className="btn blue-btn ml-4" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link className="btn blue-btn ml-4" href="/login">
                Login
              </Link>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-bg-base-200 hover:bg-base-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {isAdmin && (
            <Link
              className="block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-400 hover:bg-base-200"
              href="/admin"
            >
              Admin
            </Link>
          )}
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-bg-base-200 hover:text-bg-base-200 hover:bg-base-200"
            href="/leaderboard"
          >
            Leaderboard
          </Link>
          <Link
            className="block px-3 py-2 rounded-md text-base font-medium text-bg-base-200 hover:text-bg-base-200 hover:bg-base-200"
            href="/projects"
          >
            Projects
          </Link>
          {/* Our Teams Mobile Dropdown */}
          <div className="block">
            <button
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-bg-base-200 hover:text-bg-base-200 hover:bg-base-200 inline-flex items-center"
              onClick={toggleMobileTeamsDropdown}
            >
              Our Teams
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            {isMobileTeamsDropdownOpen && (
              <div className="ml-4 mt-1 space-y-1">
                <Link
                  href="/teams/webdev"
                  className="block px-3 py-2 text-bg-base-200 hover:text-bg-base-200 hover:bg-base-200 rounded-md"
                >
                  Web Dev
                </Link>
                <Link
                  href="/teams/data"
                  className="block px-3 py-2 text-bg-base-200 hover:text-bg-base-200 hover:bg-base-200 rounded-md"
                >
                  Data
                </Link>
                <Link
                  href="/teams/vr"
                  className="block px-3 py-2 text-bg-base-200 hover:text-bg-base-200 hover:bg-base-200 rounded-md"
                >
                  VR
                </Link>
                <Link
                  href="/teams/video"
                  className="block px-3 py-2 text-bg-base-200 hover:text-bg-base-200 hover:bg-base-200 rounded-md"
                >
                  Video
                </Link>
                <Link
                  href="/teams/graphics"
                  className="block px-3 py-2 text-bg-base-200 hover:text-bg-base-200 hover:bg-base-200 rounded-md"
                >
                  Graphics
                </Link>
                <Link
                  href="/teams/motiongraphics"
                  className="block px-3 py-2 text-bg-base-200 hover:text-bg-base-200 hover:bg-base-200 rounded-md"
                >
                  Motion Graphics
                </Link>
              </div>
            )}
          </div>
          {/* Auth Buttons */}
          <div className="flex w-full text-left px-3 py-2 rounded-md text-base font-medium text-bg-base-200 hover:text-bg-base-200 hover:bg-base-200">
            <div>Change Theme:</div>
            <ThemeSwitcher />
          </div>
          {user ? (
            <button
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-bg-base-200 hover:text-bg-base-200 hover:bg-base-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-bg-base-200 hover:text-bg-base-200 hover:bg-base-200"
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
