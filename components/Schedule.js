"use client";
import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
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

export default function Schedule() {
  const [scheduleData, setScheduleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newClass, setNewClass] = useState({
    day: "",
    name: "",
    time: "",
    weeks: "",
  });

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const scheduleCollection = collection(db, "schedule");
      const scheduleSnapshot = await getDocs(scheduleCollection);
      const scheduleData = {};
      scheduleSnapshot.forEach((doc) => {
        const day = doc.id;
        const classes = doc.data().classes;
        scheduleData[day] = classes;
      });
      setScheduleData(scheduleData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching schedule: ", err);
      setError("Failed to load schedule. Please try again later.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass({ ...newClass, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dayRef = doc(db, "schedule", newClass.day);
      const dayDoc = await getDocs(dayRef);

      if (dayDoc.exists()) {
        // If the day document exists, update it
        await updateDoc(dayRef, {
          classes: [...scheduleData[newClass.day], newClass],
        });
      } else {
        // If the day document doesn't exist, create it
        await addDoc(collection(db, "schedule"), {
          [newClass.day]: [newClass],
        });
      }

      // Refresh the schedule data
      fetchSchedule();
      // Clear the form
      setNewClass({ day: "", name: "", time: "", weeks: "" });
    } catch (err) {
      console.error("Error adding new class: ", err);
      setError("Failed to add new class. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Schedule</h1>

      {/* Add new class form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-base-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Add New Class</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="day"
            value={newClass.day}
            onChange={handleInputChange}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Day</option>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
              (day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ),
            )}
          </select>
          <input
            type="text"
            name="name"
            value={newClass.name}
            onChange={handleInputChange}
            placeholder="Class Name"
            className="input input-bordered w-full"
            required
          />
          <input
            type="time"
            name="time"
            value={newClass.time}
            onChange={handleInputChange}
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            name="weeks"
            value={newClass.weeks}
            onChange={handleInputChange}
            placeholder="Number of Weeks"
            className="input input-bordered w-full"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-4">
          Add Class
        </button>
      </form>

      {/* Existing schedule display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(scheduleData).map(([day, classes]) => (
          <div key={day} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg font-semibold mb-4">{day}</h2>
              <ul className="space-y-2">
                {classes.map((cls, index) => (
                  <li key={index} className="bg-base-200 p-2 rounded">
                    <p className="font-medium">{cls.name}</p>
                    <p className="text-sm">{cls.time}</p>
                    <p className="text-xs text-gray-500">{cls.weeks}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
