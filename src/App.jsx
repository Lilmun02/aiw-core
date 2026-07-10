 import "./App.css";
import Header from "./components/Header.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Categories from "./components/Categories.jsx";

function App() {
  return (
    <div className="app">
      <Header />
      <SearchBar />
      <Categories />
    </div>
  );
}

export default App;