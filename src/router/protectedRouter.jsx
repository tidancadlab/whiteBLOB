import { Navigate, Outlet } from 'react-router-dom';

import { Button } from 'components/form-field';
import Footer from 'components/Footer';

const ProtectedRouter = () =>
  window.localStorage.getItem('token') ? (
    <div className="m-4">
      <Button className="bg-green-500 text-black" onClick={() => window.history.back()}>
        Back
      </Button>
      <Outlet />
      <Footer />
    </div>
  ) : (
    <Navigate to={'/login'} />
  );

export default ProtectedRouter;
