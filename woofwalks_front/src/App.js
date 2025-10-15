import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import UserSettingsForm from "./components/Forms/UserSettingsForm";
import MyOrders from "./components/Lists/MyOrders";
import Footer from "./components/Partials/Footer";
import Header from "./components/Partials/Header";
import PrivateRoute from "./utils/PrivateRoute";
import AccountPage from "./views/Account/AccountPage";
import WipPage from "./views/Account/WipPage";
import ConfirmEmail from "./views/ConfirmEmail";
import Home from "./views/Home";
import LoginPage from "./views/LoginPage";
import MyActivity from "./views/MyActivity";
import RegisterPage from "./views/RegisterPage";
import WalkDetailsPage from "./views/Walks/WalkDetailsPage";
import WalksPage from "./views/Walks/WalksPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
           <div className="main-content ">
          <div className="container">
            <Routes>
              <Route path="/walks" element={<WalksPage />} />
              <Route path="/hikes" element={<WipPage />} />
              <Route path="/parcs" element={<WipPage />} /> 
              <Route path="/newaccount" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/confirm-email" element={<ConfirmEmail />} />
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Home />} />
              <Route element={<PrivateRoute />}>
                <Route path="/walks/:id" element={<WalkDetailsPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/myactivity" element={<MyActivity />} />
                <Route path="/settings" element={<UserSettingsForm />} />
                <Route path="/myorders" element={<MyOrders/>} />
                <Route path="/shop" element={<WipPage />} /> 
                
              </Route>
            </Routes>
          </div>
        </div>
        <Footer />
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
