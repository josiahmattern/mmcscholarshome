import React, { useState } from "react";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseConfig.js";
import StudentSelectionList from "./StudentSelectionList";

const EditTeamModal = ({ team, students, onSave, onCancel }) => {
  const [editingTeam, setEditingTeam] = useState(team);
  const [imageFile, setImageFile] = useState(null);

  const handleSave = async () => {
    let updatedTeam = { ...editingTeam };
    if (imageFile) {
      const imageRef = storageRef(storage, `team-images/${editingTeam.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);
      updatedTeam.imageUrl = imageUrl;
    }
    onSave(updatedTeam);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-2">Edit Team</h3>
        <input
          type="text"
          value={editingTeam.name}
          onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
          className="input input-bordered w-full mb-2"
        />
        <StudentSelectionList
          students={students}
          selectedStudents={editingTeam.members}
          onSelectionChange={(members) => setEditingTeam({ ...editingTeam, members })}
        />
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="file-input file-input-bordered w-full mb-2"
        />
        {editingTeam.imageUrl && (
          <div className="mb-2">
            <img src={editingTeam.imageUrl} alt="Team" className="w-full h-32 object-cover rounded" />
          </div>
        )}
        <div className="flex justify-end">
          <button onClick={handleSave} className="btn btn-primary mr-2">Save</button>
          <button onClick={onCancel} className="btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditTeamModal;
