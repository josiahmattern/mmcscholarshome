import React, { useState } from "react";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig.js";
import StudentSelectionList from "./StudentSelectionList";
import { motion, AnimatePresence } from "framer-motion";

const AdminActions = ({ activeTab, onAddStudent, onAddTeam, students }) => {
  const [newStudent, setNewStudent] = useState({
    name: "",
    studentId: "",
    communityPoints: 0,
    projectPoints: 0,
    graduationYear: "",
    projectGroups: [],
  });
  const [newTeam, setNewTeam] = useState({ name: "", members: [], imageUrl: "" });
  const [imageFile, setImageFile] = useState(null);

  const handleAddStudent = (e) => {
    e.preventDefault();
    onAddStudent(newStudent);
    setNewStudent({
      name: "",
      studentId: "",
      communityPoints: 0,
      projectPoints: 0,
      graduationYear: "",
      projectGroups: [],
    });
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (imageFile) {
      const imageRef = storageRef(storage, `team-images/${newTeam.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);
      onAddTeam({ ...newTeam, imageUrl });
    } else {
      onAddTeam(newTeam);
    }
    setNewTeam({ name: "", members: [], imageUrl: "" });
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.2 } }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Admin Actions</h2>
      <AnimatePresence mode="wait">
        {activeTab === "students" ? (
          <motion.form
            key="student-form"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleAddStudent}
            className="card bg-base-100 shadow-xl p-4"
          >
            <h3 className="text-xl font-semibold mb-2">Add New Student</h3>
            <input
              type="text"
              placeholder="Name"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="input input-bordered w-full mb-2"
            />
            <input
              type="text"
              placeholder="Student ID"
              value={newStudent.studentId}
              onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
              className="input input-bordered w-full mb-2"
            />
            <input
              type="number"
              placeholder="Community Points"
              value={newStudent.communityPoints}
              onChange={(e) => setNewStudent({ ...newStudent, communityPoints: parseInt(e.target.value) })}
              className="input input-bordered w-full mb-2"
            />
            <input
              type="number"
              placeholder="Project Points"
              value={newStudent.projectPoints}
              onChange={(e) => setNewStudent({ ...newStudent, projectPoints: parseInt(e.target.value) })}
              className="input input-bordered w-full mb-2"
            />
            <input
              type="number"
              placeholder="Graduation Year"
              value={newStudent.graduationYear}
              onChange={(e) => setNewStudent({ ...newStudent, graduationYear: e.target.value })}
              className="input input-bordered w-full mb-2"
            />
            <input
              type="text"
              placeholder="Project Groups (comma-separated)"
              value={newStudent.projectGroups.join(", ")}
              onChange={(e) => setNewStudent({ ...newStudent, projectGroups: e.target.value.split(", ").filter(group => group.trim() !== "") })}
              className="input input-bordered w-full mb-2"
            />
            <button type="submit" className="btn btn-primary">Add Student</button>
          </motion.form>
        ) : (
          <motion.form
            key="team-form"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={handleAddTeam}
            className="card bg-base-100 shadow-xl p-4"
          >
            <h3 className="text-xl font-semibold mb-2">Add New Team</h3>
            <input
              type="text"
              placeholder="Team Name"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              className="input input-bordered w-full mb-2"
            />
            <StudentSelectionList
              students={students}
              selectedStudents={newTeam.members}
              onSelectionChange={(members) => setNewTeam({ ...newTeam, members })}
            />
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="file-input file-input-bordered w-full mb-2"
            />
            <button type="submit" className="btn btn-primary">Add Team</button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminActions;
