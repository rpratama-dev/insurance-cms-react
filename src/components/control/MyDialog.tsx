import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { FormConfig } from '../../types/default';
import { DialogActions, DialogContent, DialogTitle, Dialog, Button } from '@mui/material';
import MyButton from './MyButton';

export interface ConfirmationDialogRawProps extends FormConfig {
  children: React.ReactElement;
}

function MyDialog(props: ConfirmationDialogRawProps) {
  const { handleClose, handleOK, open, ...other } = props;
  const radioGroupRef = React.useRef<HTMLElement>(null);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '100%' } }}
      maxWidth='sm'
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      title={other.title}
    >
      <DialogTitle borderBottom={0}>{props.title}</DialogTitle>
      {handleClose ? (
        <IconButton
          aria-label='close'
          onClick={() => handleClose()}
          disabled={other.loading}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <span className='fas fa-times' />
        </IconButton>
      ) : null}
      <DialogContent dividers title='test'>
        {other.children}
      </DialogContent>
      <DialogActions>
        <Button autoFocus className='text-danger' disabled={other.loading} onClick={handleClose}>
          Cancel
        </Button>
        <MyButton title='Save' loading={other.loading || false} handleClick={handleOK} />
      </DialogActions>
    </Dialog>
  );
}

export default MyDialog;
