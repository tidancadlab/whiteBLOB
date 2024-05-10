import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from 'pages/home';
import NavBar from 'components/NavBar';
import LoginPage from 'pages/login';
import VideoUpload from 'pages/upload';
import PlayerPage from 'pages/player';
import PageNotFound from 'pages/page-not-found';
import Footer from 'components/Footer';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-black">
        <NavBar />
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/login" Component={LoginPage} />
          <Route path="/upload" Component={VideoUpload} />
          <Route path="/watch/:id" Component={PlayerPage} />
          <Route path="/*" Component={PageNotFound} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
