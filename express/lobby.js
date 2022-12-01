let images = [];

$(document).ready(function () {
  //This method deals with event listener submit button
  let upload = function () {
    key = `shape-${images.length + 1}`;

    //Need to make sure that the title is filled in
    //Create a task elemnt and add it to the array
    let title = $("#art-title").val();
    let category = $("#art-category").val();
    let creator = $("#art-creator").val();
    // let explicit = $("#art-explicit").val();
    var date = new Date();
    date = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    let description = $("#art-description").val();
    let dateHolder = Date.parse(date);

    let elem = {
      filekey: key,
      title: title,
      category: category,
      creator: creator,
      upload_date: date,
      description: description,
    };

    if (title == "") {
      alert("Task must have a title!");
    }
    if (isNaN(dateHolder)) {
      alert("The date fromat is incorrect!");
    }
    populateCanvas(elem);
    images.push(elem);
  };

  $("#artFile").on("change", function (event) {
    const src = URL.createObjectURL(event.target.files[0]);
    key = `shape-${images.length + 1}`;
    localStorage.setItem(key, src);
  });

  // modal

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  document.getElementById("uploadbtn").onclick = function () {
    modal.style.display = "block";
  };

  document.getElementById("modal-close-btn").onclick = function (event) {
    $("#newupload")[0].reset();
    modal.style.display = "none";
    event.preventDefault();
  };

  document.getElementById("modal-submit-btn").onclick = function (event) {
    upload();
    modal.style.display = "none";
    $("#newupload")[0].reset();
    event.preventDefault();
  };

  // Get the <span> element that closes the modal
  document.getElementById("imgSpan").onclick = function () {
    document.getElementById("imgModal").style.display = "none";
  };

  function populateCanvas(image) {
    $(`#${image.filekey}`).empty();
    let img = $("<imageTexture>", { url: localStorage.getItem(image.filekey) });
    $(`#${image.filekey}`).append(img);
    let parent = $(`#${image.filekey}`).parent();
    parent.click(function () {
      // alert("you clicked me!");

      // Get the modal
      document.getElementById("imgModal").style.display = "block";
      var img = document.getElementById("imgContent");

      img.src = localStorage.getItem(image.filekey);
      $("#img-text-content").empty();
      let title = $("<p>", { text: `Title - ${image.title}` });
      let desc = $("<p>", { text: `Description - ${image.description}` });
      let created = $("<p>", { text: `Created By - ${image.creator}` });
      let cat = $("<p>", { text: `Category - ${image.category}` });
      let dt = $("<p>", { text: `Uploaded on - ${image.upload_date}` });
      $("#img-text-content").append(title);
      $("#img-text-content").append(desc);
      $("#img-text-content").append(created);
      $("#img-text-content").append(cat);
      $("#img-text-content").append(dt);
    });
  }
});
