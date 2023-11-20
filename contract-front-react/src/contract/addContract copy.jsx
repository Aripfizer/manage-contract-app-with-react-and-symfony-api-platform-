import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddContract = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [enableFgaInput, setEnableFgaInput] = useState(true);

  const effectiveDateRef = useRef();
  const dueDateRef = useRef();
  const dateOfIssueRef = useRef();

  const [customerData, setCustomerData] = useState({
    firstname: "",
    lastname: "",
  });

  const [contract, setContract] = useState({
    company: "",
    company_id: "",
    client: "",
    tax: null,
    accessory: null,
    netPrime: null,
    automobileGuaranteeFund: null,
    effectiveDate: "",
    dueDate: "",
    dateOfIssue: "",
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enregistrez le client
      const responseClient = await axios.post("/clients", customerData);
      const savedClient = responseClient.data;

      console.log("Client enregistré :", savedClient);

      // Mise à jour du contrat avec l'ID du client
      const clientLink = "/api/clients/" + savedClient.id;
      const updatedContract = {
        ...contract,
        client: clientLink,
      };

      // Mise à jour du contrat avec l'ID de la compagnie
      const company = "/api/companies/" + updatedContract.company_id;
      updatedContract.company = company;

      // Convertir les valeurs en nombres à virgule flottante
      updatedContract.tax = parseFloat(updatedContract.tax);
      updatedContract.accessory = parseFloat(updatedContract.accessory);
      updatedContract.netPrime = parseFloat(updatedContract.netPrime);
      updatedContract.automobileGuaranteeFund = parseFloat(
        updatedContract.automobileGuaranteeFund
      );

      // Affichez le contrat final
      console.log("Contrat final :", updatedContract);

      // Enregistrez le contrat
      const responseContract = await axios.post("/contracts", updatedContract);
      console.log("Contrat enregistré :", responseContract.data);
      notifySucess();
      navigate("/contracts");
     
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
      notifyError(error.message);
    }
  };

  const notifySucess = () =>
    toast.success("Contrat ajouter avec succes ✅", {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  const notifyError = (message) =>
    toast.error("Error : " + message, {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesResponse = await axios.get("/companies?page=1");
        setCompanies(companiesResponse.data);
      } catch (error) {
        console.error("Error fetching Select data:", error);
      }
    };
    fetchCompanies();
    // notify()
  }, [enableFgaInput]);
  return (
    <div className="w-full h-full bg-gray-50 pb-8">
      <div className="max-w-7xl mx-auto ">
        <div className="pt-14 mb-6 text-center text-2xl font-bold text-blue-600">
          Ajouter un Contract
        </div>

        <div className="w-100 flex justify-center">
          <form
            onSubmit={handleFormSubmit}
            className="p-8 max-w-4xl bg-white shadow-md"
          >
            <div className="my-8 space-x-20 flex items-center justify-between">
              <input
                name="lastname"
                type="text"
                value={customerData.lastname}
                placeholder="Nom Client"
                className="text-lg text-gray-800 w-72 transition border border-blue-600 focus:border-blue-500 placeholder:text-gray-600 placeholder:text-md"
                onChange={(e) => {
                  setCustomerData({
                    ...customerData,
                    lastname: e.target.value,
                  });
                }}
              />
              <input
                name="firstname"
                type="text"
                value={customerData.firstname}
                placeholder="Prénom Client"
                className="text-lg text-gray-800 w-72 transition border border-blue-600 focus:border-blue-500 placeholder:text-gray-600 placeholder:text-md"
                onChange={(e) => {
                  setCustomerData({
                    ...customerData,
                    firstname: e.target.value,
                  });
                }}
              />
            </div>
            <div className="my-8 space-x-20 flex items-center justify-between">
              <select
                name="company"
                value={contract.company_id}
                className="text-lg text-gray-800 w-72 transition border border-blue-600 focus:border-blue-500 placeholder:text-gray-600 placeholder:text-md"
                onChange={(e) => {
                  setContract({
                    ...contract,
                    company_id: e.target.value,
                  });
                }}
              >
                <option className="text-gray-600 text-lg" value="">
                  Compagnies
                </option>
                {companies.map((company) => (
                  <option
                    className="text-gray-600 text-lg"
                    key={company.id}
                    value={company.id}
                  >
                    {company.title}
                  </option>
                ))}
              </select>
              <input
                name="fga"
                type="number"
                value={contract.automobileGuaranteeFund}
                placeholder="FGA"
                className={
                  enableFgaInput
                    ? "text-lg text-gray-800 w-72 transition border border-blue-600 focus:border-blue-500 placeholder:text-gray-600 placeholder:text-md"
                    : "border-gray-400 w-72"
                }
                onChange={(e) => {
                  setContract({
                    ...contract,
                    automobileGuaranteeFund: e.target.value,
                  });
                }}
                disabled={!enableFgaInput}
              />
            </div>
            <div className="my-8 space-x-20 flex items-center justify-between">
              <input
                name="accessory"
                type="number"
                value={contract.accessory}
                placeholder="Accessoir"
                className="text-lg text-gray-800 w-72 transition border border-blue-600 focus:border-blue-500 placeholder:text-gray-600 placeholder:text-md"
                onChange={(e) => {
                  setContract({
                    ...contract,
                    accessory: e.target.value,
                  });
                }}
              />
              <input
                name="tax"
                type="number"
                value={customerData.tax}
                placeholder="Taxe"
                className="text-lg text-gray-800 w-72 transition border border-blue-600 focus:border-blue-500 placeholder:text-gray-600 placeholder:text-md"
                onChange={(e) => {
                  setContract({
                    ...contract,
                    tax: e.target.value,
                  });
                }}
              />
            </div>
            <div className="my-8 space-x-20 flex items-center justify-between">
              <input
                name="netPrime"
                type="number"
                value={contract.netPrime}
                placeholder="Price TTC"
                className="text-lg text-gray-800 w-72 transition border border-blue-600 focus:border-blue-500 placeholder:text-gray-600 placeholder:text-md"
                onChange={(e) => {
                  setContract({
                    ...contract,
                    netPrime: e.target.value,
                  });
                }}
              />
              <input
                name="dateOfIssue"
                type="text"
                ref={dateOfIssueRef}
                value={customerData.dateOfIssue}
                placeholder="Date d'émission"
                className="text-lg text-gray-800 w-72 transition border border-blue-600 focus:border-blue-500 placeholder:text-gray-600 placeholder:text-md"
                onFocus={() => (dateOfIssueRef.current.type = "date")}
                onBlur={() => (dateOfIssueRef.current.type = "text")}
                onChange={(e) => {
                  setContract({
                    ...contract,
                    dateOfIssue: e.target.value,
                  });
                }}
              />
            </div>
            <div className="my-8 space-x-20 flex items-center justify-between">
              <input
                name="effectiveDate"
                type="text"
                ref={effectiveDateRef}
                value={customerData.effectiveDate}
                placeholder="Date effective"
                className="text-lg text-gray-800 w-72 transition border border-blue-600 focus:border-blue-500 placeholder:text-gray-600 placeholder:text-md"
                onFocus={() => (effectiveDateRef.current.type = "date")}
                onBlur={() => (effectiveDateRef.current.type = "text")}
                onChange={(e) => {
                  setContract({
                    ...contract,
                    effectiveDate: e.target.value,
                  });
                }}
              />
              <input
                name="dueDate"
                type="text"
                ref={dueDateRef}
                value={customerData.dueDate}
                placeholder="Date d'échéance"
                className="text-lg text-gray-800 w-72 transition border border-blue-600 focus:border-blue-500 placeholder:text-gray-600 placeholder:text-md"
                onFocus={() => (dueDateRef.current.type = "date")}
                onBlur={() => (dueDateRef.current.type = "text")}
                onChange={(e) => {
                  setContract({
                    ...contract,
                    dueDate: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex justify-center mt-14">
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 text-white hover:transition-shadow hover:bg-blue-700 w-3/4"
              >
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContract;
