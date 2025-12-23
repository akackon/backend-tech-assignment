import express from "express";
import swaggerUi from "swagger-ui-express";
import { questionRoutes } from "./routes/question-routes.js";
import { quizRoutes } from "./routes/quiz-routes.js";
import { connectDatabase } from "./config/database.js";
import { swaggerSpec } from "./config/swagger.js";

const appServer = express();

appServer.use(express.json());

// Swagger UI
appServer.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

appServer.use(questionRoutes);
appServer.use(quizRoutes);

// Connect to database then start server
connectDatabase().then(() => {
  appServer.listen(3000, () => {
    console.log("Server is running on port 3000");
    console.log(
      "📚 API Documentation available at http://localhost:3000/api-docs"
    );
  });
});
