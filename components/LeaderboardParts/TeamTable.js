import React from "react";

const TeamTable = ({ teams, students, isAdmin, onEdit, onDelete }) => {
  const calculateAveragePoints = (team) => {
    if (!team.members || team.members.length === 0) return 0;
    const totalPoints = team.members.reduce((sum, memberName) => {
      const member = students.find((s) => s.name === memberName);
      return sum + (member ? member.totalPoints : 0);
    }, 0);
    return (totalPoints / team.members.length).toFixed(2);
  };

  return (
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
        {teams.map((team, index) => (
          <tr key={team.id}>
            <td>{index + 1}</td>
            <td>{team.name}</td>
            <td>{calculateAveragePoints(team)}</td>
            <td>
              {team.members ? team.members.join(", ") : "No members"}
            </td>
            {isAdmin && (
              <td>
                <button
                  className="btn btn-xs btn-outline mr-2"
                  onClick={() => onEdit(team)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => onDelete(team.id)}
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

export default TeamTable;
