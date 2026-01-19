import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import restaurantRoutes from "../src/routes/restaurants.route.js";
import cityRoutes from "../src/routes/cities.route.js";

dotenv.config();

const PORT = process.env.PORT || 3003;

const app = express();

app.use(cors());
app.use("/restaurants", restaurantRoutes);
app.use("/cities", cityRoutes);

app.listen(PORT, () => {
  console.log("Server started on PORT", PORT);
});
