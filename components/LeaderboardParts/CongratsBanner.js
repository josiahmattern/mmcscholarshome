import React, { useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

const CongratulationsBanner = ({ topEntity, entityType, filterInfo }) => {
  const confettiRef = useRef(null);
  const hasPlayedAnimation = useRef(false);

  useEffect(() => {
    if (topEntity && !hasPlayedAnimation.current) {
      handleCongratAnimation();
      hasPlayedAnimation.current = true;
    }
  }, [topEntity]);

  const handleCongratAnimation = () => {
    const end = Date.now() + 1 * 1000;
    const colors = ["#efbb34", "#00adee", "#d81a8b"]; // Updated to match background animation colors

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 65,
        spread: 75,
        origin: { x: 0, y: 0.4 },
        ticks: 40,
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 115,
        spread: 75,
        origin: { x: 1, y: 0.4 },
        ticks: 40,
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  if (!topEntity) return null;

  let congratsMessage = "";
  if (entityType === "student") {
    congratsMessage = `Top ${filterInfo.pointType} for ${filterInfo.graduationYear === 'all' ? 'All Years' : filterInfo.graduationYear}`;
  } else if (entityType === "team") {
    congratsMessage = "Top Team";
  }

  return (
    <div className="mt-2 p-8 bg-neutral rounded-lg shadow-md mb-8">
      <div className="flex flex-col items-center">
        <h1 ref={confettiRef} className="text-2xl md:text-3xl inline-block">
          Congratulations
        </h1>
        <span className="blue text-2xl md:text-3xl mt-2">{topEntity.name}!</span>
        <p className="text-sm md:text-base mt-2 ">{congratsMessage}</p>
      </div>
    </div>
  );
};

export default CongratulationsBanner;
