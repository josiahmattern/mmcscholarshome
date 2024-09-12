import React, { useState } from "react";

const EditStudentModal = ({ student, onSave, onCancel }) => {
  const [editingStudent, setEditingStudent] = useState(student);

  const handleSave = () => {
    onSave(editingStudent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Edit Student</h3>
        <input
          type="text"
          value={editingStudent.name}
          onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
          className="input input-bordered w-full mb-2"
        />
        <input
          type="number"
          value={editingStudent.communityPoints}
          onChange={(e) => setEditingStudent({ ...editingStudent, communityPoints: parseInt(e.target.value) })}
          className="input input-bordered w-full mb-2"
        />
        <input
          type="number"
          value={editingStudent.projectPoints}
          onChange={(e) => setEditingStudent({ ...editingStudent, projectPoints: parseInt(e.target.value) })}
          className="input input-bordered w-full mb-2"
        />
        <input
          type="number"
          value={editingStudent.graduationYear}
          onChange={(e) => setEditingStudent({ ...editingStudent, graduationYear: e.target.value })}
          className="input input-bordered w-full mb-2"
        />
        <input
          type="text"
          value={editingStudent.projectGroups ? editingStudent.projectGroups.join(", ") : ""}
          onChange={(e) => setEditingStudent({ ...editingStudent, projectGroups: e.target.value.split(", ") })}
          className="input input-bordered w-full mb-2"
          placeholder="Project Groups (comma-separated)"
        />
        <div className="flex justify-end">
          <button onClick={handleSave} className="btn btn-primary mr-2">Save</button>
          <button onClick={onCancel} className="btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;
