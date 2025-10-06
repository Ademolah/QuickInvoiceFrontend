import axios from "axios";


const BASEURL = "https://quickinvoice-backend-1.onrender.com"

const api = axios.create({
  baseURL: BASEURL
});

// Add a response interceptor
api.interceptors.response.use(
    
  (response) => response,
  (error) => {
    // If token expired or invalid
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // if you store user
      // Optional: Show a message before redirect
      alert("Session expired. Please log in again.");
      window.location.href = "/login"; // Or use navigate
      
    }
    return Promise.reject(error);
  }
);
export default api;