import { createSlice } from "@reduxjs/toolkit";
import { fetchCVs, fetchCVById, updateCV, autosaveCV, deleteCV } from "../features/cv/cvThunks";

const initialState = {
    cvs: [],
    currentCV: null,
    loading: false,
    error: null,
    saveStatus: 'idle', // idle, saving, saved, error
};

const cvSlice = createSlice({
    name: "cv",
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
        resetCurrentCV: (state) => {
            state.currentCV = null;
            state.saveStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch CVs
            .addCase(fetchCVs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCVs.fulfilled, (state, action) => {
                state.loading = false;
                state.cvs = action.payload;
            })
            .addCase(fetchCVs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch CV By ID
            .addCase(fetchCVById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCVById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCV = action.payload;
            })
            .addCase(fetchCVById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update CV
            .addCase(updateCV.pending, (state) => {
                state.saveStatus = 'saving';
            })
            .addCase(updateCV.fulfilled, (state, action) => {
                state.saveStatus = 'saved';
                state.currentCV = action.payload;
                // Update list if present
                const index = state.cvs.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.cvs[index] = action.payload;
                }
            })
            .addCase(updateCV.rejected, (state, action) => {
                state.saveStatus = 'error';
                state.error = action.payload;
            })
            // Autosave CV
            .addCase(autosaveCV.pending, (state) => {
                state.saveStatus = 'saving';
            })
            .addCase(autosaveCV.fulfilled, (state, action) => {
                state.saveStatus = 'saved';
                // Only update data part to avoid re-rendering everything if not needed
                if (state.currentCV) {
                    state.currentCV = action.payload;
                }
            })
            .addCase(autosaveCV.rejected, (state, action) => {
                state.saveStatus = 'error';
                // Don't set global error for background autosave failure to avoid disrupting user
                console.error("Autosave failed:", action.payload);
            })
            // Delete CV
            .addCase(deleteCV.fulfilled, (state, action) => {
                state.cvs = state.cvs.filter((cv) => (cv._id || cv.id) !== action.payload);
                if (state.currentCV && (state.currentCV._id || state.currentCV.id) === action.payload) {
                    state.currentCV = null;
                }
            });
    },
});

export const { clearErrors, resetCurrentCV } = cvSlice.actions;
export default cvSlice.reducer;
