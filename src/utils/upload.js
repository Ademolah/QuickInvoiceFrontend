import axios from "axios";
export const uploadAvatar = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axios.post(
      "https://quickinvoice-backend-1.onrender.com/api/users/avatar", // adjust if deployed
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.avatar; // returns Cloudinary URL
  } catch (err) {
    console.error("Avatar upload failed:", err);
    throw err;
  }
};