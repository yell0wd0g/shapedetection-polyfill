
require('zxing');
require('../src/shapedetection.js');

var urlSelect = document.querySelector('select#code');
urlSelect.onchange = () => {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  document.body.appendChild(img);

  img.onload = function() {

    //var footer = document.getElementsByTagName('footer')[0];

    var bc = new BarcodeDetector();

    bc.detect(img)
        .then((barcodes) => {
   	      for(var i = 0; i < barcodes.length; i++) {
            //footer.innerHTML = '+ found: ' + barcodes[i].rawValue + '\n';
            console.log('Found sth: ' + barcodes[i].rawValue + '\n');
          }
        })
        .catch( (error) => {
          //footer.innerHTML = 'detection failed: ' + error;
          console.error(error);
        });
  }
  img.src = urlSelect.value;
}
