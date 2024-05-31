import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import { useIsOnline } from 'hooks/useCheckNetwork';
import { StorageContext } from 'storage';
import ProtectedRouter from 'router/protectedRouter';
import CustomRoute from 'router/customRoute';
import LoadingComponent from 'components/loadingComponent';
import NoNavRoute from 'router/no-nav.route';
import UserProfile from 'pages/user-profile';
import RegisterPage from 'pages/register';

const HomePage = lazy(() => import('pages/home'));
const VideoUpload = lazy(() => import('pages/upload'));
const PlayerPage = lazy(() => import('pages/player'));
const PageNotFound = lazy(() => import('pages/page-not-found'));
const LoginPage = lazy(() => import('pages/login'));
const MoviesPage = lazy(() => import('pages/movies'));
const ShowsPage = lazy(() => import('pages/shows'));

function App() {
  const isOnline = useIsOnline();
  const [allVideoList, setAllVideoList] = useState([]);

  return (
    <StorageContext.Provider
      value={{
        isOnline,
        allVideoList,
        setAllVideoList,
      }}>
      <BrowserRouter>
        <Suspense fallback={<LoadingComponent />}>
          <div className="flex min-h-screen flex-col bg-black">
            <Routes>
              <Route path="/" element={<CustomRoute />}>
                <Route exact path="/" element={<HomePage />} />
                <Route exact path="/movie" element={<MoviesPage />} />
                <Route exact path="/family" element={<ShowsPage />} />
                <Route exact path="/login" element={<LoginPage />} />
                <Route exact path="/register" element={<RegisterPage />} />
                <Route path="/user">
                  <Route path="/user/profile" element={<UserProfile />} />
                </Route>
                <Route exact path="/page-not-found" element={<PageNotFound />} />
              </Route>
              <Route path="/" element={<NoNavRoute />}>
                <Route path="/watch/:id" element={<PlayerPage />} />
              </Route>
              <Route path="/" element={<ProtectedRouter />}>
                <Route path="/upload" element={<VideoUpload />} />
              </Route>
              <Route path="/*" element={<Navigate to={'/page-not-found'} />} />
            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
    </StorageContext.Provider>
  );
}
export default App;
