import React, { useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ShareIcon from "@mui/icons-material/Share";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchCVs, deleteCV } from "../Redux/features/cv/cvThunks";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const dispatch = useDispatch();
  const { cvs, loading, error } = useSelector((state) => state.cv);


  useEffect(() => {
    dispatch(fetchCVs());
  }, [dispatch]);

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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this CV?")) {
      dispatch(deleteCV(id));
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h5">My CVs</Typography>
          <Button variant="contained" onClick={() => navigate("/templates")}>
            Create New CV
          </Button>
        </div>

        {error && (
          <Alert severity="error" className="mb-4">{error}</Alert>
        )}

        {loading ? (
          <div className="flex justify-center mt-20">
            <CircularProgress />
          </div>
        ) : (
          <>
            {/* Empty state */}
            {cvs.length === 0 && !error && (
              <div className="text-center mt-20">
                <Typography variant="h6" color="text.secondary">
                  No CVs created yet
                </Typography>
                <Button variant="contained" className="mt-4" onClick={() => navigate("/templates")}>
                  Create Your First CV
                </Button>
              </div>
            )}

            {/* CV List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => {
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
                    {cv.previewImageUrl ? (
                      <div className="w-full h-40 overflow-hidden rounded-t-md">
                        <img
                          src={cv.previewImageUrl}
                          alt={`${title} preview`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none' }} // Fallback: hide if broken
                        />
                      </div>
                    ) : (
                      // Optional: Add a placeholder block if no image
                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-t-md">
                        <span className="text-gray-400">No Preview</span>
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

                        <IconButton onClick={() => handleDelete(id)} aria-label="delete" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </CardActions>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
