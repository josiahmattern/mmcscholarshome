"use client";
import Nav from "@/components/Nav";
import WebDevTeam from "@/components/Teams/WebDevTeam";
import DataTeam from "@/components/Teams/DataTeam";
import VideoTeam from "@/components/Teams/VideoTeam";
import GraphicsTeam from "@/components/Teams/GraphicsTeam";
import MotionGraphicsTeam from "@/components/Teams/MotionGraphicsTeam";
import VRTeam from "@/components/Teams/VRTeam";
import { useState } from "react";

export default function Teams() {
  const [activeTab, setActiveTab] = useState("webdev");

  return (
    <main>
      <Nav />
      <div className="p-4">
        <h1 className="text-4xl font-bold text-center mb-4">Teams</h1>

        <div className="tabs tabs-boxed mb-4 flex flex-col w-full md:flex-row md:justify-around">
          <a
            className={`tab ${activeTab === "webdev" ? "tab-active" : ""} w-full text-center`}
            onClick={() => {
              setActiveTab("webdev");
            }}
          >
            Web Dev
          </a>
          <a
            className={`tab ${activeTab === "data" ? "tab-active" : ""} w-full text-center`}
            onClick={() => {
              setActiveTab("data");
            }}
          >
            Data
          </a>
          <a
            className={`tab ${activeTab === "VR" ? "tab-active" : ""} w-full text-center`}
            onClick={() => {
              setActiveTab("VR");
            }}
          >
            VR
          </a>
          <a
            className={`tab ${activeTab === "video" ? "tab-active" : ""} w-full  text-center`}
            onClick={() => {
              setActiveTab("video");
            }}
          >
            Video
          </a>
          <a
            className={`tab ${activeTab === "graphics" ? "tab-active" : ""} w-full  text-center`}
            onClick={() => {
              setActiveTab("graphics");
            }}
          >
            Graphics
          </a>
          <a
            className={`tab ${activeTab === "motiongraphics" ? "tab-active" : ""} w-full text-center`}
            onClick={() => {
              setActiveTab("motiongraphics");
            }}
          >
            Motion Graphics
          </a>
        </div>
        <div>{activeTab === "webdev" && <WebDevTeam />}</div>
        <div>{activeTab === "data" && <DataTeam />}</div>
        <div>{activeTab === "video" && <VideoTeam />}</div>
        <div>{activeTab === "graphics" && <GraphicsTeam />}</div>
        <div>{activeTab === "motiongraphics" && <MotionGraphicsTeam />}</div>
        <div>{activeTab === "VR" && <VRTeam />}</div>
      </div>
    </main>
  );
}
