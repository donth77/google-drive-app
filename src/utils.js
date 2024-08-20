export function convertTimestamp(timestamp) {
  const date = new Date(timestamp);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return date.toLocaleString(undefined, options);
}

export function getFileType(mimeType) {
  const formattedGoogleDriveMimeTypes = {
    "application/vnd.google-apps.document": "Document",
    "application/vnd.google-apps.spreadsheet": "Spreadsheet",
    "application/vnd.google-apps.presentation": "Presentation",
    "application/vnd.google-apps.form": "Form",
    "application/vnd.google-apps.drawing": "Drawing",
    "application/vnd.google-apps.map": "Map",
    "application/vnd.google-apps.site": "Site",
    "application/vnd.google-apps.script": "Script",
    "application/vnd.google-apps.folder": "Folder",
    "application/vnd.google-apps.shortcut": "Shortcut",
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "Word",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "Excel",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PowerPoint",
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/gif": "GIF",
    "image/bmp": "BMP",
    "image/tiff": "TIFF",
    "image/webp": "WEBP",
    "video/mp4": "MP4",
    "video/mpeg": "MPEG",
    "video/quicktime": "MOV",
    "video/x-msvideo": "AVI",
    "video/x-ms-wmv": "WMV",
    "video/webm": "WEBM",
    "video/x-flv": "FLV",
    "application/zip": "ZIP",
    "text/plain": "Text",
    "application/octet-stream": "Binary",
  };

  if (formattedGoogleDriveMimeTypes.hasOwnProperty(mimeType)) {
    return formattedGoogleDriveMimeTypes[mimeType];
  }
  return "Other";
}

export function getExportFileType(mimeType) {
  const exportTypes = {
    "application/vnd.google-apps.document":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.google-apps.spreadsheet":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.google-apps.presentation":
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.google-apps.form": "Form",
    "application/vnd.google-apps.drawing": "image/jpeg",
    "application/vnd.google-apps.script": "application/json",
  };
  if (exportTypes.hasOwnProperty(mimeType)) {
    return exportTypes[mimeType];
  }
  return mimeType;
}

export function binaryStringToArrayBuffer(binaryString) {
  const length = binaryString.length;
  const buffer = new ArrayBuffer(length);
  const view = new Uint8Array(buffer);

  for (let i = 0; i < length; i++) {
    view[i] = binaryString.charCodeAt(i);
  }

  return buffer;
}
