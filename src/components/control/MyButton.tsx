import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';

interface IProps {
  title: string;
  loading: boolean;
  handleClick: () => void;
}

const MyButton = (props: IProps): React.ReactElement => {
  const { ...prop } = props;
  const [loadingChange, setLoadingChange] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (prop.loading) {
      setSuccess(false);
      setLoadingChange(true);
    }
    if (!prop.loading && loadingChange) {
      setLoadingChange(false);
      setSuccess(true);
    }
  }, [prop.loading]);

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  return (
    <Box sx={{ m: 1, position: 'relative' }}>
      <Button
        variant='contained'
        sx={buttonSx}
        startIcon={<span className='fas fa-save' />}
        disabled={prop.loading}
        onClick={prop.handleClick}
      >
        {prop.title}
      </Button>
      {prop.loading && (
        <CircularProgress
          size={24}
          sx={{
            color: green[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </Box>
  );
};

export default MyButton;
