import { useEffect, useState } from "react";
import axios from "../api/axios";
import "../index.css";
import { Link } from "react-router-dom";

const Contract = () => {
  const [contracts, setContracts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    "client.firstname": "",
    "client.lastname": "",
    "company.id": "",
    "company.category.id": "",
  });

//   const [selectFilters, setSelectFilters] = useState({
//     companyId: "",
//     categoryId: "",
//   });

  useEffect(() => {
    let isMonted = true;
    const controller = new AbortController();

    const getContracts = async () => {
      try {
        const response = await axios.get("/contracts?page=1", {
          params: filters,
          signal: controller.signal,
        });
        console.log("!!!!! response !!!!!");
        console.log(response.data);
        isMonted = true && setContracts(response.data);
        console.table({ title: "Type", type: typeof contracts });
      } catch (error) {
        console.log(error);
      }
      console.log(typeof contracts);
    };

    // const getCompanies = async () => {
    //   try {
    //     const response = await axios.get("/companies?page=1", {
    //       signal: controller.signal,
    //     });
    //     setCompanies(response.data);
    //     console.table({ companies: companies });
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   console.log(companies);
    // };

    const fetchData = async () => {
      try {
        const companiesResponse = await axios.get("/companies?page=1");
        const categoriesResponse = await axios.get("/categories?page=1");

        setCompanies(companiesResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching Select data:", error);
      }
    };

    getContracts();
    fetchData();

    // getCompanies();

    return () => {
      isMonted = false;
      controller.abort();
    };
  }, [filters]);
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mt-14 mb-6 text-center text-2xl font-bold text-blue-600">
        Contract list
      </div>
      <div className="w-full py-4 flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="text"
            name="clientFirstname"
            value={filters["client.lastname"]}
            placeholder="Nom"
            onChange={(e) =>
              setFilters({ ...filters, "client.lastname": e.target.value })
            }
          />
          <input
            type="text"
            name="clientLastname"
            value={filters["client.firstname"]}
            placeholder="Prénom"
            onChange={(e) =>
              setFilters({ ...filters, "client.firstname": e.target.value })
            }
          />

          <select
            name="categoryId"
            value={filters["company.category.id"]}
            onChange={(e) => {
            //   setSelectFilters({ ...selectFilters, categoryId: e.target.value });
              setFilters({ ...filters, "company.category.id": e.target.value });
              const companiesFiltered = companies.filter((company) => {
                return company.category.id !== filters[company.category.id] 
              })
              console.log("Filter")
              console.log(companiesFiltered)
            }}
          >
            <option value="">Catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            name="companyId"
            value={filters["company.id"]}
            onChange={(e) => {
            //   setSelectFilters({ ...selectFilters, companyId: e.target.value });
              setFilters({ ...filters, "company.id": e.target.value });
            }}
          >
            <option value="">Compagnies</option>
            {companies       
              .map((company) => (
                <option key={company.id} value={company.id}>
                  {company.title}
                </option>
              ))}
          </select>

          {/* <input
            type="text"
            name="company"
            value={filters["company.title"]}
            placeholder="Compagnie"
            onChange={(e) =>
              setFilters({ ...filters, "company.title": e.target.value })
            }
          />
          <input
            type="text"
            name="company"
            value={filters["company.category.name"]}
            placeholder="Categogy"
            onChange={(e) =>
              setFilters({
                ...filters,
                "company.category.name": e.target.value,
              })
            }
          /> */}
        </div>
        <Link to="/contracts/add" className="py-2 px-4 bg-blue-600 text-white hover:transition-shadow hover:bg-blue-700">
          Ajouter
        </Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Numéro du Contrat
              </th>
              <th scope="col" className="px-6 py-3">
                Compagnie
              </th>
              <th scope="col" className="px-6 py-3">
                Categorie
              </th>
              <th scope="col" className="px-6 py-3">
                client
              </th>
              <th scope="col" className="px-6 py-3">
                FGA
              </th>
              <th scope="col" className="px-6 py-3">
                Accessoire
              </th>
              <th scope="col" className="px-6 py-3">
                Taxe
              </th>
              <th scope="col" className="px-6 py-3">
                Prime Nette
              </th>
              <th scope="col" className="px-6 py-3">
                Prime TTC
              </th>
            </tr>
          </thead>
          <tbody>
            {contracts.length ? (
              <>
                {contracts.map((contract, i) => {
                  return (
                    <tr
                      key={i}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {contract.contract_number}
                      </th>
                      <td className="px-6 py-4">{contract.company.title}</td>
                      <td className="px-6 py-4">
                        {contract.company.category.name}
                      </td>
                      <td className="px-6 py-4">
                        {contract.client.firstname +
                          " " +
                          contract.client.lastname}
                      </td>
                      <td
                        className={
                          contract.company.category.name === "Automobile"
                            ? "px-6 py-4"
                            : "px-8 py-4 text-2xl"
                        }
                      >
                        {contract.company.category.name === "Automobile"
                          ? contract.automobile_guarantee_fund
                          : " - "}
                      </td>
                      <td className="px-6 py-4">{contract.accessory}</td>
                      <td className="px-6 py-4">{contract.tax}</td>
                      <td className="px-6 py-4">{contract.net_prime}</td>
                      <td className="px-6 py-4">{contract.ttc_prime}</td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <tr>Aucun contract trouvé</tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contract;
