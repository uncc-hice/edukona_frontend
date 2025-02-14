import { Delete, Edit, Quiz, Summarize } from '@mui/icons-material';
import { Divider, MenuItem } from '@mui/material';
import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import EditRecordingTitleDialog from '../pages/InstructorRecordings/Components/EditRecordingTitleDialog';
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
    </Fragment>
  );
};

export default RecordingListRowMenu;
