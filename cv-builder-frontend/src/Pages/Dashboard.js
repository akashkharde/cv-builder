import React from "react";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * TEMP data – replace with API response
 */
const mockCVs = [
  {
    _id: "695b69d6c4bd9cdab8f92d23",
    name: "Classic",
    slug: "classic",
    description: "A classic two-column CV layout with profile on left.",
    previewImageUrl: "/assets/templates/classic.png",
    layoutStructure: { columns: 2, left: ["basicDetails", "skills"], right: ["education", "experience", "projects"] },
    defaultTheme: {
      fontFamily: "Inter",
      fontSizes: { heading: 18, body: 14 },
      colors: { primary: "#2563eb", text: "#111827", background: "#ffffff" },
      spacing: { sectionGap: 12 },
    },
    isPremium: false,
    tags: ["classic", "two-column", "professional"],
    assets: [],
    isActive: true,
    versions: [
      {
        versionNumber: 1,
        layoutStructure: { columns: 2, left: ["basicDetails", "skills"], right: ["education", "experience", "projects"] },
        defaultTheme: { fontFamily: "Inter", fontSizes: { heading: 18, body: 14 }, colors: { primary: "#2563eb", text: "#111827", background: "#ffffff" } },
        previewImageUrl: "/assets/templates/classic.png",
        createdAt: { date: "2026-01-05T07:35:50.032Z" },
      },
    ],
    createdAt: { date: "2026-01-05T07:35:50.032Z" },
    updatedAt: { date: "2026-01-05T07:35:50.032Z" },
  },
];

/**
 * Extracts a usable ISO/string date from several possible shapes the backend may return.
 * Accepts: ISO string, Date object, { date: "..." }, or nested objects.
 */
const extractDateString = (value) => {
  if (!value) return null;

  // If it's a string (likely ISO)
  if (typeof value === "string") return value;

  // If it's a Date instance
  if (value instanceof Date) return value.toISOString();

  // If it's an object with .date (your current shape)
  if (typeof value === "object") {
    if (value.date && typeof value.date === "string") return value.date;
    // common mongoose shapes sometimes store { "$date": "..." }
    if (value.$date && typeof value.$date === "string") return value.$date;
  }

  return null;
};

const formatDate = (raw) => {
  const dateStr = extractDateString(raw);
  if (!dateStr) return "-";
  const dt = new Date(dateStr);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toLocaleDateString();
};

const Dashboard = () => {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    if (!id) return;
    navigate(`/editor/${id}`);
  };

  const handlePreview = (id) => {
    if (!id) return;
    navigate(`/preview/${id}`);
  };

  const handleDownload = (id) => {
    // Payment check placeholder
    alert(`Payment required to download CV: ${id}`);
  };

  const handleShare = (id) => {
    // Payment check placeholder
    alert(`Payment required to share CV: ${id}`);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h5">My CVs</Typography>
          <Button variant="contained" onClick={() => navigate("/editor/new")}>
            Create New CV
          </Button>
        </div>

        {/* Empty state */}
        {mockCVs.length === 0 && (
          <div className="text-center mt-20">
            <Typography variant="h6" color="text.secondary">
              No CVs created yet
            </Typography>
            <Button variant="contained" className="mt-4" onClick={() => navigate("/editor/new")}>
              Create Your First CV
            </Button>
          </div>
        )}

        {/* CV List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCVs.map((cv) => {
            const id = cv._id || cv.id;
            const title = cv.name || cv.title || "Untitled CV";
            // Prefer updatedAt, fallback to versions' latest createdAt, fallback to createdAt
            const updatedRaw =
              cv.updatedAt ||
              (Array.isArray(cv.versions) && cv.versions.length ? cv.versions[cv.versions.length - 1].createdAt : null) ||
              cv.createdAt;
            const updatedAt = formatDate(updatedRaw);

            return (
              <Card key={id} className="shadow-md">
                {/* preview image (if present) */}
                {cv.previewImageUrl && (
                  <div className="w-full h-40 overflow-hidden rounded-t-md">
                    <img
                      src={cv.previewImageUrl}
                      alt={`${title} preview`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <CardContent>
                  <Typography variant="h6" className="mb-1">
                    {title}
                  </Typography>

                  {cv.description && (
                    <Typography variant="body2" color="text.secondary" className="mb-2">
                      {cv.description}
                    </Typography>
                  )}

                  <div className="flex flex-wrap gap-2 mb-2">
                    {(cv.tags || []).slice(0, 5).map((t) => (
                      <Chip key={t} label={t} size="small" />
                    ))}
                  </div>

                  <Typography variant="body2" color="text.secondary">
                    Last updated: {updatedAt}
                  </Typography>
                </CardContent>

                <CardActions className="flex justify-between">
                  <div>
                    <IconButton onClick={() => handlePreview(id)} aria-label="preview">
                      <VisibilityIcon />
                    </IconButton>

                    <IconButton onClick={() => handleEdit(id)} aria-label="edit">
                      <EditIcon />
                    </IconButton>
                  </div>

                  <div>
                    <IconButton onClick={() => handleDownload(id)} aria-label="download">
                      <PictureAsPdfIcon />
                    </IconButton>

                    <IconButton onClick={() => handleShare(id)} aria-label="share">
                      <ShareIcon />
                    </IconButton>
                  </div>
                </CardActions>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
