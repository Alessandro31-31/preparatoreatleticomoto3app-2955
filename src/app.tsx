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

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

// Moto3 App Pages - Lazy loaded for better performance
const Moto3Home = lazy(() => import("@/pages/moto3/home"));
const Moto3Calendar = lazy(() => import("@/pages/moto3/calendar-full"));
const Moto3Readiness = lazy(() => import("@/pages/moto3/readiness"));
const Moto3Progress = lazy(() => import("@/pages/moto3/progress"));
const VirtualCoach = lazy(() => import("@/pages/moto3/virtual-coach"));
const LapSimulator = lazy(() => import("@/pages/moto3/lap-simulator"));
const MentalTraining = lazy(() => import("@/pages/moto3/mental-training"));
const NutritionDiary = lazy(() => import("@/pages/moto3/nutrition"));
const VideoAnalysis = lazy(() => import("@/pages/moto3/video-analysis"));
const BikeSetup = lazy(() => import("@/pages/moto3/bike-setup"));
const Achievements = lazy(() => import("@/pages/moto3/achievements"));
const Warmup = lazy(() => import("@/pages/moto3/warmup"));
const Cooldown = lazy(() => import("@/pages/moto3/cooldown"));
const Stretching = lazy(() => import("@/pages/moto3/stretching"));
const FoamRolling = lazy(() => import("@/pages/moto3/foam-rolling"));
const Mobility = lazy(() => import("@/pages/moto3/mobility"));
const MorningRoutine = lazy(() => import("@/pages/moto3/morning-routine"));
const Timer = lazy(() => import("@/pages/moto3/timer"));
const ACRCalculator = lazy(() => import("@/pages/moto3/acr-calculator"));
const LoadTracker = lazy(() => import("@/pages/moto3/load-tracker"));
const QuickReference = lazy(() => import("@/pages/moto3/quick-reference"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
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
        <Route path="/moto3/morning-routine" element={<MorningRoutine />} />
        <Route path="/moto3/warmup" element={<Warmup />} />
        <Route path="/moto3/cooldown" element={<Cooldown />} />
        <Route path="/moto3/stretching" element={<Stretching />} />
        <Route path="/moto3/foam-rolling" element={<FoamRolling />} />
        <Route path="/moto3/mobility" element={<Mobility />} />

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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
