import React from "react";
import { Typography, Box, Paper, LinearProgress } from "@mui/material";

/**
 * ModernCVRenderer - High-fidelity two-column layout
 * Matches the reference image with dark blue sidebar and white main content.
 */
const ModernCVRenderer = ({ cvData }) => {
    if (!cvData) return null;

    const {
        basicDetails = {},
        education = [],
        experience = [],
        projects = [],
        skills = [],
        socialProfiles = [],
    } = cvData;

    // Design Tokens
    const sidebarBg = "#003d73";
    const sidebarHeadingColor = "#FFFFFF";
    const sidebarTextColor = "#cbd5e1";
    const mainHeadingColor = "#003d73";
    const mainTextColor = "#334155";
    const dateColor = "#64748b";

    const titleStyle = (isSidebar) => ({
        color: isSidebar ? sidebarHeadingColor : mainHeadingColor,
        borderBottom: isSidebar ? "1px solid #ffffff44" : "1px solid #003d7344",
        paddingBottom: "4px",
        marginBottom: "16px",
        fontSize: "1rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "1px",
    });

    const renderSidebarSection = (title, icon, content) => (
        <Box className="mb-10">
            <Typography variant="h6" style={titleStyle(true)}>
                {title}
            </Typography>
            {content}
        </Box>
    );

    const renderMainSection = (title, content) => (
        <Box className="mb-10">
            <Typography variant="h6" style={titleStyle(false)}>
                {title}
            </Typography>
            {content}
        </Box>
    );

    return (
        <Paper className="min-h-[1100px] overflow-hidden flex flex-col md:flex-row shadow-none rounded-none border-none bg-white">
            {/* Left Column (Sidebar) */}
            <Box
                className="w-full md:w-1/3 flex-shrink-0"
                style={{ backgroundColor: sidebarBg }}
            >
                {/* Header: Large Name in Sidebar */}
                <Box className="p-8 pt-16 pb-12">
                    <Typography variant="h3" className="font-bold text-white leading-tight uppercase tracking-tighter" style={{ fontSize: "2.5rem" }}>
                        {basicDetails.name?.split(' ').map((part, i) => (
                            <React.Fragment key={i}>
                                {part}<br />
                            </React.Fragment>
                        ))}
                    </Typography>
                </Box>

                <Box className="p-8 pt-0">
                    {/* Contact Section */}
                    {renderSidebarSection("Contact", null, (
                        <Box className="space-y-4">
                            {basicDetails.address && (
                                <Box>
                                    <Typography variant="body2" className="font-bold text-white">Address</Typography>
                                    <Typography variant="body2" style={{ color: sidebarTextColor }}>{basicDetails.address}</Typography>
                                </Box>
                            )}
                            {basicDetails.phone && (
                                <Box>
                                    <Typography variant="body2" className="font-bold text-white">Phone</Typography>
                                    <Typography variant="body2" style={{ color: sidebarTextColor }}>{basicDetails.phone}</Typography>
                                </Box>
                            )}
                            {basicDetails.email && (
                                <Box>
                                    <Typography variant="body2" className="font-bold text-white">E-mail</Typography>
                                    <Typography variant="body2" style={{ color: sidebarTextColor }}>{basicDetails.email}</Typography>
                                </Box>
                            )}
                        </Box>
                    ))}

                    {/* Skills Section */}
                    {skills.length > 0 && renderSidebarSection("Skills", null, (
                        <ul className="list-disc pl-5 text-white space-y-2">
                            {skills.map((skill, i) => (
                                <li key={i}>
                                    <Typography variant="body2" style={{ color: sidebarTextColor }}>
                                        {skill.skillName}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    ))}

                    {/* Placeholder for Languages - Can be added later if needed */}
                </Box>
            </Box>

            {/* Right Column (Main Content) */}
            <Box className="w-full md:w-2/3 p-12 pt-16 bg-white overflow-visible">
                {/* Intro Paragraph */}
                <Box className="mb-10">
                    <Typography variant="body2" style={{ color: mainTextColor, lineHeight: "1.6", fontSize: "0.95rem" }}>
                        {basicDetails.introductoryParagraph}
                    </Typography>
                </Box>

                {/* Work History */}
                {experience.length > 0 && renderMainSection("Work History", (
                    <Box className="space-y-8">
                        {experience.map((exp, i) => (
                            <Box key={i} className="flex flex-col md:flex-row">
                                <Box className="w-full md:w-36 flex-shrink-0 mb-1 md:mb-0">
                                    <Typography variant="body2" style={{ color: dateColor, fontWeight: 500 }}>
                                        {exp.joiningDate ? new Date(exp.joiningDate).getFullYear() : ""} - {exp.leavingDate ? (new Date(exp.leavingDate).getFullYear()) : "Present"}
                                    </Typography>
                                </Box>
                                <Box className="flex-grow">
                                    <Typography variant="subtitle1" className="font-bold" style={{ color: "#1e293b", lineHeight: "1.2" }}>
                                        {exp.position}
                                    </Typography>
                                    <Typography variant="subtitle2" style={{ color: "#64748b", fontStyle: "italic", marginBottom: "8px" }}>
                                        {exp.organizationName}
                                    </Typography>
                                    {exp.description && (
                                        <ul className="list-disc pl-5 space-y-1">
                                            {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                                                <li key={idx}>
                                                    <Typography variant="body2" style={{ color: mainTextColor }}>
                                                        {line.replace(/^\s*-\s*/, '')}
                                                    </Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ))}

                {/* Certifications (using projects data) */}
                {projects.length > 0 && renderMainSection("Project Details", (
                    <ul className="list-disc pl-5 space-y-2">
                        {projects.map((p, i) => (
                            <li key={i}>
                                <Typography variant="body2" className="font-bold" style={{ color: "#1e293b", display: "inline" }}>
                                    {p.projectTitle || p.title}:
                                </Typography>
                                <Typography variant="body2" style={{ color: mainTextColor, display: "inline", marginLeft: "4px" }}>
                                    {p.description}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                ))}

                {/* Education */}
                {education.length > 0 && renderMainSection("Education", (
                    <Box className="space-y-6">
                        {education.map((edu, i) => (
                            <Box key={i} className="flex flex-col md:flex-row">
                                <Box className="w-full md:w-36 flex-shrink-0 mb-1 md:mb-0">
                                    <Typography variant="body2" style={{ color: dateColor, fontWeight: 500 }}>
                                        {edu.endDate ? new Date(edu.endDate).getFullYear() : ""}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" className="font-bold" style={{ color: "#1e293b" }}>
                                        {edu.degreeName}
                                    </Typography>
                                    <Typography variant="subtitle2" style={{ color: "#64748b", fontStyle: "italic" }}>
                                        {edu.institution}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default ModernCVRenderer;
