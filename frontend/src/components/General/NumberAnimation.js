import React, { useState, useEffect } from 'react';
// import './NumberAnimation.css'; // Create a CSS file for styling

const NumberAnimation = ({ maxNumber }) => {
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 2000; // Animation duration in milliseconds

    const updateNumber = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const newNumber = Math.floor(progress * maxNumber);

      setCurrentNumber(newNumber);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    };

    requestAnimationFrame(updateNumber);

    // Clean up the animation when the component unmounts
    return () => cancelAnimationFrame(updateNumber);
  }, [maxNumber]);

  return (
    <div>
      <span>{currentNumber}</span>
    </div>
  );
};

export default NumberAnimation;
