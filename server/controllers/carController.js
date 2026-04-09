const { default: slugify } = require("slugify");
const carModel = require("../models/carModel");
const orderModel = require("../models/orderModel");
const fs = require("fs");
const dotenv = require("dotenv");
const brandModel = require("../models/carBrand");
const multer = require("multer");
const path = require("path");
const { google } = require("googleapis");

dotenv.config();

// ================= MULTER (UPLOAD) =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ================= GOOGLE DRIVE =================
const KEYFILEPATH = path.join(__dirname, "cred.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: "v3", auth });

const FOLDER_ID = "1LbbwJK78fjf_ZWYc1HZF5SwwU6reXomQ";

// Upload to Google Drive
const uploadFileToGoogleDrive = async (filePath, fileName) => {
  const fileMetadata = {
    name: fileName,
    parents: [FOLDER_ID],
  };

  const media = {
    mimeType: "image/jpeg",
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "webViewLink",
  });

  return response.data;
};

// ================= CREATE CAR =================
const createCar = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      price,
      fuelType,
      transmission,
      engineSize,
      mileage,
      safetyrating,
      warranty,
      seater,
      size,
      fuelTank,
    } = req.body;

    // ✅ Updated Validation (brand removed)
    const requiredFields = [
      "name",
      "description",
      "price",
      "fuelType",
      "transmission",
    ];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).send({
          success: false,
          message: `${field} is Required`,
        });
      }
    }

    // ✅ Upload images (safe check)
    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      uploadedFiles = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadFileToGoogleDrive(
            file.path,
            file.filename
          );
          return result.webViewLink;
        })
      );
    }

    const slug = slugify(name);

    const car = new carModel({
      name,
      slug,
      description,
      brand: brand || null, // ✅ optional
      productPictures: uploadedFiles,
      price,
      fuelType,
      transmission,
      engineSize,
      mileage,
      safetyrating,
      warranty,
      seater,
      size,
      fuelTank,
    });

    await car.save();

    // ✅ Only update brand if exists
    if (brand) {
      const category = await brandModel.findById(brand);
      if (category) {
        category.carInvoleInThisBrand.push(car);
        await category.save();
      }
    }

    res.status(201).send({
      success: true,
      message: "Car Created Successfully",
      car,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Error in creating Car",
      error: err.message,
    });
  }
};
// ================= GET ALL CARS =================
const getAllCar = async (req, res) => {
  try {
    const cars = await carModel.find({}).populate("brand");

    res.status(200).send({
      success: true,
      totalCar: cars.length,
      message: "All cars",
      cars,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error in Getting Car",
      error: err.message,
    });
  }
};

// ================= GET SINGLE CAR =================
const getCarById = async (req, res) => {
  try {
    const car = await carModel
      .findOne({ slug: req.params.slug })
      .populate("brand");

    res.status(200).send({
      success: true,
      message: "Car By this Id",
      car,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error in Finding Car Id",
      err,
    });
  }
};

// ================= DELETE CAR =================
const deleteCar = async (req, res) => {
  try {
    await carModel.findByIdAndDelete(req.params.pid);

    res.status(200).send({
      success: true,
      message: "Car Deleted Successfully",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error in Deleting Car",
      err,
    });
  }
};

// ================= UPDATE CAR =================
const updatecar = async (req, res) => {
  try {
    const car = await carModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.body, slug: slugify(req.body.name) },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Car Updated Successfully",
      car,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error in Updating Car",
      err,
    });
  }
};

// ================= RELATED CAR =================
const relatedCar = async (req, res) => {
  try {
    const { cid, bid } = req.params;

    const cars = await carModel.find({
      brand: bid,
      _id: { $ne: cid },
    });

    res.status(200).send({
      success: true,
      message: "Related Cars",
      cars,
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Error While Fetching Related Cars",
      err,
    });
  }
};

// ❌ REMOVED BRAINTREE COMPLETELY

module.exports = {
  upload,
  createCar,
  getAllCar,
  getCarById,
  deleteCar,
  updatecar,
  relatedCar,
};