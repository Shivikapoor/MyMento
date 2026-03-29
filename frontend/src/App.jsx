import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LoginSignup from "./pages/LoginSignup";
import BookSession from "./pages/BookSession";
import MoodTracker from "./pages/MoodTracker";
import MySchedule from "./pages/MySchedule";
import MyDreams from "./pages/MyDreams";
import CareerGuide from "./pages/CareerGuide";
import ClientHistory from "./pages/ClientHistory";
import Admin from "./pages/Admin";
import CounsellorProfile from "./pages/CounsellorProfile";
import RateSession from "./pages/RateSession";
import Ratings from "./pages/Ratings";
import BreathingCalm from "./pages/BreathingCalm";
import GroundingExercise from "./pages/GroundingExercise";
import TalkSpace from "./pages/TalkSpace";
import CounsellorDashboard from "./pages/CounsellorDashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home / Dashboard */}
        <Route path="/" element={<Home />} />

        {/* Book Session Page */}
        <Route path="/book-session" element={<BookSession />} />
        
        <Route path="/my-appointments" element={<ClientHistory />} />
        
        {/* Auth Pages */}
        <Route path="/login" element={<LoginSignup initialMode="login" />} />
        <Route path="/signup" element={<LoginSignup initialMode="signup" />} />
        <Route path="/LoginSignup" element={<LoginSignup />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route
          path="/mood-tracker"
          element={
            <PrivateRoute>
              <MoodTracker />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-schedule"
          element={
            <PrivateRoute>
              <MySchedule />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-dreams"
          element={
            <PrivateRoute>
              <MyDreams />
            </PrivateRoute>
          }
        />
        <Route
          path="/career-guide"
          element={
            <PrivateRoute>
              <CareerGuide />
            </PrivateRoute>
          }
        />
        <Route
          path="/counsellor-dashboard"
          element={
            <PrivateRoute>
              <CounsellorDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile/" element={<CounsellorProfile />} />
        <Route path="/rate-session" element={<RateSession />} />
        <Route path="/ratings" element={<Ratings />} />
        <Route path="/breathing-calm" element={<BreathingCalm />} />
        <Route path="/grounding-exercise" element={<GroundingExercise />} />
        <Route
          path="/talk-space"
          element={
            <PrivateRoute>
              <TalkSpace />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
