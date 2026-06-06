require("dotenv").config();

const express = require("express");
const cors = require("cors");

const sequelize = require("./config/db");

const User = require("./models/User");
const Store = require("./models/Store");
const Rating = require("./models/Rating");

const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const storeOwnerRoutes = require("./routes/storeOwnerRoutes");


User.hasMany(Rating);
Rating.belongsTo(User);

Store.hasMany(Rating);
Rating.belongsTo(Store);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/store-owner", storeOwnerRoutes);

sequelize.sync()
  .then(() => {
    console.log("Database Synced");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Roxiler Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});