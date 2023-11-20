import { Navigate } from "react-router-dom";
import { accountService } from "../_services/acount.service";

const PublicGard = ({ children }) => {
 
  if (accountService.isLogged()) {
    return <Navigate to="/contracts" />;
  }

  return children;
};

export default PublicGard;
