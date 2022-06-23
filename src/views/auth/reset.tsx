import React from 'react';
import { Link } from 'react-router-dom';

function Reset(): React.ReactElement {
  return (
    <React.Fragment>
      <p className='login-box-msg'>You are only one step a way from your new password, recover your password now.</p>
      <div className='input-group mb-3'>
        <input type='password' className='form-control' placeholder='Password' />
        <div className='input-group-append'>
          <div className='input-group-text'>
            <span className='fas fa-lock' />
          </div>
        </div>
      </div>
      <div className='input-group mb-3'>
        <input type='password' className='form-control' placeholder='Confirm Password' />
        <div className='input-group-append'>
          <div className='input-group-text'>
            <span className='fas fa-lock' />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <button type='submit' className='btn btn-primary btn-block'>
            Change password
          </button>
        </div>
      </div>
      <p className='my-1'>
        <Link to='/auth/login'>Login</Link>
      </p>
    </React.Fragment>
  );
}

export default Reset;
