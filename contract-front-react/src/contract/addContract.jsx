import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { fr } from "yup-locales";
import { setLocale } from "yup";
import { accountService } from "../_services/acount.service";

setLocale(fr);
const ContractSchema = yup.object().shape({
  firstname: yup.string().min(2).max(20).required(),
  lastname: yup.string().min(2).max(20).required(),
  company_id: yup
    .number()
    .typeError("Vous devez selectionner une compagnie")
    .positive()
    .required(),
  automobileGuaranteeFund: yup
    .number()
    .typeError("Vous devez entrer le FAG")
    .positive("Le FAG doit être positif")
    .required(),
  accessory: yup
    .number()
    .typeError("Vous devez entrer les accessoires")
    .positive("Les accessoires doivent être positif")
    .required(),
  tax: yup
    .number()
    .typeError("Vous devez entrer la taxe")
    .positive("La taxe doit être positive")
    .required(),
  netPrime: yup
    .number()
    .typeError("Vous devez entrer la prime nette")
    .positive("La prime nette doit être positive")
    .required(),
  dateOfIssue: yup
    .date()
    .typeError("Vous devez entrer la date d'émission")
    .required(),
  effectiveDate: yup
    .date()
    .typeError("Vous devez entrer la date éffective")
    .required()
    .test({
      name: "is-after-dateOfIssue",
      message: "La date effective doit être après la date d'émission",
      test: function (value) {
        const dateOfIssue = this.parent.dateOfIssue;
        return dateOfIssue && value && value > dateOfIssue;
      },
    }),
  dueDate: yup
    .date()
    .typeError("Vous devez entrer la date d'échéance")
    .required()
    .test({
      name: "is-after-effectiveDate",
      message: "La date d'échéance doit être après la date effective",
      test: function (value) {
        const effectiveDate = this.parent.effectiveDate;
        return effectiveDate && value && value > effectiveDate;
      },
    }),
});

// ContractSchema.locale(fr);

