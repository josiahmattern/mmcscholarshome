"use client";
import React, { useEffect, useState } from "react";
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

export default function StudentLeaderboard({ isAdmin = false }) {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: "",
    points: 0,
    graduationYear: "",
    projectGroups: [],
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const studentsCollection = collection(db, "students");
      const studentsSnapshot = await getDocs(studentsCollection);
      const studentList = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const sortedStudents = studentList.sort((a, b) => b.points - a.points);
      setStudents(sortedStudents);
      setFilteredStudents(sortedStudents);
      setLoading(false);
    } catch (err) {
      setError("Error fetching student data");
      setLoading(false);
    }
  };

  const addStudent = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "students"), newStudent);
      setNewStudent({ name: "", points: 0, graduationYear: "", projectGroups: [] });
      fetchStudents();
    } catch (err) {
      setError("Error adding new student");
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

  const deleteStudent = async (id) => {
    try {
      await deleteDoc(doc(db, "students", id));
      fetchStudents();
    } catch (err) {
      setError("Error deleting student");
    }
  };

  const startEditing = (student) => {
    setEditingStudent({ ...student });
  };

  const handleEditChange = (field, value) => {
    setEditingStudent({ ...editingStudent, [field]: value });
  };

  const cancelEditing = () => {
    setEditingStudent(null);
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error) return <div className="alert alert-error shadow-lg"><div><span>{error}</span></div></div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Student Leaderboard</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for a student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Points</th>
              <th>Graduation Year</th>
              <th>Project Groups</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <React.Fragment key={student.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.points}</td>
                  <td>{student.graduationYear}</td>
                  <td>{student.projectGroups.join(", ")}</td>
                  {isAdmin && (
                    <td>
                      <button onClick={() => startEditing(student)} className="btn btn-xs btn-outline mr-2">Edit</button>
                      <button onClick={() => deleteStudent(student.id)} className="btn btn-xs btn-error">Delete</button>
                    </td>
                  )}
                </tr>
                {isAdmin && editingStudent && editingStudent.id === student.id && (
                  <tr>
                    <td colSpan="6">
                      <div className="p-4 bg-base-200">
                        <input
                          type="text"
                          value={editingStudent.name}
                          onChange={(e) => handleEditChange("name", e.target.value)}
                          className="input input-bordered w-full mb-2"
                          placeholder="Name"
                        />
                        <input
                          type="number"
                          value={editingStudent.points}
                          onChange={(e) => handleEditChange("points", parseInt(e.target.value))}
                          className="input input-bordered w-full mb-2"
                          placeholder="Points"
                        />
                        <input
                          type="text"
                          value={editingStudent.graduationYear}
                          onChange={(e) => handleEditChange("graduationYear", e.target.value)}
                          className="input input-bordered w-full mb-2"
                          placeholder="Graduation Year"
                        />
                        <input
                          type="text"
                          value={editingStudent.projectGroups.join(", ")}
                          onChange={(e) => handleEditChange("projectGroups", e.target.value.split(", "))}
                          className="input input-bordered w-full mb-2"
                          placeholder="Project Groups (comma-separated)"
                        />
                        <div className="flex justify-end mt-2">
                          <button onClick={() => updateStudent(editingStudent.id, editingStudent)} className="btn btn-primary btn-sm mr-2">Save Changes</button>
                          <button onClick={cancelEditing} className="btn btn-ghost btn-sm">Cancel</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {isAdmin && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Add New Student</h2>
          <form onSubmit={addStudent} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <input
                type="text"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="input input-bordered w-full mb-2"
                placeholder="Name"
                required
              />
              <input
                type="number"
                value={newStudent.points}
                onChange={(e) => setNewStudent({ ...newStudent, points: parseInt(e.target.value) })}
                className="input input-bordered w-full mb-2"
                placeholder="Points"
                required
              />
              <input
                type="text"
                value={newStudent.graduationYear}
                onChange={(e) => setNewStudent({ ...newStudent, graduationYear: e.target.value })}
                className="input input-bordered w-full mb-2"
                placeholder="Graduation Year"
                required
              />
              <input
                type="text"
                value={newStudent.projectGroups.join(", ")}
                onChange={(e) => setNewStudent({ ...newStudent, projectGroups: e.target.value.split(", ") })}
                className="input input-bordered w-full mb-2"
                placeholder="Project Groups (comma-separated)"
              />
              <div className="card-actions justify-end mt-4">
                <button type="submit" className="btn btn-primary">Add Student</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
