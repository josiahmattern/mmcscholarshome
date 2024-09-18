"use client";
import { useState } from "react";
import Nav from "@/components/Nav";
import WebDevTeam from "@/components/Teams/WebDevTeam";
import DataTeam from "@/components/Teams/DataTeam";
import VideoTeam from "@/components/Teams/VideoTeam";
import GraphicsTeam from "@/components/Teams/GraphicsTeam";
import MotionGraphicsTeam from "@/components/Teams/MotionGraphicsTeam";
import VRTeam from "@/components/Teams/VRTeam";

const tabs = [
  { key: "webdev", label: "Web Dev", component: WebDevTeam },
  { key: "data", label: "Data", component: DataTeam },
  { key: "VR", label: "VR", component: VRTeam },
  { key: "video", label: "Video", component: VideoTeam },
  { key: "graphics", label: "Graphics", component: GraphicsTeam },
  { key: "motiongraphics", label: "Motion Graphics", component: MotionGraphicsTeam },
];

export default function Teams() {
  const [activeTab, setActiveTab] = useState("webdev");
  const ActiveComponent = tabs.find((tab) => tab.key === activeTab)?.component;

  return (
    <main>
      <Nav />
      <div className="p-4">
        <h1 className="text-4xl font-bold text-center mb-8">Teams</h1>

        <div className="tabs tabs-boxed mb-8 flex flex-wrap justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tab ${
                activeTab === tab.key ? "tab-active" : ""
              } m-2`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </main>
  );
}
