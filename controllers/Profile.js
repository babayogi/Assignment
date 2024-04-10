const User = require("../model/User");

exports.getProfile = async (req, res) => {
  try {
    // fetch all items from database
    const items = await User.find({});

    // Response
    res.status(200).json({
      success: true,
      data: items,
      message: "Entire Profile is Fetched",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Server error",
    });
  }
};