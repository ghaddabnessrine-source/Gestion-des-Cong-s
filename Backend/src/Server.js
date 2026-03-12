import "dotenv/config";
import express from "express";

import congeRoutes from "./routes/congeRoutes.js";
import typeCongeRoutes from "./routes/typeCongeRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(express.json());

app.use("/conges", congeRoutes);
app.use("/type-conges", typeCongeRoutes);
app.use("/roles", roleRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

app.listen( 3000, () => {
  console.log("Server running");
});