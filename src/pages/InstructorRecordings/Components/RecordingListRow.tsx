import { Box, Button, TableCell, TableRow } from '@mui/material';
import React, { useState } from 'react';
import RecordingListRowMenu from '../../../blocks/RecordingListRowMenu';
import { Recording } from '../../../types/edukonaTypes';
import AccordionQuizzes from './AccordionQuizzes';
import RecordingDuration from './RecordingDuration';

const RecordingListRow = ({ recording, onUpdate }: { recording: Recording; onUpdate: () => void }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <React.Fragment key={recording.id}>
      {/* --- Row 1: Recording Info --- */}
      <TableRow sx={{ cursor: 'default' }}>
        <TableCell align="center" sx={{ width: '30%' }}>
          <Box textAlign="center">
            <Button
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {recording.title === '' ? recording.id.substring(0, 7) + '...' : recording.title}
            </Button>
          </Box>
        </TableCell>
        <TableCell align="center" sx={{ width: '20%' }}>
          {new Date(recording.uploaded_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </TableCell>
        <TableCell align="center" sx={{ width: '15%' }}>
          <RecordingDuration duration={recording.duration} />
        </TableCell>
        <TableCell align="center" sx={{ width: '15%' }}>
          <Box
            component="span"
            sx={{
              width: 16,
              height: 16,
              display: 'inline-block',
              borderRadius: '50%',
              bgcolor: recording.transcript.toLowerCase() === 'completed' ? 'green' : 'red',
              marginRight: 1,
            }}
          />
          {recording.transcript.charAt(0).toUpperCase() + recording.transcript.slice(1)}
        </TableCell>
        <TableCell align="center" sx={{ width: '10%' }}>
          <Box textAlign="center">
            <RecordingListRowMenu recording={recording} onUpdate={onUpdate} />
          </Box>
        </TableCell>
      </TableRow>

      {/* --- Row 2: Accordion for Quizzes (only if expanded) --- */}
      {expanded && (
        <TableRow>
          <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
            <AccordionQuizzes recordingId={recording.id} expanded={expanded} />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

export default RecordingListRow;
