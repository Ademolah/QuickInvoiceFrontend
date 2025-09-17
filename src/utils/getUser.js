//utils/api.js
import axios from "axios";
const API_BASE_URL =  "https://quickinvoice-backend-1.onrender.com/api"
// Fetch authenticated user
export const fetchUser = async (token) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; // should contain { id, name, email, profileImage, ... }
  } catch (error) {
    console.error("Error fetching user:", error.response?.data || error.message);
    throw error;
  }
};