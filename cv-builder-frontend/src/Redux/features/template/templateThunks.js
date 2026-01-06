import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../services/axiosInstance";

// Fetch all templates
export const fetchTemplates = createAsyncThunk(
    "template/fetchTemplates",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/templates");
console.log(response.data);

            const data = response.data.data?.data || response.data?.data || [];
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch templates"
            );
        }
    }
);
