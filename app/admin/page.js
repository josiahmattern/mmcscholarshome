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

      // Create a mapping of student IDs to names
      const studentIdToName = {};
      studentsData.forEach((student) => {
        studentIdToName[student.id] = student.name;
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

  const sanitizePath = (path) => {
    return path.replace(/[.#$[\]]/g, "_");
  };

  const importFromCSV = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: async (result) => {
          const { data } = result;
          try {
            let currentSection = "";
            for (const row of data) {
              if (
                row[0] === "Students" ||
                row[0] === "Teams" ||
                row[0] === "Schedule"
              ) {
                currentSection = row[0];
                continue; // Skip the header row
              }
              if (row[0] === "Name" || row[0] === "Day") continue; // Skip column headers

              switch (currentSection) {
                case "Students":
                  if (row[0] && row[1]) {
                    // Check if name and student ID exist
                    const sanitizedStudentId = sanitizePath(row[1]);
                    await set(ref(db, `students/${sanitizedStudentId}`), {
                      name: row[0],
                      studentId: row[1], // Keep the original ID in the data
                      projectPoints: Number(row[2]) || 0,
                      communityPoints: Number(row[3]) || 0,
                      graduationYear: Number(row[4]) || 0,
                      projectGroups: row[5]
                        ? row[5]
                            .split(", ")
                            .filter((group) => group !== '""' && group !== "")
                        : [],
                    });
                    console.log(`Imported student: ${row[0]}`);
                  }
                  break;
                case "Teams":
                  if (row[0]) {
                    // Check if team name exists
                    const sanitizedTeamName = sanitizePath(row[0]);
                    await set(ref(db, `teams/${sanitizedTeamName}`), {
                      name: row[0],
                      members: row[1]
                        ? row[1].split(", ").filter((member) => member !== "")
                        : [],
                    });
                    console.log(`Imported team: ${row[0]}`);
                  }
                  break;
                case "Schedule":
                  if (row[0] && row[1]) {
                    // Check if day and name exist
                    await push(ref(db, "schedule"), {
                      day: row[0],
                      name: row[1],
                      startTime: row[2] || "",
                      endTime: row[3] || "",
                      weeks: row[4] || "",
                    });
                    console.log(`Imported schedule event: ${row[1]}`);
                  }
                  break;
              }
            }
            alert("Data imported successfully.");
          } catch (error) {
            console.error("Error importing data: ", error);
            alert(`An error occurred while importing data: ${error.message}`);
          }
        },
        error: (error) => {
          console.error("Error parsing CSV: ", error);
          alert(`Error parsing CSV: ${error.message}`);
        },
      });
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
          <input
            type="file"
            accept=".csv"
            onChange={importFromCSV}
            className="btn btn-secondary mb-4"
          />
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
