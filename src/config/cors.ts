import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whiteList = [
        process.env.FRONTEND_URL,
        "http://localhost:4000", // Vite default
        "http://localhost:5174",
        "http://localhost:5173", // Tu puerto actual
        "http://127.0.0.1:5173", // Alternativa IPv4
        "http://127.0.0.1:5174"  // Alternativa para tu puerto
    ];

    // Permitir solicitudes sin origen (Postman/curl) en desarrollo
    if (process.env.NODE_ENV === "development" && !origin) {
      return callback(null, true);
    }
    
    // Comparación flexible (incluye protocolo + host + puerto exactos)
    if (origin && whiteList.some(url => url === origin)) {
      callback(null, true);
    } else {
      console.error("Error CORS - Origen no permitido:", origin);
      callback(new Error("Error de CORS: Origen no permitido"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"]
};