const mongoose = require("mongoose");
const express = require("express");
const app = express();

const dotenv = require("dotenv");
const userRoutes = require("./routes/User");
const courseRoutes = require('./routes/Courses')
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

app.use(express.json());
app.use(cors());

const options = {
  definition:{
    openapi:'3.0.0',
    info:{
      title:"Node js Api project for mongodb",
      version:'1.0.0'
    },
    servers:[
      {
        api:'http://localhost:4000/'
      }
    ]
  }
  // apis:[./]
}

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
  .connect(process.env.DATABASE_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
