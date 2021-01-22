// read from url
function readUrl() { 
    var input = document.getElementById("urlInput").value;
    var res = encodeURIComponent(input);
    $.getJSON("https://api.qrserver.com/v1/read-qr-code/?fileurl=" + res, function(data) {
        if ((data[0].symbol[0].data) == null) {
            document.getElementById("urlOutput").value = "No QR code was found."
        } 
        else {
            document.getElementById("urlOutput").value = (data[0].symbol[0].data);
        }
    })
}

// read from file
document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");
    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
    });
    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
        }
    });
    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
    });
    ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
             dropZoneElement.classList.remove("drop-zone--over");
        });
    });
    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        }
        dropZoneElement.classList.remove("drop-zone--over");
    });
});

function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
        dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }
    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone__thumb");
        dropZoneElement.appendChild(thumbnailElement);
    }
    thumbnailElement.dataset.label = file.name;
    if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
        };
    }
    else {
        thumbnailElement.style.backgroundImage = null;
    }
}

function readFile() {
    event.preventDefault();
    var form = $('#myForm')[0];
    var data = new FormData(form);
    $("#btnSubmit").prop("disabled", true);
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "https://api.qrserver.com/v1/read-qr-code/",
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data[0].symbol[0].error == null) {
                alert(data[0].symbol[0].data);
            }
            else {
                alert(data[0].symbol[0].error);
            }
            $("#btnSubmit").prop("disabled", false);
        },
        error: function (e) {
            alert("Error: " + e);
            $("#btnSubmit").prop("disabled", false);
        }
    });
}

// read from camera
function readCamera() {
    var scanner = new Instascan.Scanner({video: document.getElementById("preview"), scanPeriod: 1, mirror: false});
	scanner.addListener("scan", function(content) {
        alert(content);
	});
    Instascan.Camera.getCameras().then(function(cameras) {
	    if (cameras.length > 0) {
		    scanner.start(cameras[0]);
			$('[name="options"]').on('change', function() {
				if ($(this).val() == 1) {
					if (cameras[0] != "") {
						scanner.start(cameras[0]);
					}
                    else {
						alert('No front camera found!');
					}
				}
                else if ($(this).val() == 2) {
					if (cameras[1] != "") {
                        scanner.start(cameras[1]);
					}
                    else {
						alert('No back camera found!');
					}
				}
			});
		}
        else {
			console.error('No cameras found.');
			alert('No cameras found.');
		}
	}).catch(function(e) {alert(e);});
}