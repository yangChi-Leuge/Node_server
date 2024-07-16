import express from "express";
import { json, urlencoded } from "body-parser";
import { connectDatabase } from "./dataBase";
import login from "./routes/controller/login.controller";
import signup from "./routes/controller/signup.controller";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./swagger/swagger";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/auth", login);
app.use("/auth", signup);


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

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
