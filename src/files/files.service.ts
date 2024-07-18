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
    // const privateKey = process.env.PRIVATE_KEY;

    this.storage = new Storage({
      projectId: projectId,
      credentials: {
        client_email: clientEmail,
        private_key:
          '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCko+kjyL4u9jxr\nBrNaEKb6miZbSh7WZ4ielWmCgeBMJPIbvVgneAUfvDvTu8hmgcQ6krjgCbb15vhU\nf9a0gHkg1fE0csJQ6qbiFZSL/gZENvw2HLD+Uji0RtgTFocvZyQiS5mLL3Z40yxO\na8ybHa8cBfuh3pJAsrm3S4s90sozVEPqQUFF+oUT80IUlPx+KpH2DDyN3mDYftYU\nlUVIDIB8Jn2uhLNnopQfbgKZYmS37j0h7UDeQayh2mOY/wRswVCSpbr2vZTwmAZZ\nYaYT7RVNe8xs8e6eUnG01Ks379XsvR2V8uQoDvC4AHEJ2o+jvbpV4cQVtV60JK/T\nurGfjRQnAgMBAAECggEARMHFSDH6Ju+jrMi4Fyl0Kp083owWU9EaL6xTS3ME4pfd\nWnNZQOZxMV8xlwvJtfGEqzeCKOI1u/0xAU0ANBKhQ3LFkHNKrnNIrYt4pXw5Tryt\n2MVjr1pUHwmlDFewrj3DS+VJouR39B6w1rFTWgZsDmZ7P48NgiKBx8gvRurkkcl3\nb2/r9dcBFom0b7soHNYD8XHt0bzBtOQSQdZCgndLZy7ApjkF1xk9dhJKZ0rsghg4\n8Auya8yNZuPcHMrDM/8U954CjAUQ1eQLX9qYqjLSMdzCJBq0KmVPt7hhOl4ivHD4\nKnmigqikT4rIkSnOtOWCRr0vhPKFT18WynBq4ecQUQKBgQDh2wUks7JuPGx1B0yY\not+I7jNyFoool/ILN4wyW7C7US9cLux2yC272jXfPosMLOpFp+oEOxId3IX/exN4\ncg5I4X0ejxMZOnNTZbr/oBs+qFSMSL+0cJ/pBZ7RQZ4CeOkp97YZU+RhW8vW7NOn\nwZFo6TdRq73s8ISMG2j4YzyI9wKBgQC6nU0rK3RYi4WrYUV98Fi55VtqFhqCYbqU\nvFcXu8h0Qq38/MLki3LWgk8l3F12avkWm25tkysOijQxFAVHO8YDZZxeOQYWf3f+\ncwWw0ppwVce4AerKz3YZnJAzqhXcIIiGMTqu5+j235aVVZHmUc4K8ZajdlrZyjTn\nss7evqayUQKBgBNOR3hFrADkRVkTkKaTdYwc4GTmLFUf996hluhPEiJQ5D16/VeB\n8PbXxjcY/4XA6R2fJs/JxNismv+lo5puFW6BZ9KO5FEJwAXm8j8bjniipud+6HQi\nFGk0w8ibVUhc0YF23Sf5FdKEqD3s7IKwdx+Cn+npRkjUnl/jj+t7gBctAoGAE1tp\nu8agJOckEGjgmnWp3m6KEvEEAu48Ol1m81FJM7YO8iUN2kMUwGd36kd3cmcaO1wY\nEkmnt7RiQY0AFyl+GrAZjjSACylhuwUXXAYcevaK5u1b+3mVmIaC9rj314OQZcsJ\neUcZBTKgHhFoNunZY403wPDv75Nn9Xi4uKYyCGECgYEAjvvgIRit6AMifNvpjUDP\nYMMBnB7MoA22R3YSTYR1acOsiaGIZsPHjYUCJTMBTd3cK1gzlXm3ifSWI2PXP/OJ\nifVQw1+XfmFk3hpvb9BntMFxWckwpQo9PZ31IaXW1gB1cS3hHMkcjXGrscBpt5Ed\nwwjJMV1/btOZAmN+v8TYNos=\n-----END PRIVATE KEY-----\n',
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
    // Generar una UUID
    const uuid = this.generateUUID();
    const file = bucket.file(folderName + `${uuid}${extension}`);
    await file.save(fileData, {
      contentType: mimeType,
      resumable: false,
    });
    const name = getNameHelper(file.name, folderName);
    const format = getFileFormatHelper(file.name);
    const fileName = file.name;
    // Obtener una URL compartida, ya que los archivos se suben en privado
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
        // Dar un formato a los archivos, el back es cuando no tiene ningun formato y solo es el archivo si mismo, usarlo para volver atras
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
