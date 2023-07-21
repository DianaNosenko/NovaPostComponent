import axios from "axios";

const novaPostAPI = axios.create({
  baseURL: "https://api.novaposhta.ua/v2.0",
});

export const request = (body) => novaPostAPI.post("/json/", body);
