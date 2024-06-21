import { Navigate,Outlet, useLocation } from 'react-router-dom';
// import { User } from "./Context/userContext";
// import { useContext } from "react";
import Cookies from "universal-cookie";


const RequireAuth = ({ userData}) => {
    const cookies = new Cookies();
     const token = cookies.get("Bearer");
    // const user =useContext(User);
    const location =useLocation();
    return  token? <Outlet/>:<Navigate  state={{from:location}} replace to="/register"/> ;
};



export default RequireAuth;
