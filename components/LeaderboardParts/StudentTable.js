import React from "react";

const StudentTable = ({ students, sortBy, isAdmin, onEdit, onDelete }) => {
  return (
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
        {students.map((student, index) => (
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
                  onClick={() => onEdit(student)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => onDelete(student.id)}
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;
