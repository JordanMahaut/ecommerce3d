require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const apiLimiter = require("./middleware/rateLimit.middleware");
const errorHandler = require("./middleware/error.middleware");
const swaggerSpec = require("./config/swagger");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const orderRoutes = require("./routes/order.routes");
const questionRoutes = require("./routes/question.routes");
const adminQuestionRoutes = require("./routes/admin/question.routes");
const dashboardRoutes = require("./routes/dashboard.routes")

const app = express();

// Sécurité
app.use(helmet());
app.use(compression());

// Middlewares
app.use(cors());
app.use(express.json());

// Documentation Swagger
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);

// Limite les requêtes sur les routes API
app.use("/api", apiLimiter);

// Fichiers statiques
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads")),
);

// Route de test
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Ecommerce 3D OK",
  });
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/admin/questions", adminQuestionRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Gestion globale des erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});