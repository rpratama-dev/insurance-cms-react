import React from 'react';
import { Button, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { GridSearchIcon } from '@mui/x-data-grid';
import MyTable from '../../../components/control/MyTable';
import FormInputResource from '../../../components/display/resources/FormInputResource';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store/StoreProvider';

type Timeouts = {
  fetchIndex: any;
};

const timeouts: Timeouts = {
  fetchIndex: 0,
};

function Resource(): React.ReactElement {
  const { resourceStore } = useStore();

  React.useEffect(() => {
    if (timeouts.fetchIndex) clearTimeout(timeouts.fetchIndex);
    timeouts.fetchIndex = setTimeout(() => {
      resourceStore.getAll();
    }, 1000);
  }, []);

  const handleRefresh = async () => {
    await resourceStore.getAll();
  };

  const handleClickListItem = () => {
    resourceStore.handleOpen('formResource');
  };

  return (
    <>
      <div className='card card-default'>
        <div className='card-header'>
          <Grid container spacing={2} alignItems='center'>
            <Grid item>
              <GridSearchIcon color='inherit' sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder='Search by email address, phone number, or user UID'
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 'default' },
                }}
                variant='standard'
              />
            </Grid>
            <Grid item>
              <Button onClick={handleClickListItem} variant='contained' sx={{ mr: 1 }}>
                Add New
              </Button>
              <Tooltip title='Reload'>
                <IconButton onClick={handleRefresh}>
                  <span className='fas fa-sync' />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </div>
        <div className='card-body'>
          <MyTable />
        </div>
        <div className='card-footer'>
          Visit <a href='https://www.dropzonejs.com'>dropzone.js documentation</a> for more examples and information
          about the plugin.
        </div>
      </div>

      <FormInputResource {...resourceStore.formConfig} />
    </>
  );
}

export default observer(Resource);
