import express from "express";
import { EvaluationController } from "../controllers/EvaluationController";

const router = express.Router();

router.get("/", EvaluationController.getAllEvaluations);
router.post("/", EvaluationController.createEvaluation);
router.get("/project/:projectId", EvaluationController.getEvaluationsByProject);
router.get("/:id", EvaluationController.getEvaluationById);
router.put("/:id", EvaluationController.updateEvaluation);
router.delete("/:id", EvaluationController.deleteEvaluation);

export default router;
