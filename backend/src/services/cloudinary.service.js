const cloudinary = require('../config/cloudinary');
const streamifier = require('stream');

/**
 * Upload a buffer directly to Cloudinary using stream.
 * @param {Buffer} buffer - File buffer from Multer memory storage
 * @param {Object} options - Cloudinary upload options (folder, resource_type)
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'chatapp',
        resource_type: options.resource_type || 'auto',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readable = new streamifier.Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

module.exports = { uploadToCloudinary };
