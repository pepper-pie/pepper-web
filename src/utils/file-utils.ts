/**
 * Helper function to download a file from a Blob.
 * 
 * @param blob - The file content as a Blob.
 * @param fileName - The name of the file to be downloaded.
 */
export const downloadFile = (blob: Blob, fileName: string) => {
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(downloadUrl); // Clean up the URL object
};