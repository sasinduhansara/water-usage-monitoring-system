import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Registration failed" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

export const fetchWaterUsage = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/water`);
    return response.data;
  } catch (error) {
    console.error("Error fetching water usage data:", error);
    throw error;
  }
};

