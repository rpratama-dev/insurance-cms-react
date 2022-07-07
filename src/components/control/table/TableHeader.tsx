import { Button, Grid, IconButton, TextField, Tooltip } from '@mui/material';

type Props = {
  handleShowForm: () => void;
  handleRefresh: () => void;
  handleChangeKeyword: (value: string, name?: string) => void;
  title?: string;
  searchPlaceholder?: string;
};

export default function TableHeader(props: Props): JSX.Element {
  const { handleShowForm, handleRefresh, ...other } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    other.handleChangeKeyword(value, 'keyword');
  };

  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item>
        <i className='fas fa-search' />
      </Grid>
      <Grid item xs>
        <TextField
          fullWidth
          placeholder={other.searchPlaceholder || 'Search by email address, phone number, or user UID'}
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: 'default' },
          }}
          onChange={handleChange}
          variant='standard'
        />
      </Grid>
      <Grid item>
        <Button onClick={handleShowForm} variant='contained' sx={{ mr: 1 }}>
          {other.title || 'Add New'}
        </Button>
        <Tooltip title='Reload'>
          <IconButton onClick={handleRefresh}>
            <span className='fas fa-sync' />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}
