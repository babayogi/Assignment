const User = require("../model/User");
const Course = require("../model/Course");

// Create Course
exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Get all required fields from request body
    let { category, level, popularity } = req.body;

    // Check if any of the required fields are missing
    if (!category || !level || !popularity) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    // Check if the user is an Student
    const instructorDetails = await User.findById(userId, {
      accountType: "Student",
    });

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Student Details Not Found",
      });
    }

    // Create a new course with the given details
    const newCourse = await Course.create({
      category,
      level,
      popularity,
    });

    // Add the new course to the User Schema
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    

    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// Get Course List
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find();
    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

// Update Course Details
exports.updateCourse = async (req, res) => {
  try {
    const { courseId, category, level, popularity } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
    { _id: courseId},
    {category,level,popularity},
    {new:true}
    )
    

    return res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete the course
    await Course.findByIdAndDelete(
      courseId,
      {
        $pull: {
          _id: course._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Get Course by filtering options based on parameters such as category, level, popularity and pagination
exports.getCourse = async(req,res) => {
try{
  
  // Pagination parameters
  const page = parseInt(req.query.page) ?? 1;
  const limit = parseInt(req.query.limit) ?? 10;
 

  // Filtering options
  const category = req.query.category;
  const level = req.query.level;
  const popularity = req.query.popularity;

  const dbquery = {}

  if (category) dbquery["category"]= category;
  if (level) dbquery["level"] = level;
  if (popularity) dbquery["popularity"] = popularity;

  const courses = await Course.find(dbquery)
    .sort({ created_at: -1 })
    .limit(limit)
    .skip(limit * page)
    .lean();

  return res.status(200).json({
    success: true,
    data:courses ,
  });
}
catch(error){
   console.log(error);
   return res.status(404).json({
     success: false,
     message: `Can't Fetch Course Data`,
     error: error.message,
   });
}
}

exports.enrollCourse = async(req,res)=> {
  try{
    const { courseId, userId } = req.body;

    // If there is no CourseId found
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if the user is already enrolled in the course
    if (course.user.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: "User is already enrolled in the course",
      });
    }

    // Enroll the user in the course
    course.user.push(userId)

    // save in Database
    await course.save();

    // return response
    res.status(200).json({ message: "Enrollment successful" });
  }
  catch(error){
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
}

