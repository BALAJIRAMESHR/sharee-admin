import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  useNavigate,
} from "react-router-dom";

import 'react-toastify/dist/ReactToastify.css';
import ProductManagement from "./pages/ProductManagement/ProductManagement";
import CategoryManagement from "./pages/CategoryManagement/CategoryManagement";
import OrdersManagement from "./pages/OrderManagement/OrderManagement";
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import Inventory from "./pages/Invetory/invetory.jsx"
import Coupons from "./pages/Coupoes/coupoes.jsx";
import User from "./pages/UserManagement/usermanagement.jsx";
import { useEffect } from "react";

function HomeRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/productmanagement');
  }, [navigate]);

  return null; // No UI for this component
}


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<HomeRedirect />}></Route>
      <Route path="/productmanagement" element={<ProductManagement />}></Route>
      <Route path="/categorymanagement" element={<CategoryManagement />}></Route>
      <Route path="/order" element={<OrdersManagement />}></Route>
      <Route path="/user-management" element={<User/>}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>
      <Route path="/coupons" element={<Coupons />}></Route>
      <Route path="/inventory" element={<Inventory/>}></Route>
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
