"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get, set, push } from "firebase/database";
import Papa from "papaparse";
import Schedule from "@/components/Schedule";
import Nav from "@/components/Nav";
import StudentLeaderboard from "@/components/StudentLeaderboard";
import { auth, db } from "@/lib/firebaseConfig.js"; // Adjust this import path as needed

export default function Admin() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if the user is an admin
        const adminRef = ref(db, `admins/${user.uid}`);
        const adminSnap = await get(adminRef);
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
    const studentsRef = ref(db, "students");
    const studentsSnapshot = await get(studentsRef);
    const studentsData = [];
    studentsSnapshot.forEach((childSnapshot) => {
      studentsData.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });


    // Fetch teams data
    const teamsRef = ref(db, "teams");
    const teamsSnapshot = await get(teamsRef);
    const teamsData = [];
    teamsSnapshot.forEach((childSnapshot) => {
      teamsData.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });

    // Fetch schedule data
    const scheduleRef = ref(db, "schedule");
    const scheduleSnapshot = await get(scheduleRef);
    const scheduleData = [];
    scheduleSnapshot.forEach((childSnapshot) => {
      scheduleData.push(childSnapshot.val());
    });

    // Start building the CSV text
    let csvContent = "";

    // ----- STUDENTS SECTION -----
    csvContent += "Students\n";
    csvContent += "Name,Student ID,Project Points,Community Points,Total Points,Graduation Year,Project Groups\n";
    studentsData.forEach((student) => {
      const name = student.name || "";
      const studentId = student.studentId || "";
      const projectPoints = student.projectPoints ?? 0;
      const communityPoints = student.communityPoints ?? 0;
      const totalPoints = projectPoints + communityPoints;
      const graduationYear = student.graduationYear ?? "";
      // Make sure projectGroups is an array before joining
      const projectGroups = Array.isArray(student.projectGroups)
        ? student.projectGroups.join(", ")
        : "";

      csvContent += `${name},${studentId},${projectPoints},${communityPoints},${totalPoints},${graduationYear},"${projectGroups}"\n`;
    });

    csvContent += "\n";

    // ----- TEAMS SECTION -----
    csvContent += "Teams\n";
    csvContent += "Name,Points,Members\n";
teamsData.forEach((team) => {
  // Since members are now actual names:
  const membersArray = Array.isArray(team.members) ? team.members : [];
  // Just join them directly:
  const memberNames = membersArray.join(", "); 

  csvContent += `${team.name},"${memberNames}"\n`;
});

    csvContent += "\n";

    // ----- SCHEDULE SECTION -----
    csvContent += "Schedule\n";
    csvContent += "Day,Name,Start Time,End Time,Weeks,Video URL\n";
    scheduleData.forEach((event) => {
      const day = event.day || "";
      const name = event.name || "";
      const startTime = event.startTime || "";
      const endTime = event.endTime || "";
      const weeks = event.weeks || "";
      const videoURL = event.videoURL || ""; 
      csvContent += `${day},${name},${startTime},${endTime},${weeks},${videoURL}\n`;
    });

    // ----- CREATE AND DOWNLOAD THE CSV FILE -----
    // Convert the csvContent to a Blob
    const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a temporary URL for the blob
    const url = URL.createObjectURL(csvBlob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "mmc_data_export.csv");
    document.body.appendChild(link);

    // Simulate a click to trigger download
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      <div className="w-full bg-base-200 p-4">
        <div className="container mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4 mt-4">Admin</h1>
          <div className="tabs bg-base-100 tabs-boxed mb-4">
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
          {/* Export and import buttons 

          <button onClick={exportToCSV} className="btn btn-primary mb-4">
            Export All Data to CSV
          </button>
          <input
            type="file"
            accept=".csv"
            onChange={importFromCSV}
            className="btn btn-secondary mb-4"
          />
          */}
          <button onClick={exportToCSV} className="btn btn-primary mb-4">
            Export All Data to CSV
          </button>
        </div>
      </div>
      <div className="p-4">
        {activeTab === "schedule" ? (
          <Schedule isAdmin="true" />
        ) : (
          <StudentLeaderboard isAdmin="true" />
        )}
      </div>
    </main>
  );
}
