import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageNotFound from "./component/pageNotFounf";
import NavBar from "./component/NavBar";
import HomePage from "./Pages/Home";
import PlayerPage from "./Pages/PlayerPage";
import Footer from "./component/Footer";
import LoginPage from "./Pages/LoginPage";
import SpeedTest from "./Pages/SpeedTest";
import VideoUpload from "./Pages/UploadPage/index";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-black">
        <NavBar />
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/login" Component={LoginPage} />
          <Route path="/upload" Component={VideoUpload} />
          <Route path="/watch/:id" Component={PlayerPage} />
          <Route path="/speed" Component={SpeedTest} />
          <Route path="/*" Component={PageNotFound} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
