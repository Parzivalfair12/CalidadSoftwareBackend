import { Schema, model, Document } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  status: 'Aprobado' | 'Revisión' | 'No Aprobado';
  startDate: Date;
  endDate?: Date;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'El nombre del proyecto es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Aprobado', 'Revisión', 'No Aprobado'],
      default: 'Revisión'
    },
    startDate: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria'],
      default: Date.now
    },
    endDate: {
      type: Date,
      validate: {
        validator: function(this: IProject, value: Date) {
          return !value || value > this.startDate;
        },
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      }
    },
  },
  {
    timestamps: true 
  }
);

ProjectSchema.index({ name: 1 }, { unique: true });

ProjectSchema.pre('deleteOne', async function(next) {
  const projectId = this.getQuery()._id;
  next();
});

export const Project = model<IProject>('Project', ProjectSchema);