const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
} = require("../controllers/Auth");

const { getProfile } = require("../controllers/Profile");
const { updateProfile } = require("../controllers/updateProfile");

// Route for user signup and login
router.post("/users/signup", signUp);
router.post("/users/login", login);

// Route for view profile
router.get("/users/getProfile", getProfile);

// Route for update profile
router.put("/users/updateProfile/:id", updateProfile);


module.exports = router;
