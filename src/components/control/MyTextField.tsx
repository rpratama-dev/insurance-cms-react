import { TextField } from '@mui/material';
import React from 'react';

interface IProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  maxLength?: number;
  errMsg?: string;
  handleChange: (value: string, name: string) => void;
}

const MyTextField = (props: IProps): React.ReactElement => {
  const { ...prop } = props;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let { value } = event.target;
    if (prop.maxLength) {
      if (value.length > prop.maxLength) value = prop.value;
    }
    prop.handleChange(value, prop.name);
  };

  return (
    <TextField
      size="small"
      label={prop.label}
      placeholder={prop.placeholder || prop.label}
      value={prop.value}
      onChange={handleChange}
      disabled={prop.disabled || false}
      fullWidth
      multiline={prop.multiline || false}
      rows={prop.multiline ? 2 : 1}
      error={!!prop.errMsg}
      helperText={prop.errMsg}
    />
  );
};

export default MyTextField;
