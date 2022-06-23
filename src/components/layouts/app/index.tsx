import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ContentWrapper from './partials/ContentWrapper';
import Controlbar from './partials/Controlbar';
import Footer from './partials/Footer';
import Navbar from './partials/Navbar';
import Sidebar from './partials/Sidebar';

export default function AppLayout() {
  useEffect(() => {
    const body = window.document.querySelector('body');
    if (body) {
      body.classList.add('layout-fixed');
      body.classList.add('layout-navbar-fixed');
      body.classList.add('hold-transition');
      body.classList.add('sidebar-mini');
      body.classList.add('layout-footer-fixed');
      body.classList.add('text-sm');
    }
  }, []);

  return (
    <>
      <div className='wrapper'>
        <Navbar />
        <Sidebar />
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
        <Controlbar />
        <Footer />
      </div>
    </>
  );
}
