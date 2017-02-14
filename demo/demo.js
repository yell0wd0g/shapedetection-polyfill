
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
    var bc = new BarcodeDetector();

    bc.detect(img)
        .then((barcodes) => {
          for(var i = 0; i < barcodes.length; i++) {
            if (footer !== 'undefined')
              footer.innerHTML += ' found: ' + barcodes[i].rawValue + '\n';
            if (barcodes[i].rawValue !== 'undefined')
              console.log('Found sth: ' + barcodes[i].rawValue + '\n');
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
