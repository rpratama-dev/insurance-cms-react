import React from 'react';
import { Grid } from '@mui/material';
import MyDialog from '../../control/MyDialog';
import { observer } from 'mobx-react-lite';
import { FormConfig } from '../../../types/default';
import { useStore } from '../../../store/StoreProvider';
import MyTextField from '../../control/MyTextField';
import MyAutocomplete from '../../control/MyAutocomplete';
import MyCheckBox from '../../control/MyCheckBox';
import Joi from 'joi';

type IProps = FormConfig;

function FormInputResource(props: IProps) {
  const { handleOK, handleClose, ...other } = props;
  const { resourceStore } = useStore();
  const { payload, errMsg, schema, parentList } = resourceStore;

  const validate = (field: keyof typeof errMsg, value: any) => {
    const newErrMsg = { ...errMsg, [field]: '' };
    let newSchema = schema[field];
    let temp: any = value;
    if (['parent_id', 'is_parent'].includes(field)) {
      temp = {
        is_parent: field === 'is_parent' ? value : payload.is_parent,
        parent_id: field === 'parent_id' ? value : payload.parent_id,
      };
      newErrMsg.is_parent = '';
      newErrMsg.parent_id = '';
      newSchema = Joi.object().keys({ is_parent: schema.is_parent, parent_id: schema.parent_id });
    }
    const validator = newSchema.validate(temp);
    validator.error?.details.forEach((el) => {
      newErrMsg[(el.path[0] || field) as keyof typeof errMsg] = el.message || '';
    });
    resourceStore.setErrMsg(newErrMsg);
  };

  const handleChange = (value: React.Key | boolean | null, name: string) => {
    const field = name as keyof typeof payload;
    const newPayload = { ...resourceStore.payload, [name]: value };

    switch (field) {
      case 'is_parent': {
        newPayload.parent_id = 0;
        break;
      }
      case 'parent_id': {
        newPayload[field] = +(value || 0);
        break;
      }
      case 'code': {
        const match = value ? String(value).match(/^[a-zA-Z0-9-_]+$/) : true;
        if (!match) {
          value = payload.code;
          newPayload[field] = value;
        }
        break;
      }
      default:
        break;
    }
    resourceStore.setPayload(newPayload);
    validate(field, value);
  };

  return (
    <React.Fragment>
      <MyDialog
        open={props.open}
        loading={other.loading}
        handleClose={handleClose}
        title={props.title}
        description={props.description}
        handleOK={handleOK}
      >
        <Grid container spacing={2}>
          <Grid item md={12}>
            <MyCheckBox
              label='Is parent'
              name='is_parent'
              checked={payload.is_parent}
              handleChange={(val, name) => handleChange(val.checked, name)}
            />
          </Grid>
          <Grid item md={12}>
            <MyAutocomplete
              label='Parent'
              name='parent_id'
              value={payload.parent_id}
              errMsg={errMsg.parent_id}
              disabled={payload.is_parent}
              options={parentList}
              handleChange={(value, name) => handleChange(value?.value || null, name)}
            />
          </Grid>
          <Grid item md={12}>
            <MyTextField
              label='Resource Code'
              name='code'
              value={payload.code}
              errMsg={errMsg.code}
              handleChange={handleChange}
              maxLength={30}
            />
          </Grid>
          <Grid item md={12}>
            <MyTextField
              label='Name ID'
              name='name_id'
              value={payload.name_id}
              errMsg={errMsg.name_id}
              handleChange={handleChange}
              maxLength={50}
            />
          </Grid>
          <Grid item md={12}>
            <MyTextField
              label='Name EN'
              name='name_en'
              value={payload.name_en}
              errMsg={errMsg.name_en}
              handleChange={handleChange}
              maxLength={50}
            />
          </Grid>
          <Grid item md={12}>
            <MyTextField
              label='Description'
              name='description'
              value={payload.description}
              errMsg={errMsg.description}
              handleChange={handleChange}
              maxLength={255}
              multiline
            />
          </Grid>
        </Grid>
      </MyDialog>
    </React.Fragment>
  );
}

export default observer(FormInputResource);
