#!/usr/bin/node

const express = require("express");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
var bodyParser = require("body-parser");
const cors = require("cors");

/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
const MONGO_URI =
  "mongodb+srv://moss-art:FunAtMossArt@cluster0.pa3bndl.mongodb.net/Moss-Art";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const imageSchema = {
  canvas: String,
  title: String,
  category: String,
  creator: String,
  upload_date: String,
  description: String
};

const Image = mongoose.model("Images", imageSchema);

const app = express();
app.use(express.json());
app.use(express.static("express"));

// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(
  fileUpload({
    createParentPath: true
  })
);
app.use(cors());

// Tested OK
app.post("/uploadMediaFile", function (req, res) {
  console.log("/uploadMediaFile POST");
  try {
    if (!req.files) {
      res.status(500).send({
        uploaded: false,
        message: "No file uploaded"
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let image = req.files.targetFile;

      //Use the mv() method to place the file in the upload directory (i.e. "uploads")
      image.mv(__dirname + "/media/" + image.name);

      //send response
      res.send({
        status: true,
        message: "File is uploaded",
        data: {
          name: image.name,
          mimetype: image.mimetype,
          size: image.size
        }
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Tested OK
app.post("/uploadMediaData", async function (req, res) {
  console.log("/uploadMediaData POST", req.body);

  const meta = new Image(req.body);

  meta.save(function (err, obj) {
    if (err) {
      res.status(400).send({ message: err.message });
    }

    // All good
    res.status(200).send({ message: "image data saved!", meta_data: obj });
  });
});

// Tested OK
app.get("/media", async function (req, res) {
  console.log("/media GET");
  res.sendFile(__dirname + "/media/" + req.query.filename);
});

// Tested OK
app.get("/mediaDataFilename", async function (req, res) {
  console.log("/mediaDataFilename GET");
  const foundImage = await Image.findOne({
    canvas: req.query.filename.split(".")[0]
  });
  if (foundImage) {
    res.status(200).send(foundImage);
  } else {
    res.status(400).send({ message: "No Document Found" });
  }
});

// Tested OK
app.get("/mediaPaths", function (req, res) {
  console.log("/mediaPaths GET");
  var files = fs.readdirSync(__dirname + "/media/");
  res.send({ Files: files });
});

app.delete("/media", function (req, res) {
  console.log("/media DELETE");
  //deleting file
  const filename = req.query.filename;

  Image.deleteOne({ canvas: filename.split(".")[0] }, function (err, result) {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      fs.unlink(__dirname + "/media/" + filename, (err) => {
        if (err) {
          res.status(500).send({ message: err.message });
        } else {
          res.status(200).send({
            message: "Image file and mongo document deleted successfully!",
            result: result
          });
        }
      });
    }
  });
});

app.delete("/mediaAll", function (req, res) {
  console.log("/mediaAll DELETE");
  var files = fs.readdirSync(__dirname + "/media/");

  Image.deleteMany({}, function (err, result) {
    if (err) {
      res.status(500).send({ message: err.message });
    }
  });
  files.forEach(function (file) {
    fs.unlink(__dirname + "/media/" + file, (err) => {
      if (err) {
        res.status(500).send({ message: err.message, deleteCount: fileCount });
      }
    });
  });
  res.status(200).send({
    message: `Successfully deleted all image files and metadata`
  });
});

app.use("/", function (req, res) {
  console.log("/ HOMEPAGE");
  res.sendFile(path.join(__dirname + "/express/index.html"));
});

app.listen(3000, function () {
  console.log("App is running on Port 3000");
});

// =========================================================================================================
