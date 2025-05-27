import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import productRouter from "./products/product.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productRouter);
app.get("/", (req, res) => {
  res.send("hellow");
});

app.listen(process.env.PORT || 2000, () => {
  console.log(`Server running on port ${process.env.PORT} || 2000`);
});
