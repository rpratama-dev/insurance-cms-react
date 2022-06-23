import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { ReactElement, useState } from 'react';

type Props = {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  isPassword: boolean;
  errMsg?: string;
  icon?: ReactElement;
  handleChange: (value: string, name: string) => void;
};

function MyAdornment(params: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    params.handleChange(value, params.name);
  };

  return (
    <FormControl sx={{ m: 1, width: '100%' }} className='mx-0' variant='outlined'>
      <InputLabel htmlFor={params.name} className='MyApp'>
        {params.label}
      </InputLabel>
      <OutlinedInput
        id={params.name}
        type={showPassword || !params.isPassword ? 'text' : 'password'}
        value={params.value}
        onChange={handleChange}
        size='small'
        error={!!params.errMsg}
        fullWidth
        endAdornment={
          <InputAdornment position='end'>
            {params.isPassword ? (
              <IconButton
                aria-label='toggle password visibility'
                onClick={params.isPassword ? handleClickShowPassword : undefined}
                className='p-0'
                // onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showPassword ? (
                  <span className='fas fa-eye fa-xs pr-2' />
                ) : (
                  <span className='fas fa-eye-slash fa-xs pr-2' />
                )}
              </IconButton>
            ) : (
              params.icon || null
            )}
          </InputAdornment>
        }
        label={params.label}
      />
      {params.errMsg && <FormHelperText error>{params.errMsg}</FormHelperText>}
    </FormControl>
  );
}

export default MyAdornment;
