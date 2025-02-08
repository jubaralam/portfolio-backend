const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    poster: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    status: { type: String, default: "progress" },
    technologies: {
      type: [String],
      required: true,
    },
    learnings: {
      type: [String],
      required: true,
    },
    github_link: { type: [String], required: true },
    project_url: {
      type: String,
      required: true,
    },
    video_demo_link: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

const ProjectModel = mongoose.model("project", projectSchema);

module.exports = ProjectModel;
