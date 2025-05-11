import { MetricController } from "../controllers/MetricController";
import { Router } from "express";

const router = Router();

router.get("/", MetricController.getAllMetrics);

router.post("/", MetricController.createProject);

router.get("/:id", MetricController.getMetricById);

router.put('/:id', MetricController.updateMetric);

router.delete('/:id', MetricController.deleteMetric);

export default router;
