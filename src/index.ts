import express from 'express';
import dotenv from 'dotenv';
import Router from './config/router';
import bodyParser from 'body-parser'
import Db from './config/database'

dotenv.config()

const app = express();
app.use(bodyParser.json())

global.Pool = new Db();
const port = process.env.PORT as string || 3000;

new Router(app).init()

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});