import { Request, Response } from "express";
import Color from "colors";
import { Evaluation } from "../models/Evaluation";
import { Project } from "../models/Projects";
import { Metrica } from "../models/Metric";

export class EvaluationController {
  static getAllEvaluations = async (req: Request, res: Response) => {
    try {
      const evaluations = await Evaluation.find({})
        .populate("projectId", "name status")
        .populate(
          "metrics.metricId",
          "metrica caracteristica subcaracteristica"
        );

      res.json(evaluations);
    } catch (error) {
      console.error(Color.red("Error getting evaluations:"), error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  static createEvaluation = async (req: Request, res: Response) => {
    try {
      const { projectId, metrics, ...evaluationData } = req.body;

      // Validar que el proyecto exista
      const project = await Project.findById(projectId);
      if (!project) {
        res.status(404).json({
          success: false,
          message: "Project not found",
        });
        return;
      }

      // Validar métricas
      const validMetrics = await Promise.all(
        metrics.map(async (m: any) => {
          const metric = await Metrica.findById(m.metricId);
          if (!metric) throw new Error(`Metric ${m.metricId} not found`);
          return {
            metricId: m.metricId,
            value: m.value,
            observations: m.observations || "",
          };
        })
      );

      const evaluation = new Evaluation({
        projectId,
        metrics: validMetrics,
        ...evaluationData,
        date: new Date(evaluationData.date),
      });

      await evaluation.save();

      res.status(201).json({
        success: true,
        message: "Evaluation created successfully",
        data: evaluation,
      });
    } catch (error) {
      console.error(Color.red("Error creating evaluation:"), error);
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error creating evaluation",
      });
    }
  };

  static getEvaluationById = async (req: Request, res: Response) => {
    try {
      const evaluation = await Evaluation.findById(req.params.id)
        .populate("projectId")
        .populate("metrics.metricId");

      if (!evaluation) {
        res.status(404).json({
          success: false,
          message: "Evaluation not found",
        });
        return;
      }

      res.json({
        success: true,
        data: evaluation,
      });
    } catch (error) {
      console.error(Color.red("Error getting evaluation:"), error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  static updateEvaluation = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { metrics, ...updateData } = req.body;

      let validMetrics;
      if (metrics) {
        validMetrics = await Promise.all(
          metrics.map(async (m: any) => {
            if (!m.metricId) throw new Error("MetricId is required");
            const metric = await Metrica.findById(m.metricId);
            if (!metric) throw new Error(`Metric ${m.metricId} not found`);
            return {
              metricId: m.metricId,
              value: m.value,
              observations: m.observations || "",
            };
          })
        );
      }

      const update = {
        ...updateData,
        ...(validMetrics && { metrics: validMetrics }),
      };

      const evaluation = await Evaluation.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      });

      if (!evaluation) {
        res.status(404).json({
          success: false,
          message: "Evaluation not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Evaluation updated successfully",
        data: evaluation,
      });
    } catch (error) {
      console.error(Color.red("Error updating evaluation:"), error);
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error updating evaluation",
      });
    }
  };

  static deleteEvaluation = async (req: Request, res: Response) => {
    try {
      const evaluation = await Evaluation.findByIdAndDelete(req.params.id);

      if (!evaluation) {
        res.status(404).json({
          success: false,
          message: "Evaluation not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Evaluation deleted successfully",
      });
    } catch (error) {
      console.error(Color.red("Error deleting evaluation:"), error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  static getEvaluationsByProject = async (req: Request, res: Response) => {
    try {
      const evaluations = await Evaluation.find({
        projectId: req.params.projectId,
      })
        .sort({ date: -1 })
        .populate("metrics.metricId");

      res.json({
        success: true,
        data: evaluations,
      });
    } catch (error) {
      console.error(Color.red("Error getting project evaluations:"), error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
