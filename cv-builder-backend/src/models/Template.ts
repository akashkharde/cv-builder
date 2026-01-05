// src/modules/templates/template.model.js
import mongoose from "mongoose";
import slugify from "slugify";

const { Schema } = mongoose;

/**
 * TemplateVersion - keep versions so existing CVs don't break when template changes
 */
const TemplateVersionSchema = new Schema(
  {
    versionNumber: { type: Number, required: true },
    layoutStructure: { type: Schema.Types.Mixed, required: true }, // JSON describing columns/sections
    defaultTheme: { type: Schema.Types.Mixed, required: true }, // fonts/colors/sizes
    previewImageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

/**
 * Template main schema
 */
const TemplateSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

    description: { type: String, default: "" },
    previewImageUrl: { type: String, default: "" },

    // core layout description (current)
    layoutStructure: {
      type: Schema.Types.Mixed,
      required: true,
      // Example shape:
      // { columns: 2, left: ["basicDetails","skills"], right: ["education","experience"] }
    },

    // default theme for this template (fonts, sizes, colors)
    defaultTheme: {
      type: Schema.Types.Mixed,
      required: true,
      // Example:
      // { fontFamily: "Inter", fontSizes: { heading: 18, body: 14 }, colors: { primary: "#2563eb", text: "#111827" } }
    },

    // optional assets used by template (icons, background images, svg paths)
    assets: [
      {
        type: { type: String, enum: ["icon", "background", "divider", "svg", "other"], default: "other" },
        url: { type: String },
        meta: { type: Schema.Types.Mixed },
      },
    ],

    // is template paid?
    isPremium: { type: Boolean, default: false },

    // is template visible/active in UI
    isActive: { type: Boolean, default: true },

    // tags for search/filter (e.g., ["minimal","modern"])
    tags: [{ type: String, index: true }],

    // optional admin/user who created the template
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

    // version history (optional but helpful)
    versions: {
      type: [TemplateVersionSchema],
      default: [],
    },

    // simple stats
    downloadCount: { type: Number, default: 0 },
    useCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Indexes
 */
TemplateSchema.index({ name: "text", description: "text", tags: 1 });
TemplateSchema.index({ slug: 1 }, { unique: true });

/**
 * Pre-validate: auto-generate slug from name if not provided
 * If slug collides, append a short suffix (timestamp-based).
 */
TemplateSchema.pre("validate", async function (next) {
  try {
    if (!this.slug && this.name) {
      const base = slugify(this.name, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
      let candidate = base;
      // quick uniqueness check — if exists, append short suffix
      const existing = await mongoose.models.Template?.findOne({ slug: candidate });
      if (existing && existing._id && this._id && existing._id.toString() !== this._id.toString()) {
        candidate = `${base}-${Date.now().toString().slice(-5)}`;
      } else if (existing && !this._id) {
        // if existing and creating new doc, append suffix
        candidate = `${base}-${Date.now().toString().slice(-5)}`;
      }
      this.slug = candidate;
    }
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Instance method: merge theme with overrides (used when rendering a CV)
 */
TemplateSchema.methods.resolveTheme = function (overrides = {}) {
  const baseTheme = this.defaultTheme || {};
  return { ...baseTheme, ...overrides };
};

/**
 * Static: get active templates with pagination (page-based)
 */
TemplateSchema.statics.list = async function ({ page = 1, limit = 10, tag, search } = {}) {
  const filter = { isActive: true };

  if (tag) filter.tags = tag;
  if (search) filter.$text = { $search: search };

  const skip = (Math.max(1, page) - 1) * limit;
  const items = await this.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
  const total = await this.countDocuments(filter);

  return { items, total, page, limit };
};

/**
 * Static: add a new version (increments versionNumber automatically)
 */
TemplateSchema.statics.addVersion = async function (templateId, { layoutStructure, defaultTheme, previewImageUrl }) {
  const t = await this.findById(templateId);
  if (!t) throw new Error("Template not found");
  const lastVersion = t.versions.length ? t.versions[t.versions.length - 1].versionNumber : 0;
  const newVersion = {
    versionNumber: lastVersion + 1,
    layoutStructure,
    defaultTheme,
    previewImageUrl,
    createdAt: new Date(),
  };
  t.versions.push(newVersion);
  // Optionally update current layout/theme to new one:
  t.layoutStructure = layoutStructure;
  t.defaultTheme = defaultTheme;
  await t.save();
  return newVersion;
};

/**
 * toJSON transform: remove __v and keep id
 */
TemplateSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Template = mongoose.models.Template || mongoose.model("Template", TemplateSchema);
export default Template;