const AddContract = () => {
  const navigate = useNavigate();

  let isLogged = accountService.isLogged();

  const logout = () => {
    accountService.logout();
    notifyLogoutSucess();
    navigate("/login");
  };
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
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: yupResolver(ContractSchema),
  });

  const dateOfIssue = watch("dateOfIssue");
  const effectiveDate = watch("effectiveDate");

  // console.log(errors);
  // const handleFormSubmit = (data) => console.log(data);
  const handleFormSubmit = async (data) => {
    try {
      // Enregistrez le client
      const responseClient = await axios.post("/clients", {
        firstname: data.firstname,
        lastname: data.lastname,
      });
      const savedClient = responseClient.data;

      console.log("Client enregistré :", savedClient);

      // Mise à jour du contrat avec l'ID du client
      const clientLink = "/api/clients/" + savedClient.id;
      const updatedContract = {
        ...data,
        client: clientLink,
      };

      // Mise à jour du contrat avec l'ID de la compagnie
      const company = "/api/companies/" + updatedContract.company_id;
      updatedContract.company = company;

      // Convertir les valeurs en nombres à virgule flottante
      // updatedContract.tax = parseFloat(updatedContract.tax);
      // updatedContract.accessory = parseFloat(updatedContract.accessory);
      // updatedContract.netPrime = parseFloat(updatedContract.netPrime);
      // updatedContract.automobileGuaranteeFund = parseFloat(
      //   updatedContract.automobileGuaranteeFund
      // );

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

  const notifyLogoutSucess = () =>
    toast.warn("Vous vous etes déconnecter ✅", {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
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
            onSubmit={handleSubmit(handleFormSubmit)}
            className="p-8 max-w-4xl bg-white shadow-md"
          >
            <div className="my-8 space-x-20 flex items-start justify-between">
              <div className="flex flex-col items-start justify-start">
                <input
                  type="text"
                  placeholder="Nom Client"
                  className={`"text-lg text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                    errors.lastname
                      ? "border-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-blue-600 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  {...register("lastname")}
                />
                {errors.lastname && (
                  <span className="text-red-400 text-sm mt-2 first-letter:capitalize">
                    {errors.lastname?.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start justify-start">
                <input
                  placeholder="Prénom Client"
                  className={`"text-lg text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                    errors.firstname
                      ? "border-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-blue-600 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  {...register("firstname")}
                />
                <p></p>
                {errors.firstname && (
                  <span className="text-red-400 text-sm mt-2 first-letter:capitalize">
                    {errors.firstname?.message}
                  </span>
                )}
              </div>
            </div>
            <div className="my-8 space-x-20 flex items-start justify-between">
              <div className="flex flex-col items-start justify-start">
                <select
                  defaultValue=""
                  className={`"text-sm text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                    errors.company_id
                      ? "border-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-blue-600 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  {...register("company_id", {
                    required: true,
                  })}
                >
                  <option className="text-gray-600 text-lg" value="" disabled>
                    Selectionner compagnie
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
                {errors.company_id && (
                  <span className="text-red-400 text-sm mt-2 first-letter:capitalize">
                    {errors.company_id?.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start justify-start">
                <input
                  type="number"
                  placeholder="FAG"
                  className={`"text-sm text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                    errors.automobileGuaranteeFund
                      ? "border-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-blue-600 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  {...register("automobileGuaranteeFund", {
                    required: true,
                  })}
                />

                {errors.automobileGuaranteeFund && (
                  <span className="text-red-400 text-sm mt-2 first-letter:capitalize">
                    {errors.automobileGuaranteeFund?.message}
                  </span>
                )}
              </div>
            </div>

            <div className="my-8 space-x-20 flex items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <input
                  type="number"
                  placeholder="Accessoir"
                  className={`"text-lg text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                    errors.accessory
                      ? "border-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-blue-600 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  {...register("accessory")}
                />
                {errors.accessory && (
                  <span className="text-red-400 text-sm mt-2 first-letter:capitalize">
                    {errors.accessory?.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start justify-start">
                <input
                  type="number"
                  placeholder="Taxe"
                  className={`"text-lg text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                    errors.tax
                      ? "border-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-blue-600 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  {...register("tax")}
                />
                {errors.tax && (
                  <span className="text-red-400 text-sm mt-2 first-letter:capitalize">
                    {errors.tax?.message}
                  </span>
                )}
              </div>
            </div>

            <div className="my-8 space-x-20 flex items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <input
                  type="number"
                  placeholder="Price nette"
                  className={`"text-lg text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                    errors.netPrime
                      ? "border-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-blue-600 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  {...register("netPrime")}
                />
                {errors.netPrime && (
                  <span className="text-red-400 text-sm mt-2 first-letter:capitalize">
                    {errors.netPrime?.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start justify-start">
                <input
                  type="text"
                  placeholder="Date d'émission"
                  onFocus={(e) => {
                    e.target.type = "date";
                  }}
                  className={`"text-lg text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                    errors.dateOfIssue
                      ? "border-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-blue-600 focus:border-blue-500 focus:ring-blue-500 placeholder:opacity-100"
                  }`}
                  {...register("dateOfIssue", {
                    onBlur: (e) => {
                      setValue("date", e.target.value);
                      e.target.type = "text";
                    },
                  })}
                />
                {errors.dateOfIssue && (
                  <span className="text-red-400 text-sm mt-2 first-letter:capitalize">
                    {errors.dateOfIssue?.message}
                  </span>
                )}
              </div>
            </div>

            <div className="my-8 space-x-20 flex items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <input
                  type="text"
                  placeholder="Date effective"
                  onFocus={(e) => {
                    e.target.type = "date";
                  }}
                  min={isDirty ? dateOfIssue : undefined} // Date minimum est la date d'émission si elle a été sélectionnée
                  className={`"text-lg text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                    errors.effectiveDate
                      ? "border-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-blue-600 focus:border-blue-500 focus:ring-blue-500 placeholder:opacity-100"
                  }`}
                  {...register("effectiveDate", {
                    onBlur: (e) => {
                      setValue("date", e.target.value);
                      e.target.type = "text";
                    },
                  })}
                />

                {errors.effectiveDate && (
                  <span className="text-red-400 text-sm mt-2 first-letter:capitalize max-w-[18rem]">
                    {errors.effectiveDate?.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-start justify-start">
                <input
                  type="text"
                  placeholder="Date d'échéance"
                  onFocus={(e) => {
                    e.target.type = "date";
                  }}
                  min={isDirty ? effectiveDate : undefined} // Date minimum est la date effective si elle a été sélectionnée
                  className={`"text-lg text-gray-800 w-72 transition border placeholder:text-gray-600 placeholder:text-md " + ${
                    errors.dueDate
                      ? "border-red-600 focus:border-red-500 focus:ring-red-500"
                      : "border-blue-600 focus:border-blue-500 focus:ring-blue-500 placeholder:opacity-100"
                  }`}
                  {...register("dueDate", {
                    onBlur: (e) => {
                      setValue("date", e.target.value);
                      e.target.type = "text";
                    },
                  })}
                />

                {errors.dueDate && (
                  <span className="text-red-400 text-sm mt-2 first-letter:capitalize max-w-[18rem]">
                    {errors.dueDate?.message}
                  </span>
                )}
              </div>
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

      {isLogged && (
        <div className="w-full">
          <button
            onClick={logout}
            className="mx-auto py-2 px-4 w-72 bg-blue-600 text-white hover:transition-shadow hover:bg-blue-700 "
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

export default AddContract;
