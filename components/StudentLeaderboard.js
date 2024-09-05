"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import confetti from "canvas-confetti";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

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
const db = getFirestore(app);

export default function LeaderboardComponent({ isAdmin = false }) {
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [filteredStudentsForTeam, setFilteredStudentsForTeam] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    studentId: "",
    projectPoints: "",
    communityPoints: "",
    graduationYear: "",
    projectGroups: [],
  });
  const [newTeam, setNewTeam] = useState({
    name: "",
    members: [],
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [sortBy, setSortBy] = useState("total");
  const [graduationYearFilter, setGraduationYearFilter] = useState("all");
  const [topStudents, setTopStudents] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const confettiRef = useRef(null);

  useEffect(() => {
    fetchStudents();
    fetchTeams();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    let filteredStuds = students.filter((student) =>
      student.name.toLowerCase().includes(lowercasedFilter),
    );

    if (graduationYearFilter !== "all") {
      filteredStuds = filteredStuds.filter(
        (student) => student.graduationYear === graduationYearFilter,
      );
    }

    filteredStuds.sort((a, b) => {
      if (sortBy === "community") return b.communityPoints - a.communityPoints;
      if (sortBy === "project") return b.projectPoints - a.projectPoints;
      return (
        b.projectPoints +
        b.communityPoints -
        (a.projectPoints + a.communityPoints)
      );
    });

    setFilteredStudents(filteredStuds);

    const filteredTms = teams.filter((team) =>
      team.name.toLowerCase().includes(lowercasedFilter),
    );
    setFilteredTeams(filteredTms);

    // check if there are students in the leaderboard
    if (filteredStuds.length > 0) {
      // get the highest points
      console.log(filteredStuds);
      // console.log(filteredStuds.map((student) => student.points));
      // console.log(filteredStuds.map((student) => typeof student.points));
      const validPoints = filteredStuds
        .map((student) => student.projectPoints + student.communityPoints)
        .filter((point) => typeof point === "number" && !isNaN(point));

      const maxPoints = Math.max(...validPoints, 0);
      // console.log(maxPoints);

      // filter students who have the highest points
      const topStudents = filteredStuds.filter(
        (student) =>
          student.projectPoints + student.communityPoints === maxPoints,
      );
      setTopStudents(topStudents);
    } else {
      setTopStudents([]); // No students to congrat
    }
  }, [searchTerm, students, teams, sortBy, graduationYearFilter]);

  const handleCongratAnimation = useCallback(() => {
    var end = Date.now() + 1 * 1000;
    var colors = ["#bb0000", "#000000"];
    (function frame() {
      topStudents.forEach(() => {
        confetti({
          particleCount: 2,
          angle: 65,
          spread: 75,
          origin: { x: 0, y: 0.4 },
          ticks: 75,
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 115,
          spread: 75,
          origin: { x: 1, y: 0.4 },
          ticks: 75,
          colors: colors,
        });
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [topStudents]);

  useEffect(() => {
    if (topStudents.length > 0) {
      handleCongratAnimation();
    }
  }, [topStudents, handleCongratAnimation]);

  useEffect(() => {
    const lowercasedFilter = studentSearch.toLowerCase();
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(lowercasedFilter),
    );
    setFilteredStudentsForTeam(filtered);
  }, [studentSearch, students]);

  const fetchStudents = async () => {
    try {
      const studentsCollection = collection(db, "students");
      const studentsSnapshot = await getDocs(studentsCollection);
      const studentList = studentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedStudents = studentList.sort(
        (a, b) =>
          b.projectPoints +
          b.communityPoints -
          (a.projectPoints + a.communityPoints),
      );
      setStudents(sortedStudents);
      setFilteredStudents(sortedStudents);
      setLoading(false);
    } catch (err) {
      setError("Error fetching student data");
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const teamsCollection = collection(db, "teams");
      const teamsSnapshot = await getDocs(teamsCollection);
      const teamList = teamsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedTeams = teamList.sort(
        (a, b) => calculateTeamPoints(b) - calculateTeamPoints(a),
      );
      setTeams(sortedTeams);
      setFilteredTeams(sortedTeams);
      setLoading(false);
    } catch (err) {
      setError("Error fetching team data");
      setLoading(false);
    }
  };

  const calculateTeamPoints = (team) => {
    const teamMembers = students.filter((student) =>
      team.members.includes(student.id),
    );
    if (teamMembers.length === 0) return 0;
    const totalPoints = teamMembers.reduce(
      (sum, member) => sum + member.projectPoints + member.communityPoints,
      0,
    );
    return totalPoints / teamMembers.length;
  };

  const addStudent = async (e) => {
    e.preventDefault();
    try {
      const studentToAdd = {
        ...newStudent,
        projectPoints:
          newStudent.projectPoints === ""
            ? 0
            : parseInt(newStudent.projectPoints),
        communityPoints:
          newStudent.communityPoints === ""
            ? 0
            : parseInt(newStudent.communityPoints),
      };
      await addDoc(collection(db, "students"), studentToAdd);
      setNewStudent({
        name: "",
        studentId: "",
        projectPoints: "",
        communityPoints: "",
        graduationYear: "",
        projectGroups: [],
      });
      fetchStudents();
    } catch (err) {
      setError("Error adding new student");
    }
  };

  const addTeam = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "teams"), newTeam);
      setNewTeam({ name: "", members: [] });
      fetchTeams();
    } catch (err) {
      setError("Error adding new team");
    }
  };

  const updateStudent = async (id, updatedData) => {
    try {
      const studentRef = doc(db, "students", id);
      await updateDoc(studentRef, updatedData);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      setError("Error updating student");
    }
  };

  const updateTeam = async (id, updatedData) => {
    try {
      const teamRef = doc(db, "teams", id);
      await updateDoc(teamRef, updatedData);
      setEditingTeam(null);
      fetchTeams();
    } catch (err) {
      setError("Error updating team");
    }
  };

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteDoc(doc(db, "students", id));

        const updatedTeams = teams.map((team) => ({
          ...team,
          members: team.members.filter((memberId) => memberId !== id),
        }));

        for (let team of updatedTeams) {
          if (
            team.members.length !==
            teams.find((t) => t.id === team.id).members.length
          ) {
            await updateDoc(doc(db, "teams", team.id), {
              members: team.members,
            });
          }
        }

        fetchStudents();
        fetchTeams();
      } catch (err) {
        setError("Error deleting student");
      }
    }
  };

  const deleteTeam = async (id) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await deleteDoc(doc(db, "teams", id));
        fetchTeams();
      } catch (err) {
        setError("Error deleting team");
      }
    }
  };

  const startEditing = (item, type) => {
    if (type === "student") {
      setEditingStudent({ ...item });
    } else {
      setEditingTeam({ ...item });
    }
  };

  const handleEditChange = (field, value, type) => {
    if (type === "student") {
      setEditingStudent({ ...editingStudent, [field]: value });
    } else {
      setEditingTeam({ ...editingTeam, [field]: value });
    }
  };

  const cancelEditing = (type) => {
    if (type === "student") {
      setEditingStudent(null);
    } else {
      setEditingTeam(null);
    }
  };

  const handleStudentSelection = (studentId, type) => {
    if (type === "new") {
      const updatedMembers = newTeam.members.includes(studentId)
        ? newTeam.members.filter((id) => id !== studentId)
        : [...newTeam.members, studentId];
      setNewTeam({ ...newTeam, members: updatedMembers });
    } else if (type === "edit") {
      const updatedMembers = editingTeam.members.includes(studentId)
        ? editingTeam.members.filter((id) => id !== studentId)
        : [...editingTeam.members, studentId];
      setEditingTeam({ ...editingTeam, members: updatedMembers });
    }
  };

  const getGraduationYears = () => {
    const years = [
      ...new Set(students.map((student) => student.graduationYear)),
    ];
    return years.sort((a, b) => a - b);
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
      <div>
        {activeTab === "students" && topStudents.length > 0 && (
          <div className="mt-2 p-8 bg-neutral-100 rounded-lg shadow-md mb-8">
            <div className="flex justify-center">
              <h1
                ref={confettiRef}
                onMouseEnter={handleCongratAnimation}
                className="text-2xl md:text-3xl inline-block"
              >
                Congratulations
                <span className="text-red-500 ml-2">{students[0].name}!</span>
              </h1>
            </div>
          </div>
        )}
        {activeTab === "teams" && teams.length > 0 && (
          <div className="mt-2 p-8 bg-neutral-100 rounded-lg shadow-md mb-8">
            <div className="flex justify-center">
              <h1
                ref={confettiRef}
                onMouseEnter={handleCongratAnimation}
                className="text-2xl md:text-3xl inline-block"
              >
                Congratulations
                <span className="text-red-500 ml-2">{teams[0].name}!</span>
              </h1>
            </div>
          </div>
        )}
      </div>
      <h1 className="text-4xl font-bold text-center mb-8 mt-4">Leaderboard</h1>

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

      <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
        <input
          type="text"
          placeholder={`Search for a ${
            activeTab === "students" ? "student" : "team"
          }...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full md:mr-2"
        />
        {activeTab === "students" && (
          <>
            <div className="flex w-full mt-2 md:mt-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select select-bordered w-full mr-2"
              >
                <option value="total">Total Points</option>
                <option value="community">Community Points</option>
                <option value="project">Project Points</option>
              </select>
              <select
                value={graduationYearFilter}
                onChange={(e) => setGraduationYearFilter(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="all">All Years</option>
                {getGraduationYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
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
                  {sortBy === "total"
                    ? "Total Points"
                    : sortBy === "community"
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
                    {sortBy === "total"
                      ? student.projectPoints + student.communityPoints
                      : sortBy === "community"
                        ? student.communityPoints
                        : student.projectPoints}
                  </td>
                  <td>{student.projectGroups.join(", ")}</td>
                  {isAdmin && (
                    <td>
                      <button
                        onClick={() => startEditing(student, "student")}
                        className="btn btn-xs btn-outline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteStudent(student.id)}
                        className="btn btn-xs btn-error"
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
                  <td>{calculateTeamPoints(team).toFixed(2)}</td>
                  <td>
                    {team.members
                      .map(
                        (memberId) =>
                          students.find((s) => s.id === memberId)?.name,
                      )
                      .join(", ")}
                  </td>
                  {isAdmin && (
                    <td>
                      <button
                        onClick={() => startEditing(team, "team")}
                        className="btn btn-xs btn-outline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTeam(team.id)}
                        className="btn btn-xs btn-error"
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
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Add New {activeTab === "students" ? "Student" : "Team"}
          </h2>
          {activeTab === "students" ? (
            <form onSubmit={addStudent} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  value={newStudent.studentId}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, studentId: e.target.value })
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Student ID (Name.Number)"
                  required
                />
                <input
                  type="number"
                  value={newStudent.projectPoints}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      projectPoints:
                        e.target.value === "" ? "" : parseInt(e.target.value),
                    })
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Project Points"
                  required
                />
                <input
                  type="number"
                  value={newStudent.communityPoints}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      communityPoints:
                        e.target.value === "" ? "" : parseInt(e.target.value),
                    })
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Community Points"
                  required
                />
                <input
                  type="text"
                  value={newStudent.graduationYear}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      graduationYear: e.target.value,
                    })
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Graduation Year"
                  required
                />
                <input
                  type="text"
                  value={newStudent.projectGroups.join(", ")}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      projectGroups: e.target.value.split(", "),
                    })
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Project Groups (comma-separated)"
                />
                <div className="card-actions justify-end mt-4">
                  <button type="submit" className="btn btn-primary">
                    Add Student
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={addTeam} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, name: e.target.value })
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Team Name"
                  required
                />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="input input-bordered w-full mb-2"
                  placeholder="Search for students..."
                />
                <div className="max-h-60 overflow-y-auto mb-2">
                  {filteredStudentsForTeam.map((student) => (
                    <div key={student.id} className="form-control">
                      <label className="cursor-pointer label">
                        <span className="label-text">{student.name}</span>
                        <input
                          type="checkbox"
                          checked={newTeam.members.includes(student.id)}
                          onChange={() =>
                            handleStudentSelection(student.id, "new")
                          }
                          className="checkbox checkbox-primary"
                        />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="card-actions justify-end mt-4">
                  <button type="submit" className="btn btn-primary">
                    Add Team
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {isAdmin && editingStudent && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Edit Student
              </h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) =>
                    handleEditChange("name", e.target.value, "student")
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={editingStudent.studentId}
                  onChange={(e) =>
                    handleEditChange("studentId", e.target.value, "student")
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Student ID (Name.Number)"
                />
                <input
                  type="number"
                  value={editingStudent.projectPoints}
                  onChange={(e) =>
                    handleEditChange(
                      "projectPoints",
                      parseInt(e.target.value),
                      "student",
                    )
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Project Points"
                />
                <input
                  type="number"
                  value={editingStudent.communityPoints}
                  onChange={(e) =>
                    handleEditChange(
                      "communityPoints",
                      parseInt(e.target.value),
                      "student",
                    )
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Community Points"
                />
                <input
                  type="text"
                  value={editingStudent.graduationYear}
                  onChange={(e) =>
                    handleEditChange(
                      "graduationYear",
                      e.target.value,
                      "student",
                    )
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Graduation Year"
                />
                <input
                  type="text"
                  value={editingStudent.projectGroups.join(", ")}
                  onChange={(e) =>
                    handleEditChange(
                      "projectGroups",
                      e.target.value.split(", "),
                      "student",
                    )
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Project Groups (comma-separated)"
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() =>
                    updateStudent(editingStudent.id, editingStudent)
                  }
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => cancelEditing("student")}
                  className="mt-3 px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAdmin && editingTeam && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Edit Team
              </h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="text"
                  value={editingTeam.name}
                  onChange={(e) =>
                    handleEditChange("name", e.target.value, "team")
                  }
                  className="input input-bordered w-full mb-2"
                  placeholder="Team Name"
                />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="input input-bordered w-full mb-2"
                  placeholder="Search for students..."
                />
                <div className="max-h-60 overflow-y-auto mb-2">
                  {filteredStudentsForTeam.map((student) => (
                    <div key={student.id} className="form-control">
                      <label className="cursor-pointer label">
                        <span className="label-text">{student.name}</span>
                        <input
                          type="checkbox"
                          checked={editingTeam.members.includes(student.id)}
                          onChange={() =>
                            handleStudentSelection(student.id, "edit")
                          }
                          className="checkbox checkbox-primary"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => updateTeam(editingTeam.id, editingTeam)}
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => cancelEditing("team")}
                  className="mt-3 px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
