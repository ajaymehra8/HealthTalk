const multer = require("multer");
const sharp = require("sharp");
const { storage } = require("../config/firebase");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { v4: uuidv4 } = require("uuid");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};
const multerFilter2 = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Not an file! Please upload only images."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
const upload2 = multer({
  storage: multerStorage,
  fileFilter: multerFilter2,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

const uploadUserPhoto = upload.single("image");
const uploadDoctorPdf = upload2.single("degree");

const resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();
  req.file.buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();

  next();
};
const uploadPdfToFirebase = async (req, res, next) => {
  if (!req.file) return next();

  const fileBuffer = req.file.buffer;
  const fileExtension =
    req.file.mimetype === "application/pdf"
      ? "pdf"
      : req.file.mimetype.split("/")[1];
  const uniqueId = uuidv4();
  const timestamp = Date.now();
  const fileName = `${uniqueId}-${timestamp}.${fileExtension}`;

  try {
    const metadata = {
      contentType: "application/pdf", // Ensure correct Content-Type
    };

    const storageRef = ref(storage, `doctors/degrees/${fileName}`);
    const uploadResult = await uploadBytes(storageRef, fileBuffer, metadata);
    const downloadUrl = await getDownloadURL(uploadResult.ref);

    req.file.fileName = downloadUrl; // Add file URL to request object
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const uploadPhotoToFirebase = async (req, res, next) => {
  if (!req.file) return next();

  const fileBuffer = req.file.buffer;
  const fileExtension = req.file.mimetype.split("/")[1]; // Extract file extension from mimetype
  const uniqueId = uuidv4();
  const timestamp = Date.now();
  const fileName = `${uniqueId}-${timestamp}.${fileExtension}`;

  try {
    const metadata = {
      contentType: req.file.mimetype, // Use the file's mimetype for correct Content-Type
    };

    const storageRef = ref(storage, `users/${fileName}`);
    const uploadResult = await uploadBytes(storageRef, fileBuffer, metadata);
    const downloadUrl = await getDownloadURL(uploadResult.ref);

    req.file.fileName = downloadUrl;

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  uploadUserPhoto,
  uploadDoctorPdf,
  resizeUserPhoto,
  uploadPhotoToFirebase,
  uploadPdfToFirebase,
};
