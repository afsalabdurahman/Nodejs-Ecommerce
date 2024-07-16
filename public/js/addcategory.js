// script.js
document.addEventListener("DOMContentLoaded", function () {
  const chooseFile = document.getElementById("choose-file");
  const fileChosen = document.getElementById("file-chosen");
  const previewImage = document.getElementById("preview-image");

  chooseFile.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      fileChosen.textContent = file.name;

      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block"; // Show the image if hidden
      };
      reader.readAsDataURL(file);
    } else {
      fileChosen.textContent = "No file chosen";
      previewImage.style.display = "none"; // Hide the image if no file is chosen
    }
  });
});

////list category

let id = "";
function showModal(model) {
  id = model;
  document.getElementById("confirmationModal").style.display = "block";
}

function closeModal() {
  document.getElementById("confirmationModal").style.display = "none";
}

function confirmAction() {
  console.log(id, "data");
  window.location.href = `/admin/unlist?id=${id}`;
  // Add your action here, e.g., delete the product
  closeModal();
}
