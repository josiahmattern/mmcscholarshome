import React from "react";
import Nav from "@/components/Nav";
import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    link: "https://youtu.be/iYMnkLS-NPI",
    title: "After Effects",
    desc: "After Effects is a software program used for special and visual effects animations, and is often utilized in television and film production",
    length: "7",
  },
  {
    link: "https://youtu.be/B6HE7xImZvA",
    title: "Applied Marketing",
    desc: "Students will learn the fundamentals of how to write a marketing plan for a growing business.",
    length: "14",
  },
  {
    link: "https://youtu.be/p08lItcBzV4",
    title: "Blender",
    desc: "Learn the basics of 3D modeling with this amazing free software.",
    length: "14",
  },
  {
    link: "https://youtu.be/hajOu3WAmiw",
    title: "ChatGPT Basics",
    desc: "Learn how to various AI platforms to improve your productivity.",
    length: "7",
  },
  {
    link: "https://youtu.be/KxJWLsvrlEU",
    title: "Digital Media & Composition",
    desc: "Learn how to create digital media and how to use it in your projects.",
    length: "14",
  },
  {
    link: "https://youtu.be/R3mgT3sSlnI",
    title: "Financial Literacy/ Investing",
    desc: "Learn about the stock market and different ways you can invest.",
    length: "7",
  },
  {
    link: "https://youtu.be/L8QUauvatrQ",
    title: "Illustrator Basics",
    desc: "Learn the in's and out's of Adobe Illustrator, a high-end graphic editing software.",
    length: "14",
  },
  {
    link: "https://youtu.be/ssSHtqNVZ0M",
    title: "InDesign Basics",
    desc: "In this project group students will learn graphic layout basics with InDesign.",
    length: "7",
  },
  {
    link: "https://youtu.be/z4pwQ171av0",
    title: "LinkedIn Pro",
    desc: "Wish your LinkedIn profile was a little more than it is? Wonder what else you can do with it? Join us for the LinkedInPro project group to push your profile so it is polished and professional.",
    length: "7",
  },
  {
    link: "https://youtu.be/_0aHh130Z6M",
    title: "Microsoft Office 365",
    desc: "Learn how to get the most out of these program you already use everyday.",
    length: "7",
  },
  {
    link: "https://youtu.be/nZ1umZiwjmw",
    title: "Photoshop",
    desc: "Ever wish you could touch up your photos or make a collage? Learn basic digital imaging skills with Photoshop, the industry standard that works on both macs and PCs. No experience needed.",
    length: "14",
  },
  {
    link: "https://youtu.be/AhG5V8YQvW8",
    title: "Podcasting",
    desc: "Learn how to make a podcast using the Anchor Podcasting App.Use tools such as Audacity, Garageband and more!",
    length: "7",
  },
  {
    link: "https://youtu.be/RWRgRxGHMjg",
    title: "Premiere Pro",
    desc: "Learn the basics of the industry standard video editing software the pros use.",
    length: "14",
  },
  {
    link: "https://youtu.be/a86a1gRZJZI",
    title: "Procreate",
    desc: "Learn how to use the Procreate app by exploring its powerful, versatile features that are great for creating graphics, digital paintings, and animations.",
    length: "7",
  },
  {
    link: "https://youtu.be/-N6NGxfiRYU",
    title: "Professional Development",
    desc: "Professional Development focuses on everything from resume writing and interviewing skills, to what to wear.",
    length: "7",
  },
  {
    link: "https://youtu.be/wtY3n-N4ZzQ",
    title: "Public Speaking",
    desc: "Are you afraid of public speaking? Are you looking for a fun place to gain new skills?",
    length: "14",
  },
  {
    link: "https://youtu.be/PAxwCgoRYVI",
    title: "Qualtrics",
    desc: "Learn how to use the best survey software that data professionals use.",
    length: "7",
  },
  {
    link: "https://youtu.be/AjiCcFnvCXU",
    title: "Social Media Marketing",
    desc: "Learn how to get serious with your social media accounts. This group is ideal for those who are interested in going into Social Media careers!",
    length: "14",
  },
  {
    link: "https://youtu.be/MFyais-GwAI",
    title: "Tableau",
    desc: "Tableau is a cool, free new app that business and researchers use to make their data more visual.",
    length: "7",
  },
  {
    link: "https://youtu.be/89hfe3H6E_0",
    title: "Video Basics",
    desc: "The video production project group gives students the chance to create their own 5-10 minutes movie. Student pairs create a 3 act plot, write dialogue, and then shoot it.",
    length: "7",
  },
  {
    link: "https://youtu.be/d9IKeFkgB24",
    title: "Youtube Content Creation",
    desc: "Learn the basics and fundamentals of YouTube in the YouTube Content Creation project group! No experience necessary!",
    length: "7",
  },
  // Add more projects as needed
  ,
];

export default function Projects() {
  return (
    <main className="bg-base-200 min-h-screen pb-6">
      <Nav />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2">Projects</h1>
        <h1 className="text-xl text-neutral-700 text-center mb-8">
          Click on link to view video
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              link={project.link}
              title={project.title}
              desc={project.desc}
              length={project.length}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
