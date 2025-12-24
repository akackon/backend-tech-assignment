import express from "express";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import { questionRoutes } from "./routes/question-routes.js";
import { quizRoutes } from "./routes/quiz-routes.js";
import { connectDatabase } from "./config/database.js";
import { swaggerSpec } from "./config/swagger.js";

// Load environment variables
dotenv.config();

const appServer = express();
const PORT = process.env.PORT || 3000;

appServer.use(express.json());

// Swagger UI
appServer.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

appServer.use(questionRoutes);
appServer.use(quizRoutes);

// Connect to database then start server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  connectDatabase().then(() => {
    appServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(
        `📚 API Documentation available at http://localhost:${PORT}/api-docs`
      );
    });
  });
}

export default appServer;
