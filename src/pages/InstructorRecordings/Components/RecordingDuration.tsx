import { Typography } from '@mui/material';

const RecordingDuration = ({ duration }: { duration: number }) => {
  const formatDuration = (duration: number) => {
    if (duration === 0) return '--';
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    return [hours > 0 && `${hours}h`, minutes > 0 && `${minutes}m`, `${seconds}s`].filter(Boolean).join(' ');
  };

  return (
    <Typography variant="body2" color="textSecondary">
      {formatDuration(duration)}
    </Typography>
  );
};

export default RecordingDuration;
