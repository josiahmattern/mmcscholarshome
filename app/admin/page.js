"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Schedule from "@/components/Schedule";
import Nav from "@/components/Nav";
import StudentLeaderboard from "@/components/StudentLeaderboard";

const auth = getAuth();
const db = getFirestore();

export default function Admin() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if the user is an admin
        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.exists()) {
          setIsAdmin(true);
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null; // or a "Not authorized" message
  }

  return (
    <main>
      <Nav />
      <div className="w-full bg-neutral-200 p-4">
        <div className="container mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2">Admin</h1>
          <div className="tabs bg-neutral-100 tabs-boxed ">
            <a
              className={`tab ${activeTab === "schedule" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("schedule")}
            >
              Schedule
            </a>
            <a
              className={`tab ${activeTab === "leaderboard" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("leaderboard")}
            >
              Leaderboard
            </a>
          </div>
        </div>
      </div>

      <div className="p-4">
        {activeTab === "schedule" && <Schedule isAdmin={true} />}
        {activeTab === "leaderboard" && <StudentLeaderboard isAdmin={true} />}
      </div>
    </main>
  );
}
