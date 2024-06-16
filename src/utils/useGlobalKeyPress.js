import { useEffect } from 'react';

const useGlobalKeyPress = (toggleTheme, showTour) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.code === 'Space') {
        toggleTheme();
      } else if (event.altKey && event.code === 'F1') {
        showTour();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [toggleTheme, showTour]);
};

export default useGlobalKeyPress;
