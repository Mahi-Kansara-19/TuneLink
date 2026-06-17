import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Artists from "./pages/Artists";
import CreateProject from "./pages/CreateProject";
import AIMatch from "./pages/AIManager";


import CollabBoard from "./pages/CollabBoard";
import ProjectRoom from "./pages/ProjectRoom";
import Subscription from "./pages/Subscription";
import AdminDashboard from "./pages/AdminDashboard";
import ArtistProfile from "./pages/ArtistProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

  
        <Route path="/profile" element={<Profile />} />
        <Route path="/artists" element={<Artists />} />

        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/collab-board" element={<CollabBoard />} />
        <Route path="/project/:id" element={<ProjectRoom />} />

        <Route path="/subscription" element={<Subscription />} />

        <Route path="/ai-match" element={<AIMatch />} />
        <Route path="/admin" element={<AdminDashboard />} />
   <Route path="/artists/:id" element={<ArtistProfile />} />
<Route path="/artists/:name/:id" element={<ArtistProfile />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;