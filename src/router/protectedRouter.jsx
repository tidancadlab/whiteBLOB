import { Navigate, Outlet } from 'react-router-dom';

import { Button } from 'components/form-field';
import Footer from 'components/Footer';

const ProtectedRouter = () =>
  window.localStorage.getItem('token') ? (
    <>
      <Button className="bg-green-500 text-black m-8" onClick={() => window.history.back()}>
        Back
      </Button>
      <Outlet />
      <Footer />
    </>
  ) : (
    <Navigate to={'/login'} />
  );

export default ProtectedRouter;
