export const getNameHelper = (name: string, folderName: string) => {
  const replace = name.replace(folderName, '');
  if (name === folderName) return 'atras..';
  if (replace.endsWith('/')) return replace.slice(0, -1);
  return replace;
};
