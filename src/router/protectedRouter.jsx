import { Link, Navigate, Outlet } from 'react-router-dom';

import Footer from 'components/Footer';

const ProtectedRouter = () =>
  window.localStorage.getItem('token') ? (
    <>
      <div className="flex h-20 justify-center py-4">
        <Link to="/">
          <img className="h-full" src="/img/LOGO_314p.3af9dce3b8ba48029249.png" alt="" />
        </Link>
      </div>
      <Outlet />
      <Footer />
    </>
  ) : (
    <Navigate to={'/login'} />
  );

export default ProtectedRouter;
