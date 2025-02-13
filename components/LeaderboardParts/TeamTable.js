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
          <th>Logo</th>{" "}
          {/* Hidden on small screens */}
          <th>Team Name</th>
          <th>Average Points</th>
          <th className="hidden md:table-cell">Members</th>{" "}
          {isAdmin && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {teams.map((team, index) => (
          <tr key={team.id}>
            <td>{index + 1}</td>
            <td >
              {" "}
              {/* Hidden on small screens */}
              <div className="avatar">
                <div className="mask mask-circle w-14 h-14 overflow-hidden">
                  {team.imageUrl ? (
                    <Image
                      className="object-cover w-full h-full"
                      width={256}
                      height={256}
                      src={team.imageUrl}
                      alt={team.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        className="object-cover w-full h-full"
                        width={256}
                        height={256}
                        src="/MMCLOGO.png"
                        alt={team.name}
                      />
                    </div>
                  )}
                </div>
              </div>
            </td>
            <td>
              <div className="font-bold">{team.name}</div>
            </td>
            <td>{calculateAveragePoints(team)}</td>
            <td className="hidden md:table-cell">
              {team.members ? team.members.join(", ") : "No members"}</td>
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
