import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/header/Header';

function App() {
  return (
    <>
      <Header />
      <div className="container my-4">
        <Outlet />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
