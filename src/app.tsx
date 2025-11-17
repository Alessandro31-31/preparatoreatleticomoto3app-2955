import RequireAuth from "@/components/RequireAuth";
import RequireAdmin from "@/components/RequireAdmin";
import Billing from "@/pages/billing";
import BillingSuccess from "@/pages/billing-success";
import Chat from "@/pages/chat";
import Dashboard from "@/pages/dashboard";
import Home from "@/pages/home";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import TrainingCalendar from "@/pages/calendar";
import MonitoringTools from "@/pages/tools";
import MorningRoutine from "@/pages/routine";

// Moto3 App Pages
import Moto3Home from "@/pages/moto3/home";
import Moto3Calendar from "@/pages/moto3/calendar-full";
import Moto3Readiness from "@/pages/moto3/readiness";
import Moto3Progress from "@/pages/moto3/progress";
import VirtualCoach from "@/pages/moto3/virtual-coach";
import LapSimulator from "@/pages/moto3/lap-simulator";
import MentalTraining from "@/pages/moto3/mental-training";
import NutritionDiary from "@/pages/moto3/nutrition";
import VideoAnalysis from "@/pages/moto3/video-analysis";
import BikeSetup from "@/pages/moto3/bike-setup";
import Achievements from "@/pages/moto3/achievements";
import Warmup from "@/pages/moto3/warmup";
import Cooldown from "@/pages/moto3/cooldown";
import Timer from "@/pages/moto3/timer";
import ACRCalculator from "@/pages/moto3/acr-calculator";
import LoadTracker from "@/pages/moto3/load-tracker";
import QuickReference from "@/pages/moto3/quick-reference";

import { BrowserRouter, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Moto3 App - Main Routes */}
        <Route path="/" element={<Moto3Home />} />
        <Route path="/moto3" element={<Moto3Home />} />
        <Route path="/moto3/calendar" element={<Moto3Calendar />} />
        <Route path="/moto3/readiness" element={<Moto3Readiness />} />
        <Route path="/moto3/progress" element={<Moto3Progress />} />

        {/* Moto3 Tools */}
        <Route path="/moto3/virtual-coach" element={<VirtualCoach />} />
        <Route path="/moto3/lap-simulator" element={<LapSimulator />} />
        <Route path="/moto3/mental-training" element={<MentalTraining />} />
        <Route path="/moto3/nutrition" element={<NutritionDiary />} />
        <Route path="/moto3/video-analysis" element={<VideoAnalysis />} />
        <Route path="/moto3/bike-setup" element={<BikeSetup />} />
        <Route path="/moto3/achievements" element={<Achievements />} />

        {/* Moto3 Preparation & Recovery */}
        <Route path="/moto3/warmup" element={<Warmup />} />
        <Route path="/moto3/cooldown" element={<Cooldown />} />

        {/* Moto3 Professional Tools */}
        <Route path="/moto3/timer" element={<Timer />} />
        <Route path="/moto3/acr-calculator" element={<ACRCalculator />} />
        <Route path="/moto3/load-tracker" element={<LoadTracker />} />
        <Route path="/moto3/quick-reference" element={<QuickReference />} />

        {/* Original Tools Pages */}
        <Route path="/calendar" element={<TrainingCalendar />} />
        <Route path="/tools" element={<MonitoringTools />} />
        <Route path="/routine" element={<MorningRoutine />} />

        {/* Authentication routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Billing routes */}
        <Route
          path="/billing"
          element={
            <RequireAuth>
              <Billing />
            </RequireAuth>
          }
        />
        <Route
          path="/billing/success"
          element={
            <RequireAuth>
              <BillingSuccess />
            </RequireAuth>
          }
        />

        {/* Chat routes */}
        <Route
          path="/chat"
          element={
            <RequireAuth>
              <Chat />
            </RequireAuth>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Dashboard />
            </RequireAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
