import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <React.Fragment>
      <div className='hold-transition login-page'>
        <div className='login-box'>
          <div className='card card-outline card-primary'>
            <div className='card-header text-center'>
              <Link to='/' className='h1'>
                <b>Admin</b>CMS
              </Link>
            </div>
            <div className='card-body'>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AuthLayout;
