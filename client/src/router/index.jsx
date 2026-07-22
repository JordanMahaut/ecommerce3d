import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import ProtectedRoute from "../routes/ProtectedRoute";
import AdminRoute from "../routes/AdminRoute";

import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Profile from "../pages/Profile";
import ProductDetails from "../pages/ProductDetails";

import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Categories from "../pages/admin/Categories";
import Orders from "../pages/admin/Orders";
import Users from "../pages/admin/Users";
import Quotes from "../pages/admin/Quotes";
import OrderDetails from "../pages/OrderDetails";
import OrdersShop from "../pages/Orders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "products/:slug",
        element: <ProductDetails />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "profile/orders",
            element: <OrdersShop />,
          },
          {
            path: "profile/orders/:id",
            element: <OrderDetails />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "products",
            element: <Products />,
          },
          {
            path: "categories",
            element: <Categories />,
          },
          {
            path: "orders",
            element: <Orders />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "quotes",
            element: <Quotes />,
          },
        ],
      },
    ],
  },
]);

export default router;
