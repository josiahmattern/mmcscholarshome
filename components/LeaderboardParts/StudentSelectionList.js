import React, { useState } from "react";
import SearchInput from "@/components/LeaderboardParts/SearchInput"; 

const StudentSelectionList = ({ students, selectedStudents, onSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStudentSelection = (studentName) => {
    const updatedSelection = selectedStudents.includes(studentName)
      ? selectedStudents.filter((name) => name !== studentName)
      : [...selectedStudents, studentName];
    onSelectionChange(updatedSelection);
  };

  return (
    <div className="mb-2">
      <div className="mb-2">
      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      </div>
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {filteredStudents.map((student) => (
          <label key={student.id} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedStudents.includes(student.name)}
              onChange={() => handleStudentSelection(student.name)}
              className="checkbox mr-2"
            />
            {student.name}
          </label>
        ))}
      </div>
    </div>
  );
};

export default StudentSelectionList;
