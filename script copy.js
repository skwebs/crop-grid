"use strict";


const _ = e => document.querySelector(e);
const gap = 50; // Adjust gap as needed
const margin = gap / 2;

const targetImageWidth = 360; // Target image width
let targetImageRatio = 4 / 5;
const targetImageHeight = targetImageWidth / targetImageRatio

const borderWidth = 5;
const img = new Image();

const ppi = 300;
const scaleFactor = ppi / 96;
const paperSize = {
    A4: { width: 2480, height: 3505 },
    _4x6: { width: 1200, height: 1800 },
    _5x7: { width: 1500, height: 2100 },
}

const picSize = {
    type_3_5and4_5: { width: 360, height: 450 }
}


const canvas = _('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = paperSize.A4.width; // Adjust canvas size as needed
canvas.height = paperSize.A4.height;
canvas.style.backgroundColor = "#FFF";


let canvasImageBlob = null; // Store canvas image blob
let originalImageMimeType = ''; // Store original image MIME type
let numRows = parseInt(_('#rowsSelect').value, 10) || 1; // Default number of rows
let numCols = parseInt(_('#colsSelect').value, 10) || 6; // Default number of columns
let backgroundColor = '#008080'; // Default background color (white)

let isImageLoaded = false;







// ==========================================================================================
let cropper = null;
const imageForCrop = _("#select_image");

// // Handle user imageForCrop input change
// _('#imageInput').addEventListener('change', function (event) {

//     const loadImageForCrop = function (url) {
//         imageForCrop.src = url;
//     }
//     let reader;
//     let file;
//     let files = event.target.files;
//     // const file = event.target.files[0];
//     if (files && files.length > 0) {
//         file = files[0];
//         // const img = new Image();
//         // img.src = URL.createObjectURL(file);
//         if (URL) {
//             loadImageForCrop(URL.createObjectURL(file));
//         } else if (FileReader) {
//             reader = new FileReader();
//             reader.onload = function (e) {
//                 loadImageForCrop(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }

//         // ctx.clearRect(0, 0, canvas.width, canvas.height);
//         // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//         if (cropper) {
//             cropper.destroy();
//         }

//         // Initialize Cropper.js on the selected imageForCrop
//         cropper = new Cropper(imageForCrop, {
//             aspectRatio: targetImageRatio,
//             dragMode: 'move',
//             autoCropArea: 1,
//             restore: !1,
//             modal: !1,
//             highlight: !1,
//             cropBoxMovable: !1,
//             cropBoxResizable: !1,
//             toggleDragModeOnDblclick: !1,
//             viewMode: 3,
//         });
//     }
// });

// // Handle crop and create button click
// document.getElementById('cropAndCreateButton').addEventListener('click', function () {
//     console.log("cropped")
//     if (cropper) {
//         console.log("cropper available")
//         const croppedCanvas = cropper.getCroppedCanvas({
//             width: targetImageWidth,
//             height: targetImageHeight,
//         });

//         croppedCanvas.toBlob(function (blob) {

//             // cropper.destroy();

//             const imgUrl = URL.createObjectURL(blob);
//             imageForCrop.src = imgUrl;
//             img.src = imgUrl;

//             drawGrid();

//             console.log(imgUrl);
//         }, originalImageMimeType, 1);
//     }
// });
// ==========================================================================================













// Handle image input change event
_('#imageInput').addEventListener('change', handleImage);

// Handle background color input change event
_('#backgroundColorInput').addEventListener('input', setBackgroundColor);

// Handle download button click
_('#downloadButton').addEventListener('click', downloadCanvas);

// Handle rows select change event
_('#rowsSelect').addEventListener('change', updateGrid);

// Handle columns select change event
_('#colsSelect').addEventListener('change', updateGrid);


function handleImage(event) {
    // const file = event.target.files[0];

    // if (file) {
    //     originalImageMimeType = file.type; // Store original image MIME type

    //     img.onload = function () {
    //         isImageLoaded = true;

    //         setOriginalImageRatio(img)

    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         drawGrid();
    //     };
    //     img.src = URL.createObjectURL(file);
    // }


    const loadImageForCrop = function (url) {
        imageForCrop.src = url;
        img.src = url;


        img.onload = function () {
            isImageLoaded = true;
            setOriginalImageRatio(img)
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
        };
        // img.src = url;
    }

    let reader;
    let file;
    let files = event.target.files;
    if (files && files.length > 0) {
        file = files[0];
        originalImageMimeType = file.type; // Store original image MIME type

        if (URL) {
            loadImageForCrop(URL.createObjectURL(file));
        } else if (FileReader) {
            reader = new FileReader();
            reader.onload = function (e) {
                loadImageForCrop(reader.result);
            };
            reader.readAsDataURL(file);
        }


        if (cropper) {
            cropper.destroy();
        }

        // Initialize Cropper.js on the selected image
        cropper = new Cropper(imageForCrop, {
            aspectRatio: targetImageRatio,
            dragMode: 'move',
            autoCropArea: 1,
            restore: !1,
            modal: !1,
            highlight: !1,
            cropBoxMovable: !1,
            cropBoxResizable: !1,
            toggleDragModeOnDblclick: !1,
            viewMode: 3,
        });
    }
}

// Handle crop and create button click
document.getElementById('cropButton').addEventListener('click', function () {
    console.log("cropped")
    if (cropper) {
        console.log("cropper available")
        const croppedCanvas = cropper.getCroppedCanvas({
            width: targetImageWidth,
            height: targetImageHeight,
        });

        croppedCanvas.toBlob(function (blob) {
            // if want to close cropper on crop then uncomment below code
            // cropper.destroy();

            const imgUrl = URL.createObjectURL(blob);
            imageForCrop.src = imgUrl;
            img.src = imgUrl;

            drawGrid();

        }, originalImageMimeType, 1);
    }
});


function setOriginalImageRatio({ width, height }) {
    targetImageRatio = width / height;
}

function setBackgroundColor(event) {
    backgroundColor = event.target.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
}

function updateGrid() {
    numRows = parseInt(_('#rowsSelect').value, 10);
    numCols = parseInt(_('#colsSelect').value, 10);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
}

function drawGrid() {
    if (isImageLoaded) {
        // canvas.width = numCols * (targetImageWidth + gap) + margin; // Adjust canvas size as needed
        // canvas.height = numRows * (img.height / img.width * targetImageWidth + gap) + margin;

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                const x = col * (targetImageWidth + gap) + margin; // Adjusted x position
                const y = row * (targetImageHeight + gap) + margin; // Adjusted y position

                // for maintain original image ratio
                // const y = row * (img.height / img.width * targetImageWidth + gap) + margin; // Adjusted y position

                ctx.fillStyle = backgroundColor;
                ctx.fillRect(x, y, targetImageWidth, targetImageHeight);

                ctx.strokeStyle = 'black';
                ctx.lineWidth = 5;

                ctx.strokeRect(x, y, targetImageWidth, targetImageHeight); // Stroke around the image
                ctx.drawImage(img, x, y, targetImageWidth, targetImageHeight);
            }
        }
        // const imageUrl = URL.createObjectURL(canvasImageBlob);

    }


    // Store canvas image as Blob
    canvas.toBlob(function (blob) {
        canvasImageBlob = blob;
        enableDownloadLink();
    }, originalImageMimeType); // Pass original image MIME type
}


