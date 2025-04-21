import React from "react"; // Correct import
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./views/Home";

import WalksPage from "../../woofwalks_front/src/views/Walks/WalksPage";

function App() {
  return (
    <div className="App">
      <h1>rhger</h1>
      <Header />
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/walks" element={<WalksPage />} />
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
