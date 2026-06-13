const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Add lazy loading to images
code = code.replace(
  '`<img src="${file.previewUrl}" alt="thumb">`',
  '`<img src="${file.previewUrl}" alt="thumb" loading="lazy">`'
);

code = code.replace(
  '`<img src="${file.previewUrl}" class="queue-thumb" alt="thumb">`',
  '`<img src="${file.previewUrl}" class="queue-thumb" alt="thumb" loading="lazy">`'
);

// 2. Refactor extractExifData to use a sequential queue
const extractExifStart = `function extractExifData(fileObj) {
  const file = fileObj.rawFile;
  const fileType = file.type || "";`;

const newExtractExifStart = `const exifExtractionQueue = [];
let isExtractingExif = false;

function processExifQueue() {
  if (exifExtractionQueue.length === 0) {
    isExtractingExif = false;
    return;
  }
  isExtractingExif = true;
  const fileObj = exifExtractionQueue.shift();
  
  try {
    EXIF.getData(fileObj.rawFile, function() {
      const make = EXIF.getTag(this, "Make") || "";
      const model = EXIF.getTag(this, "Model") || "";
      const width = EXIF.getTag(this, "PixelXDimension") || EXIF.getTag(this, "ImageWidth") || "-";
      const height = EXIF.getTag(this, "PixelYDimension") || EXIF.getTag(this, "ImageHeight") || "-";
      const shutter = EXIF.getTag(this, "ExposureTime");
      const aperture = EXIF.getTag(this, "FNumber");
      const iso = EXIF.getTag(this, "ISOSpeedRatings");
      
      if (make || model) {
        fileObj.exif.camera = \`\${make} \${model}\`.trim();
      } else {
        fileObj.exif.camera = "Digital DSLR Camera";
      }
      
      if (width !== "-" && height !== "-") {
        fileObj.exif.resolution = \`\${width} x \${height} Pixels\`;
      } else {
        fileObj.exif.resolution = "HD Capture";
      }
      
      fileObj.exif.type = "JPEG Photograph";
      
      let expString = [];
      if (shutter) {
        const shutterFrac = shutter < 1 ? \`1/\${Math.round(1/shutter)}\` : shutter;
        expString.push(\`\${shutterFrac}s\`);
      }
      if (aperture) expString.push(\`f/\${aperture}\`);
      if (iso) expString.push(\`ISO \${iso}\`);
      
      if (expString.length > 0) {
        fileObj.exif.exposure = expString.join(", ");
      } else {
        fileObj.exif.exposure = "Auto Settings";
      }
      
      // Update UI if this file is currently selected
      if (currentFile && currentFile.id === fileObj.id) {
        document.getElementById('meta-resolution').textContent = fileObj.exif.resolution;
        document.getElementById('meta-file-type').textContent = fileObj.exif.type;
        document.getElementById('meta-camera').textContent = fileObj.exif.camera;
        document.getElementById('meta-exposure').textContent = fileObj.exif.exposure;
      }
      
      // Process next file in queue
      setTimeout(processExifQueue, 5); // tiny delay to free up UI thread
    });
  } catch (e) {
    setTimeout(processExifQueue, 5);
  }
}

function extractExifData(fileObj) {
  const file = fileObj.rawFile;
  const fileType = file.type || "";`;

code = code.replace(extractExifStart, newExtractExifStart);

const oldExifGetDataMarker = `  try {
    EXIF.getData(file, function() {
      const make = EXIF.getTag(this, "Make") || "";
      const model = EXIF.getTag(this, "Model") || "";
      const width = EXIF.getTag(this, "PixelXDimension") || EXIF.getTag(this, "ImageWidth") || "-";
      const height = EXIF.getTag(this, "PixelYDimension") || EXIF.getTag(this, "ImageHeight") || "-";
      const shutter = EXIF.getTag(this, "ExposureTime");
      const aperture = EXIF.getTag(this, "FNumber");
      const iso = EXIF.getTag(this, "ISOSpeedRatings");
      
      if (make || model) {
        fileObj.exif.camera = \`\${make} \${model}\`.trim();
      } else {
        fileObj.exif.camera = "Digital DSLR Camera";
      }
      
      if (width !== "-" && height !== "-") {
        fileObj.exif.resolution = \`\${width} x \${height} Pixels\`;
      } else {
        fileObj.exif.resolution = "HD Capture";
      }
      
      fileObj.exif.type = "JPEG Photograph";
      
      let expString = [];
      if (shutter) {
        const shutterFrac = shutter < 1 ? \`1/\${Math.round(1/shutter)}\` : shutter;
        expString.push(\`\${shutterFrac}s\`);
      }
      if (aperture) expString.push(\`f/\${aperture}\`);
      if (iso) expString.push(\`ISO \${iso}\`);
      
      if (expString.length > 0) {
        fileObj.exif.exposure = expString.join(", ");
      } else {
        fileObj.exif.exposure = "Auto Settings";
      }
    });
  } catch (e) {
    console.error("Exif extraction failed", e);
  }`;

const oldExifGetDataReplacement = `  exifExtractionQueue.push(fileObj);
  if (!isExtractingExif) {
    processExifQueue();
  }`;

code = code.replace(oldExifGetDataMarker, oldExifGetDataReplacement);

fs.writeFileSync('app.js', code);
console.log("Patched performance successfully!");
