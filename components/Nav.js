"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Image from "next/image";

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
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "admins", currentUser.uid));
        setIsAdmin(userDoc.exists());
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

  return (
    <div className="w-screen flex justify-between items-center p-2">
      <Link href="/" className="text-3xl font-bold ml-2">
        <Image
          src="/MMCLOGO.png"
          alt="MMC Logo"
          width={100}
          height={100}
          className="mt-1"
        />
      </Link>
      <div>
        {isAdmin && (
          <Link className="mr-6 font-bold text-red-600" href="/admin">
            Admin
          </Link>
        )}
        <Link className="mr-6 font-bold" href="/leaderboard">
          Leaderboard
        </Link>
        {user ? (
          <button className="btn mr-1" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link className="btn mr-1" href="/login">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
