"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
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

  const exportToCSV = async () => {
    try {
      // Fetch students data
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const studentsData = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Create a mapping of student IDs to names
      const studentIdToName = {};
      studentsData.forEach((student) => {
        studentIdToName[student.id] = student.name;
      });

      // Fetch teams data
      const teamsSnapshot = await getDocs(collection(db, "teams"));
      const teamsData = teamsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch schedule data
      const scheduleSnapshot = await getDocs(collection(db, "schedule"));
      const scheduleData = scheduleSnapshot.docs.map((doc) => doc.data());

      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";

      // Students section
      csvContent += "Students\n";
      csvContent +=
        "Name,Student ID,Project Points,Community Points,Graduation Year,Project Groups\n";
      studentsData.forEach((student) => {
        csvContent += `${student.name},${student.studentId},${student.projectPoints},${student.communityPoints},${student.graduationYear},"${student.projectGroups.join(", ")}"\n`;
      });

      csvContent += "\nTeams\n";
      csvContent += "Name,Members\n";
      teamsData.forEach((team) => {
        const memberNames = team.members
          .map((memberId) => studentIdToName[memberId] || "Unknown")
          .join(", ");
        csvContent += `${team.name},"${memberNames}"\n`;
      });

      csvContent += "\nSchedule\n";
      csvContent += "Day,Name,Start Time,End Time,Weeks\n";
      scheduleData.forEach((event) => {
        csvContent += `${event.day},${event.name},${event.startTime},${event.endTime},${event.weeks}\n`;
      });

      // Create a download link and trigger the download
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "mmc_data_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data: ", error);
      alert("An error occurred while exporting data. Please try again.");
    }
  };

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
          <h1 className="text-3xl font-bold mb-4 mt-4">Admin</h1>
          <div className="tabs bg-neutral-100 tabs-boxed mb-4">
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
          <button onClick={exportToCSV} className="btn btn-primary mb-4">
            Export All Data to CSV
          </button>
        </div>
      </div>
      <div className="p-4">
        {activeTab === "schedule" && <Schedule isAdmin={true} />}
        {activeTab === "leaderboard" && <StudentLeaderboard isAdmin={true} />}
      </div>
    </main>
  );
}
