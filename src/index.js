import express from "express";
import bodyParser from "body-parser";
import { dataSource } from "./db/db.js";
//import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import trainingsessionsRouter from "./routes/trainingsessions.js";
import cors from "cors";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
//endpoints
//app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/trainingsessions", trainingsessionsRouter);

dataSource
  .initialize()
  .then(() => {
    console.log("Connected to database");

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
