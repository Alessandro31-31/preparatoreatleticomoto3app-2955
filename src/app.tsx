import RequireAuth from "@/components/RequireAuth";
import RequireAdmin from "@/components/RequireAdmin";
import Billing from "@/pages/billing";
import BillingSuccess from "@/pages/billing-success";
import Calendar from "@/pages/calendar";
import Chat from "@/pages/chat";
import Dashboard from "@/pages/dashboard";
import Home from "@/pages/home";
import PreparationRecovery from "@/pages/preparation";
import ProgressAnalysis from "@/pages/progress";
import RedFlags from "@/pages/red-flags";
import MorningRoutine from "@/pages/routine";
import SessionDetail from "@/pages/session";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import MonitoringTools from "@/pages/tools";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Authentication routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Training routes */}
        <Route
          path="/calendar"
          element={
            <RequireAuth>
              <Calendar />
            </RequireAuth>
          }
        />
        <Route
          path="/session/:week/:day"
          element={
            <RequireAuth>
              <SessionDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/routine"
          element={
            <RequireAuth>
              <MorningRoutine />
            </RequireAuth>
          }
        />
        <Route
          path="/preparation"
          element={
            <RequireAuth>
              <PreparationRecovery />
            </RequireAuth>
          }
        />
        <Route
          path="/tools"
          element={
            <RequireAuth>
              <MonitoringTools />
            </RequireAuth>
          }
        />
        <Route
          path="/progress"
          element={
            <RequireAuth>
              <ProgressAnalysis />
            </RequireAuth>
          }
        />
        <Route
          path="/red-flags"
          element={
            <RequireAuth>
              <RedFlags />
            </RequireAuth>
          }
        />

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
