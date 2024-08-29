"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

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
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-2 bg-base-100">
      <Link href="/" className="text-3xl font-bold ml-2">
        <span className="text-yellow-400">M</span>
        <span className="text-sky-500">M</span>
        <span className="text-red-600">C</span>
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
