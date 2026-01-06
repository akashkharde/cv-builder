// src/Pages/CVEditor.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Typography,
    CircularProgress,
    Grid,
    Paper,
    TextField,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchCVById, updateCV, autosaveCV, deleteCV } from "../Redux/features/cv/cvThunks";
import { resetCurrentCV, setIsNewProgress } from "../Redux/slices/cvSlice";
import debounce from "lodash/debounce";
import ModernCVRenderer from "../components/ModernCVRenderer";

/**
 * Helper: extract a safe string from possible date shapes
 */
const extractDateString = (value) => {
    if (!value) return null;
    if (typeof value === "string") return value;
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "object") {
        if (typeof value.date === "string") return value.date;
        if (typeof value.$date === "string") return value.$date;
    }
    return null;
};

const formatDate = (raw) => {
    const s = extractDateString(raw);
    if (!s) return "";
    const dt = new Date(s);
    if (Number.isNaN(dt.getTime())) return "";
    return dt.toLocaleDateString();
};

const emptyCV = {
    title: "",
    data: {
        basicDetails: {},
        education: [],
        experience: [],
        projects: [],
        skills: [],
        socialProfiles: [],
    },
};

const CVEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentCV, loading, saveStatus } = useSelector((state) => state.cv);
    const [formData, setFormData] = useState(null);
    const [expanded, setExpanded] = useState("basicDetails");
    const [validationErrors, setValidationErrors] = useState({}); // { "basicDetails.name": "Required", "education.0.institution": "Required" }
    const prevFormData = useRef(null);

    // Create debounced autosave only once
    const debouncedAutosave = useMemo(() => {
        return debounce((cvId, data) => {
            dispatch(autosaveCV({ id: cvId, data }));
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(fetchCVById(id));
        }
        return () => {
            // cleanup
            debouncedAutosave.cancel();
            dispatch(resetCurrentCV());
            setFormData(null);
        };
    }, [dispatch, id, debouncedAutosave]);

    // Initialize/Sync Form Data
    useEffect(() => {
        // Helper to format initial data
        const formatInitialData = (cv) => {
            let data = cv.data || {};

            // Fix corrupted nested data if present
            if (data.data) {
                console.log("Fixing corrupted nested data in frontend for CV:", cv._id);
                data = data.data;
            }

            // Helper to join arrays back to strings for editing
            const safeJoin = (val) => {
                if (Array.isArray(val)) return val.join(", ");
                return val || "";
            };

            return {
                title: cv.title || "",
                data: {
                    basicDetails: data.basicDetails || {},
                    education: Array.isArray(data.education) ? data.education : [],
                    experience: (data.experience || []).map(exp => ({
                        ...exp,
                        duration: exp.duration || "",
                        technologies: safeJoin(exp.technologies)
                    })),
                    projects: (data.projects || []).map(p => ({
                        ...p,
                        // Map backend 'projectTitle' to frontend 'title'
                        projectTitle: p.projectTitle || p.title || "",
                        duration: p.duration || "",
                        technologies: safeJoin(p.technologies)
                    })),
                    skills: Array.isArray(data.skills) ? data.skills : [],
                    socialProfiles: Array.isArray(data.socialProfiles) ? data.socialProfiles : [],
                },
            };
        };

        if (!formData) {
            // Initialize from Redux Store (after fetch)
            if (currentCV) {
                const initialData = formatInitialData(currentCV);
                setFormData(initialData);
                prevFormData.current = initialData;
            } else if (!id) {
                // New CV
                setFormData(emptyCV);
                prevFormData.current = emptyCV;
            }
        }
    }, [currentCV, formData, id]);

    // Autosave effect
    useEffect(() => {
        if (!formData || !id || !prevFormData.current) return;

        // crude shallow compare by reference: avoid autosave on mount
        if (prevFormData.current !== formData) {
            // Prepare data before saving (convert strings to arrays where needed)
            const dataToSave = prepareDataForSave(formData.data);
            debouncedAutosave(id, { title: formData.title, data: dataToSave });
            prevFormData.current = formData;
        }
    }, [formData, id, debouncedAutosave]);

    // Warn on refresh/close if saving
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            // If we are saving or have an error, warn the user
            if (saveStatus === 'saving' || saveStatus === 'error') {
                e.preventDefault();
                e.returnValue = ''; // Chrome requires returnValue to be set
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [saveStatus]);

    /**
     * Prepare data for backend (validation fixes)
     */
    const prepareDataForSave = (data) => {
        if (!data) return {};
        const safeSplit = (val) => {
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
            return [];
        };

        const normalizeUrl = (url) => {
            if (!url) return url;
            const trimmed = url.trim();
            if (!trimmed) return "";
            if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) {
                return trimmed;
            }
            return `https://${trimmed}`;
        };

        return {
            ...data,
            basicDetails: {
                ...data.basicDetails,
                image: normalizeUrl(data.basicDetails?.image)
            },
            projects: (data.projects || []).map(p => ({
                ...p,
                projectTitle: p.projectTitle, // backend expects projectTitle
                technologies: safeSplit(p.technologies)
            })),
            experience: (data.experience || []).map(e => ({
                ...e,
                duration: e.duration || "",
                technologies: safeSplit(e.technologies)
            })),
            socialProfiles: (data.socialProfiles || []).map(sp => ({
                ...sp,
                profileLink: normalizeUrl(sp.profileLink)
            }))
        };
    };

    // Validation Logic
    const validateForm = () => {
        const errors = {};
        let isValid = true;
        const data = formData.data;

        // Title
        if (!formData.title.trim()) {
            errors["title"] = "Title is required";
            isValid = false;
        }

        // Basic Details - Only these are required
        const basic = data.basicDetails;
        if (!basic.name?.trim()) errors["basicDetails.name"] = "Full Name is required";
        if (!basic.email?.trim()) errors["basicDetails.email"] = "Email is required";
        if (!basic.phone?.trim()) errors["basicDetails.phone"] = "Phone is required";
        if (!basic.introductoryParagraph?.trim()) errors["basicDetails.introductoryParagraph"] = "Summary is required";

        // Helper for arrays - only validate items that have ANY content
        const validateArray = (section, fields) => {
            (data[section] || []).forEach((item, index) => {
                // Check if item has any non-empty field
                const hasContent = fields.some(field => {
                    const val = item[field];
                    return val && (typeof val !== 'string' || val.trim());
                });

                // Only validate if the item has some content
                if (hasContent) {
                    fields.forEach(field => {
                        const val = item[field];
                        if (!val || (typeof val === 'string' && !val.trim())) {
                            errors[`${section}.${index}.${field}`] = "Required";
                        }
                    });
                }
            });
        };

        // These sections are OPTIONAL - only validate if user added items
        validateArray("education", ["institution", "degreeName", "endDate"]);
        validateArray("experience", ["organizationName", "position", "duration"]);
        validateArray("projects", ["projectTitle", "technologies", "duration", "description"]);
        validateArray("skills", ["skillName"]);
        validateArray("socialProfiles", ["platformName", "profileLink"]);

        if (Object.keys(errors).length > 0) isValid = false;

        setValidationErrors(errors);
        return isValid;
    };

    // Handlers
    const handleBasicChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            data: {
                ...prev.data,
                basicDetails: {
                    ...prev.data.basicDetails,
                    [name]: value,
                },
            },
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        setFormData((prev) => {
            const arr = Array.isArray(prev.data[section]) ? [...prev.data[section]] : [];
            arr[index] = { ...(arr[index] || {}), [field]: value };
            return {
                ...prev,
                data: {
                    ...prev.data,
                    [section]: arr,
                },
            };
        });
    };

    const handleAddItem = (section, initialItem) => {
        setFormData((prev) => ({
            ...prev,
            data: {
                ...prev.data,
                [section]: [...(prev.data[section] || []), initialItem],
            },
        }));
        // expand the added section for immediate editing
        setExpanded(section);
    };

    const handleRemoveItem = (section, index) => {
        setFormData((prev) => {
            const arr = [...(prev.data[section] || [])];
            arr.splice(index, 1);
            return {
                ...prev,
                data: {
                    ...prev.data,
                    [section]: arr,
                },
            };
        });
    };

    const handleSave = async () => {
        if (!formData) return;

        if (!validateForm()) {
            alert("Please fill in all required fields.");
            return;
        }

        debouncedAutosave.cancel(); // cancel pending auto save to avoid duplicate

        const dataToSave = prepareDataForSave(formData.data);
        try {
            await dispatch(
                updateCV({
                    id,
                    data: {
                        title: formData.title,
                        data: dataToSave,
                    },
                })
            ).unwrap();

            // Redirect to dashboard on success
            navigate("/");
        } catch (error) {
            console.error("Failed to save CV:", error);
            // Error is already handled by Redux state/UI via saveStatus
        }
    };

    /**
     * Cancel changes and redirect to dashboard.
     * If it's a new CV (isNewProgress is true), delete it from the database first.
     */
    const handleCancel = async () => {
        if (setIsNewProgress && id) {
            try {
                await dispatch(deleteCV(id)).unwrap();
            } catch (error) {
                console.error("Failed to delete draft CV on cancel:", error);
            }
        }
        dispatch(setIsNewProgress(false));
        navigate("/");
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    if (loading || !formData) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <CircularProgress />
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-100 min-h-screen p-4 md:p-6">
                {/* Header area - responsive */}
                <Paper className="p-4 mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 md:sticky md:top-20 z-10">
                    <div className="w-full sm:w-auto">
                        <TextField
                            variant="standard"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="CV Title (e.g., Software Engineer CV)"
                            fullWidth
                            error={!!validationErrors.title}
                            helperText={validationErrors.title}
                            InputProps={{ style: { fontSize: "1.25rem", fontWeight: 700 } }}
                        />
                        <Typography
                            variant="caption"
                            display="block"
                            color={saveStatus === "error" ? "error" : "textSecondary"}
                        >
                            {saveStatus === "saving"
                                ? "Saving..."
                                : saveStatus === "saved"
                                    ? "All changes saved."
                                    : saveStatus === "error"
                                        ? "Error saving changes"
                                        : "Draft saved locally"}
                        </Typography>
                    </div>

                    <div className="flex gap-2 items-center">
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                // Reset to backend version if you want (optional)
                                if (currentCV) {
                                    setFormData({
                                        title: currentCV.title || "",
                                        data: {
                                            basicDetails: currentCV.data?.basicDetails || {},
                                            education: currentCV.data?.education || [],
                                            experience: currentCV.data?.experience || [],
                                            projects: currentCV.data?.projects || [],
                                            skills: currentCV.data?.skills || [],
                                            socialProfiles: currentCV.data?.socialProfiles || [],
                                        },
                                    });
                                } else {
                                    setFormData(emptyCV);
                                }
                            }}
                        >
                            Reset
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            color="primary"
                            disabled={saveStatus === "saving"}
                        >
                            Save
                        </Button>
                    </div>
                </Paper>

                <Grid container spacing={4}>
                    {/* Editor column */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            '@media (min-width: 768px)': {
                                flexBasis: '50%',
                                maxWidth: '50%'
                            }
                        }}
                    >
                        {/* Basic Details */}
                        <Accordion expanded={expanded === "basicDetails"} onChange={handleAccordionChange("basicDetails")}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Basic Details</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            name="name"
                                            value={formData.data.basicDetails.name || ""}
                                            onChange={handleBasicChange}
                                            error={!!validationErrors["basicDetails.name"]}
                                            helperText={validationErrors["basicDetails.name"]}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            value={formData.data.basicDetails.email || ""}
                                            onChange={handleBasicChange}
                                            error={!!validationErrors["basicDetails.email"]}
                                            helperText={validationErrors["basicDetails.email"]}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            name="phone"
                                            value={formData.data.basicDetails.phone || ""}
                                            onChange={handleBasicChange}
                                            error={!!validationErrors["basicDetails.phone"]}
                                            helperText={validationErrors["basicDetails.phone"]}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="Professional Summary"
                                            name="introductoryParagraph"
                                            value={formData.data.basicDetails.introductoryParagraph || ""}
                                            onChange={handleBasicChange}
                                            error={!!validationErrors["basicDetails.introductoryParagraph"]}
                                            helperText={validationErrors["basicDetails.introductoryParagraph"]}
                                        />
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                        {/* Education */}
                        <Accordion expanded={expanded === "education"} onChange={handleAccordionChange("education")}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Education</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {(formData.data.education || []).map((edu, index) => (
                                    <div key={index} className="mb-4 p-4 border rounded relative">
                                        <IconButton
                                            size="small"
                                            className="absolute top-2 right-2"
                                            onClick={() => handleRemoveItem("education", index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Institution"
                                                    value={edu.institution || ""}
                                                    onChange={(e) => handleArrayChange("education", index, "institution", e.target.value)}
                                                    error={!!validationErrors[`education.${index}.institution`]}
                                                    helperText={validationErrors[`education.${index}.institution`]}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Degree"
                                                    value={edu.degreeName || ""}
                                                    onChange={(e) => handleArrayChange("education", index, "degreeName", e.target.value)}
                                                    error={!!validationErrors[`education.${index}.degreeName`]}
                                                    helperText={validationErrors[`education.${index}.degreeName`]}
                                                />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Year / End Date"
                                                    value={edu.endDate || ""}
                                                    onChange={(e) => handleArrayChange("education", index, "endDate", e.target.value)}
                                                    error={!!validationErrors[`education.${index}.endDate`]}
                                                    helperText={validationErrors[`education.${index}.endDate`]}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>
                                ))}

                                <Button startIcon={<AddIcon />} onClick={() => handleAddItem("education", { institution: "", degreeName: "", endDate: "" })}>
                                    Add Education
                                </Button>
                            </AccordionDetails>
                        </Accordion>

                        {/* Experience */}
                        <Accordion expanded={expanded === "experience"} onChange={handleAccordionChange("experience")}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Experience</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {(formData.data.experience || []).map((exp, index) => {
                                    return (
                                        <div key={index} className="mb-4 p-4 border rounded relative">
                                            <IconButton
                                                size="small"
                                                className="absolute top-2 right-2"
                                                onClick={() => handleRemoveItem("experience", index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Company / Organization"
                                                        value={exp.organizationName || ""}
                                                        onChange={(e) => handleArrayChange("experience", index, "organizationName", e.target.value)}
                                                        error={!!validationErrors[`experience.${index}.organizationName`]}
                                                        helperText={validationErrors[`experience.${index}.organizationName`]}
                                                    />
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Position"
                                                        value={exp.position || ""}
                                                        onChange={(e) => handleArrayChange("experience", index, "position", e.target.value)}
                                                        error={!!validationErrors[`experience.${index}.position`]}
                                                        helperText={validationErrors[`experience.${index}.position`]}
                                                    />
                                                </Grid>

                                                <Grid item xs={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Duration"
                                                        value={exp.duration || ""}
                                                        onChange={(e) => handleArrayChange("experience", index, "duration", e.target.value)}
                                                        error={!!validationErrors[`experience.${index}.duration`]}
                                                        helperText={validationErrors[`experience.${index}.duration`]}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                    )
                                })}

                                <Button startIcon={<AddIcon />} onClick={() => handleAddItem("experience", { organizationName: "", position: "", duration: "" })}>
                                    Add Experience
                                </Button>
                            </AccordionDetails>
                        </Accordion>

                        {/* Projects (NEW) */}
                        <Accordion expanded={expanded === "projects"} onChange={handleAccordionChange("projects")}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Projects</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {(formData.data.projects || []).map((project, index) => {
                                    console.log("2222222222222222222222222222", project);

                                    return (
                                        <div key={index} className="mb-4 p-4 border rounded relative">
                                            <IconButton
                                                size="small"
                                                className="absolute top-2 right-2"
                                                onClick={() => handleRemoveItem("projects", index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>

                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Project Title"
                                                        value={project.projectTitle || ""}
                                                        onChange={(e) => handleArrayChange("projects", index, "projectTitle", e.target.value)}
                                                        error={!!validationErrors[`projects.${index}.projectTitle`]}
                                                        helperText={validationErrors[`projects.${index}.projectTitle`]}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Technologies (comma separated)"
                                                        value={project.technologies || ""}
                                                        onChange={(e) => handleArrayChange("projects", index, "technologies", e.target.value)}
                                                        error={!!validationErrors[`projects.${index}.technologies`]}
                                                        helperText={validationErrors[`projects.${index}.technologies`]}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        fullWidth
                                                        label="Duration"
                                                        value={project.duration || ""}
                                                        onChange={(e) => handleArrayChange("projects", index, "duration", e.target.value)}
                                                        error={!!validationErrors[`projects.${index}.duration`]}
                                                        helperText={validationErrors[`projects.${index}.duration`]}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        multiline
                                                        rows={3}
                                                        label="Project Description"
                                                        value={project.description || ""}
                                                        onChange={(e) => handleArrayChange("projects", index, "description", e.target.value)}
                                                        error={!!validationErrors[`projects.${index}.description`]}
                                                        helperText={validationErrors[`projects.${index}.description`]}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </div>
                                    )
                                })}

                                <Button
                                    startIcon={<AddIcon />}
                                    onClick={() =>
                                        handleAddItem("projects", { projectTitle: "", technologies: "", duration: "", description: "" })
                                    }
                                >
                                    Add Project
                                </Button>
                            </AccordionDetails>
                        </Accordion>

                        {/* Skills */}
                        <Accordion expanded={expanded === "skills"} onChange={handleAccordionChange("skills")}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Skills</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {(formData.data.skills || []).map((skill, index) => (
                                    <div key={index} className="flex gap-2 mb-2 items-center">
                                        <TextField
                                            fullWidth
                                            label="Skill Name"
                                            value={skill.skillName || ""}
                                            onChange={(e) => handleArrayChange("skills", index, "skillName", e.target.value)}
                                            error={!!validationErrors[`skills.${index}.skillName`]}
                                            helperText={validationErrors[`skills.${index}.skillName`]}
                                        />
                                        <IconButton onClick={() => handleRemoveItem("skills", index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                ))}
                                <Button startIcon={<AddIcon />} onClick={() => handleAddItem("skills", { skillName: "" })}>
                                    Add Skill
                                </Button>
                            </AccordionDetails>
                        </Accordion>

                        {/* Social Profiles (NEW via Requirement) */}
                        <Accordion expanded={expanded === "socialProfiles"} onChange={handleAccordionChange("socialProfiles")}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Social Profiles</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {(formData.data.socialProfiles || []).map((profile, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row gap-2 mb-4 p-4 border rounded relative">
                                        <IconButton
                                            size="small"
                                            className="absolute top-2 right-2 sm:static sm:order-last"
                                            onClick={() => handleRemoveItem("socialProfiles", index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        <TextField
                                            fullWidth
                                            label="Platform (e.g. LinkedIn)"
                                            value={profile.platformName || ""}
                                            onChange={(e) => handleArrayChange("socialProfiles", index, "platformName", e.target.value)}
                                            error={!!validationErrors[`socialProfiles.${index}.platformName`]}
                                            helperText={validationErrors[`socialProfiles.${index}.platformName`]}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Profile Link"
                                            value={profile.profileLink || ""}
                                            onChange={(e) => handleArrayChange("socialProfiles", index, "profileLink", e.target.value)}
                                            error={!!validationErrors[`socialProfiles.${index}.profileLink`]}
                                            helperText={validationErrors[`socialProfiles.${index}.profileLink`]}
                                        />
                                    </div>
                                ))}
                                <Button startIcon={<AddIcon />} onClick={() => handleAddItem("socialProfiles", { platformName: "", profileLink: "" })}>
                                    Add Social Profile
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>

                    {/* Preview column */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            '@media (min-width: 768px)': {
                                flexBasis: '50%',
                                maxWidth: '50%'
                            }
                        }}
                    >
                        <Paper className="p-4 h-full w-full">
                            <Typography variant="h6" className="mb-4">
                                Live Preview
                            </Typography>

                            <div className="w-full border rounded max-h-[60vh] md:max-h-[calc(100vh-200px)] overflow-auto bg-white shadow-inner">
                                {currentCV?.layoutId?.slug === 'modern' || currentCV?.layoutId?.columns === 2 ? (
                                    <ModernCVRenderer cvData={formData.data} />
                                ) : (
                                    <div className="p-4">
                                        {/* Header / Basic */}
                                        <Box className="text-center mb-6">
                                            <Typography variant="h4" className="font-bold">
                                                {formData.data.basicDetails.name || "Your Name"}
                                            </Typography>
                                            <Typography variant="body1">
                                                {formData.data.basicDetails.email || ""}{" "}
                                                {formData.data.basicDetails.phone ? `| ${formData.data.basicDetails.phone} ` : ""}
                                            </Typography>
                                            {formData.data.basicDetails.address && (
                                                <Typography variant="body2">{formData.data.basicDetails.address}</Typography>
                                            )}
                                        </Box>

                                        {/* Summary */}
                                        {formData.data.basicDetails.introductoryParagraph && (
                                            <div className="mb-6">
                                                <Typography variant="h6" className="border-b mb-2">
                                                    Summary
                                                </Typography>
                                                <Typography variant="body2">{formData.data.basicDetails.introductoryParagraph}</Typography>
                                            </div>
                                        )}

                                        {/* Experience */}
                                        {formData.data.experience && formData.data.experience.length > 0 && (
                                            <div className="mb-6">
                                                <Typography variant="h6" className="border-b mb-2">
                                                    Experience
                                                </Typography>
                                                {formData.data.experience.map((exp, i) => (
                                                    <div key={i} className="mb-4">
                                                        <Typography variant="subtitle1" className="font-bold">
                                                            {exp.position || "Position"}
                                                        </Typography>
                                                        <Typography variant="subtitle2">
                                                            {exp.organizationName || ""} {exp.duration ? `| ${exp.duration} ` : ""}
                                                        </Typography>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Education */}
                                        {formData.data.education && formData.data.education.length > 0 && (
                                            <div className="mb-6">
                                                <Typography variant="h6" className="border-b mb-2">
                                                    Education
                                                </Typography>
                                                {formData.data.education.map((edu, i) => (
                                                    <div key={i} className="mb-4">
                                                        <Typography variant="subtitle1" className="font-bold">
                                                            {edu.institution || "Institution"}
                                                        </Typography>
                                                        <Typography variant="subtitle2">{edu.degreeName || ""}</Typography>
                                                        {edu.endDate && <Typography variant="body2">{edu.endDate}</Typography>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Projects */}
                                        {formData.data.projects && formData.data.projects.length > 0 && (
                                            <div className="mb-6">
                                                <Typography variant="h6" className="border-b mb-2">
                                                    Projects
                                                </Typography>
                                                {formData.data.projects.map((p, i) => (
                                                    <div key={i} className="mb-4">
                                                        <Typography variant="subtitle1" className="font-bold">
                                                            {p.projectTitle || "Project Title"}
                                                        </Typography>
                                                        <Typography variant="subtitle2">
                                                            {p.technologies ? p.technologies : ""}
                                                            {p.duration ? ` | ${p.duration} ` : ""}
                                                        </Typography>
                                                        {p.description && <Typography variant="body2">{p.description}</Typography>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Skills */}
                                        {formData.data.skills && formData.data.skills.length > 0 && (
                                            <div className="mb-6">
                                                <Typography variant="h6" className="border-b mb-2">
                                                    Skills
                                                </Typography>
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.data.skills.map((skill, i) => (
                                                        <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">
                                                            {skill.skillName}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Social Profiles */}
                                        {formData.data.socialProfiles && formData.data.socialProfiles.length > 0 && (
                                            <div className="mb-6">
                                                <Typography variant="h6" className="border-b mb-2">
                                                    Social Profiles
                                                </Typography>
                                                <div className="flex flex-wrap gap-4">
                                                    {formData.data.socialProfiles.map((profile, i) => (
                                                        <div key={i} className="flex flex-col">
                                                            <Typography variant="subtitle2" className="font-bold">
                                                                {profile.platformName}
                                                            </Typography>
                                                            {profile.profileLink && (
                                                                <a
                                                                    href={profile.profileLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 text-sm hover:underline"
                                                                >
                                                                    {profile.profileLink}
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </>
    );
};

export default CVEditor;
