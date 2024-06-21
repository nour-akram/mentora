import { Navigate,Outlet, useLocation } from 'react-router-dom';
// import { User } from "./Context/userContext";
// import { useContext } from "react";
import Cookies from "universal-cookie";


const PreventGoBack = ({ userData}) => {
    const cookies = new Cookies();
    const token = cookies.get("Bearer");
    const location =useLocation();
    return  !token? <Outlet/>:<Navigate  state={{from:location}} replace to="/home"/> ;
};



export default PreventGoBack;
