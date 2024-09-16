import React from "react";
import Image from "next/image";

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
          <th className="hidden md:table-cell">Image</th> {/* Hidden on small screens */}
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
            <td className="hidden md:table-cell"> {/* Hidden on small screens */}
              <div className="avatar">
                <div className="mask mask-squircle w-12 h-12">
                  {team.imageUrl ? (
                    <Image 
                      width={48}
                      height={48}
                      src={team.imageUrl} 
                      alt={team.name} 
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
              </div>
            </td>
            <td>
              <div className="font-bold">{team.name}</div>
            </td>
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
