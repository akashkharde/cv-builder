import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Typography,
    CircularProgress,
    Paper,
    Box,
    Button,
    Container,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import Navbar from "./Navbar";
import { fetchCVById } from "../Redux/features/cv/cvThunks";
import ModernCVRenderer from "../components/ModernCVRenderer";

const CVPreview = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentCV, loading } = useSelector((state) => state.cv);
    const [cvData, setCvData] = useState(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchCVById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (currentCV) {
            const data = {
                basicDetails: currentCV.data?.basicDetails || {},
                education: Array.isArray(currentCV.data?.education) ? currentCV.data.education : [],
                experience: Array.isArray(currentCV.data?.experience) ? currentCV.data.experience : [],
                projects: Array.isArray(currentCV.data?.projects) ? currentCV.data.projects : [],
                skills: Array.isArray(currentCV.data?.skills) ? currentCV.data.skills : [],
                socialProfiles: Array.isArray(currentCV.data?.socialProfiles) ? currentCV.data.socialProfiles : [],
            };
            setCvData(data);
        }
    }, [currentCV]);

    const handleDownload = () => {
        alert(`Payment required to download CV: ${id}`);
    };

    if (loading || !cvData) {
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
            <Container maxWidth="md" className="py-8">
                <Box className="flex justify-between items-center mb-6">
                    <Typography variant="h4" component="h1">
                        CV Preview
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                    >
                        Download PDF
                    </Button>
                </Box>

                {currentCV?.layoutId?.slug === 'modern' || currentCV?.layoutId?.columns === 2 ? (
                    <ModernCVRenderer cvData={cvData} />
                ) : (
                    <Paper className="p-8 min-h-[100vh]">
                        {/* Header / Basic */}
                        <Box className="text-center mb-6">
                            <Typography variant="h4" className="font-bold">
                                {cvData.basicDetails.name || "Your Name"}
                            </Typography>
                            <Typography variant="body1">
                                {cvData.basicDetails.email || ""}{" "}
                                {cvData.basicDetails.phone ? `| ${cvData.basicDetails.phone}` : ""}
                            </Typography>
                            {cvData.basicDetails.address && (
                                <Typography variant="body2">{cvData.basicDetails.address}</Typography>
                            )}
                        </Box>

                        {/* Summary */}
                        {cvData.basicDetails.introductoryParagraph && (
                            <div className="mb-6">
                                <Typography variant="h6" className="border-b mb-2">
                                    Summary
                                </Typography>
                                <Typography variant="body2">{cvData.basicDetails.introductoryParagraph}</Typography>
                            </div>
                        )}

                        {/* Experience */}
                        {cvData.experience.length > 0 && (
                            <div className="mb-6">
                                <Typography variant="h6" className="border-b mb-2">
                                    Experience
                                </Typography>
                                {cvData.experience.map((exp, i) => (
                                    <div key={i} className="mb-4">
                                        <Typography variant="subtitle1" className="font-bold">
                                            {exp.position || "Position"}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {exp.organizationName || ""} {exp.duration ? `| ${exp.duration}` : ""}
                                        </Typography>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Education */}
                        {cvData.education.length > 0 && (
                            <div className="mb-6">
                                <Typography variant="h6" className="border-b mb-2">
                                    Education
                                </Typography>
                                {cvData.education.map((edu, i) => (
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
                        {cvData.projects.length > 0 && (
                            <div className="mb-6">
                                <Typography variant="h6" className="border-b mb-2">
                                    Projects
                                </Typography>
                                {cvData.projects.map((p, i) => (
                                    <div key={i} className="mb-4">
                                        <Typography variant="subtitle1" className="font-bold">
                                            {p.projectTitle || p.title || "Project Title"}
                                        </Typography>
                                        <Typography variant="subtitle2">
                                            {p.technologies ? (Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies) : ""}
                                            {p.duration ? ` | ${p.duration}` : ""}
                                        </Typography>
                                        {p.description && <Typography variant="body2">{p.description}</Typography>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Skills */}
                        {cvData.skills.length > 0 && (
                            <div className="mb-6">
                                <Typography variant="h6" className="border-b mb-2">
                                    Skills
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {cvData.skills.map((skill, i) => (
                                        <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">
                                            {skill.skillName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Profiles */}
                        {cvData.socialProfiles.length > 0 && (
                            <div className="mb-6">
                                <Typography variant="h6" className="border-b mb-2">
                                    Social Profiles
                                </Typography>
                                <div className="flex flex-wrap gap-4">
                                    {cvData.socialProfiles.map((profile, i) => (
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
                    </Paper>
                )}
            </Container>
        </>
    );
};

export default CVPreview;
