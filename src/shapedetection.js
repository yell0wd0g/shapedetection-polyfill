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

        this._debug = true;
    }

    /**
     * Implements https://wicg.github.io/shape-detection-api/#dom-barcodedetector-detect
     * @param {ImageBitmapSource} image - Image/Video/Canvas input.
     * @returns {Promise<sequence<DetectedBarcode>>} Fulfilled promise with detected codes.
     */
    detect(image) {
      var that = this;
      var result = [];
      var image = image;
      return that.detectQRCodes(image)
          .then((qrCodes) => {
            if ('rawValue' in qrCodes[0])
              result = result.concat(qrCodes);
            return that.detectBarcodes(image)
          })
          .then((barCodes) => {
            if ('rawValue' in barCodes[0])
              result = result.concat(barCodes);
            return result;
          })
          .catch(() => { console.error('Detection error'); })
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

        that._qrcode.callback = function(err, result) {
          var detectedBarcode = new Object;
          detectedBarcode.boundingBox = undefined;
          detectedBarcode.cornerPoints = [];
          if (err != null) {
            console.error('no qr codes detected: ' + err);
          } else {
            // |result.result| contains the decoded string, url or otherwise.
            console.log('qr detected: ', result.result);
            detectedBarcode.rawValue = result.result;

            if (result.points) {
              detectedBarcode.cornerPoints = [
                  { x: result.points[0].X, y:result.points[0].Y },
                  { x: result.points[1].X, y:result.points[1].Y },
                  { x: result.points[2].X, y:result.points[2].Y },
                  { x: result.points[3].X, y:result.points[3].Y }];
            }
          }
          resolve( [detectedBarcode] );
        };
        that._qrcode.decode(that.getImageAsBase64(image));
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
        const what = that.getImageAsBase64(image);

        that._quagga.decodeSingle({
          src: what,
          numOfWorkers: 0,  // Needs to be 0 when used within node
          locate: true,
          inputStream: {
              size: image.width > image.height ? image.width : image.height
          },
          decoder: {
            readers : [
              'upc_reader', 'code_128_reader', 'code_39_reader',
              'code_39_vin_reader', 'ean_8_reader', 'ean_reader',
              'upc_e_reader', 'codabar_reader'
            ]
          },
          multiple: true,
        }, function(result) {
          var detectedBarcode = new Object;
          detectedBarcode.boundingBox = undefined;
          detectedBarcode.cornerPoints = [];
          if(result) {
            if (result.codeResult) {
              console.log('detected: ', result.codeResult.code);
              detectedBarcode.rawValue = result.codeResult.code;

              detectedBarcode.cornerPoints = [
                  { x: result.boxes[0][0][0], y:result.boxes[0][0][1] },
                  { x: result.boxes[0][1][0], y:result.boxes[0][1][1] },
                  { x: result.boxes[0][2][0], y:result.boxes[0][2][1] },
                  { x: result.boxes[0][3][0], y:result.boxes[0][3][1] }];
            }

          } else {
            console.error('no barcodes detected');
          }

          resolve( [detectedBarcode] );
        });

      });
    };

    getImageAsBase64(image) {
      var canvas = document.createElement('canvas');
      canvas.style.visibility = 'hidden';

      var ctx = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);

      return canvas.toDataURL();
    };
  };
}
