const File = require("../model/File");
const cloudinary = require("cloudinary").v2;

exports.cloudinaryProfile = async (req, res) => {
  function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
  }

  async function uploadFileToCloudinary(file, folder, quality) {
    const options = { folder };
    console.log("temp file path:", file.tempFilePath);
    if (quality) {
      options.quality = quality;
    }
    options.resource_type = "auto"; // automatically detect the file type
    return await cloudinary.uploader.upload(file.tempFilePath, options);
  }

  try {
    // data fetch
    const { name } = req.body;
    console.log(name);

    // imageFile is the name of image which we will use as Profile Picture
    const file = req.files.imageFile;
    console.log(file);

    // validation that the file is only jpg, jpeg, png
    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File format not supported",
      });
    }

    // file formatted supported so upload to cloudinary
    const response = await uploadFileToCloudinary(file, "Assign"); //Assign is folder name which we have named in cloudinary.com
    console.log(response);

    // Save in Database
    const fileData = await File.create({
      name,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "Image successfully Uploaded",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Something wrong",
    });
  }
};
