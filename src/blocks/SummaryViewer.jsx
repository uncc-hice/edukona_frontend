import { Box } from '@mui/material';
import Markdown from 'react-markdown';

const SummaryViewer = ({ summary }) => {
  return (
    <Box height={'100%'} width={'100%'}>
      <Markdown>{summary}</Markdown>
    </Box>
  );
};

export default SummaryViewer;
