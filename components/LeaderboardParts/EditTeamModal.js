import React, { useState } from "react";
import StudentSelectionList from "@/components/LeaderboardParts/StudentSelectionList";

const EditTeamModal = ({ team, students, onSave, onCancel }) => {
  const [editingTeam, setEditingTeam] = useState(team);

  const handleSave = () => {
    onSave(editingTeam);
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
        <div className="flex justify-end">
          <button onClick={handleSave} className="btn btn-primary mr-2">Save</button>
          <button onClick={onCancel} className="btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditTeamModal;
