import { lazy } from 'react';
import { Outlet } from 'react-router-dom';

const NavBar = lazy(() => import('components/NavBar'));
const Footer = lazy(() => import('components/Footer'));


const CustomRoute = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default CustomRoute;
