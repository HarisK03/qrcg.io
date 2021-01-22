var activeFormat;
var textRequest;

function pngActive() {
    activeFormat = "png";
    clearActive();
    checkActive();
    document.getElementById("png").classList.add("black-button-active");
}

function gifActive() {
    activeFormat = "gif";
    clearActive();
    checkActive();
    document.getElementById("gif").classList.add("black-button-active");
}

function jpgActive() {
    activeFormat = "jpg";
    clearActive();
    document.getElementById("jpg").classList.add("black-button-active");
}

function clearActive() {
    document.getElementById("png").classList.remove("black-button-active");
    document.getElementById("gif").classList.remove("black-button-active");
    document.getElementById("jpg").classList.remove("black-button-active");
}

function checkActive() {
    if (activeFormat == "png") {
        document.getElementById("qrSize").setAttribute("max", "1000");
    }

    else if (activeFormat == "gif") {
        document.getElementById("qrSize").setAttribute("max", "1000");
    }

    else if (activeFormat == "jpg") {
        document.getElementById("qrSize").setAttribute("max", "1000");
    }
}


var sliderSize = document.getElementById("qrSize");
var outputSize = document.getElementById("qrSizeSlider");
var pxSize = 200;
outputSize.innerHTML = sliderSize.value;

sliderSize.oninput = function() {
    outputSize.innerHTML = this.value;
    pxSize = this.value;
}

function createQR() {
    if (!$("#textQR").val()) {
        alert("Please write some text.");    
    }   
    else {
        text = document.getElementById("textQR").value;
        textRequest = "https://api.qrserver.com/v1/create-qr-code/?data=" + text;
        document.getElementById("qrCode").setAttribute("src", textRequest + "&size=" + "200" + "x" + "200");
    }
}

$('#qrCode').on('click', function () {
    var src = document.getElementById("qrCode").src;
    var size = document.getElementById("qrSizeSlider").innerText;
    if (size > 1000 || size < 10) {
        alert("Size is not valid!");
        return;
    }
    $.ajax({
        url: src + "&size=" + size + "x" + size + "&format=" + activeFormat,
        method: 'GET',
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data) {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = 'QRCode';
            document.body.append(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
    });
});