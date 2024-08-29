"use client";
import React, { useState } from "react";
import Schedule from "@/components/Schedule";
import Navbar from "/components/Navbar";
import StudentLeaderboard from "@/components/StudentLeaderboard";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("leaderboard");

  return (
    <main>
      <Navbar />
      <div className="w-screen flex flex-col items-center bg-neutral-200 p-8 mb-4">
        <h1 className="font-bold text-3xl mb-4">Admin</h1>
        <div className="tabs tabs-boxed">
          <a 
            className={`tab ${activeTab === "leaderboard" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </a>
          <a 
            className={`tab ${activeTab === "schedule" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            Schedule
          </a>
        </div>
      </div>
      <div className="container mx-auto px-4">
        {activeTab === "leaderboard" && <StudentLeaderboard isAdmin={true} />}
        {activeTab === "schedule" && <Schedule isAdmin={true} />}
      </div>
    </main>
  );
}
