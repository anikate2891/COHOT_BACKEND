import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import Product from "../features/products/pages/Product.jsx";
import DashBoard from "../features/products/pages/DashBoard.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import Home from "../features/products/pages/Home.jsx";
import ProductDetail from "../features/products/pages/ProductDetail.jsx";
import SellerProductDetails from "../features/products/pages/SellerProductDetails.jsx";

export const routes = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/product/:productId", element: <ProductDetail /> }, 

    // seller routes
    { path: "/seller",
        children: [
            { path: "/seller/create-product", element: <Protected role="seller"><Product /></Protected> },
            { path: "/seller/dashboard", element: <Protected role="seller"><DashBoard /></Protected> },
            { path: "/seller/product/:productId", element: <Protected role="seller"><SellerProductDetails /></Protected> }
        ]   
    }
    
]);
