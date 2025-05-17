import mongoose, { Schema, Document } from "mongoose";

export interface IEvaluation extends Document {
  projectId: mongoose.Types.ObjectId;
  date: Date;
  metrics: {
    metricId: mongoose.Types.ObjectId;
    value: number;
    observations: string;
  }[];
  result?: number;
  status: "Draft" | "Completed" | "Approved" | "Rejected";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EvaluationSchema = new Schema<IEvaluation>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    metrics: [
      {
        metricId: {
          type: Schema.Types.ObjectId,
          ref: "Metrica",
          required: true,
        },
        value: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        observations: {
          type: String,
          default: "",
        },
      },
    ],
    result: {
      type: Number,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["Borrador", "Completado", "Aprobado", "Rechazado"],
      default: "Draft",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

EvaluationSchema.pre<IEvaluation>("save", function (next) {
  if (this.status !== "Draft" && !this.result) {
    this.result =
      this.metrics.reduce((sum, m) => sum + m.value, 0) / this.metrics.length;
  }
  next();
});

export const Evaluation = mongoose.model<IEvaluation>(
  "Evaluation",
  EvaluationSchema
);
