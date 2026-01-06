import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../services/axiosInstance";

// Fetch all CVs
export const fetchCVs = createAsyncThunk(
    "cv/fetchCVs",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/cvs");


            const data = response.data.data.data || response.data || [];
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch CVs"
            );
        }
    }
);

// Create a new CV
export const createCV = createAsyncThunk(
    "cv/createCV",
    async (cvData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/cvs", cvData);
            return response.data; // Expecting the created CV object or response wrapper
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create CV"
            );
        }
    }
);

// Fetch single CV by ID
export const fetchCVById = createAsyncThunk(
    "cv/fetchCVById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/cvs/${id}`);
            return response.data.data?.cv || response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch CV"
            );
        }
    }
);

// Update CV
export const updateCV = createAsyncThunk(
    "cv/updateCV",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/cvs/${id}`, data);
            return response.data.data?.cv || response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update CV"
            );
        }
    }
);

// Autosave CV
export const autosaveCV = createAsyncThunk(
    "cv/autosaveCV",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/cvs/${id}/autosave`, { data });
            return response.data.data?.cv || response.data.data || response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to autosave CV"
            );
        }
    }
);
// Delete CV
export const deleteCV = createAsyncThunk(
    "cv/deleteCV",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/cvs/${id}`);
            return id; // Return the ID of the deleted CV
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete CV"
            );
        }
    }
);
