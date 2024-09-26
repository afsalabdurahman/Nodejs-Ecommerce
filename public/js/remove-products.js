document.addEventListener('DOMContentLoaded', function () {
    const uploadBtn = document.getElementById('upload-btn');
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    let croppedImages = [];

    uploadBtn.addEventListener('click', function () {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', function (event) {
        const files = event.target.files;
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = function (e) {
                console.log(e, "eeeee")
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Uploaded Image';
                img.dataset.filename = file.name;

                const removeBtn = document.createElement('button');
                removeBtn.classList.add('remove-btn');
                removeBtn.textContent = 'X';

                removeBtn.addEventListener('click', function () {
                    imageContainer.remove();
                });

                const cropBtn = document.createElement('button');
                cropBtn.classList.add('cropImg');
                cropBtn.textContent = "Crop";

                cropBtn.addEventListener('click', function () {
                    Swal.fire({
                        title: 'Crop your image',
                        html: `
                            <img id="imageToCrop" src="${img.src}" style="max-width: 100%; max-height: 400px;" alt="Image to crop">
                            <br>
                            <button id="cropImageBtn" class="swal2-confirm swal2-styled" style="margin-top: 10px;">Crop Image</button>
                        `,
                        showConfirmButton: false,
                        didOpen: () => {
                            // Initialize Cropper.js on the image inside SweetAlert2
                            const imageToCrop = document.getElementById('imageToCrop');
                            const cropper = new Cropper(imageToCrop, {
                                aspectRatio: 1,
                                viewMode: 1,
                                autoCropArea: 1,
                                movable: true,
                                zoomable: true,
                                rotatable: true,
                                scalable: true
                            });

                            // Handle crop button click inside SweetAlert2
                            document.getElementById('cropImageBtn').addEventListener('click', function () {
                                const croppedCanvas = cropper.getCroppedCanvas({
                                    width: 400,
                                    height: 400
                                });

                                const croppedImageURL = croppedCanvas.toDataURL();
                                img.src = croppedImageURL;
                                croppedImages.push(file.name);
                                // Display the cropped image in a new SweetAlert2 modal
                                Swal.fire({
                                    title: 'Cropped Image',
                                    imageUrl: croppedImageURL,
                                    imageWidth: 400,
                                    imageHeight: 400,
                                    imageAlt: 'Cropped Image'
                                });


                                // Update the image preview with the cropped image
                                img.src = croppedImageURL;

                                const croppedData = cropper.getData();
                                img.heights = croppedData.height // Get cropping details (x, y, width, height)
                                console.log(croppedData, "cropped data")
                                document.getElementById("imgids").value = `${croppedImages}`
                                document.getElementById("imgedata").value = `${croppedData.height}`
                                document.getElementById("imgedata1").value = `${croppedData.width}`
                                document.getElementById("x").value = `${croppedData.x}`
                                document.getElementById("y").value = `${croppedData.y}`
                            });
                            croppedImages.forEach(item => {
                                const input = document.createElement('inputs');
                                input.type = 'hidden';
                                input.name = 'items[]';
                                input.value = item;
                                imageContainer.appendChild(input);
                            });
                        }
                    });
                });
                console.log(croppedImages, "array")
                imageContainer.appendChild(cropBtn);
                imageContainer.appendChild(img);
                imageContainer.appendChild(removeBtn);
                imagePreview.appendChild(imageContainer);
            };
            reader.readAsDataURL(file);
        }
    });
});

function validate() {
    let hide = document.getElementById("hide");
    let stock = document.getElementById("stock");
    let isValid = true;

    if (stock.value.trim() === "" || stock.value <= 0) {
        hide.style.display = "block";
        isValid = false;
    } else {
        hide.style.display = "none";
    }

    return isValid;
}

function validateName() {
    let hide = document.getElementById("hide1");
    let productTitle = document.getElementById("product-title");
    let isValid = true;

    if (productTitle.value.trim() === "") {
        hide.style.display = "block";
        isValid = false;
    } else {
        hide.style.display = "none";
    }

    return isValid;
}

function validateImage() {
    let imageInput = document.getElementById("image-upload");
    let hideImage = document.getElementById("hide-image");
    let isValid = true;

    if (imageInput.files.length === 0) {
        hideImage.style.display = "block";
        hideImage.innerText = "Please select an image.";
        isValid = false;
    } else {
        let file = imageInput.files[0];
        let allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
        let maxSize = 2 * 1024 * 1024; // 2 MB limit

        if (!allowedExtensions.exec(file.name)) {
            hideImage.style.display = "block";
            hideImage.innerText = "Invalid file type. Only .jpg, .jpeg, and .png are allowed.";
            isValid = false;
        } else if (file.size > maxSize) {
            hideImage.style.display = "block";
            hideImage.innerText = "File size should be less than 2 MB.";
            isValid = false;
        } else {
            hideImage.style.display = "none";
        }
    }

    return isValid;
}

function validation() {
    let isFormValid = true;

    if (!validate()) {
        isFormValid = false;
    }

    if (!validateName()) {
        isFormValid = false;
    }

    if (!validateImage()) {
        isFormValid = false;
    }

    return isFormValid;
}
