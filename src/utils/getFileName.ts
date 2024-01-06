const getFileName = (url: string) => {
  const getFilenameFromURL = (url: string): string => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const filename = getFilenameFromURL(url);

  return filename;
};

export default getFileName;
