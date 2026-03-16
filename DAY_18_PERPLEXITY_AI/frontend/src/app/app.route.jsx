import {createBrowserRouter} from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import DashBoard from "../features/chat/pages/DashBoard";
import Protected from "../features/auth/components/protected";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected><DashBoard /></Protected>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
]);

