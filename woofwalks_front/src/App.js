import React from "react"; // Correct import
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Partials/Footer";
import Header from "./components/Partials/Header";
import Home from "./views/Home";

import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import WalksPage from "./views/Walks/WalksPage";

function App() {
  return (
    <div className="App">
      <h1>Hello</h1>
      <Header />
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/walks" element={<WalksPage />} />
            <Route path="/newaccount" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
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
