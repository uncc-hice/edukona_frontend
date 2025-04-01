import { Delete, Download, Edit, Quiz, Summarize, SwapHoriz } from '@mui/icons-material';
import MusicVideoIcon from '@mui/icons-material/MusicVideo';
import { Divider, MenuItem } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ChangeRecordingCourseDialog from '../pages/InstructorRecordings/Components/ChangeRecordingCourseDialog';
import EditRecordingTitleDialog from '../pages/InstructorRecordings/Components/EditRecordingTitleDialog';
import { getTranscript, downloadRecording } from '../services/apiService';
import { generateSummary } from '../services/lambdaService';
import { Recording } from '../types/edukonaTypes';
import DeleteRecordingDialog from './DeleteRecordingDialog';
import GenericMenu from './GenericMenu';
import NewQuizDialog from './NewQuizDialog';

interface RecordingListRowMenuProps {
  recording: Recording;
  onUpdate(): void;
}

const RecordingListRowMenu = (props: RecordingListRowMenuProps) => {
  const [editTitleOpen, setEditTitleOpen] = useState(false);
  const [createQuizOpen, setCreateQuizOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [changeCourseOpen, setChangeCourseOpen] = useState(false);

  const handleGenerateSummary = () => {
    toast
      .promise(
        generateSummary(props.recording.id)
          .then((res) => console.log(`Summary generated: ${res.data}`))
          .catch((err) => {
            console.error('Error generating summary:', err);
          }),
        {
          pending: 'Generating summary...',
          success: 'Summary generated successfully!',
          error: 'Failed to generate summary.',
        }
      )
      .catch((err) => console.error(err));
  };

  const handleGetTranscript = async () => {
    try {
      const transcriptResponse = await getTranscript(props.recording.id);
      const transcriptBlob = new Blob([transcriptResponse.data.transcript], { type: 'text/plain' });

      const transcriptFilename = '[Transcript] ' + (props.recording.title || 'Recording') + '.txt';

      const downloadUrl = URL.createObjectURL(transcriptBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = transcriptFilename;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error getting transcript:', err);
      toast.error('Failed to get transcript.');
    }
  };

  const handleDownloadRecording = async () => {
    const theme = localStorage.getItem('themeMode') || 'light';
    try {
      toast.loading('Downloading...', { autoClose: false, toastId: 'download-toast', theme });

      const recordingResponse = await downloadRecording(props.recording.id);
      const recordingBlob = recordingResponse.data;
      const extension = recordingResponse.headers?.['content-type']?.split('/')[1] || 'webm';
      const recordingFilename = '[Recording] ' + (props.recording.title || 'Recording') + '.' + extension;

      const downloadUrl = URL.createObjectURL(recordingBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = recordingFilename;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(downloadUrl);
      toast.dismiss('download-toast');
      toast.success('Download complete!', { theme });
    } catch (err) {
      console.error('Error downloading recording:', err);
      toast.dismiss('download-toast');
      toast.error('Failed to download recording.', { theme });
    }
  };

  return (
    <Fragment>
      <GenericMenu isOpen={openMenu} setIsOpen={setOpenMenu} title="Actions">
        <MenuItem
          onClick={() => {
            setCreateQuizOpen(true);
            setOpenMenu(false);
          }}
          disableRipple
        >
          <Quiz /> Create and Start Quiz
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleGenerateSummary();
            setOpenMenu(false);
          }}
          disableRipple
        >
          <Summarize /> Generate Summary
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleGetTranscript();
            setOpenMenu(false);
          }}
          disableRipple
        >
          <Download /> Download Transcript
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDownloadRecording();
            setOpenMenu(false);
          }}
          disableRipple
        >
          <MusicVideoIcon /> Download Recording
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            setEditTitleOpen(true);
            setOpenMenu(false);
          }}
          disableRipple
        >
          <Edit /> Edit Title
        </MenuItem>
        <MenuItem
          onClick={() => {
            setChangeCourseOpen(true);
            setOpenMenu(false);
          }}
          disableRipple
        >
          <SwapHoriz /> Change Course
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeleteOpen(true);
            setOpenMenu(false);
          }}
          disableRipple
        >
          <Delete /> Delete Recording
        </MenuItem>
      </GenericMenu>
      <NewQuizDialog open={createQuizOpen} setOpen={setCreateQuizOpen} recordingId={props.recording.id} />
      <DeleteRecordingDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onUpdate={props.onUpdate}
        recordingId={props.recording.id}
      />
      <EditRecordingTitleDialog
        open={editTitleOpen}
        setOpen={setEditTitleOpen}
        recordingId={props.recording.id}
        onUpdate={props.onUpdate}
        currentTitle={props.recording.title}
      />
      <ChangeRecordingCourseDialog
        open={changeCourseOpen}
        setOpen={setChangeCourseOpen}
        recording_id={props.recording.id}
        course_id={props.recording.course_id}
        onUpdate={props.onUpdate}
      />
    </Fragment>
  );
};

export default RecordingListRowMenu;
