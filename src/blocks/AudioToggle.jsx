import { MusicNote, MusicOff } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const AudioToggle = ({ src }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const audio = useRef(null);

  useEffect(() => {
    audio.current = new Audio(src);
    audio.current.loop = true;

    if (isEnabled) {
      const playPromise = audio.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Audio playback started successfully
            console.log('Audio is playing');
          })
          .catch((error) => {
            // Audio playback was prevented
            console.error('Audio playback failed:', error);
            setIsEnabled(false); // Update state if playback fails
          });
      }
    }

    // Cleanup on unmount
    return () => {
      audio.current.pause();
    };
  }, [src, isEnabled]);

  const handleToggle = () => {
    if (isEnabled) {
      audio.current.pause();
      setIsEnabled(false);
    } else {
      audio.current.play().catch((error) => {
        console.error('Audio playback failed:', error);
      });
      setIsEnabled(true);
    }
  };

  return (
    <Button onClick={handleToggle} variant="text" startIcon={isEnabled ? <MusicNote /> : <MusicOff />}>
      {isEnabled ? 'Music On' : 'Music Off'}
    </Button>
  );
};

export default AudioToggle;
