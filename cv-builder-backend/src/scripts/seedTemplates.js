// scripts/seedTemplates.js
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cv-builder";

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, {});

    const templatesCollection = mongoose.connection.collection("templates");

    const existing = await templatesCollection.countDocuments();
    if (existing > 0) {
      console.log("Templates already exist in DB — skipping seed.");
      process.exit(0);
    }

    const now = new Date();

    const templates = [
      {
        name: "Classic",
        slug: "classic",
        description: "A classic two-column CV layout with profile on left.",
        previewImageUrl: "https://cdn-images.zety.com/pages/two-column-resume-ztus-cta-02.webp",
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
            defaultTheme: {
              fontFamily: "Inter",
              fontSizes: { heading: 18, body: 14 },
              colors: { primary: "#2563eb", text: "#111827", background: "#ffffff" },
            },
            previewImageUrl: "https://cdn-images.zety.com/pages/two-column-resume-ztus-cta-02.webp",
            createdAt: now,
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Modern",
        slug: "modern",
        description: "Minimal modern layout with emphasis on experience.",
        previewImageUrl: "https://cdn-images.zety.com/pages/two-column-resume-ztus-cta-02.webp",
        layoutStructure: {
          columns: 2,
          left: ["basicDetails", "skills", "socialProfiles"],
          right: ["basicDetails", "experience", "education", "projects"]
        },
        defaultTheme: {
          fontFamily: "Poppins",
          fontSizes: { heading: 20, body: 15 },
          colors: { primary: "#111827", text: "#1f2937", background: "#fff" },
          spacing: { sectionGap: 10 },
        },
        isPremium: true,
        tags: ["modern", "two-column", "minimal"],
        assets: [],
        isActive: true,
        versions: [
          {
            versionNumber: 1,
            layoutStructure: {
              columns: 2,
              left: ["basicDetails", "skills", "socialProfiles"],
              right: ["basicDetails", "experience", "education", "projects"]
            },
            defaultTheme: {
              fontFamily: "Poppins",
              fontSizes: { heading: 20, body: 15 },
              colors: { primary: "#111827", text: "#1f2937", background: "#fff" },
            },
            previewImageUrl: "https://cdn-images.zety.com/pages/two-column-resume-ztus-cta-02.webp",
            createdAt: now,
          },
        ],
        createdAt: now,
        updatedAt: now,
      },
    ];

    const result = await templatesCollection.insertMany(templates);
    console.log("Inserted templates:", result.insertedCount);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

run();
