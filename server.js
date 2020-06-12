const express = require("express");
const fs = require("fs");
const next = require("next");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

function saveImage(baseImage) {
  //path of folder where you want to save the image.
  const localPath = `${__dirname}/public/assets/img/users/`;
  //Find extension of file
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );
  const fileType = baseImage.substring("data:".length, baseImage.indexOf("/"));
  //Forming regex to extract base64 data of file.
  const regex = new RegExp(`^data:${fileType}/${ext};base64,`, "gi");
  //Extract base64 data.
  const base64Data = baseImage.replace(regex, "");
  const filename = `user-${Date.now()}.${ext}`;

  //Check that if directory is present or not.
  if (!fs.existsSync(localPath)) {
    fs.mkdirSync(localPath);
  }
  fs.writeFileSync(localPath + filename, base64Data, "base64");
  return localPath.split("/public")[1] + filename;
}

app.prepare().then(() => {
  const server = express();

  server.use(express.json());

  server.post("/upload", (req, res) => {
    let image;
    if (req.body.image) image = saveImage(req.body.image);

    res.status(200).json({
      status: "success",
      image,
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`App running on port ${port}...`);
  });
});
