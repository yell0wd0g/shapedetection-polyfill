// ShapeDetection polyfill.
// Uses zxing for barcode detection fallback. This supports only QR codes.

export var BarcodeDetector = window.BarcodeDetector;

if (typeof window.BarcodeDetector === 'undefined') {

  // https://wicg.github.io/shape-detection-api/#barcode-detection-api
  BarcodeDetector = class {

    constructor() {
        // |qrcode| should be defined by `qrcode = require('zxing');`
        // TODO(mcasas): I'm not sure if this won't load zxing every time.
        if (typeof this._qrcode === 'undefined')
          this._qrcode = require('zxing');

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

        that._qrcode.debug = false;
        that._qrcode.decode(function(err, result) {
          var detectedBarcode = new Object;
          detectedBarcode.boundingBox = undefined;
          detectedBarcode.cornerPoints = [];
          if (err != null) {
            console.error('no qr codes detected: ' + err);
          } else {
            console.log("qr detected: ", result);
            // Replicate sequence<DetectedBarcode> response; ZXing library only
            // provides a single detected |rawValue| barcode (no position).
            detectedBarcode.rawValue = result;
          }
          resolve( [detectedBarcode] );

          // Remove the "qr-canvas" element from the document.
          canv.parentNode.removeChild(canv);
        });
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
        if (!that._debug)
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
            }

            if (that._debug) {
              var ctx = document.getElementById('barcode-canvas').getContext("2d");
              ctx.beginPath();
              ctx.lineWidth = 2;
              ctx.strokeStyle = "red";
              for(var i = 0; i < result.boxes.length; i++) {
                ctx.moveTo(Math.floor(result.boxes[i][0][0]),
                           Math.floor(result.boxes[i][0][1]));
                ctx.lineTo(Math.floor(result.boxes[i][1][0]),
                           Math.floor(result.boxes[i][1][1]));
                ctx.lineTo(Math.floor(result.boxes[i][2][0]),
                           Math.floor(result.boxes[i][2][1]));
                ctx.lineTo(Math.floor(result.boxes[i][3][0]),
                           Math.floor(result.boxes[i][3][1]));
                ctx.lineTo(Math.floor(result.boxes[i][0][0]),
                           Math.floor(result.boxes[i][0][1]));
                ctx.stroke();
              }
              ctx.closePath();
            }

          } else {
            console.error("no barcodes detected");
          }

          resolve( [detectedBarcode] );
        });

        if (!that._debug) {
          // Remove the "temp-canvas" element from the document.
          canv.parentNode.removeChild(canv);
        }

      });
    };
  };
}
