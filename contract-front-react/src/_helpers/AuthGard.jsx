import { Navigate } from "react-router-dom";
import { accountService } from "../_services/acount.service";

const AuthGard = ({ children }) => {
 
  if (!accountService.isLogged()) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthGard;
