const { uploadToCloudinary } = require('../services/cloudinary.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * @desc    Upload an image or document to Cloudinary
 * @route   POST /api/uploads
 * @access  Private
 */
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 400, 'Please select a file to upload');
    }

    const isImage = req.file.mimetype.startsWith('image/');
    const folder = isImage ? 'chatapp/images' : 'chatapp/files';
    const resourceType = isImage ? 'image' : 'raw';

    const result = await uploadToCloudinary(req.file.buffer, {
      folder,
      resource_type: resourceType,
    });

    const attachment = {
      url: result.secure_url,
      publicId: result.public_id,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
    };

    return sendSuccess(res, 200, 'File uploaded successfully', attachment);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadFile };
