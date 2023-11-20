import axios from "../api/axios";
import { accountService } from "./acount.service";

axios.interceptors.request.use((request) => {
  if (accountService.isLogged()) {
    request.headers.Authorization = "Bearer " + accountService.getToken();
  }

  return request;
});

const getAllContracts = (filters, signal) => {
  return axios.get("/contracts?page=1&order[id]=desc", {
    params: filters,
    signal: signal
  });
};



export const contractService = {
  getAllContracts,
};
