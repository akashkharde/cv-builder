import { API_ENDPOINTS } from "../../../config/apiConfig";
import axiosInstance from "../../../services/axiosInstance";

export const registerAPI = async (payload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  return response.data;
};

export const loginAPI = async (payload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, payload);
  return response.data;
};

export const getMeAPI = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.USERS.ME);
  return response.data;
};

export const logoutAPI = async () => {
  const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
  return response.data;
};
