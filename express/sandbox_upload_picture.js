const images = [
  {
    url: "BathSign.jpg",
    title: "Women restroom sign",
    category: "signs",
    creator: "autobot AI",
    explicit: false,
    description: "A typical women's restroom sign",
  },
];

$(document).ready(function () {
  const image_uploaded_count = 0;

  //   const uploadBtn = document.getElementById("upload-new");
  //   uploadBtn.addEventListener("click", function () {
  //     uploadBtn.setAttribute("data-toggle", "modal");
  //     let shape_1 = document.getElementById("shape-1");
  //     var image_texture = shape_1.children[0].children[0];
  //     image_texture.setAttribute("url", "BathSignMen.jpg");
  //   });

  $("#exampleModal").on("show.bs.modal", function (event) {
    var button = $("#upload-new"); // Button that triggered the modal
    var recipient = button.data("whatever"); // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this);
    modal.find(".modal-title").text("New message to " + recipient);
    modal.find(".modal-body input").val(recipient);
  });
});
