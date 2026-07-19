require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const path = require("path");

const app = express();

const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");



app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads")),
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "API Ecommerce 3D OK"
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});