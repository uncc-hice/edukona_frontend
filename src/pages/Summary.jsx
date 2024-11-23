import { Edit, Save } from '@mui/icons-material';
import { Box, Button, CircularProgress } from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SummaryEditor from '../blocks/SummaryEditor';
import SummaryViewer from '../blocks/SummaryViewer';
import { Main } from '../layouts';
import { getSummary } from '../services/apiService';

const Summary = () => {
  const [summary, setSummary] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { summaryId } = useParams();

  useEffect(() => {
    getSummary(summaryId)
      .then((res) => setSummary(res.data.summary))
      .catch(() => toast.error('Failed to fetch summary.'));
  }, [summaryId]);

  if (summary === null) {
    return <CircularProgress />;
  }

  return (
    <Main>
      <Box position={'sticky'} textAlign={'right'} top={'80px'} marginRight={'20px'}>
        {isEditing ? (
          <Button onClick={() => setIsEditing(false)}>
            <Save />
            Save Changes
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Edit />
            Edit Summary
          </Button>
        )}
      </Box>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '5%',
          minHeight: '100%',
          width: '90%',
        }}
      >
        {isEditing ? <SummaryEditor summary={summary} setSummary={setSummary} /> : null}
        <SummaryViewer summary={summary} />
      </Container>
    </Main>
  );
};

export default Summary;
