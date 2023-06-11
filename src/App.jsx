import { Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage/LandingPage";
import Navbar from "./components/Navbar/Navbar";
import MentionsLegales from "./components/Mentions Legales/MentionsLegales";
import About from "./components/About/About";
import Project from "./components/About/Project/Project";
import Teams from "./components/About/Teams/Teams";
import Research from "./components/About/Research/Research";
import Publications from "./components/About/Publications/Publications";
import Login from "./components/Login/Login";
import Explore from "./components/Explore/Explore";
import Elections from "./components/Explore/Elections/Elections";
import Geography from "./components/Explore/Geography/Geography";
import Themes from "./components/Explore/Themes/Themes";
import Maps from "./components/Maps/Maps";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/legal" element={<MentionsLegales />} />

        <Route path="/about" element={<About />} />
        <Route path="/about/project" element={<Project />} />
        <Route path="/about/teams" element={<Teams />} />
        <Route path="/about/research" element={<Research />} />
        <Route path="/about/publications" element={<Publications />} />

        <Route path="/login" element={<Login />} />

        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/elections" element={<Elections />} />
        <Route path="/explore/geography" element={<Geography />} />
        <Route path="/explore/themes" element={<Themes />} />

        <Route path="/maps" element={<Maps />} />
      </Routes>
    </>
  );
}

export default App;
