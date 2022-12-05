let media_paths = [];
const APP_URL = "http://localhost:3000/";

// Converts any given blob into a base64 encoded string.
function convertBlobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

async function update_media_paths() {
  let res = await fetch(APP_URL + "mediaPaths");
  let data = await res.json();
  media_paths = data.Files;
}

async function post_media(file, meta_data) {
  await post_mediaData(meta_data);
  await post_mediaFile(file);
}

async function post_mediaFile(file) {
  const fd = new FormData();
  fd.append("targetFile", file);

  // send `POST` request
  try {
    let res = await fetch(APP_URL + "uploadMediaFile", {
      method: "POST",
      body: fd
    });
  } catch (err) {
    console.error(err);
  }
}

async function post_mediaData(meta_data) {
  console.log(meta_data);
  // send `POST` request
  try {
    let res = await fetch(APP_URL + "uploadMediaData", {
      method: "POST",
      body: JSON.stringify(meta_data),
      headers: {
        "Content-Type": "application/json"
      }
    });
    data = res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

async function uploadMedia() {
  let title = $("#art-title").val();
  let canvas = $("#art-canvas").val();
  let category = $("#art-category").val();
  let creator = $("#art-creator").val();
  let file = document.getElementById("artFile").files[0];

  var blob = file.slice(0, file.size, "image/jpg");
  newFile = new File([blob], `${canvas}.jpg`, { type: "image/jpg" });

  var date = new Date();
  date = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  let description = $("#art-description").val();
  let dateHolder = Date.parse(date);

  if (title == "") {
    alert("Task must have a title!");
  }
  if (isNaN(dateHolder)) {
    alert("The date fromat is incorrect!");
  }

  const meta_data = {
    canvas: canvas,
    title: title,
    category: category,
    creator: creator,
    upload_date: date,
    description: description
  };

  await post_media(newFile, meta_data);

  // put file up on the canvas
  await populateCanvas();
}

async function addImageToCanvas(fileName) {
  try {
    const fetchResult = await fetch(APP_URL + `?image=${fileName}`);

    const canvas = fileName.split(".")[0];
    $(`#${canvas}`).empty();

    image.src = await convertBlobToBase64(await fetchResult.blob());
  } catch (error) {
    console.error(error);
  }
}

async function getImageMetaData(filename) {
  let res = await fetch(
    APP_URL + "mediaDataFilename" + `?filename=${filename}`
  );
  let data = await res.json();
  return data;
}

async function populateCanvas() {
  await update_media_paths();

  media_paths.forEach(async function (path) {
    let filename = path.split(".")[0];

    let fileAttr = filename.split("_");

    let texture = $(`#${filename}`).children("imageTexture");
    texture.attr("url", APP_URL + "media?" + `filename=${path}`);

    let parent = $(`#${filename}`).parent();
    parent.attr("hasImage", "true");

    const data = await getImageMetaData(filename);

    document.getElementById(fileAttr[0] + "_title_" + fileAttr[1]).string =
      data.title;
    document.getElementById(fileAttr[0] + "_create_" + fileAttr[1]).string =
      "By - " + data.creator;

    parent.click(function () {
      if (parent.attr("hasImage") == "true") {
        // Get the modal
        document.getElementById("imgModal").style.display = "block";
        var img = document.getElementById("imgContent");
        img.src = APP_URL + "media?" + `filename=${path}`;
        $("#img-text-content").empty();
        let title = $("<p>", { text: `Title - ${data.title}` });
        let desc = $("<p>", { text: `Description - ${data.description}` });
        let created = $("<p>", { text: `Created By - ${data.creator}` });
        let cat = $("<p>", { text: `Category - ${data.category}` });
        let dt = $("<p>", { text: `Uploaded on - ${data.upload_date}` });
        $("#img-text-content").append(title);
        $("#img-text-content").append(desc);
        $("#img-text-content").append(created);
        $("#img-text-content").append(cat);
        $("#img-text-content").append(dt);
      }
    });
  });
}

// ================================= ON LOAD ====================================

$(document).ready(function () {
  //onclick for snap to view

  document.getElementById("a-snap").onclick = function () {
    document.getElementById("a-snap-view").setAttribute("set_bind", "true");
  };

  document.getElementById("b-snap").onclick = function () {
    document.getElementById("b-snap-view").setAttribute("set_bind", "true");
  };

  document.getElementById("c-snap").onclick = function () {
    document.getElementById("c-snap-view").setAttribute("set_bind", "true");
  };

  document.getElementById("d-snap").onclick = function () {
    document.getElementById("d-snap-view").setAttribute("set_bind", "true");
  };
  document.getElementById("e-snap").onclick = function () {
    document.getElementById("e-snap-view").setAttribute("set_bind", "true");
  };

  // MODAL UPLOAD
  var modal = document.getElementById("myModal");

  var canvases = document.getElementsByClassName("image_canvas");

  Array.from(canvases).forEach((element) => {
    element.onclick = function () {
      if (element.getAttribute("hasImage") == "false") {
        document
          .getElementById("art-canvas")
          .setAttribute("value", element.firstElementChild.getAttribute("id"));
        modal.style.display = "block";
      }
    };
  });

  document.getElementById("modal-close-btn").onclick = function (event) {
    $("#newupload")[0].reset();
    modal.style.display = "none";
    event.preventDefault();
  };

  document.getElementById("modal-submit-btn").onclick = async function (event) {
    await uploadMedia();
    modal.style.display = "none";
    $("#newupload")[0].reset();
    event.preventDefault();
  };

  document.getElementById("imgSpan").onclick = function () {
    document.getElementById("imgModal").style.display = "none";
  };

  // setInterval(populateCanvas(), 1000);
  populateCanvas();
});
