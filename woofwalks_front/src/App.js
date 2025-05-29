import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Partials/Footer";
import Header from "./components/Partials/Header";
import PrivateRoute from "./utils/PrivateRoute";
import ConfirmEmail from "./views/ConfirmEmail";
import Home from "./views/Home";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import WalkDetailsPage from "./views/Walks/WalkDetailsPage";
import WalksPage from "./views/Walks/WalksPage";

function App() {
  return (
    <div className="App">
      <h1>Hello</h1>
      <BrowserRouter>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/walks" element={<WalksPage />} />
            <Route path="/newaccount" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/confirm-email" element={<ConfirmEmail />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />

            <Route element={<PrivateRoute />}>
              <Route path="/walks/:id" element={<WalkDetailsPage />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
