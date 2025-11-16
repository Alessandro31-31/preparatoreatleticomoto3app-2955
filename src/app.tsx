import RequireAuth from "@/components/RequireAuth";
import RequireAdmin from "@/components/RequireAdmin";
import MobileLayout from "@/components/MobileLayout";
import Billing from "@/pages/billing";
import BillingSuccess from "@/pages/billing-success";
import Chat from "@/pages/chat";
import Dashboard from "@/pages/dashboard";
import Home from "@/pages/home";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import Calendar from "@/pages/calendar";
import Routine from "@/pages/routine";
import Tools from "@/pages/tools";
import Preparation from "@/pages/preparation";
import RedFlags from "@/pages/red-flags";
import Progressions from "@/pages/progressions";
import Progress from "@/pages/progress";
import Profile from "@/pages/profile";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (no mobile layout) */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes with mobile layout */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <MobileLayout>
                <Home />
              </MobileLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/calendar"
          element={
            <RequireAuth>
              <MobileLayout>
                <Calendar />
              </MobileLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/routine"
          element={
            <RequireAuth>
              <MobileLayout>
                <Routine />
              </MobileLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/tools"
          element={
            <RequireAuth>
              <MobileLayout>
                <Tools />
              </MobileLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/preparation"
          element={
            <RequireAuth>
              <MobileLayout>
                <Preparation />
              </MobileLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/red-flags"
          element={
            <RequireAuth>
              <MobileLayout>
                <RedFlags />
              </MobileLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/progressions"
          element={
            <RequireAuth>
              <MobileLayout>
                <Progressions />
              </MobileLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/progress"
          element={
            <RequireAuth>
              <MobileLayout>
                <Progress />
              </MobileLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <MobileLayout>
                <Profile />
              </MobileLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/chat"
          element={
            <RequireAuth>
              <MobileLayout>
                <Chat />
              </MobileLayout>
            </RequireAuth>
          }
        />

        {/* Billing routes */}
        <Route
          path="/billing"
          element={
            <RequireAuth>
              <MobileLayout>
                <Billing />
              </MobileLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/billing/success"
          element={
            <RequireAuth>
              <MobileLayout>
                <BillingSuccess />
              </MobileLayout>
            </RequireAuth>
          }
        />

        {/* Admin Dashboard (no mobile layout) */}
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
