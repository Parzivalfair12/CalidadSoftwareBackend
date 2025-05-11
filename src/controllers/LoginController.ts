import { Request, Response } from "express";
import { User } from "../models/User";

export class LoginController {
  static Login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        res.status(400).json({
          success: false,
          message: "Credenciales inválidas",
        });
        return;
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        res.status(400).json({
          success: false,
          message: "Credenciales inválidas",
        });
        return;
      }

      res.json({
        success: true,
        message: "Inicio de sesión exitoso",
        name: user.name,
      });
    } catch (error) {
      console.error("Error en el login:", error);
      res.status(500).json({
        success: false,
        message: "Error en el servidor",
      });
    }
  };
}
