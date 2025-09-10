const fs = require("fs");
const AdmZip = require("adm-zip");

// put your zip file name here
const zipFile = "Soni Times Mobile App UI (4).zip";

// create output folder
const outputDir = "SoniTimesUI";
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// extract
try {
  const zip = new AdmZip(zipFile);
  zip.extractAllTo(outputDir, true);
  console.log(`✅ Extracted to folder: ${outputDir}`);
} catch (err) {
  console.error("❌ Error extracting zip:", err);
}
