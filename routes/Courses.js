const express = require("express");
const router = express.Router();


const {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getCourse,
  enrollCourse,
  viewCourse,
} = require("../controllers/Course");

const { auth, isAdmin } = require("../middlewares/auth");
const { cloudinaryProfile } = require("../controllers/cloudinaryProfile");


// Route for creating Courses which can be only done by Admin
router.post("/courses/createCourse", auth, isAdmin, createCourse);

// Route to get Course which can be only done by Admin
router.get("/courses/getAllCourses", auth, isAdmin, getAllCourses);

// Route for update Course which can be only done by Admin
router.put("/courses/updateCourse", auth, isAdmin, updateCourse);

// Route for deleting Course which can be only done by Admin
router.delete("/courses/deleteCourse", auth, isAdmin, deleteCourse);

// get course by filtering options based on category, level, popularity
router.get("/courses/getCourse", getCourse);

// course enroll by User
router.post("/courses/enrollCourse", enrollCourse);

// view the course by user
// router.get("/viewCourse", viewCourse);

// Profile picture by cloudinary
router.post("/courses/imageUpload", cloudinaryProfile);

module.exports = router;
