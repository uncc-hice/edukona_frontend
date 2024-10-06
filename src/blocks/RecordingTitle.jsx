import { Button, Typography } from '@mui/material';
import { toast } from 'react-toastify';

const RecordingTitle = ({ title, id }) => {
  const handleClick = () => {
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state === 'granted' || result.state === 'prompt') {
        toast.promise(navigator.clipboard.writeText(id), {
          success: 'Copied recording id to clipboard',
          pending: 'Copying recording id to clipboard',
          error: "Couldn't copy recording id to clipboard",
        });
      }
    });
  };

  if (title === '') {
    return (
      <Button variant={'text'} onClick={handleClick}>
        {id.substring(0, 7)}...
      </Button>
    );
  }
  return <Typography variant="p">{title}</Typography>;
};

export default RecordingTitle;
