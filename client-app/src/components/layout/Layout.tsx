import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '../common/Header';

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <Box component="main">
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;