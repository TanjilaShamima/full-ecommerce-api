const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const appConfig = require("../config/constant");
const { v4: uuid } = require("uuid");
const s3 = require("../config/s3");

appConfig.imageFolders.forEach((folder) => {
  const dir = path.join("../uploads/images", folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});
const videoDir = path.join("../uploads/videos");
if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

// Use memory storage for sharp processing
const storage = multer.memoryStorage();

// File Filter for image/video
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|avi/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"), false);
  }
};

const uploader = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}); // 10 MB limit

// method for image resizing and saving
const processUploadedImage = async (fileBuffer, originalname, req) => {
  const extension = path.extname(originalname).toLowerCase();
  if (!extension) {
    throw new Error("File extension is required!");
  }
  const baseName = `${uuid()}-${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}-${path.basename(originalname, extension)}`;

  const urls = {};
  const ogName = `${baseName}-og${extension}`;
  const ogPath = path.join(__dirname, `../uploads/images/og/${ogName}`);
  await sharp(fileBuffer).toFile(ogPath);
  // urls.og = `${req.protocol}://${req.get("host")}/uploads/images/og/${ogName}`;
  urls.og = `/uploads/images/og/${ogName}`;

  // save resized images
  for (const [key, size] of Object.entries(appConfig.imageSizes)) {
    if (key === "og") continue; // Skip original size
    const fileName = `${baseName}-${key}${extension}`;
    const filePath = path.join(
      __dirname,
      `../uploads/images/${key}/${fileName}`
    );
    if (size) {
      await sharp(fileBuffer).resize(size.width, size.height).toFile(filePath);
    }
    urls[key] = `/uploads/images/${key}/${fileName}`;
  }

  return urls;
};

const processUploadedImagesToS3 = async (fileBuffer, originalname) => {
  const extension = path.extname(originalname).toLowerCase();
  if (!extension) {
    throw new Error("File extension is required!");
  }
  const baseName = `${uuid()}-${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}-${path.basename(originalname, extension)}`;

  const urls = {};
  // const ogName = `${baseName}-og${extension}`;
  // urls.og = `/uploads/images/og/${ogName}`;

  // save original image
  // await sharp(fileBuffer).toFile(path.join(__dirname, `../uploads/images/og/${ogName}`));

  // save resized images
  for (const [key, size] of Object.entries(appConfig.imageSizes)) {
    let imageBuffer = fileBuffer; // Default to original buffer
    if (key === "og") imageBuffer = await sharp(fileBuffer).toBuffer();
    else
      imageBuffer = await sharp(fileBuffer)
        .resize(size.width, size.height)
        .toBuffer();
    const fileName = `${baseName}-${key}${extension}`;

    const uploadResult = await s3
      .upload({
        Bucket: appConfig.aws.bucketName,
        Key: `uploads/images/${key}/${fileName}`,
        Body: imageBuffer,
        ContentType: `image/${extension.replace(".", "")}`,
      })
      .promise();
    urls[key] = uploadResult.Location;
  }

  return urls;
};

const removeAllSizesImage = (images) => {
  Object.values(images).forEach((url) => {
    // url is like /uploads/images/lg/filename.png
    const filePath = path.join(__dirname, `..${url}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
};

const removeAllSizesImageFromS3 = async (images) => {
  for (const url of Object.values(images)) {
    const filePath = url.replace("/uploads/images/", "");
    await s3
      .deleteObject({
        Bucket: appConfig.aws.bucketName,
        Key: filePath,
      })
      .promise();
  }
};

module.exports = {
  uploader,
  processUploadedImage,
  removeAllSizesImage,
  processUploadedImagesToS3,
  removeAllSizesImageFromS3,
};
