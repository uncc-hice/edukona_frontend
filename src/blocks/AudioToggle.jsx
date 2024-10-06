import { MusicNote, MusicOff } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const AudioToggle = ({ src }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const audio = useRef(null);

  useEffect(() => {
    audio.current = new Audio(src);
    audio.current.loop = true;
  }, []);

  const handleToggle = () => {
    if (isEnabled === false) {
      setIsEnabled(true);
      audio.current.play();
    } else {
      setIsEnabled(false);
      audio.current.pause();
    }
  };

  if (isEnabled === true) {
    return (
      <Button onClick={handleToggle}>
        <MusicNote />
      </Button>
    );
  }
  return (
    <Button onClick={handleToggle}>
      <MusicOff />
    </Button>
  );
};

export default AudioToggle;
