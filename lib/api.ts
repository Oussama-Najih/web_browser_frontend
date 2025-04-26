import axios from "axios";

/** single Axios instance for the whole app */
const api = axios.create({ baseURL: "http://localhost:8080" });
export default api;

/** helper: fetch one tab plus its full history[] array */
export const getTab = (id: number) =>
  api.get(`/tab/${id}/history`).then(
    (r) =>
      r.data as {
        id: number;
        history: { url: string; title: string }[];
      }
  );
