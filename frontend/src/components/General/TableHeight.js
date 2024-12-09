import { useState, useEffect } from 'react';

export const DynamicTableHeight = () => {
  const [containerStyle, setContainerStyle] = useState(window.innerHeight-310);

  useEffect(() => { 
    const handleResize = () => {
      // Calculate the desired container height based on screen   size
      const screenHeight = window.innerHeight;
      const desiredHeight = screenHeight - 310; // Adjust as needed

      // Set the container style dynamically
      setContainerStyle(`${desiredHeight}px`);
    };

    // Initial setup and add event listener
    handleResize();
    window.addEventListener('resize', handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return containerStyle;
};
