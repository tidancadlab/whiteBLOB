import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Player from './component/Player';
import PageNotFound from './component/pageNotFounf';
import NavBar from './component/NavBar';
import HomePage from './Pages/Home';


function App() {
  return (
    <BrowserRouter>
      <div >
        {/* <NavFile /> */}
        <Routes>
          <Route path='/' Component={Home} />
          <Route path='/*' Component={
            PageNotFound
          } />
          <Route path='/player/*' Component={Player} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

function Home() {
  return (
    <>
      <NavBar/>
      <HomePage />
    </>
  )
}