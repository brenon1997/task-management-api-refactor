import express from 'express';
import routes from './routes/routes';

const app = express();

app.use(express.json());
app.use(routes);

const PORT: number = parseInt(process.env.PORT || '4000', 10);

app.listen(PORT, () => {
  console.log(`Servidor online na porta ${PORT}`);
});
