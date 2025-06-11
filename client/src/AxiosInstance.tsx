import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Add token to requests if it exists
const token = localStorage.getItem("token");
if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

instance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status != 422) {
      console.error("Unexpected response error: ", error);
    }

    return Promise.reject(error);
  }
);

export default instance;
