import { createSlice } from "@reduxjs/toolkit";
import { fetchTemplates } from "../features/template/templateThunks";

const initialState = {
    templates: [],
    loading: false,
    error: null,
};

const templateSlice = createSlice({
    name: "template",
    initialState,
    reducers: {
        clearTemplateErrors: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Templates
            .addCase(fetchTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTemplates.fulfilled, (state, action) => {
                state.loading = false;
                state.templates = action.payload;
            })
            .addCase(fetchTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearTemplateErrors } = templateSlice.actions;
export default templateSlice.reducer;
