import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import routes from './routes';
import express from "express";

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT;

app.use(bodyParser.json());
app.use(routes);

app.listen(port, () => console.log(`Quickstart app listening at http://localhost:${port}`));
