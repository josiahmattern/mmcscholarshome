"use client";
import { motion } from "framer-motion";
import React from "react";

const BackgroundAnimation = () => {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Yellow background circle */}
      <motion.div
        initial={{ opacity: 0.2, scale: 0.8 }}
        animate={{ opacity: [0.2, 0.4], scale: [1, 1.5] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
        style={{
          backgroundColor: "#efbb34",
          position: "absolute",
          width: "200%",
          height: "200%",
          borderRadius: "50%",
          top: "-50%",
          left: "-50%",
          filter: "blur(150px)",
        }}
      />

      {/* Blue moving wave with smooth back-and-forth */}
      <motion.div
        initial={{ scale: 1, x: "-100vw" }}
        animate={{ x: ["-100vw", "100vw"] }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        style={{
          backgroundColor: "#00adee",
          position: "absolute",
          width: "90vw",
          height: "50vh",
          top: "10vh",
          filter: "blur(250px)",
        }}
      />

      {/* Pink circle moving back and forth */}
      <motion.div
        initial={{ scale: 1, x: "100vw" }}
        animate={{ x: ["100vw", "-100vw"] }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut",
          repeatType: "mirror",
        }}
        style={{
          backgroundColor: "#d81a8b",
          position: "absolute",
          width: "90vw",
          height: "50vh",
          borderRadius: "30%",
          top: "60%",
          filter: "blur(250px)",
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;
