import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { supabase } from "./lib/supabase.js";

import Categories from "./components/Categories.jsx";
import FeaturedTools from "./components/FeaturedTools.jsx";
import FeedbackForm from "./components/FeedbackForm.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Navbar from "./components/Navbar.jsx";
import NotificationPrompt from "./components/NotificationPrompt.jsx";
import SearchBar from "./components/SearchBar.jsx";
import SubmitTool from "./components/SubmitTool.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminNotifications from "./pages/AdminNotifications.jsx";
import FounderHome from "./pages/FounderHome.jsx";
import FounderSupport from "./pages/FounderSupport.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Signup from "./pages/Signup.jsx";

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
        <div id="home">
          <Header />
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        <div id="categories">
          <Categories setSearchTerm={setSearchTerm} />
        </div>
        <div id="featured">
          <FeaturedTools searchTerm={searchTerm} />
        </div>
        <SubmitTool />
      </main>
      <Footer />
    </div>
  );
}

function SubmitToolPage() {
  function returnHome() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      <Navbar onLogoClick={returnHome} />
      <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-8 sm:px-8 lg:px-12">
        <SubmitTool />
      </main>
      <Footer />
    </div>
  );
}

function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      <main className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8">
        <FeedbackForm />
      </main>
    </div>
  );
}

function ProtectedRoute({ children, redirectTo = "/login" }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (isMounted) setSession(currentSession);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) setSession(currentSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070d1a] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
          <p className="text-slate-300">Loading AIWCORE...</p>
        </div>
      </div>
    );
  }

  if (!session) return <Navigate to={redirectTo} replace />;
  return children;
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

      if (error) {
        checkedUsers.delete(userId);
        console.error("Automatic streak check-in failed:", error.message);
      }
    }

    async function loadCurrentSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) return;
      if (error) {
        console.error("Unable to load session for streak:", error.message);
        return;
      }
      if (session) checkInUser(session);
    }

    loadCurrentSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted && currentSession) checkInUser(currentSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/founder-support"
          element={
            <ProtectedRoute>
              <FounderSupport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit-tool"
          element={
            <ProtectedRoute>
              <SubmitToolPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/founder/lilmun"
          element={
            <ProtectedRoute>
              <FounderHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/founder/lilmun/notifications"
          element={
            <ProtectedRoute>
              <AdminNotifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/founder/lilmun/operations"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

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
