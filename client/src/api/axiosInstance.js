import axios from "axios";
export const axiosInstance = axios.create({
  headers: {
    authorization: `Bearer ${
      JSON.parse(window.localStorage.getItem("token"))?.token || undefined
    }`,
  },
});
