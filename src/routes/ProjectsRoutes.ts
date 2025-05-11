import express from "express";
import { projectsController } from "../controllers/ProjectsController";
const router = express.Router();

router.get("/", projectsController.getAllProjects);
router.post("/", projectsController.createProject);
router.get("/:id", projectsController.getProjectById);
router.put("/:id", projectsController.updateProject);
router.delete("/:id", projectsController.deleteProject);

export default router;
