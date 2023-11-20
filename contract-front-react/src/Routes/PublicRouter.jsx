
import { Routes, Route } from "react-router-dom";
import Login from "../auth/login";
import Register from "../auth/register";

function PublicRouter() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default PublicRouter;
