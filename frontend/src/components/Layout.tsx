import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <NavBar />
      <main style={{ minHeight: 'calc(100vh - 60px)', paddingTop: '60px' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;