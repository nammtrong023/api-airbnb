import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const validateFileUpload = () => {
  return new ParseFilePipe({
    validators: [
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
    ],
  });
};
