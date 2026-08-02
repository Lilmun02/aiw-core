import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Categories from "./components/Categories.jsx";
import FeaturedTools from "./components/FeaturedTools.jsx";
import FeedbackForm from "./components/FeedbackForm.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Navbar from "./components/Navbar.jsx";
import NotificationPrompt from "./components/NotificationPrompt.jsx";
import SearchBar from "./components/SearchBar.jsx";
import SubmitTool from "./components/SubmitTool.jsx";
import { supabase } from "./lib/supabase.js";

const AdminNotifications = lazy(() => import("./pages/AdminNotifications.jsx"));
const FounderHome = lazy(() => import("./pages/FounderHome.jsx"));
const FounderOperations = lazy(() => import("./pages/FounderOperations.jsx"));
const FounderSupport = lazy(() => import("./pages/FounderSupport.jsx"));
const FounderSupportCancel = lazy(() => import("./pages/FounderSupportCancel.jsx"));
const FounderSupportSuccess = lazy(() => import("./pages/FounderSupportSuccess.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));

function LoadingScreen({ message = "Loading AIWCORE..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070d1a] text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
        <p className="text-slate-300">{message}</p>
      </div>
    </div>
  );
}

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  function resetHome() {
    setSearchTerm("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      <Navbar onLogoClick={resetHome} />
      <main className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-12">
        <div id="home"><Header /><SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /></div>
        <div id="categories"><Categories setSearchTerm={setSearchTerm} /></div>
        <div id="featured"><FeaturedTools searchTerm={searchTerm} /></div>
        <SubmitTool />
      </main>
      <Footer />
    </div>
  );
}

function SubmitToolPage() {
  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      <Navbar onLogoClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
      <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-8 sm:px-8 lg:px-12"><SubmitTool /></main>
      <Footer />
    </div>
  );
}

function FeedbackPage() {
  return <div className="min-h-screen bg-[#070d1a] text-white"><main className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8"><FeedbackForm /></main></div>;
}

function ProtectedRoute({ children, redirectTo = "/login" }) {
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => { if (isMounted) setSession(data.session); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => { if (isMounted) setSession(currentSession); });
    return () => { isMounted = false; subscription.unsubscribe(); };
  }, []);
  if (session === undefined) return <LoadingScreen />;
  if (!session) return <Navigate to={redirectTo} replace />;
  return children;
}

function LazyRoute({ children }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}

function App() {
  useEffect(() => {
    let isMounted = true;
    const checkedUsers = new Set();
    async function checkInUser(currentSession) {
      const userId = currentSession?.user?.id;
      if (!userId || checkedUsers.has(userId)) return;
      checkedUsers.add(userId);
      const { error } = await supabase.rpc("check_in_user_streak");
      if (!isMounted) return;
      if (error) { checkedUsers.delete(userId); console.error("Automatic streak check-in failed:", error.message); }
    }
    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) console.error("Unable to load session for streak:", error.message);
      else if (data.session) checkInUser(data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => { if (isMounted && currentSession) checkInUser(currentSession); });
    return () => { isMounted = false; subscription.unsubscribe(); };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/submit-tool" element={<ProtectedRoute><SubmitToolPage /></ProtectedRoute>} />
        <Route path="/signup" element={<LazyRoute><Signup /></LazyRoute>} />
        <Route path="/login" element={<LazyRoute><Login /></LazyRoute>} />
        <Route path="/profile" element={<ProtectedRoute><LazyRoute><Profile /></LazyRoute></ProtectedRoute>} />
        <Route path="/founder-support" element={<ProtectedRoute><LazyRoute><FounderSupport /></LazyRoute></ProtectedRoute>} />
        <Route path="/founder-support/success" element={<ProtectedRoute><LazyRoute><FounderSupportSuccess /></LazyRoute></ProtectedRoute>} />
        <Route path="/founder-support/cancel" element={<ProtectedRoute><LazyRoute><FounderSupportCancel /></LazyRoute></ProtectedRoute>} />
        <Route path="/founder/lilmun" element={<ProtectedRoute><LazyRoute><FounderHome /></LazyRoute></ProtectedRoute>} />
        <Route path="/founder/lilmun/notifications" element={<ProtectedRoute><LazyRoute><AdminNotifications /></LazyRoute></ProtectedRoute>} />
        <Route path="/founder/lilmun/operations" element={<ProtectedRoute><LazyRoute><FounderOperations /></LazyRoute></ProtectedRoute>} />
        <Route path="/founder/notifications" element={<Navigate to="/founder/lilmun/notifications" replace />} />
        <Route path="/admin" element={<Navigate to="/founder/lilmun/operations" replace />} />
        <Route path="/admin-login" element={<Navigate to="/founder/lilmun" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <NotificationPrompt />
    </>
  );
}

export default App;
