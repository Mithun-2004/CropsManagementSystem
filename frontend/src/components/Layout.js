import React from 'react';
import Header from './Header';
import AllUsersButton from '../components/AllUsersButton';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      {children}
      <AllUsersButton />
    </div>
  );
};

export default Layout;
