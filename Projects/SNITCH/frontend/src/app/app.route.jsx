import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Product from "../features/products/pages/Product.jsx";
import DashBoard from "../features/products/pages/DashBoard.jsx";

export const routes = createBrowserRouter([
    { path: "/", element: <h1>Home</h1> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },

    // seller routes
    { path: "/seller",
        children: [
            { path: "/seller/create-product", element: <Product /> },
            { path: "/seller/dashboard", element: <DashBoard /> }
        ]
    }
]);
