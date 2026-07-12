 import { useState } from "react";

import Navbar from "./components/Navbar.jsx";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Categories from "./components/Categories.jsx";
import FeaturedTools from "./components/FeaturedTools.jsx";
import Footer from "./components/Footer.jsx";

function App() {
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
      </main>

      <Footer />
    </div>
  );
}

export default App;