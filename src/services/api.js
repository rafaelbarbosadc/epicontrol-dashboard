import axios from "axios";

const api = axios.create({
  baseURL: "https://epidetector.herokuapp.com/",
});

export default api;
