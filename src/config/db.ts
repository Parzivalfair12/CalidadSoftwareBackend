import mongoose from "mongoose";
import Color from "colors";
import { exit } from "node:process";

export const ConnectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL)
    const url = `${connection.connection.host}:${connection.connection.port}`
    console.log(Color.magenta(`MongoDB conectado en: ${url}`))
  } catch (error) {
    console.log(Color.red('Error al conectar a MongoDB'));
    exit(1);
  }
};
