 import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { supabase } from "./lib/supabase.js";

import Navbar from "./components/Navbar.jsx";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Categories from "./components/Categories.jsx";
import FeaturedTools from "./components/FeaturedTools.jsx";
import SubmitTool from "./components/SubmitTool.jsx";
import FeedbackForm from "./components/FeedbackForm.jsx";
import Footer from "./components/Footer.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  function resetHome() {
    setSearchTerm("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      <Navbar onLogoClick={resetHome} />

      <main className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-12">
        <div id="home">
          <Header />

          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
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
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070d1a] text-white">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

function App() {
  return (
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

      <Route path="/admin-login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute redirectTo="/admin-login">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;