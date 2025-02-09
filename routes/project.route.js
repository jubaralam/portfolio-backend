const express = require("express");
const projectRouter = express.Router();

const upload = require("../middleware/multer.middleware");

const uploadOnCloudinary = require("../utils/cloudinary");
const ProjectModel = require("../models/project.model");
const fs = require("fs");
projectRouter.post("/add", upload.single("file"), async (req, res) => {
  console.log("received file", req.file);
  console.log("received body", req.body);

  const cleanedBody = Object.fromEntries(
    Object.entries(req.body).map(([key, value]) => [key.trim(), value])
  );

  const {
    title,

    description,
    status,
    technologies,
    github_link,
    project_url,
    video_demo_link,
    learnings,
    project_type,
  } = cleanedBody;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const localFilePath = req.file.path;
    const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

    // Delete local file after upload
    // fs.unlinkSync(localFilePath);
    try {
      fs.unlinkSync(localFilePath);
    } catch (unlinkError) {
      console.error("Error deleting local file:", unlinkError.message);
    }
    if (!cloudinaryResponse) {
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }

    if (
      !title ||
      !description ||
      !status ||
      !technologies ||
      !github_link ||
      !project_url ||
      !video_demo_link ||
      !learnings
    ) {
      return res.status(401).send({ message: "All fields are required" });
    }
    const technologiesArray = technologies.split(",");
    const gitLinks = github_link.split(",");
    const learningsArray = learnings.split(",");

    const newProject = new ProjectModel({
      poster: cloudinaryResponse.secure_url,
      project_type,
      title,
      learnings: learningsArray,
      description,
      status,
      technologies: technologiesArray,
      github_link: gitLinks,
      project_url,
      video_demo_link,
    });

    const savedProject = await newProject.save();
    res.status(201).json({
      message: "Congratulations! New Project has been created",
      savedProject,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

projectRouter.get("/", async (req, res) => {
  try {
    const projects = await ProjectModel.find();

    if (projects <= 0) {
      return res.status(404).send({ error: "projects not found" });
    }

    res.status(200).send({ data: projects });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
projectRouter.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const project = await ProjectModel.findById(id);

    if (!project) {
      return res.status(404).send({ error: "projects not found" });
    }

    res.status(200).send({ data: project });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

projectRouter.get("/latest", async (req, res) => {
  const { limit = 3 } = req.query;

  try {
    const projects = await ProjectModel.find().sort({ updatedAt: -1 }).limit(3);

    if (projects <= 0) {
      return res.status(404).send({ error: "projects not found" });
    }

    res.status(200).send({ data: projects });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
module.exports = projectRouter;
