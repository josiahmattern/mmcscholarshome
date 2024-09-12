"use client";
import React, { useEffect, useState, useRef } from "react";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { db } from "@/lib/firebaseConfig.js";
import CongratsBanner from "@/components/LeaderboardParts/CongratsBanner";
import SearchInput from "@/components/LeaderboardParts/SearchInput";
import StudentTable from "@/components/LeaderboardParts/StudentTable";
import TeamTable from "@/components/LeaderboardParts/TeamTable";
import AdminActions from "@/components/LeaderboardParts/AdminActions";
import EditStudentModal from "@/components/LeaderboardParts/EditStudentModal";
import EditTeamModal from "@/components/LeaderboardParts/EditTeamModal";

const LeaderboardComponent = ({ isAdmin = false }) => {
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [graduationYearFilter, setGraduationYearFilter] = useState("all");
  const [sortBy, setSortBy] = useState("totalPoints");
  const [showAdminActions, setShowAdminActions] = useState(false);
  const adminActionsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsRef = ref(db, "students");
        const teamsRef = ref(db, "teams");

        onValue(studentsRef, (snapshot) => {
          if (snapshot.exists()) {
            const studentsData = Object.entries(snapshot.val()).map(
              ([id, data]) => ({
                id,
                ...data,
                totalPoints:
                  (parseInt(data.communityPoints) || 0) +
                  (parseInt(data.projectPoints) || 0),
              }),
            );
            setStudents(studentsData);
          }
        });

        onValue(teamsRef, (snapshot) => {
          if (snapshot.exists()) {
            const teamsData = Object.entries(snapshot.val()).map(
              ([id, data]) => ({
                id,
                ...data,
              }),
            );
            setTeams(teamsData);
          }
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = students
    .filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(
      (student) =>
        graduationYearFilter === "all" ||
        student.graduationYear.toString() === graduationYearFilter,
    )
    .sort((a, b) => {
      if (sortBy === "communityPoints")
        return b.communityPoints - a.communityPoints;
      if (sortBy === "projectPoints") return b.projectPoints - a.projectPoints;
      return b.totalPoints - a.totalPoints;
    });

  const filteredTeams = teams
    .filter((team) =>
      team.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const aPoints = a.members
        ? a.members.reduce((sum, memberName) => {
            const member = students.find((s) => s.name === memberName);
            return sum + (member ? member.totalPoints : 0);
          }, 0) / a.members.length
        : 0;
      const bPoints = b.members
        ? b.members.reduce((sum, memberName) => {
            const member = students.find((s) => s.name === memberName);
            return sum + (member ? member.totalPoints : 0);
          }, 0) / b.members.length
        : 0;
      return bPoints - aPoints;
    });

  const handleAddButtonClick = () => {
    setShowAdminActions(!showAdminActions);
    // If we're showing the admin actions, scroll to it after a short delay
    // to allow for any animations or state updates to complete
    if (!showAdminActions) {
      setTimeout(() => {
        adminActionsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleAddStudent = async (newStudent) => {
    try {
      const newStudentRef = push(ref(db, "students"));
      await set(newStudentRef, newStudent);
      setShowAdminActions(false); // Hide the form after adding
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleAddTeam = async (newTeam) => {
    try {
      const newTeamRef = push(ref(db, "teams"));
      await set(newTeamRef, newTeam);
      setShowAdminActions(false); // Hide the form after adding
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };

  const handleUpdateStudent = async (updatedStudent) => {
    try {
      await update(ref(db, `students/${updatedStudent.id}`), updatedStudent);
      setEditingStudent(null);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleUpdateTeam = async (updatedTeam) => {
    try {
      await update(ref(db, `teams/${updatedTeam.id}`), updatedTeam);
      setEditingTeam(null);
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await remove(ref(db, `students/${id}`));
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleDeleteTeam = async (id) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await remove(ref(db, `teams/${id}`));
      } catch (error) {
        console.error("Error deleting team:", error);
      }
    }
  };

  const getGraduationYears = () => {
    const years = students
      .map((student) => parseInt(student.graduationYear, 10))
      .filter((year) => !isNaN(year) && year > 0);
    return [...new Set(years)].sort((a, b) => a - b);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <span>{error}</span>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <CongratsBanner
        topEntity={
          activeTab === "students" ? filteredStudents[0] : filteredTeams[0]
        }
        entityType={activeTab}
        filterInfo={{ pointType: sortBy, graduationYear: graduationYearFilter }}
      />

      <h1 className="text-4xl font-bold text-center mb-8">Leaderboard</h1>

      <div className="tabs tabs-boxed mb-4">
        <a
          className={`tab ${activeTab === "students" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("students");
            setShowAdminActions(false);
          }}
        >
          Students
        </a>
        <a
          className={`tab ${activeTab === "teams" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("teams");
            setShowAdminActions(false);
          }}
        >
          Teams
        </a>
      </div>

      <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {activeTab === "students" && (
          <div className="flex w-full mt-2 md:mt-0">
            <select
              value={graduationYearFilter}
              onChange={(e) => setGraduationYearFilter(e.target.value)}
              className="select select-bordered w-full mr-2"
            >
              <option value="all">All Years</option>
              {getGraduationYears().map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="totalPoints">Total Points</option>
              <option value="communityPoints">Community Points</option>
              <option value="projectPoints">Project Points</option>
            </select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        {activeTab === "students" ? (
          <StudentTable
            students={filteredStudents}
            sortBy={sortBy}
            isAdmin={isAdmin}
            onEdit={setEditingStudent}
            onDelete={handleDeleteStudent}
          />
        ) : (
          <TeamTable
            teams={filteredTeams}
            students={students}
            isAdmin={isAdmin}
            onEdit={setEditingTeam}
            onDelete={handleDeleteTeam}
          />
        )}
      </div>

      {isAdmin && (
        <div className="mt-4">
          <button className="btn btn-primary w-full mt-2" onClick={handleAddButtonClick}>
            {showAdminActions
              ? "Hide Add Form"
              : `Add ${activeTab === "students" ? "Student" : "Team"}`}
          </button>
        </div>
      )}

      {isAdmin && showAdminActions && (
        <div ref={adminActionsRef}>
          <AdminActions
            activeTab={activeTab}
            onAddStudent={handleAddStudent}
            onAddTeam={handleAddTeam}
            students={students}
          />
        </div>
      )}

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onSave={handleUpdateStudent}
          onCancel={() => setEditingStudent(null)}
        />
      )}

      {editingTeam && (
        <EditTeamModal
          team={editingTeam}
          students={students}
          onSave={handleUpdateTeam}
          onCancel={() => setEditingTeam(null)}
        />
      )}
    </div>
  );
};

export default LeaderboardComponent;
