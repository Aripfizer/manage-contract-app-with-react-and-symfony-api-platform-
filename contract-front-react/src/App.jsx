import { ToastContainer } from "react-toastify";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRouter from "./Routes/AdminRouter";
import PublicRouter from "./Routes/PublicRouter";
import AuthGard from "./_helpers/AuthGard";
import PublicGard from "./_helpers/PublicGard";

function App() {
  return (
    <div>
      <ToastContainer />

      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <PublicGard>
                <PublicRouter />
              </PublicGard>
            }
          />
          <Route
            path="/contracts/*"
            element={
              <AuthGard>
                <AdminRouter />
              </AuthGard>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
