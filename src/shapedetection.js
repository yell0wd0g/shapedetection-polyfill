// ShapeDetection polyfill.
// Uses zxing for barcode detection fallback. This supports only QR codes.

export var BarcodeDetector = window.BarcodeDetector;

if (typeof window.BarcodeDetector === 'undefined') {

  // https://wicg.github.io/shape-detection-api/#barcode-detection-api
  BarcodeDetector = class {

    /**
     * Implements https://wicg.github.io/shape-detection-api/#dom-barcodedetector-detect
     * @param {ImageBitmapSource} image - Image/Video/Canvas input.
     * @returns {Promise<sequence<DetectedBarcode>>} Fulfilled promise with detected codes.
     */
    detect(image) {
      return new Promise(function executorBCD(resolve, reject) {

        // |qrcode| should be defined by `qrcode = require('zxing');`
        // TODO(mcasas): I'm not sure if this won't load zxing every time.
        if (typeof qrcode === 'undefined')
          var qrcode = require('zxing');

        // ZXing likes to get the data from a canvas element called "qr-canvas".
        // Dump |image| therem then just call qrcode.decode().
        var canv = document.createElement("canvas");
        canv.setAttribute("id", "qr-canvas");
        canv.style.visibility = "hidden";
        document.body.appendChild(canv);

        var ctx = canv.getContext('2d');
        canv.width = image.width;
        canv.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);

        qrcode.debug = false;
        qrcode.decode(function(err, result) {
          if (err != null) {
            console.error(err);
            reject(new DOMException('OperationError', error));
          } else {
            // Replicate sequence<DetectedBarcode> response; ZXing library only
            // provides a single detected |rawValue| barcode (no position).
            var detectedBarcode = new Object;
            detectedBarcode.rawValue = result;
            detectedBarcode.boundingBox = undefined;
            detectedBarcode.cornerPoints = [];
            resolve( [detectedBarcode] );
          }
        });

        // Remove the "qr-canvas" element from the document.
        canv.parentNode.removeChild(canv);
      });
    }
  };
}
