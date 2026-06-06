import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import ChangePassword from "./pages/ChangePassword";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/user"
          element={<UserDashboard />}
        />

        <Route
          path="/owner"
          element={<StoreOwnerDashboard />}
        />

        <Route
          path="/change-password"
          element={<ChangePassword />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;