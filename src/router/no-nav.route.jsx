import Footer from 'components/Footer';
import NavBar from 'components/NavBar';
const { Outlet } = require('react-router-dom');

const NoNavRoute = () => {
  return (
    <>
      <NavBar position="bottom-4" />
      <Outlet />
      <Footer />
    </>
  );
};

export default NoNavRoute;
