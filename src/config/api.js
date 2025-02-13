import axios from "axios";

export const API_BASE_URL = "https://ecom-api-quindl.onrender.com";
export const API_IMAGE_URL = "http://103.120.176.156:5191";

export const baseAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const imageAPI = axios.create({
  baseURL: API_IMAGE_URL,
  headers: {
    Authorization: "QuindlTokPATFileUpload2025#$$TerOiu$",
    Accept: "*/*",
    "Access-Control-Allow-Origin": "*",
  },
  // Add CORS configuration
  withCredentials: false,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  timeout: 30000, // 30 seconds timeout
});

// Add request interceptor for imageAPI
imageAPI.interceptors.request.use(
  (config) => {
    // Ensure headers are properly set for file upload
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

baseAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

baseAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

imageAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = "Image upload failed";

    if (error.code === "ERR_NETWORK") {
      errorMessage =
        "Unable to connect to image server. Please check your network connection.";
    } else if (error.response) {
      errorMessage = error.response.data?.error || error.response.statusText;
    }

    console.error("Image API Error:", errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);
