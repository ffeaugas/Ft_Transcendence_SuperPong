import { HttpException } from '@nestjs/common';
import { diskStorage } from 'multer';

const storage = diskStorage({
  destination: './uploads/avatar',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split('.').pop();
    const oldname = file.originalname.split('.')[0];
    callback(null, `${oldname}-${uniqueSuffix}.${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new HttpException(
        'Invalid file type. Only JPEG and PNG are allowed.',
        401,
      ),
    );
  }
  callback(null, true);
};

export const multerConfig = {
  storage,
  fileFilter,
};
