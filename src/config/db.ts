import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.mongodb_url);

mongoose
  .connect(process.env.mongodb_url as string)
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch(error => {
    const msg: string = 'Erro ao conectar ao MongoDB';
    console.log(msg, error);
  });
