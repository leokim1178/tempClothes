import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { getToday } from 'src/commons/libraries/utils';

interface IFeedImg {
  imgs: FileUpload[];
}
interface IUserImg {
  img: FileUpload;
}

@Injectable()
export class FileService {
  async uploadImgs({ imgs }: IFeedImg) {
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(process.env.STORAGE_BUCKET);

    const waitedImgs = await Promise.all(imgs);

    console.log('hi');
    const results = await Promise.all(
      waitedImgs.map((el) => {
        const uuid = uuidv4();
        return new Promise((resolve, reject) => {
          const imgName = `${getToday()}/${uuid}/origin/${el.filename}`;
          el.createReadStream()
            .pipe(storage.file(imgName).createWriteStream())
            .on('finish', () =>
              resolve(`${process.env.STORAGE_BUCKET}/${imgName}`),
            )
            .on('error', () => reject());
        });
      }),
    );

    return results;
  }

  async uploadImg({ img }: IUserImg) {
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME,
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(process.env.STORAGE_BUCKET);
    const uuid = uuidv4();

    const result = await new Promise((resolve, reject) => {
      const imgName = `${getToday()}/${uuid}/origin/${img.filename}`;
      img
        .createReadStream()
        .pipe(storage.file(imgName).createWriteStream())
        .on('finish', () => resolve(`${process.env.STORAGE_BUCKET}/${imgName}`))
        .on('error', () => reject());
    });
    return result;
  }
}
