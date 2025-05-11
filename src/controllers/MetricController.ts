import { Metrica } from "../models/Metric";
import { Request, Response } from "express";
import Color from "colors";

export class MetricController {
  static getAllMetrics = async (req: Request, res: Response) => {
    try {
      const metric = await Metrica.find({});
      res.json(metric);
    } catch (error) {
      console.log(Color.red(error));
    }
  };

  static createProject = async (req: Request, res: Response) => {
    const project = new Metrica(req.body);

    try {
      await project.save();
      res.status(200).json({ message: "Metrica creada correctamente" });
    } catch (error) {
      res.status(404).json({
        message: "Ha ocurrido un error, contacte con el administrador",
      });
    }
  };

  static getMetricById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const metric = await Metrica.findById(id);
      if (!metric) {
        const error = new Error("Metrica no encontrada");
        res.status(400).json({ error: error.message });
        return;
      }
      res.json(metric);
    } catch (error) {
      console.log(Color.red(error));
    }
  };

  static deleteMetric = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const metric = await Metrica.findByIdAndDelete(id);

      if (!metric) {
        res.status(404).json({
          success: false,
          message: "Métrica no encontrada",
        });
        return;
      }

      res.json({
        success: true,
        message: "Métrica eliminada correctamente",
        data: metric,
      });
    } catch (error) {
      console.error(Color.red("Error al eliminar métrica:"), error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor al eliminar la métrica",
      });
    }
  };

  static updateMetric = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { caracteristica, subcaracteristica, metrica, descripcion } =
      req.body;

    try {
      // Verificar si la métrica existe
      const existingMetric = await Metrica.findById(id);
      if (!existingMetric) {
        res.status(404).json({
          success: false,
          message: "Métrica no encontrada",
        });
        return;
      }

      // Verificar si la nueva métrica ya existe (excepto para este mismo registro)
      if (metrica && metrica !== existingMetric.metrica) {
        const metricExists = await Metrica.findOne({ metrica });
        if (metricExists) {
          res.status(400).json({
            success: false,
            message: "El nombre de la métrica ya está en uso",
          });
          return;
        }
      }

      // Actualizar la métrica
      const updatedMetric = await Metrica.findByIdAndUpdate(
        id,
        {
          caracteristica,
          subcaracteristica,
          metrica,
          descripcion,
        },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: "Métrica actualizada correctamente",
        data: updatedMetric,
      });
    } catch (error) {
      console.error(Color.red("Error al actualizar métrica:"), error);

      if (error.name === "ValidationError") {
        res.status(400).json({
          success: false,
          message: "Error de validación",
          errors: error.errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Error interno del servidor al actualizar la métrica",
      });
    }
  };
}
