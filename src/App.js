import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  useNavigate,
} from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import CategoryManagement from "./pages/CategoryManagement/CategoryManagement";
import OrdersManagement from "./pages/OrderManagement/OrderManagement";
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import Inventory from "./pages/Invetory/invetory.jsx";
import Coupons from "./pages/Coupoes/coupoes.jsx";
import User from "./pages/UserManagement/usermanagement.jsx";
import Login from "./pages/Login/Login";
import { useEffect } from "react";

function HomeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return null;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/productmanagement" element={<ProductManagement />} />
      <Route path="/categorymanagement" element={<CategoryManagement />} />
      <Route path="/order" element={<OrdersManagement />} />
      <Route path="/user-management" element={<User />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/coupons" element={<Coupons />} />
      <Route path="/inventory" element={<Inventory />} />
    </Route>
  )
);

function App() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
