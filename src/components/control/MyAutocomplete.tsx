import { Autocomplete, TextField } from '@mui/material';
import React from 'react';

type TOption = { label: string; value: string | number };

interface IProps {
  label: string;
  name: string;
  value: string | number | null;
  options: Array<TOption>;
  disabled?: boolean;
  errMsg?: string;
  handleChange: (value: TOption | null, name: string) => void;
}

const MyAutocomplete = (props: IProps): React.ReactElement => {
  const { ...prop } = props;

  return (
    <Autocomplete
      disablePortal
      size="small"
      options={prop.options}
      value={prop.options.find((el) => el.value === prop.value) || null}
      onChange={(_, value) => prop.handleChange(value, prop.name)}
      renderInput={(params) => (
        <TextField {...params} error={!!prop.errMsg} helperText={prop.errMsg} label={prop.label} />
      )}
      fullWidth
      className="w-100"
      disabled={prop.disabled || false}
    />
  );
};

export default MyAutocomplete;
