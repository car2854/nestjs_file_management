import { Bucket } from '@google-cloud/storage';

export const getPublicUrlHelper = async (fileName: string, bucket: Bucket) => {
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 3600 * 1000, // 1 hora de validez
  };
  const file = bucket.file(fileName);
  try {
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: options.expires,
    });
    return url;
  } catch (err) {
    console.error('Error al obtener la URL pública del archivo:', err);
    throw err;
  }
};
