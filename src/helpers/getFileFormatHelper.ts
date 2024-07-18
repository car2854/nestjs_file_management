export const getFileFormatHelper = (fileName: string) => {
  const fileParts = fileName.split('.');
  return fileName.endsWith('/') ? 'folder' : fileParts[fileParts.length - 1]; // Devuelve la extensión
};
