const fs = require("fs");
const unzipper = require("unzipper");

fs.createReadStream("Soni Times Mobile App UI (4).zip")
  .pipe(unzipper.Extract({ path: "SoniTimesUI" }))
  .on("close", () => console.log("✅ Extraction complete"));
