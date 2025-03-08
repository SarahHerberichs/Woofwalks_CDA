import React from "react"; // Correct import
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./views/Home";

import Walks from "./views/Walks";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/walks" element={<Walks />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </div>
      <Footer />
    </div>
  );
}

export default App;
