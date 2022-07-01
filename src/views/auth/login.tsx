import { FormHelperText } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import MyAdornment from '../../components/control/MyAdornment';
import { useStore } from '../../store/StoreProvider';

function Login(): ReactElement {
  const { auth } = useStore();

  const handleChange = (value: string, name: string) => {
    auth.validate(name as keyof typeof auth.errMsg, value);
    auth.handlePayload({ ...auth.payload, [name]: value });
  };

  const handleLogin = () => {
    auth.handleOK();
  };

  return (
    <>
      <React.Fragment>
        <p className='login-box-msg'>Sign in to start your session</p>
        {/* {router.query['error'] && <p className='text-danger text-center'>Username / Password Salah</p>} */}
        {auth.errorResponse && (
          <div className='text-center mb-2'>
            <FormHelperText error className='text-center'>
              {auth.errorResponse}
            </FormHelperText>
          </div>
        )}
        <div>
          <MyAdornment
            label='Email'
            name='email'
            value={auth.payload.email}
            errMsg={auth.errMsg.email}
            placeholder='Email'
            isPassword={false}
            icon={<span className='fas fa-envelope' />}
            handleChange={handleChange}
          />
          <MyAdornment
            label='Password'
            name='password'
            value={auth.payload.password}
            errMsg={auth.errMsg.password}
            placeholder='Password'
            isPassword
            handleChange={handleChange}
          />
          <div className='row'>
            <div className='col-8'>
              <div className='icheck-primary'>
                <input type='checkbox' id='remember' />
                <label htmlFor='remember' className='ml-2'>
                  Remember Me
                </label>
              </div>
            </div>
            <div className='col-4'>
              <button type='button' className='btn btn-primary btn-block' onClick={handleLogin}>
                Sign In
              </button>
            </div>
          </div>
        </div>
        <p className='my-1'>
          <Link to='/auth/forgot'>I forgot my password</Link>
        </p>
      </React.Fragment>
    </>
  );
}

export default observer(Login);
