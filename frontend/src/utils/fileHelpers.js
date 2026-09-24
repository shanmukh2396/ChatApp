// File helper utilities — implemented in Module 10
// Validates type/size on the client side (UX only — backend is authoritative)

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ACCEPTED_FILE_TYPES  = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

export const ACCEPTED_TYPES = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_FILE_TYPES];

export const MAX_IMAGE_SIZE = 5  * 1024 * 1024; // 5 MB
export const MAX_FILE_SIZE  = 10 * 1024 * 1024; // 10 MB

export const isImage = (mimeType) => ACCEPTED_IMAGE_TYPES.includes(mimeType);

export const validateFile = (file) => {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'File type not supported. Allowed: images, PDF, Word, Excel, text.';
  }
  const limit = isImage(file.type) ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
  if (file.size > limit) {
    const mb = limit / 1024 / 1024;
    return `File too large. Maximum allowed size is ${mb} MB.`;
  }
  return null; // null = valid
};
