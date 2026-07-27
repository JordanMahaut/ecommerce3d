require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const orderRoutes = require("./routes/order.routes");
const questionRoutes = require("./routes/question.routes");
const adminQuestionRoutes = require("./routes/admin/question.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads")),
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/admin/questions", adminQuestionRoutes);


app.use(errorHandler);
app.get("/", (req, res) => {
  res.json({
    message: "API Ecommerce 3D OK",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});