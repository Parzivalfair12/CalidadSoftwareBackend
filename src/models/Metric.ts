import { Schema, model, Document } from "mongoose";

interface IMetrica extends Document {
  caracteristica: string;
  subcaracteristica: string;
  metrica: string;
  descripcion?: string;
  fechaCreacion: Date;
}

const MetricaSchema = new Schema<IMetrica>({
  caracteristica: {
    type: String,
    required: [true, "La característica es obligatoria"],
    trim: true,
  },
  subcaracteristica: {
    type: String,
    required: [true, "La subcaracterística es obligatoria"],
    trim: true,
  },
  metrica: {
    type: String,
    required: [true, "La métrica es obligatoria"],
    unique: true,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

MetricaSchema.path("caracteristica").validate(function (value: string) {
  return value.length <= 50;
}, "La característica no debe exceder 50 caracteres");

export const Metrica = model<IMetrica>("Metrica", MetricaSchema);
