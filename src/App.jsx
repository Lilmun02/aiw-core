 import Navbar from "./components/Navbar.jsx";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Categories from "./components/Categories.jsx";
import FeaturedTools from "./components/FeaturedTools.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-12">
        <div id="home">
          <Header />
          <SearchBar />
        </div>

        <div id="categories">
          <Categories />
        </div>

        <div id="featured">
          <FeaturedTools />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;