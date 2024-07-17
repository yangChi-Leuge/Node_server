import express from "express";
import { json, urlencoded } from "body-parser";
import { connectDatabase } from "./dataBase";

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

import login from "./routes/controller/login.controller";
import signup from "./routes/controller/signup.controller";
// import refersh from "./routes/token/token.generator"
import profile from "./routes/controller/user.controller";
import news from "./routes/controller/new.controller";

const app = express();
const PORT = process.env.PORT || 8000;
const swaggerYaml = YAML.load(path.join(__dirname, "./swagger/swagger.yaml"));

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/auth", login);
app.use("/auth", signup);
// app.use("/auth", refersh);
app.use(profile);
app.use(news);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerYaml));

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
