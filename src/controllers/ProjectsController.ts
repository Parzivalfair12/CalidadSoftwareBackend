import { Request, Response } from "express";
import { Project } from "../models/Projects";

export const projectsController = {
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = await Project.find()

      const formattedProjects = projects.map((project) => ({
        _id: project._id,
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate.toISOString().split("T")[0],
        endDate: project.endDate?.toISOString().split("T")[0],
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      }));

      res.json(formattedProjects);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener proyectos",
        error: error.message,
      });
    }
  },

  async createProject(req: Request, res: Response) {
    try {
      const { name, description, status, startDate, endDate, metrics } =
        req.body;

      const project = new Project({
        name,
        description,
        status,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : undefined,
      });

      await project.save();

      const newProject = await Project.findById(project._id);

      res.status(201).json({
        success: true,
        project: {
          ...newProject.toObject(),
          startDate: newProject.startDate.toISOString().split("T")[0],
          endDate: newProject.endDate?.toISOString().split("T")[0],
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error al crear proyecto",
        error: error.message,
      });
    }
  },

  async getProjectById(req: Request, res: Response) {
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        res.status(404).json({
          success: false,
          message: "Proyecto no encontrado",
        });
        return;
      }

      res.json({
        success: true,
        project: {
          ...project.toObject()
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener proyecto",
        error: error.message,
      });
    }
  },

  async updateProject(req: Request, res: Response) {
    try {
      const { name, description, status, startDate, endDate, metrics } =
        req.body;

      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        {
          name,
          description,
          status,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
        },
        { new: true, runValidators: true }
      );

      if (!updatedProject) {
        res.status(404).json({
          success: false,
          message: "Proyecto no encontrado",
        });
        return;
      }

      res.json({
        success: true,
        project: {
          ...updatedProject.toObject(),
          startDate: updatedProject.startDate.toISOString().split("T")[0],
          endDate: updatedProject.endDate?.toISOString().split("T")[0],
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Error al actualizar proyecto",
        error: error.message,
      });
    }
  },

  async deleteProject(req: Request, res: Response) {
    try {
      const project = await Project.findByIdAndDelete(req.params.id);

      if (!project) {
        res.status(404).json({
          success: false,
          message: "Proyecto no encontrado",
        });
        return;
      }

      res.json({
        success: true,
        message: "Proyecto eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar proyecto",
        error: error.message,
      });
    }
  },
};
