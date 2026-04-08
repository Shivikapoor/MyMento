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
import EmptyMind from "./pages/EmptyMind";
import AmbientPlayer from "./pages/AmbientPlayer";
import ResetAfterWork from "./pages/ResetAfterWork";
import OverthinkingStopper from "./pages/OverthinkingStopper";
import MoodBooster from "./pages/MoodBooster";
import SleepHelp from "./pages/SleepHelp";
import FiveMinuteReset from "./pages/FiveMinuteReset";
import DailyMentalReset from "./pages/DailyMentalReset";
import PrivateRoute from "./components/PrivateRoute";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
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
        <Route path="/empty-your-mind" element={<EmptyMind />} />
        <Route path="/calm-music-sounds" element={<AmbientPlayer />} />
        <Route path="/guided-reset-after-work" element={<ResetAfterWork />} />
        <Route path="/overthinking-stopper" element={<OverthinkingStopper />} />
        <Route path="/mood-booster" element={<MoodBooster />} />
        <Route path="/sleep-help" element={<SleepHelp />} />
        <Route path="/five-minute-reset" element={<FiveMinuteReset />} />
        <Route path="/daily-mental-reset" element={<DailyMentalReset />} />
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
    </ThemeProvider>
  );
}

export default App;
