import { Box, TextareaAutosize } from '@mui/material';

const SummaryEditor = ({ summary, setSummary }) => {
  return (
    <Box height={'100%'} maxWidth={'100%'}>
      <TextareaAutosize
        style={{ border: 'none', outline: 'none' }}
        value={summary}
        cols={80}
        onChange={(e) => setSummary(e.target.value)}
      />
    </Box>
  );
};

export default SummaryEditor;
