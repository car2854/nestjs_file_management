import { Injectable } from '@nestjs/common';
import { Bucket, Storage } from '@google-cloud/storage';
// import * as path from 'path';

import {
  getFileFormatHelper,
  getNameHelper,
  getPublicUrlHelper,
} from '../helpers/index';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  private readonly bucketName = 'cloudcard2854';
  private readonly storage = new Storage();
  private readonly bucket: Bucket;

  constructor() {
    // const keyFilename = path.join(
    //   __dirname,
    //   '../../collection-map-414120-e036c2f5aee7.json',
    // );
    // this.storage = new Storage({ keyFilename });

    const projectId = process.env.PROJECT_ID;
    const clientEmail = process.env.CLIENT_EMAIL;
    const privateKey = process.env.PRIVATE_KEY;

    this.storage = new Storage({
      projectId: projectId,
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    });
    this.bucket = this.storage.bucket(this.bucketName);
  }

  private generateUUID(): string {
    return uuid.v4();
  }

  async uploadFile(
    fileData: Buffer,
    originalName: string,
    mimeType: string,
    folderName = '',
  ): Promise<{
    fileName: string;
    name: string;
    publicUrl: string;
    format: string;
  }> {
    const extensionMatch = originalName.match(/\.([^.]+)$/);
    const extension = extensionMatch[0];
    const bucket = this.storage.bucket(this.bucketName);
    if (folderName !== '' && !folderName.endsWith('/')) {
      folderName += '/';
    }
    const uuid = this.generateUUID();
    const file = bucket.file(folderName + `${uuid}${extension}`);
    await file.save(fileData, {
      contentType: mimeType,
      resumable: false,
    });
    const name = getNameHelper(file.name, folderName);
    const format = getFileFormatHelper(file.name);
    const fileName = file.name;
    const publicUrl = await getPublicUrlHelper(file.name, this.bucket);
    return {
      fileName,
      format,
      name,
      publicUrl,
    };
  }

  async createFolder(folderName: string): Promise<string> {
    const folder = this.bucket.file(`${folderName}/`);

    try {
      await folder.save('', {
        metadata: {
          contentType: 'application/x-www-form-urlencoded',
          metadata: {
            firebaseStorageDownloadTokens: '',
          },
        },
      });

      console.log(`Carpeta ${folderName} creada exitosamente.`);
      return `Carpeta ${folderName} creada exitosamente.`;
    } catch (err) {
      console.error('Error al crear la carpeta:', err);
      throw err;
    }
  }

  async listFiles(
    folderName = '',
  ): Promise<
    { fileName: string; name: string; publicUrl: string; format: string }[]
  > {
    const filesList: {
      fileName: string;
      name: string;
      publicUrl: string;
      format: string;
    }[] = [];
    const [files] = await this.storage.bucket(this.bucketName).getFiles({
      prefix: folderName,
    });
    for (const file of files) {
      const name = getNameHelper(file.name, folderName);
      if ([0, 1].includes(name.replace(folderName, '').split('/').length)) {
        const publicUrl = await getPublicUrlHelper(file.name, this.bucket);
        const format =
          name === 'atras..' ? 'back' : getFileFormatHelper(file.name);
        filesList.push({
          fileName: file.name,
          name,
          publicUrl,
          format,
        });
      }
    }
    console.log(folderName);

    console.log(filesList);

    return filesList;
  }

  async deleteFile(fileName: string): Promise<void> {
    const file = this.bucket.file(fileName);
    try {
      await file.delete();
      console.log(`Archivo ${fileName} eliminado exitosamente.`);
    } catch (err) {
      console.error('Error al eliminar el archivo:', err);
      throw err;
    }
  }

  async deleteFolder(folderName: string): Promise<void> {
    try {
      const [files] = await this.storage.bucket(this.bucketName).getFiles({
        prefix: `${folderName}`,
      });
      await Promise.all(files.map((file) => file.delete()));
    } catch (error) {
      throw new Error(
        `Error al eliminar la carpeta ${folderName} en Google Cloud Storage: ${error.message}`,
      );
    }
  }
}
