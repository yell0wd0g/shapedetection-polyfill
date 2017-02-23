
var shapedetection = require('../src/shapedetection.js');
var BarcodeDetector = shapedetection.BarcodeDetector;

var img = new Image();
img.crossOrigin = 'Anonymous';
img.id = 'theImage'
document.body.appendChild(img);

var urlSelect = document.querySelector('select#code');
urlSelect.onchange = () => {
  var img = document.getElementById('theImage');
  img.onload = function() {

    var footer = document.getElementsByTagName('footer')[0];
    footer.innerHTML = '';
    var bc = new BarcodeDetector();

    bc.detect(img)
        .then((barcodes) => {
          var canv = document.getElementById('result-canvas') ||
                     document.createElement("canvas");
          canv.setAttribute("id", "result-canvas");
          document.body.appendChild(canv);

          var ctx = canv.getContext('2d');
          var img = document.getElementById('theImage');
          canv.width = img.width;
          canv.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);

          for(var i = 0; i < barcodes.length; i++) {
            if (footer !== 'undefined')
              footer.innerHTML += ' found: ' + barcodes[i].rawValue + '\n';
            if (barcodes[i].rawValue !== 'undefined')
              console.log('Found sth: ' + barcodes[i].rawValue + '\n');
            if (barcodes[i].cornerPoints !== 'undefined') {

              ctx.beginPath();
              ctx.lineWidth = 2;
              ctx.strokeStyle = "red";

              ctx.moveTo(Math.floor(barcodes[i].cornerPoints[0].x),
                         Math.floor(barcodes[i].cornerPoints[0].y));
              ctx.lineTo(Math.floor(barcodes[i].cornerPoints[1].x),
                         Math.floor(barcodes[i].cornerPoints[1].y));
              ctx.lineTo(Math.floor(barcodes[i].cornerPoints[2].x),
                         Math.floor(barcodes[i].cornerPoints[2].y));
              ctx.lineTo(Math.floor(barcodes[i].cornerPoints[3].x),
                         Math.floor(barcodes[i].cornerPoints[3].y));
              ctx.lineTo(Math.floor(barcodes[i].cornerPoints[0].x),
                         Math.floor(barcodes[i].cornerPoints[0].y));
              ctx.stroke();
              ctx.closePath();
            }
          }
        })
        .catch( (error) => {
          if (footer !== 'undefined')
            footer.innerHTML = 'detection failed: ' + error;
          console.error(error);
        });
  }
  img.src = urlSelect.value;
}
