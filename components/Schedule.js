"use client";
import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
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

export default function Schedule({ isAdmin = false }) {
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newClass, setNewClass] = useState({
    day: "",
    name: "",
    startTime: "",
    endTime: "",
    weeks: "",
  });
  const [editingClass, setEditingClass] = useState(null);
  const [deletingClass, setDeletingClass] = useState(null);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = async () => {
    try {
      const scheduleCollection = collection(db, "schedule");
      const scheduleSnapshot = await getDocs(scheduleCollection);
      const fetchedData = {};
      scheduleSnapshot.forEach((doc) => {
        fetchedData[doc.id] = doc.data();
      });
      setScheduleData(fetchedData);
      setLoading(false);
    } catch (err) {
      setError("Error fetching schedule data");
      setLoading(false);
    }
  };

  const addClass = async (e) => {
    e.preventDefault();
    try {
      const newClassRef = doc(collection(db, "schedule"));
      await setDoc(newClassRef, newClass);
      setNewClass({ day: "", name: "", startTime: "", endTime: "", weeks: "" });
      fetchScheduleData();
    } catch (err) {
      setError("Error adding new class");
    }
  };

  const updateClass = async (id, updatedData) => {
    try {
      const classRef = doc(db, "schedule", id);
      await updateDoc(classRef, updatedData);
      setEditingClass(null);
      fetchScheduleData();
    } catch (err) {
      setError("Error updating class");
    }
  };

  const deleteClass = async () => {
    if (!deletingClass) return;
    try {
      await deleteDoc(doc(db, "schedule", deletingClass));
      setDeletingClass(null);
      fetchScheduleData();
    } catch (err) {
      setError("Error deleting class");
    }
  };

  const startEditing = (id, classData) => {
    setEditingClass({ id, ...classData });
  };

  const handleEditChange = (field, value) => {
    setEditingClass({ ...editingClass, [field]: value });
  };

  const cancelEditing = () => {
    setEditingClass(null);
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const sortClassesByTime = (classes) => {
    return classes.sort((a, b) => {
      const timeA = a[1].startTime.replace(":", "");
      const timeB = b[1].startTime.replace(":", "");
      return timeA.localeCompare(timeB);
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (error)
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <span>{error}</span>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto p-4 mb-8 my-auto">
      <h1 className="text-4xl font-bold text-center mt-4 mb-8">Schedule</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
        {days.map((day) => (
          <div key={day} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">{day}</h2>
              {sortClassesByTime(
                Object.entries(scheduleData).filter(
                  ([_, classData]) => classData.day === day,
                ),
              ).map(([id, classData]) => (
                <div key={id} className="mb-1 p-4 bg-base-200 rounded-lg">
                  {isAdmin && editingClass && editingClass.id === id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingClass.name}
                        onChange={(e) =>
                          handleEditChange("name", e.target.value)
                        }
                        className="input input-bordered w-full"
                      />
                      <input
                        type="time"
                        value={editingClass.startTime}
                        onChange={(e) =>
                          handleEditChange("startTime", e.target.value)
                        }
                        className="input input-bordered w-full"
                      />
                      <input
                        type="time"
                        value={editingClass.endTime}
                        onChange={(e) =>
                          handleEditChange("endTime", e.target.value)
                        }
                        className="input input-bordered w-full"
                      />
                      <input
                        type="text"
                        value={editingClass.weeks}
                        onChange={(e) =>
                          handleEditChange("weeks", e.target.value)
                        }
                        className="input input-bordered w-full"
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          onClick={() => updateClass(id, editingClass)}
                          className="btn btn-primary btn-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="btn btn-ghost btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold">{classData.name}</p>
                      <p className="text-sm">
                        {formatTime(classData.startTime)}
                        {classData.endTime && (
                          <> to {formatTime(classData.endTime)}</>
                        )}
                      </p>
                      <p className="text-sm">Weeks: {classData.weeks}</p>
                      {isAdmin && (
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => startEditing(id, classData)}
                            className="btn btn-outline btn-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeletingClass(id)}
                            className="btn btn-error btn-xs"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {isAdmin && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Add New Class</h2>
          <form onSubmit={addClass} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={newClass.day}
                  onChange={(e) =>
                    setNewClass({ ...newClass, day: e.target.value })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select Day</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Class Name"
                  value={newClass.name}
                  onChange={(e) =>
                    setNewClass({ ...newClass, name: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
                <input
                  type="time"
                  placeholder="Start Time"
                  value={newClass.startTime}
                  onChange={(e) =>
                    setNewClass({ ...newClass, startTime: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
                <input
                  type="time"
                  placeholder="End Time"
                  value={newClass.endTime}
                  onChange={(e) =>
                    setNewClass({ ...newClass, endTime: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  placeholder="Weeks"
                  value={newClass.weeks}
                  onChange={(e) =>
                    setNewClass({ ...newClass, weeks: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
              </div>
              <div className="card-actions justify-end mt-4">
                <button type="submit" className="btn btn-primary">
                  Add Class
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <input type="checkbox" id="delete-modal" className="modal-toggle" checked={!!deletingClass} onChange={() => setDeletingClass(null)} />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Are you sure you want to delete this class? This action cannot be undone.</p>
          <div className="modal-action">
            <button onClick={deleteClass} className="btn btn-error">Delete</button>
            <button onClick={() => setDeletingClass(null)} className="btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
