import { Routes, Route } from "react-router-dom";
import Contract from "../contract/Contracts";
import AddContract from "../contract/addContract";

function AdminRouter() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Contract />} />
        <Route path="/add" element={<AddContract />} />
      </Routes>
    </div>
  );
}

export default AdminRouter;
