const User = require("../model/User");
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName,email } = req.body;

    const todo = await User.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        firstName,
        email,
        updateAt: Date.now(),
      }
    );
    res.status(200).json({
      success: true,
      data: todo,
      message: "Update Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
      message: "Server error",
    });
  }
};
