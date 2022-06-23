import React from 'react';
import { Link } from 'react-router-dom';

function Forgot(): React.ReactElement {
  return (
    <React.Fragment>
      <p className='login-box-msg'>You forgot your password? Here you can easily retrieve a new password.</p>
      <div className='input-group mb-3'>
        <input type='email' className='form-control' placeholder='Email' />
        <div className='input-group-append'>
          <div className='input-group-text'>
            <span className='fas fa-envelope' />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-12'>
          <button type='submit' className='btn btn-primary btn-block'>
            Request new password
          </button>
        </div>
      </div>
      <p className='my-1'>
        <Link to='/auth/login'>Login</Link>
      </p>
    </React.Fragment>
  );
}

export default Forgot;
