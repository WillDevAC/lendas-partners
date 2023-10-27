import axios from "axios";

const APIURL = "https://api-parceiros-production.up.railway.app";

const api = axios.create({
  baseURL: APIURL,
});
export { APIURL };

export default api;
