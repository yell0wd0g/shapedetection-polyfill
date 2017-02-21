// ShapeDetection polyfill.

export var BarcodeDetector = window.BarcodeDetector;

if (typeof window.BarcodeDetector === 'undefined') {

  // https://wicg.github.io/shape-detection-api/#barcode-detection-api
  BarcodeDetector = class {

    constructor() {
        // |qrcode| should be defined by `qrcode = require('qrcode-reader');`
        if (typeof this._qrcode === 'undefined') {
          var lib = require('qrcode-reader');
          this._qrcode = new lib.default();
        }

        if (typeof this._quagga === 'undefined')
          this._quagga = require('quagga');

        if (typeof this._join === 'undefined')
          this._join = require("bluebird").join;

        this._debug = true;
    }

    /**
     * Implements https://wicg.github.io/shape-detection-api/#dom-barcodedetector-detect
     * @param {ImageBitmapSource} image - Image/Video/Canvas input.
     * @returns {Promise<sequence<DetectedBarcode>>} Fulfilled promise with detected codes.
     */
    detect(image) {
      var that = this;
      return that._join(that.detectQRCodes(image), that.detectBarcodes(image),
        function(qrCodes, barCodes) {
          var result = [];
          if ('rawValue' in qrCodes[0])
            result = result.concat(qrCodes);
          if ('rawValue' in barCodes[0])
            result = result.concat(barCodes);
          return result;
      });
    }

    /**
     QR Code detection is based on ZXing port to JS; provides the decoded string
     but no |boundingBox| nor |cornerPoints|: These are always undefined and an
     emtpy string, respectively.  If anything is detected, |rawValue| will have
     the decoded data, otherwise it's not defined.
     */
    detectQRCodes(image) {
      var that = this;
      return new Promise(function executorQRD(resolve, reject) {

        var canv = document.getElementById('qr-canvas') ||
                   document.createElement("canvas");
        canv.setAttribute("id", "qr-canvas");
        canv.style.visibility = "hidden";
        document.body.appendChild(canv);

        // ZXing likes to get the data from a canvas element called "qr-canvas".
        // Dump |image| there and then just call qrcode.decode().
        var ctx = canv.getContext('2d');
        canv.width = image.width;
        canv.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);

        that._qrcode.callback = function(result, err) {
          var detectedBarcode = new Object;
          detectedBarcode.boundingBox = undefined;
          detectedBarcode.cornerPoints = [];
          if (err != null) {
            console.error('no qr codes detected: ' + err);
          } else {
            // |result.url| contains the decoded string, be that a url or not.
            console.log("qr detected: ", result.url);
            detectedBarcode.rawValue = result.url;

            detectedBarcode.cornerPoints = [
                { x: result.points[0].X, y:result.points[0].Y },
                { x: result.points[1].X, y:result.points[1].Y },
                { x: result.points[2].X, y:result.points[2].Y },
                { x: result.points[3].X, y:result.points[3].Y }];
          }
          resolve( [detectedBarcode] );

          // Remove the "qr-canvas" element from the document.
          canv.parentNode.removeChild(canv);
        };
        that._qrcode.decode();
      });
    };

    /**
     Barcode detection is based on ZXing port to JS; provides the decoded string
     but no |boundingBox| nor |cornerPoints|: These are always undefined and an
     emtpy string, respectively.  If anything is detected, |rawValue| will have
     the decoded data, otherwise it's not defined.
     */
    detectBarcodes(image) {
      var that = this;
      return new Promise(function executorBCD(resolve, reject) {

        var canv = document.getElementById('barcode-canvas') ||
                   document.createElement("canvas");
        canv.setAttribute("id", "barcode-canvas");
        canv.style.visibility = "hidden";
        document.body.appendChild(canv);
        var ctx = canv.getContext('2d');
        canv.width = image.width;
        canv.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);

        const what = canv.toDataURL();
        that._quagga.decodeSingle({
          src: what,
          numOfWorkers: 0,  // Needs to be 0 when used within node
          locate: true,
          inputStream: { size: canv.width > canv.height ? canv.width : canv.height },
          decoder: {
            readers : [
              "upc_reader", "code_128_reader", "code_39_reader",
              "code_39_vin_reader", "ean_8_reader", "ean_reader", "upc_e_reader",
              "codabar_reader"
            ]
          },
          multiple: true,
        }, function(result) {
          var detectedBarcode = new Object;
          detectedBarcode.boundingBox = undefined;
          detectedBarcode.cornerPoints = [];
          if(result) {
            if (result.codeResult) {
              console.log("detected: ", result.codeResult.code);
              detectedBarcode.rawValue = result.codeResult.code;

              detectedBarcode.cornerPoints = [
                  { x: result.boxes[0][0][0], y:result.boxes[0][0][1] },
                  { x: result.boxes[0][1][0], y:result.boxes[0][1][1] },
                  { x: result.boxes[0][2][0], y:result.boxes[0][2][1] },
                  { x: result.boxes[0][3][0], y:result.boxes[0][3][1] }];
            }

          } else {
            console.error("no barcodes detected");
          }

          resolve( [detectedBarcode] );
        });

        // Remove the "temp-canvas" element from the document.
        canv.parentNode.removeChild(canv);
      });
    };
  };
}
