// scripts/updateModernTemplate.js
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cv-builder";

async function run() {
    try {
        await mongoose.connect(MONGODB_URI, {});
        const templatesCollection = mongoose.connection.collection("templates");

        const modernLayout = {
            columns: 2,
            left: ["basicDetails", "skills", "socialProfiles"],
            right: ["basicDetails", "experience", "education", "projects"]
        };

        await templatesCollection.updateOne(
            { slug: "modern" },
            {
                $set: {
                    layoutStructure: modernLayout,
                    "versions.0.layoutStructure": modernLayout,
                    tags: ["modern", "two-column", "minimal"],
                    updatedAt: new Date()
                }
            }
        );
        console.log("Updated Modern template to 2-column.");

        process.exit(0);
    } catch (err) {
        console.error("Update failed:", err);
        process.exit(1);
    }
}

run();
