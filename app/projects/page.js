import React from "react";
import Nav from "@/components/Nav";
import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    link: "https://youtu.be/iYMnkLS-NPI",
    title: "After Effects",
    desc: "After Effects is a software program used for special and visual effects animations, and is often utilized in television and film production.",
    length: "7",
  },
  {
    link: "https://youtu.be/B6HE7xImZvA",
    title: "Applied Marketing",
    desc: "In this project group, marketing strategies will be introduced, as well as how to use them when growing a business. Students will encounter elements and techniques used by Fortune 500 companies, analyze marketing plans, identify target markets, and explore relationships between businesses and consumers.",
    length: "14",
  },
  {
    link: "https://youtu.be/p08lItcBzV4",
    title: "Blender",
    desc: "Project group participants will learn about the different features that Blender has, such as modeling, animation, rendering, even video editing and game creation.",
    length: "14",
  },
  {
    link: "https://youtu.be/hajOu3WAmiw",
    title: "ChatGPT Basics",
    desc: "The ChatGPT Basics project group will teach students how to use ChatGPT and a variety of other similar generative AI processing programs, as well as teach students about the issues involving AI, its potential dangers, and the dangers of its irresponsible use.",
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
    title: "Financial Literacy & Investing",
    desc: "This project group will touch on topics such as retirement, what it means to invest in stocks and bonds, savings accounts, and how to go about paying off debts.",
    length: "7",
  },
  {
    link: "https://youtu.be/L8QUauvatrQ",
    title: "Illustrator Basics",
    desc: "Throughout this project group, students will learn the skills and tools necessary for understanding Adobe Illustrator. Such skills include how to use shape and pen tools, how to creatively use typography, how to work with multiple layers, and how to create a custom logo.",
    length: "14",
  },
  {
    link: "https://youtu.be/ssSHtqNVZ0M",
    title: "InDesign Basics",
    desc: "Adobe InDesign is a desktop publishing software and can be used to create works such as posters, fliers, magazines, newspapers, and books. In this project group, students will learn the basics of by designing periodical publications and posters using information about grids and typography.",
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
    desc: "The Microsoft 365 suite (including Word, Excel, and PowerPoint) is a powerful collection of software used across industries and universities. In this project group, students will learn the basics of the Microsoft 365 suite and how to tailor it to their academic and professional needs.",
    length: "7",
  },
  {
    link: "https://youtu.be/nZ1umZiwjmw",
    title: "Photoshop",
    desc: "Industry-standard across the globe, Adobe Photoshop is a key tool for anyone looking to have a creative career. Throughout this project group, students will learn the skills and tools necessary for understanding Adobe Photoshop. Such skills include how to use the lasso and pen tools, how to color correct images, how to work with masks, and how to create a custom poster, .gif animations, and more!",
    length: "14",
  },
  {
    link: "https://youtu.be/AhG5V8YQvW8",
    title: "Podcasting",
    desc: "In this project group, you will learn the basics of podcasting, such as recording and editing audio, marketing a podcast, and sharing it with an online community.",
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
    desc: "Throughout this project group, students will learn the essential skills necessary for success in a typical business environment, such as how to create a notable resume, how to maintain a professional social media presence, how to network, and how to apply for jobs and internships.",
    length: "7",
  },
  {
    link: "https://youtu.be/wtY3n-N4ZzQ",
    title: "Public Speaking",
    desc: "Public speaking is an invaluable skill, that will help any person further their own career and allow them to easily express their ideas to the world. These interactions happen every day, in situations such as job interviews, presentations, speeches, and daily conversation. Throughout this seven week project group, students will learn how to write, produce, and present an effective speech.",
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
    desc: "Tableau is a user-friendly data analysis program used to visualize data, perform calculations, and analyze your results. Tableau is the most popular software for data analysis due to its simple design, convenience, and powerful data processing abilities. In this class, you will learn how to effectively build dashboards and data sets using the expansive list of features that Tableau has to offer.",
    length: "7",
  },
  {
    link: "https://youtu.be/89hfe3H6E_0",
    title: "Video Basics",
    desc: "Create your very own short film with the video project group! In this group you will learn how to shoot, direct, and make your videos look great, no prior editing experience required. Learn about the narrative and documentary processes through interactive lessons, as well as how to use studio lights and other important video equipment.",
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
        <h1 className="text-4xl font-bold text-center mb-2">
          Project Group Offerings
        </h1>
        <h1 className="text-2xl text-bg-base-300 text-center mb-8">
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
