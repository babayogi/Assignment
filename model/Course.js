const mongoose = require("mongoose");

// Define the Courses schema
const coursesSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  popularity: {
    type: String,
    required: true,
  },
  user:[
     {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ]
});

// Export the Courses model
module.exports = mongoose.model("Course", coursesSchema);
