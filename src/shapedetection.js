// ShapeDetection polyfill.  Relies on zxing node package loaded already.
// Only QR codes supported.

export let BarcodeDetector = window.BarcodeDetector;

if (typeof BarcodeDetector === 'undefined') {

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
        if (typeof qrcode === 'undefined') {
          reject(new DOMException("NotFoundError", "|qrcode| not found"));
          return;
        }

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
            reject(new DOMException('OperationError'));

          } else {
            // Replicate DetectedBarcode; The library only provides |rawValue|
            // and a single detected barcode.
            var detectedBarcode = new Object;
            detectedBarcode.rawValue = result;
            detectedBarcode.boundingBox = undefined;
            detectedBarcode.cornerPoints = [];
            resolve( [detectedBarcode] );
          }
        });

      });
    }

  };
}
