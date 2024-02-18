import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import PageNotFound from './component/pageNotFounf';
import NavBar from './component/NavBar';
import HomePage from './Pages/Home';
import PlayerPage from './Pages/PlayerPage';
import Footer from './component/Footer';
import LoginPage from './Pages/LoginPage';
import SpeedTest from './Pages/SpeedTest';
import VideoUpload from './Pages/UploadPage/index';


function App() {
  return (
    <BrowserRouter>
      <div className='h-screen flex flex-col bg-black'>
        <NavBar />
        <Routes>
          <Route path='/' Component={HomePage} />
          <Route path='/*' Component={
            PageNotFound
          } />
          <Route path='/login' Component={LoginPage} />
          <Route path='/upload' Component={VideoUpload} />
          <Route path='/player/:videoId' Component={PlayerPage} />
          <Route path='/speed' Component={SpeedTest} />
        </Routes>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;