function enableDownloadLink() {
    const downloadButton = _('#downloadButton');
    downloadButton.disabled = false;
    downloadButton.innerText = 'Download Canvas Image';
}

function downloadCanvas() {
    if (canvasImageBlob) {
        const timestamp = new Date().getTime();
        const fileName = `canvas_image_${timestamp}.png`;
        const link = document.createElement('a');
        link.download = fileName;
        link.href = URL.createObjectURL(canvasImageBlob);
        link.click();
    }
}

function displayCanvasImage(blob) {
    const imageElement = _('#outputImage'); // Replace 'outputImage' with the ID of your image element

    if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        imageElement.src = imageUrl;
    }
}

// Initialize canvas background color
setBackgroundColor({ target: { value: backgroundColor } });

displayCanvasImage(canvasImageBlob);















































































// //   "use strict";
//   /*if (!window.console) console = {};
//   const console_out = document.getElementById("console_out");
//   console.log = function(message) {
// 	  console_out.innerHTML += message + " < br / > ";
// 	  console_out.scrollTop = console_out.scrollHeight;
//   };*/

//   // "use strict";
//   window.addEventListener('DOMContentLoaded', function() {
//     const avatar = document.getElementById('avatar');
//     const image = document.getElementById('image');
//     const input = document.getElementById('input');
//     const $progress = $('.progress');
//     const $progressBar = $('.progress-bar');
//     const $alert = $('.alert');
//     const $preview = $("#preview");
//     const $cropSec = $("#cropSec");
//     const $cropCancelBtn = $("#cropCancelBtn");
//     let cropper;
//     let mimeType;
//     $('[data-toggle="tooltip"]').tooltip();
//     input.addEventListener('change', function(e) {
//       let files = e.target.files;
//       const done = function(url) {
//         input.value = '';
//         image.src = url;
//         $alert.hide();
//         $cropSec.collapse('show')
//       };
//       let reader;
//       let file;
//       let url;
//       if (files && files.length > 0) {
//         file = files[0];
//         getMimeType(file);
//         if (URL) {
//           done(URL.createObjectURL(file));
//         } else if (FileReader) {
//           reader = new FileReader();
//           reader.onload = function(e) {
//             done(reader.result);
//           };
//           reader.readAsDataURL(file);
//         }
//       }
//     });
//     $cropSec.on('show.bs.collapse', function() {
//       cropper = new Cropper(image, {
//         aspectRatio: 4 / 5,
//         dragMode: 'move',
//         preview: '.croppingPreview',
//         autoCropArea: 1,
//         restore: !1,
//         modal: !1,
//         highlight: !1,
//         cropBoxMovable: !1,
//         cropBoxResizable: !1,
//         toggleDragModeOnDblclick: !1,
//         viewMode: 3
//       });
//     }).on('hidden.bs.collapse', function() {
//       cropper.destroy();
//       cropper = null;
//     });
//     document.getElementById('crop').addEventListener('click', function() {
//       console.time('crop time');
//       let initialAvatarURL;
//       let canvas;
//       $cropSec.collapse("hide")
//       if (cropper) {
//         canvas = cropper.getCroppedCanvas({
//           width: 300,
//           height: 375
//         });
//         initialAvatarURL = avatar.src;
//         avatar.src = canvas.toDataURL();
//         $progress.show();
//         $alert.removeClass('alert-success alert-warning');
//         canvas.toBlob(function(blob) {
//           const formData = new FormData();
//           formData.append('image', blob, 'avatar.' + mimeType.slice(6));
//           formData.append('fileExt', mimeType.slice(6));
//           formData.append('id', '84');
//           formData.append('_token', 'XFPXlKNTG7ekLBEzWqKD2WR6sG9jFnLnd4C0GvQD');
//           $.ajax('https://anshumemorial.in/v3/student/save-image/84', {
//             method: 'POST',
//             data: formData,
//             processData: false,
//             contentType: false,
//             dataType: 'json',
//             xhr: function() {
//               const xhr = new XMLHttpRequest();
//               xhr.upload.onprogress = function(e) {
//                 let percent = '0';
//                 let percentage = '0%';
//                 if (e.lengthComputable) {
//                   percent = Math.round((e.loaded / e.total) * 100);
//                   percentage = percent + '%';
//                   $progressBar.width(percentage).attr('aria-valuenow', percent).text(percentage);
//                 }
//               };
//               return xhr;
//             },
//             success: function(res) {
//               //alert(res)
//               if (res.success) {
//                 toastMsg("Image saved successfully.");
//                 //$alert.show().addClass('alert-success').text(JSON.stringify(res));
//                 console.timeEnd('crop time');
//                 console.log(res);
//                 window.location.replace("https://anshumemorial.in/v3/admitCard");
//               } else {
//                 toastMsg("Something goes wrong..");
//                 //$alert.show().addClass('alert-danger').text(JSON.stringify(res.errors));
//                 console.log(res)
//                 console.log(res.errors)
//               }
//             },
//             error: function(err) {
//               alert(JSON.stringify(err));
//               toastMsg("Error(s)..");
//               avatar.src = initialAvatarURL;
//               //$alert.show().addClass('alert-warning').text('Upload error');
//             },
//             complete: function() {
//               $progress.hide();
//             },
//           });
//         }, mimeType);
//       }
//     });
//     // check mime type
//     function getMimeType(file) {
//       const fileReaderForArrayBuffer = new FileReader();
//       fileReaderForArrayBuffer.onloadend = function(evt) {
//         if (evt.target.readyState === FileReader.DONE) {
//           const uInt8Array = new Uint8Array(evt.target.result);
//           let bytes = [];
//           uInt8Array.forEach((byte) => {
//             bytes.push(byte.toString(16))
//           });
//           const hex = bytes.join('').toUpperCase();
//           mimeType = checkMimeType(hex);
//           console.log(mimeType)
//         }
//       };
//       const BLOB = file.slice(0, 4);
//       fileReaderForArrayBuffer.readAsArrayBuffer(BLOB)
//     }
//     const checkMimeType = (signature) => {
//       switch (signature) {
//         case '89504E47':
//           return 'image/png';
//         case '47494638':
//           return 'image/gif';
//         case '25504446':
//           return 'application/pdf';
//         case 'FFD8FFDB':
//         case 'FFD8FFE0':
//         case 'FFD8FFE1':
//           return 'image/jpeg';
//         case '504B0304':
//           return 'application/zip';
//         default:
//           return 'Unknown filetype'
//       }
//     };
//     $cropSec.on("show.bs.collapse", () => {
//       $preview.collapse('hide');
//       $('[data-toggle="tooltip"]').tooltip('hide');
//     })
//     $cropSec.on("hide.bs.collapse", () => {
//       $preview.collapse('show');
//     })
//     $cropCancelBtn.on("click", () => {
//       $cropSec.collapse('hide')
//     })

//     function toastMsg(msg, bg = "#000") {
//       Toastify({
//         text: msg,
//         gravity: "bottom",
//         backgroundColor: bg,
//         position: "center",
//         duration: 4000
//       }).showToast();
//     }
//   });
