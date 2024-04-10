const mongoose = require("mongoose");
const express = require("express");
const app = express();

const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/User");
const courseRoutes = require("./routes/Courses");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(cors());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

//cloudinary connection
cloudinaryConnect();

dotenv.config();
const PORT = process.env.PORT || 3000;

//routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", courseRoutes);

app.get("/", (req, res) => {
  res.send("welcome to the server");
});

mongoose
  .connect(process.env.DATABASE_URL, {})
  .then(() =>
    app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
