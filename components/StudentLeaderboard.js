"use client";
import React, { useEffect, useState } from "react";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { db } from "@/lib/firebaseConfig.js";
import CongratsBanner from "@/components/CongratsBanner";

export default function LeaderboardComponent({ isAdmin = false }) {
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    studentId: "",
    communityPoints: 0,
    projectPoints: 0,
    graduationYear: "",
    projectGroups: [],
  });
  const [newTeam, setNewTeam] = useState({ name: "", members: [] });
  const [graduationYearFilter, setGraduationYearFilter] = useState("all");
  const [sortBy, setSortBy] = useState("totalPoints");

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

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const newStudentRef = push(ref(db, "students"));
      await set(newStudentRef, newStudent);
      setNewStudent({
        name: "",
        studentId: "",
        communityPoints: 0,
        projectPoints: 0,
        graduationYear: "",
        projectGroups: [],
      });
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    try {
      const newTeamRef = push(ref(db, "teams"));
      await set(newTeamRef, newTeam);
      setNewTeam({ name: "", members: [] });
    } catch (error) {
      console.error("Error adding team:", error);
    }
  };

  const handleUpdateStudent = async () => {
    try {
      await update(ref(db, `students/${editingStudent.id}`), editingStudent);
      setEditingStudent(null);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleUpdateTeam = async () => {
    try {
      await update(ref(db, `teams/${editingTeam.id}`), editingTeam);
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
    const years = [
      ...new Set(students.map((student) => student.graduationYear)),
    ];
    return years.filter((year) => year).sort((a, b) => a - b);
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
        filterInfo={{
          pointType: sortBy,
          graduationYear: graduationYearFilter,
        }}
      />

      <h1 className="text-4xl font-bold text-center mb-8">Leaderboard</h1>

      <div className="tabs tabs-boxed mb-4">
        <a
          className={`tab ${activeTab === "students" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          Students
        </a>
        <a
          className={`tab ${activeTab === "teams" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("teams")}
        >
          Teams
        </a>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered flex-grow"
        />
        {activeTab === "students" && (
          <>
            <select
              value={graduationYearFilter}
              onChange={(e) => setGraduationYearFilter(e.target.value)}
              className="select select-bordered"
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
              className="select select-bordered"
            >
              <option value="totalPoints">Total Points</option>
              <option value="communityPoints">Community Points</option>
              <option value="projectPoints">Project Points</option>
            </select>
          </>
        )}
      </div>

      <div className="overflow-x-auto">
        {activeTab === "students" ? (
          <table className="table w-full">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>
                  {sortBy === "totalPoints"
                    ? "Total Points"
                    : sortBy === "communityPoints"
                      ? "Community Points"
                      : "Project Points"}
                </th>
                <th>Project Groups</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>
                    {sortBy === "totalPoints"
                      ? student.totalPoints
                      : sortBy === "communityPoints"
                        ? student.communityPoints
                        : student.projectPoints}
                  </td>
                  <td>
                    {student.projectGroups
                      ? student.projectGroups.join(", ")
                      : "None"}
                  </td>
                  {isAdmin && (
                    <td>
                      <button
                        className="btn btn-xs btn-outline mr-2"
                        onClick={() => setEditingStudent(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="table w-full">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team Name</th>
                <th>Average Points</th>
                <th>Members</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team, index) => (
                <tr key={team.id}>
                  <td>{index + 1}</td>
                  <td>{team.name}</td>
                  <td>
                    {team.members
                      ? (
                          team.members.reduce((sum, memberName) => {
                            const member = students.find(
                              (s) => s.name === memberName,
                            );
                            return sum + (member ? member.totalPoints : 0);
                          }, 0) / team.members.length
                        ).toFixed(2)
                      : "N/A"}
                  </td>
                  <td>
                    {team.members ? team.members.join(", ") : "No members"}
                  </td>
                  {isAdmin && (
                    <td>
                      <button
                        className="btn btn-xs btn-outline mr-2"
                        onClick={() => setEditingTeam(team)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleDeleteTeam(team.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isAdmin && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Admin Actions</h2>
          {activeTab === "students" ? (
            <form
              onSubmit={handleAddStudent}
              className="card bg-base-100 shadow-xl p-4"
            >
              <h3 className="text-xl font-semibold mb-2">Add New Student</h3>
              <input
                type="text"
                placeholder="Name"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
                className="input input-bordered w-full mb-2"
              />
              <input
                type="text"
                placeholder="Student ID"
                value={newStudent.studentId}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, studentId: e.target.value })
                }
                className="input input-bordered w-full mb-2"
              />
              <input
                type="number"
                placeholder="Community Points"
                value={newStudent.communityPoints}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    communityPoints: parseInt(e.target.value),
                  })
                }
                className="input input-bordered w-full mb-2"
              />
              <input
                type="number"
                placeholder="Project Points"
                value={newStudent.projectPoints}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    projectPoints: parseInt(e.target.value),
                  })
                }
                className="input input-bordered w-full mb-2"
              />
              <input
                type="number"
                placeholder="Graduation Year"
                value={newStudent.graduationYear}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    graduationYear: e.target.value,
                  })
                }
                className="input input-bordered w-full mb-2"
              />
              <input
                type="text"
                placeholder="Project Groups (comma-separated)"
                value={newStudent.projectGroups.join(", ")}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    projectGroups: e.target.value.split(", "),
                  })
                }
                className="input input-bordered w-full mb-2"
              />
              <button type="submit" className="btn btn-primary">
                Add Student
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleAddTeam}
              className="card bg-base-100 shadow-xl p-4"
            >
              <h3 className="text-xl font-semibold mb-2">Add New Team</h3>
              <input
                type="text"
                placeholder="Team Name"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, name: e.target.value })
                }
                className="input input-bordered w-full mb-2"
              />
              <input
                type="text"
                placeholder="Members (comma-separated)"
                value={newTeam.members.join(", ")}
                onChange={(e) =>
                  setNewTeam({
                    ...newTeam,
                    members: e.target.value.split(", "),
                  })
                }
                className="input input-bordered w-full mb-2"
              />
              <button type="submit" className="btn btn-primary">
                Add Team
              </button>
            </form>
          )}
        </div>
      )}

      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Edit Student</h3>
            <input
              type="text"
              value={editingStudent.name}
              onChange={(e) =>
                setEditingStudent({ ...editingStudent, name: e.target.value })
              }
              className="input input-bordered w-full mb-2"
            />
            <input
              type="number"
              value={editingStudent.communityPoints}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  communityPoints: parseInt(e.target.value),
                })
              }
              className="input input-bordered w-full mb-2"
            />
            <input
              type="number"
              value={editingStudent.projectPoints}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  projectPoints: parseInt(e.target.value),
                })
              }
              className="input input-bordered w-full mb-2"
            />
            <input
              type="number"
              value={editingStudent.graduationYear}
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  graduationYear: e.target.value,
                })
              }
              className="input input-bordered w-full mb-2"
            />
            <input
              type="text"
              value={
                editingStudent.projectGroups
                  ? editingStudent.projectGroups.join(", ")
                  : ""
              }
              onChange={(e) =>
                setEditingStudent({
                  ...editingStudent,
                  projectGroups: e.target.value.split(", "),
                })
              }
              className="input input-bordered w-full mb-2"
              placeholder="Project Groups (comma-separated)"
            />
            <div className="flex justify-end">
              <button
                onClick={handleUpdateStudent}
                className="btn btn-primary mr-2"
              >
                Save
              </button>
              <button onClick={() => setEditingStudent(null)} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editingTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Edit Team</h3>
            <input
              type="text"
              value={editingTeam.name}
              onChange={(e) =>
                setEditingTeam({ ...editingTeam, name: e.target.value })
              }
              className="input input-bordered w-full mb-2"
            />
            <input
              type="text"
              value={editingTeam.members ? editingTeam.members.join(", ") : ""}
              onChange={(e) =>
                setEditingTeam({
                  ...editingTeam,
                  members: e.target.value.split(", "),
                })
              }
              className="input input-bordered w-full mb-2"
              placeholder="Members (comma-separated)"
            />
            <div className="flex justify-end">
              <button
                onClick={handleUpdateTeam}
                className="btn btn-primary mr-2"
              >
                Save
              </button>
              <button onClick={() => setEditingTeam(null)} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
