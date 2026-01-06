import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    CircularProgress,
    Alert,
} from "@mui/material";
import Navbar from "./Navbar";
import { fetchTemplates } from "../Redux/features/template/templateThunks";
import { createCV } from "../Redux/features/cv/cvThunks";

const TemplateSelection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { templates, loading, error } = useSelector((state) => state.template);

    useEffect(() => {
        dispatch(fetchTemplates());
    }, [dispatch]);

    const handleSelectTemplate = async (template) => {
        try {
            // Create new CV with selected template
            const cvData = {
                title: `My ${template.name} CV`,
                layoutId: template.id || template._id,
                data: {}, // Initial empty data
            };

            const resultAction = await dispatch(createCV(cvData));

            if (createCV.fulfilled.match(resultAction)) {
                const newCV = resultAction.payload.data?.cv || resultAction.payload.data || resultAction.payload;
                navigate(`/editor/${newCV._id || newCV.id}`);
            } else {
                // Error handled by redux state usually, or prompt here
                alert("Failed to create CV: " + (resultAction.payload || "Unknown error"));
            }
        } catch (err) {
            console.error("Failed to select template:", err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-8">
                <Typography variant="h4" className="mb-6 text-center">
                    Choose a Template
                </Typography>

                {error && <Alert severity="error" className="mb-4">{error}</Alert>}

                {loading ? (
                    <div className="flex justify-center mt-20">
                        <CircularProgress />
                    </div>
                ) : (
                    <Grid container spacing={4}>
                        {templates.map((template) => (
                            <Grid item key={template.id || template._id} xs={12} sm={6} md={4}>
                                <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow">
                                    {template.previewImageUrl && (
                                        <CardMedia
                                            component="img"
                                            height="250"
                                            image={template.previewImageUrl}
                                            alt={template.name}
                                            className="object-top object-cover h-64"
                                        />
                                    )}
                                    <CardContent className="flex-grow">
                                        <Typography gutterBottom variant="h5" component="div">
                                            {template.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {template.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions className="p-4 pt-0">
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={() => handleSelectTemplate(template)}
                                        >
                                            Use This Template
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {!loading && templates.length === 0 && !error && (
                    <Typography variant="h6" className="text-center mt-10 text-gray-500">
                        No templates available at the moment.
                    </Typography>
                )}
            </div>
        </>
    );
};

export default TemplateSelection;




