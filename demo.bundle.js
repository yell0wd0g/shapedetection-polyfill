/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return qrcode; });
/* harmony export (immutable) */ __webpack_exports__["a"] = QrCode;
/* harmony export (immutable) */ __webpack_exports__["c"] = URShift;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__detector__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__decoder__ = __webpack_require__(13);
/*
   Copyright 2011 Lazar Laszlo (lazarsoft@gmail.com, www.lazarsoft.info)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/




var qrcode = {};
qrcode.sizeOfDataLengthInfo =  [[10, 9, 8, 8], [12, 11, 16, 10], [14, 13, 16, 12]];

function QrCode() {

  this.imagedata = null;
  this.width = 0;
  this.height = 0;
  this.qrCodeSymbol = null;
  this.debug = false;

  this.callback = null;
}


QrCode.prototype.decode = function(src, data) {

  var decode = (function() {

    try {
      this.error = undefined;
      this.result = this.process(this.imagedata);
    } catch (e) {
      this.error = e;
      this.result = undefined;
    }

    if (this.callback != null) {
      this.callback(this.error, this.result);
    }

    return this.result;

  }).bind(this);

  if (src != undefined && src.width != undefined) {
    /* decode from canvas canvas.context.getImageData */
    this.width = src.width;
    this.height = src.height;
    this.imagedata = {"data": data || src.data};
    this.imagedata.width = src.width;
    this.imagedata.height = src.height;

    decode();
  } else {
    /* decode from URL */

    var image = new Image();
    image.crossOrigin = "Anonymous";

    image.onload = (function() {

      var canvas_qr = document.createElement('canvas');
      var context = canvas_qr.getContext('2d');
      var canvas_out = document.getElementById("out-canvas");

      if (canvas_out != null) {

        var outctx = canvas_out.getContext('2d');
        outctx.clearRect(0, 0, 320, 240);
        outctx.drawImage(image, 0, 0, 320, 240);
      }

      canvas_qr.width = image.width;
      canvas_qr.height = image.height;
      context.drawImage(image, 0, 0);
      this.width = image.width;
      this.height = image.height;

      try {
        this.imagedata = context.getImageData(0, 0, image.width, image.height);
      } catch (e) {
        this.result = "Cross domain image reading not supported in your browser! Save it to your computer then drag and drop the file!";
        if (this.callback != null) return this.callback(null, this.result);
      }

      decode();

    }).bind(this);

    image.src = src;
  }
};

QrCode.prototype.decode_utf8 = function(s) {

  return decodeURIComponent(escape(s));
};

QrCode.prototype.process = function(imageData) {

  var start = new Date().getTime();

  var image = this.grayScaleToBitmap(this.grayscale(imageData));

  var detector = new __WEBPACK_IMPORTED_MODULE_0__detector__["a" /* default */](image);

  var qRCodeMatrix = detector.detect();

  /*for (var y = 0; y < qRCodeMatrix.bits.height; y++)
   {
   for (var x = 0; x < qRCodeMatrix.bits.width; x++)
   {
   var point = (x * 4*2) + (y*2 * imageData.width * 4);
   imageData.data[point] = qRCodeMatrix.bits.get_Renamed(x,y)?0:0;
   imageData.data[point+1] = qRCodeMatrix.bits.get_Renamed(x,y)?0:0;
   imageData.data[point+2] = qRCodeMatrix.bits.get_Renamed(x,y)?255:0;
   }
   }*/

  var reader = __WEBPACK_IMPORTED_MODULE_1__decoder__["a" /* default */].decode(qRCodeMatrix.bits);
  var data = reader.DataByte;
  var str = "";
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++)
      str += String.fromCharCode(data[i][j]);
  }

  var end = new Date().getTime();
  var time = end - start;
  if (this.debug) {
    console.log('QR Code processing time (ms): ' + time);
  }

  return {result: this.decode_utf8(str), points: qRCodeMatrix.points};
};

QrCode.prototype.getPixel = function(imageData, x, y) {
  if (imageData.width < x) {
    throw "point error";
  }
  if (imageData.height < y) {
    throw "point error";
  }
  var point = (x * 4) + (y * imageData.width * 4);
  return (imageData.data[point] * 33 + imageData.data[point + 1] * 34 + imageData.data[point + 2] * 33) / 100;
};

QrCode.prototype.binarize = function(th) {
  var ret = new Array(this.width * this.height);
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var gray = this.getPixel(x, y);

      ret[x + y * this.width] = gray <= th;
    }
  }
  return ret;
};

QrCode.prototype.getMiddleBrightnessPerArea = function(imageData) {
  var numSqrtArea = 4;
  //obtain middle brightness((min + max) / 2) per area
  var areaWidth = Math.floor(imageData.width / numSqrtArea);
  var areaHeight = Math.floor(imageData.height / numSqrtArea);
  var minmax = new Array(numSqrtArea);
  for (var i = 0; i < numSqrtArea; i++) {
    minmax[i] = new Array(numSqrtArea);
    for (var i2 = 0; i2 < numSqrtArea; i2++) {
      minmax[i][i2] = [0, 0];
    }
  }
  for (var ay = 0; ay < numSqrtArea; ay++) {
    for (var ax = 0; ax < numSqrtArea; ax++) {
      minmax[ax][ay][0] = 0xFF;
      for (var dy = 0; dy < areaHeight; dy++) {
        for (var dx = 0; dx < areaWidth; dx++) {
          var target = imageData.data[areaWidth * ax + dx + (areaHeight * ay + dy) * imageData.width];
          if (target < minmax[ax][ay][0])
            minmax[ax][ay][0] = target;
          if (target > minmax[ax][ay][1])
            minmax[ax][ay][1] = target;
        }
      }
    }
  }
  var middle = new Array(numSqrtArea);
  for (var i3 = 0; i3 < numSqrtArea; i3++) {
    middle[i3] = new Array(numSqrtArea);
  }
  for (var ay = 0; ay < numSqrtArea; ay++) {
    for (var ax = 0; ax < numSqrtArea; ax++) {
      middle[ax][ay] = Math.floor((minmax[ax][ay][0] + minmax[ax][ay][1]) / 2);
    }
  }

  return middle;
};

QrCode.prototype.grayScaleToBitmap = function(grayScaleImageData) {
  var middle = this.getMiddleBrightnessPerArea(grayScaleImageData);
  var sqrtNumArea = middle.length;
  var areaWidth = Math.floor(grayScaleImageData.width / sqrtNumArea);
  var areaHeight = Math.floor(grayScaleImageData.height / sqrtNumArea);

  for (var ay = 0; ay < sqrtNumArea; ay++) {
    for (var ax = 0; ax < sqrtNumArea; ax++) {
      for (var dy = 0; dy < areaHeight; dy++) {
        for (var dx = 0; dx < areaWidth; dx++) {
          grayScaleImageData.data[areaWidth * ax + dx + (areaHeight * ay + dy) * grayScaleImageData.width] = (grayScaleImageData.data[areaWidth * ax + dx + (areaHeight * ay + dy) * grayScaleImageData.width] < middle[ax][ay]);
        }
      }
    }
  }
  return grayScaleImageData;
};

QrCode.prototype.grayscale = function(imageData) {
  var ret = new Array(imageData.width * imageData.height);

  for (var y = 0; y < imageData.height; y++) {
    for (var x = 0; x < imageData.width; x++) {
      var gray = this.getPixel(imageData, x, y);

      ret[x + y * imageData.width] = gray;
    }
  }

  return {
    height: imageData.height,
    width: imageData.width,
    data: ret
  };
};

function URShift(number,  bits) {
  if (number >= 0)
    return number >> bits;
  else
    return (number >> bits) + (2 << ~bits);
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = BitMatrix;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__qrcode__ = __webpack_require__(0);
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/



function BitMatrix(width,  height) {
  if (!height)
    height = width;
  if (width < 1 || height < 1) {
    throw "Both dimensions must be greater than 0";
  }
  this.width = width;
  this.height = height;
  var rowSize = width >> 5;
  if ((width & 0x1f) != 0) {
    rowSize++;
  }
  this.rowSize = rowSize;
  this.bits = new Array(rowSize * height);
  for (var i = 0; i < this.bits.length; i++)
    this.bits[i] = 0;
}

Object.defineProperty(BitMatrix.prototype, "Dimension", {
  get: function() {
    if (this.width != this.height) {
      throw "Can't call getDimension() on a non-square matrix";
    }
    return this.width;
  }
});

BitMatrix.prototype.get_Renamed = function(x, y) {
  var offset = y * this.rowSize + (x >> 5);
  return ((__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__qrcode__["c" /* URShift */])(this.bits[offset], (x & 0x1f))) & 1) != 0;
};

BitMatrix.prototype.set_Renamed = function(x, y) {
  var offset = y * this.rowSize + (x >> 5);
  this.bits[offset] |= 1 << (x & 0x1f);
};

BitMatrix.prototype.flip = function(x, y) {
  var offset = y * this.rowSize + (x >> 5);
  this.bits[offset] ^= 1 << (x & 0x1f);
};

BitMatrix.prototype.clear = function() {
  var max = this.bits.length;
  for (var i = 0; i < max; i++) {
    this.bits[i] = 0;
  }
};

BitMatrix.prototype.setRegion = function(left, top, width, height) {
  if (top < 0 || left < 0) {
    throw "Left and top must be nonnegative";
  }
  if (height < 1 || width < 1) {
    throw "Height and width must be at least 1";
  }
  var right = left + width;
  var bottom = top + height;
  if (bottom > this.height || right > this.width) {
    throw "The region must fit inside the matrix";
  }
  for (var y = top; y < bottom; y++) {
    var offset = y * this.rowSize;
    for (var x = left; x < right; x++) {
      this.bits[offset + (x >> 5)] |= 1 << (x & 0x1f);
    }
  }
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = FormatInformation;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__qrcode__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__errorlevel__ = __webpack_require__(15);
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/




var FORMAT_INFO_MASK_QR = 0x5412;
var FORMAT_INFO_DECODE_LOOKUP = [
  [0x5412, 0x00],
  [0x5125, 0x01],
  [0x5E7C, 0x02],
  [0x5B4B, 0x03],
  [0x45F9, 0x04],
  [0x40CE, 0x05],
  [0x4F97, 0x06],
  [0x4AA0, 0x07],
  [0x77C4, 0x08],
  [0x72F3, 0x09],
  [0x7DAA, 0x0A],
  [0x789D, 0x0B],
  [0x662F, 0x0C],
  [0x6318, 0x0D],
  [0x6C41, 0x0E],
  [0x6976, 0x0F],
  [0x1689, 0x10],
  [0x13BE, 0x11],
  [0x1CE7, 0x12],
  [0x19D0, 0x13],
  [0x0762, 0x14],
  [0x0255, 0x15],
  [0x0D0C, 0x16],
  [0x083B, 0x17],
  [0x355F, 0x18],
  [0x3068, 0x19],
  [0x3F31, 0x1A],
  [0x3A06, 0x1B],
  [0x24B4, 0x1C],
  [0x2183, 0x1D],
  [0x2EDA, 0x1E],
  [0x2BED, 0x1F],
];
var BITS_SET_IN_HALF_BYTE = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4];


function FormatInformation(formatInfo) {
  this.errorCorrectionLevel = __WEBPACK_IMPORTED_MODULE_1__errorlevel__["a" /* default */].forBits((formatInfo >> 3) & 0x03);
  this.dataMask =  (formatInfo & 0x07);
}

FormatInformation.prototype.GetHashCode = function() {
  return (this.errorCorrectionLevel.ordinal() << 3) |  this.dataMask;
};

FormatInformation.prototype.Equals = function(o) {
  var other =  o;
  return this.errorCorrectionLevel == other.errorCorrectionLevel && this.dataMask == other.dataMask;
};

FormatInformation.numBitsDiffering = function(a,  b) {
  a ^= b; // a now has a 1 bit exactly where its bit differs with b's
  // Count bits set quickly with a series of lookups:
  return BITS_SET_IN_HALF_BYTE[a & 0x0F] + BITS_SET_IN_HALF_BYTE[(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__qrcode__["c" /* URShift */])(a, 4) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__qrcode__["c" /* URShift */])(a, 8) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__qrcode__["c" /* URShift */])(a, 12) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__qrcode__["c" /* URShift */])(a, 16) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__qrcode__["c" /* URShift */])(a, 20) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__qrcode__["c" /* URShift */])(a, 24) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__qrcode__["c" /* URShift */])(a, 28) & 0x0F)];
};

FormatInformation.decodeFormatInformation = function(maskedFormatInfo) {
  var formatInfo = FormatInformation.doDecodeFormatInformation(maskedFormatInfo);
  if (formatInfo != null) {
    return formatInfo;
  }
  // Should return null, but, some QR codes apparently
  // do not mask this info. Try again by actually masking the pattern
  // first
  return FormatInformation.doDecodeFormatInformation(maskedFormatInfo ^ FORMAT_INFO_MASK_QR);
};
FormatInformation.doDecodeFormatInformation = function(maskedFormatInfo) {
  // Find the int in FORMAT_INFO_DECODE_LOOKUP with fewest bits differing
  var bestDifference = 0xffffffff;
  var bestFormatInfo = 0;
  for (var i = 0; i < FORMAT_INFO_DECODE_LOOKUP.length; i++) {
    var decodeInfo = FORMAT_INFO_DECODE_LOOKUP[i];
    var targetInfo = decodeInfo[0];
    if (targetInfo == maskedFormatInfo) {
      // Found an exact match
      return new FormatInformation(decodeInfo[1]);
    }
    var bitsDifference = this.numBitsDiffering(maskedFormatInfo, targetInfo);
    if (bitsDifference < bestDifference) {
      bestFormatInfo = decodeInfo[1];
      bestDifference = bitsDifference;
    }
  }
  // Hamming distance of the 32 masked codes is 7, by construction, so <= 3 bits
  // differing means we found a match
  if (bestDifference <= 3) {
    return new FormatInformation(bestFormatInfo);
  }
  return null;
};




/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = GF256;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gf256poly__ = __webpack_require__(4);
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/



function GF256(primitive) {
  this.expTable = new Array(256);
  this.logTable = new Array(256);
  var x = 1;
  for (var i = 0; i < 256; i++) {
    this.expTable[i] = x;
    x <<= 1; // x = x * 2; we're assuming the generator alpha is 2
    if (x >= 0x100) {
      x ^= primitive;
    }
  }
  for (var i = 0; i < 255; i++) {
    this.logTable[this.expTable[i]] = i;
  }
  // logTable[0] == 0 but this should never be used
  var at0 = new Array(1); at0[0] = 0;
  this.zero = new __WEBPACK_IMPORTED_MODULE_0__gf256poly__["a" /* default */](this, new Array(at0));
  var at1 = new Array(1); at1[0] = 1;
  this.one = new __WEBPACK_IMPORTED_MODULE_0__gf256poly__["a" /* default */](this, new Array(at1));
}

Object.defineProperty(GF256.prototype, "Zero", {
  get: function() {
    return this.zero;
  }
});

Object.defineProperty(GF256.prototype, "One", {
  get: function() {
    return this.one;
  }
});

GF256.prototype.buildMonomial = function(degree,  coefficient) {
  if (degree < 0) {
    throw "System.ArgumentException";
  }
  if (coefficient == 0) {
    return this.zero;
  }
  var coefficients = new Array(degree + 1);
  for (var i = 0; i < coefficients.length; i++)coefficients[i] = 0;
  coefficients[0] = coefficient;
  return new __WEBPACK_IMPORTED_MODULE_0__gf256poly__["a" /* default */](this, coefficients);
};

GF256.prototype.exp = function(a) {
  return this.expTable[a];
};

GF256.prototype.log = function(a) {
  if (a == 0) {
    throw "System.ArgumentException";
  }
  return this.logTable[a];
};

GF256.prototype.inverse = function(a) {
  if (a == 0) {
    throw "System.ArithmeticException";
  }
  return this.expTable[255 - this.logTable[a]];
};

GF256.prototype.addOrSubtract = function(a,  b) {
  return a ^ b;
};

GF256.prototype.multiply = function(a,  b) {
  if (a == 0 || b == 0) {
    return 0;
  }
  if (a == 1) {
    return b;
  }
  if (b == 1) {
    return a;
  }
  return this.expTable[(this.logTable[a] + this.logTable[b]) % 255];
};

GF256.QR_CODE_FIELD = new GF256(0x011D);
GF256.DATA_MATRIX_FIELD = new GF256(0x012D);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = GF256Poly;
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

function GF256Poly(field,  coefficients) {
  if (coefficients == null || coefficients.length == 0) {
    throw "System.ArgumentException";
  }
  this.field = field;
  var coefficientsLength = coefficients.length;
  if (coefficientsLength > 1 && coefficients[0] == 0) {
    // Leading term must be non-zero for anything except the constant polynomial "0"
    var firstNonZero = 1;
    while (firstNonZero < coefficientsLength && coefficients[firstNonZero] == 0) {
      firstNonZero++;
    }
    if (firstNonZero == coefficientsLength) {
      this.coefficients = field.Zero.coefficients;
    } else {
      this.coefficients = new Array(coefficientsLength - firstNonZero);
      for (var i = 0; i < this.coefficients.length; i++) this.coefficients[i] = 0;
      for (var ci = 0; ci < this.coefficients.length; ci++) this.coefficients[ci] = coefficients[firstNonZero + ci];
    }
  } else {
    this.coefficients = coefficients;
  }
}

Object.defineProperty(GF256Poly.prototype, "Zero", {
  get: function() {
    return this.coefficients[0] == 0;
  }
});

Object.defineProperty(GF256Poly.prototype, "Degree", {
  get: function() {
    return this.coefficients.length - 1;
  }
});

GF256Poly.prototype.getCoefficient = function(degree) {
  return this.coefficients[this.coefficients.length - 1 - degree];
};

GF256Poly.prototype.evaluateAt = function(a) {
  if (a == 0) {
    // Just return the x^0 coefficient
    return this.getCoefficient(0);
  }
  var size = this.coefficients.length;
  if (a == 1) {
    // Just the sum of the coefficients
    var result = 0;
    for (var i = 0; i < size; i++) {
      result = this.field.addOrSubtract(result, this.coefficients[i]);
    }
    return result;
  }
  var result2 = this.coefficients[0];
  for (var i = 1; i < size; i++) {
    result2 = this.field.addOrSubtract(this.field.multiply(a, result2), this.coefficients[i]);
  }
  return result2;
};

GF256Poly.prototype.addOrSubtract = function(other) {
  if (this.field != other.field) {
    throw "GF256Polys do not have same GF256 field";
  }
  if (this.Zero) {
    return other;
  }
  if (other.Zero) {
    return this;
  }

  var smallerCoefficients = this.coefficients;
  var largerCoefficients = other.coefficients;
  if (smallerCoefficients.length > largerCoefficients.length) {
    var temp = smallerCoefficients;
    smallerCoefficients = largerCoefficients;
    largerCoefficients = temp;
  }
  var sumDiff = new Array(largerCoefficients.length);
  var lengthDiff = largerCoefficients.length - smallerCoefficients.length;
  // Copy high-order terms only found in higher-degree polynomial's coefficients
  for (var ci = 0; ci < lengthDiff; ci++)sumDiff[ci] = largerCoefficients[ci];

  for (var i = lengthDiff; i < largerCoefficients.length; i++) {
    sumDiff[i] = this.field.addOrSubtract(smallerCoefficients[i - lengthDiff], largerCoefficients[i]);
  }

  return new GF256Poly(this.field, sumDiff);
};

GF256Poly.prototype.multiply1 = function(other) {
  if (this.field != other.field) {
    throw "GF256Polys do not have same GF256 field";
  }
  if (this.Zero || other.Zero) {
    return this.field.Zero;
  }
  var aCoefficients = this.coefficients;
  var aLength = aCoefficients.length;
  var bCoefficients = other.coefficients;
  var bLength = bCoefficients.length;
  var product = new Array(aLength + bLength - 1);
  for (var i = 0; i < aLength; i++) {
    var aCoeff = aCoefficients[i];
    for (var j = 0; j < bLength; j++) {
      product[i + j] = this.field.addOrSubtract(product[i + j], this.field.multiply(aCoeff, bCoefficients[j]));
    }
  }
  return new GF256Poly(this.field, product);
};

GF256Poly.prototype.multiply2 = function(scalar) {
  if (scalar == 0) {
    return this.field.Zero;
  }
  if (scalar == 1) {
    return this;
  }
  var size = this.coefficients.length;
  var product = new Array(size);
  for (var i = 0; i < size; i++) {
    product[i] = this.field.multiply(this.coefficients[i], scalar);
  }
  return new GF256Poly(this.field, product);
};

GF256Poly.prototype.multiplyByMonomial = function(degree,  coefficient) {
  if (degree < 0) {
    throw "System.ArgumentException";
  }
  if (coefficient == 0) {
    return this.field.Zero;
  }
  var size = this.coefficients.length;
  var product = new Array(size + degree);
  for (var i = 0; i < product.length; i++)product[i] = 0;
  for (var i = 0; i < size; i++) {
    product[i] = this.field.multiply(this.coefficients[i], coefficient);
  }
  return new GF256Poly(this.field, product);
};

GF256Poly.prototype.divide = function(other) {
  if (this.field != other.field) {
    throw "GF256Polys do not have same GF256 field";
  }
  if (other.Zero) {
    throw "Divide by 0";
  }

  var quotient = this.field.Zero;
  var remainder = this;

  var denominatorLeadingTerm = other.getCoefficient(other.Degree);
  var inverseDenominatorLeadingTerm = this.field.inverse(denominatorLeadingTerm);

  while (remainder.Degree >= other.Degree && !remainder.Zero) {
    var degreeDifference = remainder.Degree - other.Degree;
    var scale = this.field.multiply(remainder.getCoefficient(remainder.Degree), inverseDenominatorLeadingTerm);
    var term = other.multiplyByMonomial(degreeDifference, scale);
    var iterationQuotient = this.field.buildMonomial(degreeDifference, scale);
    quotient = quotient.addOrSubtract(iterationQuotient);
    remainder = remainder.addOrSubtract(term);
  }

  return [quotient, remainder];
};


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Version;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__formatinf__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bitmat__ = __webpack_require__(1);
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/




function ECB(count,  dataCodewords) {
  this.count = count;
  this.dataCodewords = dataCodewords;
}

function ECBlocks(ecCodewordsPerBlock,  ecBlocks1,  ecBlocks2) {
  this.ecCodewordsPerBlock = ecCodewordsPerBlock;
  if (ecBlocks2)
    this.ecBlocks = [ecBlocks1, ecBlocks2];
  else
    this.ecBlocks = [ecBlocks1];
}

Object.defineProperty(ECBlocks.prototype, "TotalECCodewords", {
  get: function() {
    return  this.ecCodewordsPerBlock * this.NumBlocks;
  }
});

Object.defineProperty(ECBlocks.prototype, "NumBlocks", {
  get: function() {
    var total = 0;
    for (var i = 0; i < this.ecBlocks.length; i++) {
      total += this.ecBlocks[i].length;
    }
    return total;
  }
});

ECBlocks.prototype.getECBlocks = function() {
  return this.ecBlocks;
};

function Version(versionNumber,  alignmentPatternCenters,  ecBlocks1,  ecBlocks2,  ecBlocks3,  ecBlocks4) {
  this.versionNumber = versionNumber;
  this.alignmentPatternCenters = alignmentPatternCenters;
  this.ecBlocks = [ecBlocks1, ecBlocks2, ecBlocks3, ecBlocks4];

  var total = 0;
  var ecCodewords = ecBlocks1.ecCodewordsPerBlock;
  var ecbArray = ecBlocks1.getECBlocks();
  for (var i = 0; i < ecbArray.length; i++) {
    var ecBlock = ecbArray[i];
    total += ecBlock.count * (ecBlock.dataCodewords + ecCodewords);
  }
  this.totalCodewords = total;
}

Object.defineProperty(Version.prototype, "DimensionForVersion", {
  get: function() {
    return  17 + 4 * this.versionNumber;
  }
});

Version.prototype.buildFunctionPattern = function() {
  var dimension = this.DimensionForVersion;
  var bitMatrix = new __WEBPACK_IMPORTED_MODULE_1__bitmat__["a" /* default */](dimension);

  // Top left finder pattern + separator + format
  bitMatrix.setRegion(0, 0, 9, 9);
  // Top right finder pattern + separator + format
  bitMatrix.setRegion(dimension - 8, 0, 8, 9);
  // Bottom left finder pattern + separator + format
  bitMatrix.setRegion(0, dimension - 8, 9, 8);

  // Alignment patterns
  var max = this.alignmentPatternCenters.length;
  for (var x = 0; x < max; x++) {
    var i = this.alignmentPatternCenters[x] - 2;
    for (var y = 0; y < max; y++) {
      if ((x == 0 && (y == 0 || y == max - 1)) || (x == max - 1 && y == 0)) {
        // No alignment patterns near the three finder paterns
        continue;
      }
      bitMatrix.setRegion(this.alignmentPatternCenters[y] - 2, i, 5, 5);
    }
  }

  // Vertical timing pattern
  bitMatrix.setRegion(6, 9, 1, dimension - 17);
  // Horizontal timing pattern
  bitMatrix.setRegion(9, 6, dimension - 17, 1);

  if (this.versionNumber > 6) {
    // Version info, top right
    bitMatrix.setRegion(dimension - 11, 0, 3, 6);
    // Version info, bottom left
    bitMatrix.setRegion(0, dimension - 11, 6, 3);
  }

  return bitMatrix;
};

Version.prototype.getECBlocksForLevel = function(ecLevel) {
  return this.ecBlocks[ecLevel.ordinal()];
};

Version.VERSION_DECODE_INFO = [
  0x07C94,
  0x085BC,
  0x09A99,
  0x0A4D3,
  0x0BBF6,
  0x0C762,
  0x0D847,
  0x0E60D,
  0x0F928,
  0x10B78,
  0x1145D,
  0x12A17,
  0x13532,
  0x149A6,
  0x15683,
  0x168C9,
  0x177EC,
  0x18EC4,
  0x191E1,
  0x1AFAB,
  0x1B08E,
  0x1CC1A,
  0x1D33F,
  0x1ED75,
  0x1F250,
  0x209D5,
  0x216F0,
  0x228BA,
  0x2379F,
  0x24B0B,
  0x2542E,
  0x26A64,
  0x27541,
  0x28C69
];

Version.VERSIONS = buildVersions();

Version.getVersionForNumber = function(versionNumber) {
  if (versionNumber < 1 || versionNumber > 40) {
    throw "ArgumentException";
  }
  return Version.VERSIONS[versionNumber - 1];
};

Version.getProvisionalVersionForDimension = function(dimension) {
  if (dimension % 4 != 1) {
    throw "Error getProvisionalVersionForDimension";
  }
  try {
    return Version.getVersionForNumber((dimension - 17) >> 2);
  } catch (iae) {
    throw "Error getVersionForNumber";
  }
};

Version.decodeVersionInformation = function(versionBits) {
  var bestDifference = 0xffffffff;
  var bestVersion = 0;
  for (var i = 0; i < Version.VERSION_DECODE_INFO.length; i++) {
    var targetVersion = Version.VERSION_DECODE_INFO[i];
    // Do the version info bits match exactly? done.
    if (targetVersion == versionBits) {
      return this.getVersionForNumber(i + 7);
    }
    // Otherwise see if this is the closest to a real version info bit string
    // we have seen so far
    var bitsDifference = __WEBPACK_IMPORTED_MODULE_0__formatinf__["a" /* default */].numBitsDiffering(versionBits, targetVersion);
    if (bitsDifference < bestDifference) {
      bestVersion = i + 7;
      bestDifference = bitsDifference;
    }
  }
  // We can tolerate up to 3 bits of error since no two version info codewords will
  // differ in less than 4 bits.
  if (bestDifference <= 3) {
    return this.getVersionForNumber(bestVersion);
  }
  // If we didn't find a close enough match, fail
  return null;
};

function buildVersions() {
  return [
    new Version(1, [], new ECBlocks(7, new ECB(1, 19)), new ECBlocks(10, new ECB(1, 16)), new ECBlocks(13, new ECB(1, 13)), new ECBlocks(17, new ECB(1, 9))),
    new Version(2, [6, 18], new ECBlocks(10, new ECB(1, 34)), new ECBlocks(16, new ECB(1, 28)), new ECBlocks(22, new ECB(1, 22)), new ECBlocks(28, new ECB(1, 16))),
    new Version(3, [6, 22], new ECBlocks(15, new ECB(1, 55)), new ECBlocks(26, new ECB(1, 44)), new ECBlocks(18, new ECB(2, 17)), new ECBlocks(22, new ECB(2, 13))),
    new Version(4, [6, 26], new ECBlocks(20, new ECB(1, 80)), new ECBlocks(18, new ECB(2, 32)), new ECBlocks(26, new ECB(2, 24)), new ECBlocks(16, new ECB(4, 9))),
    new Version(5, [6, 30], new ECBlocks(26, new ECB(1, 108)), new ECBlocks(24, new ECB(2, 43)), new ECBlocks(18, new ECB(2, 15), new ECB(2, 16)), new ECBlocks(22, new ECB(2, 11), new ECB(2, 12))),
    new Version(6, [6, 34], new ECBlocks(18, new ECB(2, 68)), new ECBlocks(16, new ECB(4, 27)), new ECBlocks(24, new ECB(4, 19)), new ECBlocks(28, new ECB(4, 15))),
    new Version(7, [6, 22, 38], new ECBlocks(20, new ECB(2, 78)), new ECBlocks(18, new ECB(4, 31)), new ECBlocks(18, new ECB(2, 14), new ECB(4, 15)), new ECBlocks(26, new ECB(4, 13), new ECB(1, 14))),
    new Version(8, [6, 24, 42], new ECBlocks(24, new ECB(2, 97)), new ECBlocks(22, new ECB(2, 38), new ECB(2, 39)), new ECBlocks(22, new ECB(4, 18), new ECB(2, 19)), new ECBlocks(26, new ECB(4, 14), new ECB(2, 15))),
    new Version(9, [6, 26, 46], new ECBlocks(30, new ECB(2, 116)), new ECBlocks(22, new ECB(3, 36), new ECB(2, 37)), new ECBlocks(20, new ECB(4, 16), new ECB(4, 17)), new ECBlocks(24, new ECB(4, 12), new ECB(4, 13))),
    new Version(10, [6, 28, 50], new ECBlocks(18, new ECB(2, 68), new ECB(2, 69)), new ECBlocks(26, new ECB(4, 43), new ECB(1, 44)), new ECBlocks(24, new ECB(6, 19), new ECB(2, 20)), new ECBlocks(28, new ECB(6, 15), new ECB(2, 16))),
    new Version(11, [6, 30, 54], new ECBlocks(20, new ECB(4, 81)), new ECBlocks(30, new ECB(1, 50), new ECB(4, 51)), new ECBlocks(28, new ECB(4, 22), new ECB(4, 23)), new ECBlocks(24, new ECB(3, 12), new ECB(8, 13))),
    new Version(12, [6, 32, 58], new ECBlocks(24, new ECB(2, 92), new ECB(2, 93)), new ECBlocks(22, new ECB(6, 36), new ECB(2, 37)), new ECBlocks(26, new ECB(4, 20), new ECB(6, 21)), new ECBlocks(28, new ECB(7, 14), new ECB(4, 15))),
    new Version(13, [6, 34, 62], new ECBlocks(26, new ECB(4, 107)), new ECBlocks(22, new ECB(8, 37), new ECB(1, 38)), new ECBlocks(24, new ECB(8, 20), new ECB(4, 21)), new ECBlocks(22, new ECB(12, 11), new ECB(4, 12))),
    new Version(14, [6, 26, 46, 66], new ECBlocks(30, new ECB(3, 115), new ECB(1, 116)), new ECBlocks(24, new ECB(4, 40), new ECB(5, 41)), new ECBlocks(20, new ECB(11, 16), new ECB(5, 17)), new ECBlocks(24, new ECB(11, 12), new ECB(5, 13))),
    new Version(15, [6, 26, 48, 70], new ECBlocks(22, new ECB(5, 87), new ECB(1, 88)), new ECBlocks(24, new ECB(5, 41), new ECB(5, 42)), new ECBlocks(30, new ECB(5, 24), new ECB(7, 25)), new ECBlocks(24, new ECB(11, 12), new ECB(7, 13))),
    new Version(16, [6, 26, 50, 74], new ECBlocks(24, new ECB(5, 98), new ECB(1, 99)), new ECBlocks(28, new ECB(7, 45), new ECB(3, 46)), new ECBlocks(24, new ECB(15, 19), new ECB(2, 20)), new ECBlocks(30, new ECB(3, 15), new ECB(13, 16))),
    new Version(17, [6, 30, 54, 78], new ECBlocks(28, new ECB(1, 107), new ECB(5, 108)), new ECBlocks(28, new ECB(10, 46), new ECB(1, 47)), new ECBlocks(28, new ECB(1, 22), new ECB(15, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(17, 15))),
    new Version(18, [6, 30, 56, 82], new ECBlocks(30, new ECB(5, 120), new ECB(1, 121)), new ECBlocks(26, new ECB(9, 43), new ECB(4, 44)), new ECBlocks(28, new ECB(17, 22), new ECB(1, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(19, 15))),
    new Version(19, [6, 30, 58, 86], new ECBlocks(28, new ECB(3, 113), new ECB(4, 114)), new ECBlocks(26, new ECB(3, 44), new ECB(11, 45)), new ECBlocks(26, new ECB(17, 21), new ECB(4, 22)), new ECBlocks(26, new ECB(9, 13), new ECB(16, 14))),
    new Version(20, [6, 34, 62, 90], new ECBlocks(28, new ECB(3, 107), new ECB(5, 108)), new ECBlocks(26, new ECB(3, 41), new ECB(13, 42)), new ECBlocks(30, new ECB(15, 24), new ECB(5, 25)), new ECBlocks(28, new ECB(15, 15), new ECB(10, 16))),
    new Version(21, [6, 28, 50, 72, 94], new ECBlocks(28, new ECB(4, 116), new ECB(4, 117)), new ECBlocks(26, new ECB(17, 42)), new ECBlocks(28, new ECB(17, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(19, 16), new ECB(6, 17))),
    new Version(22, [6, 26, 50, 74, 98], new ECBlocks(28, new ECB(2, 111), new ECB(7, 112)), new ECBlocks(28, new ECB(17, 46)), new ECBlocks(30, new ECB(7, 24), new ECB(16, 25)), new ECBlocks(24, new ECB(34, 13))),
    new Version(23, [6, 30, 54, 74, 102], new ECBlocks(30, new ECB(4, 121), new ECB(5, 122)), new ECBlocks(28, new ECB(4, 47), new ECB(14, 48)), new ECBlocks(30, new ECB(11, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(16, 15), new ECB(14, 16))),
    new Version(24, [6, 28, 54, 80, 106], new ECBlocks(30, new ECB(6, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(6, 45), new ECB(14, 46)), new ECBlocks(30, new ECB(11, 24), new ECB(16, 25)), new ECBlocks(30, new ECB(30, 16), new ECB(2, 17))),
    new Version(25, [6, 32, 58, 84, 110], new ECBlocks(26, new ECB(8, 106), new ECB(4, 107)), new ECBlocks(28, new ECB(8, 47), new ECB(13, 48)), new ECBlocks(30, new ECB(7, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(22, 15), new ECB(13, 16))),
    new Version(26, [6, 30, 58, 86, 114], new ECBlocks(28, new ECB(10, 114), new ECB(2, 115)), new ECBlocks(28, new ECB(19, 46), new ECB(4, 47)), new ECBlocks(28, new ECB(28, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(33, 16), new ECB(4, 17))),
    new Version(27, [6, 34, 62, 90, 118], new ECBlocks(30, new ECB(8, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(22, 45), new ECB(3, 46)), new ECBlocks(30, new ECB(8, 23), new ECB(26, 24)), new ECBlocks(30, new ECB(12, 15),     new ECB(28, 16))),
    new Version(28, [6, 26, 50, 74, 98, 122], new ECBlocks(30, new ECB(3, 117), new ECB(10, 118)), new ECBlocks(28, new ECB(3, 45), new ECB(23, 46)), new ECBlocks(30, new ECB(4, 24), new ECB(31, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(31, 16))),
    new Version(29, [6, 30, 54, 78, 102, 126], new ECBlocks(30, new ECB(7, 116), new ECB(7, 117)), new ECBlocks(28, new ECB(21, 45), new ECB(7, 46)), new ECBlocks(30, new ECB(1, 23), new ECB(37, 24)), new ECBlocks(30, new ECB(19, 15), new ECB(26, 16))),
    new Version(30, [6, 26, 52, 78, 104, 130], new ECBlocks(30, new ECB(5, 115), new ECB(10, 116)), new ECBlocks(28, new ECB(19, 47), new ECB(10, 48)), new ECBlocks(30, new ECB(15, 24), new ECB(25, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(25, 16))),
    new Version(31, [6, 30, 56, 82, 108, 134], new ECBlocks(30, new ECB(13, 115), new ECB(3, 116)), new ECBlocks(28, new ECB(2, 46), new ECB(29, 47)), new ECBlocks(30, new ECB(42, 24), new ECB(1, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(28, 16))),
    new Version(32, [6, 34, 60, 86, 112, 138], new ECBlocks(30, new ECB(17, 115)), new ECBlocks(28, new ECB(10, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(10, 24), new ECB(35, 25)), new ECBlocks(30, new ECB(19, 15), new ECB(35, 16))),
    new Version(33, [6, 30, 58, 86, 114, 142], new ECBlocks(30, new ECB(17, 115), new ECB(1, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(21, 47)), new ECBlocks(30, new ECB(29, 24), new ECB(19, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(46, 16))),
    new Version(34, [6, 34, 62, 90, 118, 146], new ECBlocks(30, new ECB(13, 115), new ECB(6, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(44, 24), new ECB(7, 25)), new ECBlocks(30, new ECB(59, 16), new ECB(1, 17))),
    new Version(35, [6, 30, 54, 78, 102, 126, 150], new ECBlocks(30, new ECB(12, 121), new ECB(7, 122)), new ECBlocks(28, new ECB(12, 47), new ECB(26, 48)), new ECBlocks(30, new ECB(39, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(22, 15), new ECB(41, 16))),
    new Version(36, [6, 24, 50, 76, 102, 128, 154], new ECBlocks(30, new ECB(6, 121), new ECB(14, 122)), new ECBlocks(28, new ECB(6, 47), new ECB(34, 48)), new ECBlocks(30, new ECB(46, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(2, 15), new ECB(64, 16))),
    new Version(37, [6, 28, 54, 80, 106, 132, 158], new ECBlocks(30, new ECB(17, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(29, 46), new ECB(14, 47)), new ECBlocks(30, new ECB(49, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(24, 15), new ECB(46, 16))),
    new Version(38, [6, 32, 58, 84, 110, 136, 162], new ECBlocks(30, new ECB(4, 122), new ECB(18, 123)), new ECBlocks(28, new ECB(13, 46), new ECB(32, 47)), new ECBlocks(30, new ECB(48, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(42, 15), new ECB(32, 16))),
    new Version(39, [6, 26, 54, 82, 110, 138, 166], new ECBlocks(30, new ECB(20, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(40, 47), new ECB(7, 48)), new ECBlocks(30, new ECB(43, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(10, 15), new ECB(67, 16))),
    new Version(40, [6, 30, 58, 86, 114, 142, 170], new ECBlocks(30, new ECB(19, 118), new ECB(6, 119)), new ECBlocks(28, new ECB(18, 47), new ECB(31, 48)), new ECBlocks(30, new ECB(34, 24), new ECB(34, 25)), new ECBlocks(30, new ECB(20, 15), new ECB(61, 16))),
  ];
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BarcodeDetector", function() { return BarcodeDetector; });
// ShapeDetection polyfill.

var BarcodeDetector = window.BarcodeDetector;

if (typeof window.BarcodeDetector === 'undefined') {

  // https://wicg.github.io/shape-detection-api/#barcode-detection-api
  BarcodeDetector = class {

    constructor() {
        // |qrcode| should be defined by `qrcode = require('qrcode-reader');`
        if (typeof this._qrcode === 'undefined') {
          var lib = __webpack_require__(18);
          this._qrcode = new lib.default();
        }

        if (typeof this._quagga === 'undefined')
          this._quagga = __webpack_require__(20);

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


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {


var shapedetection = __webpack_require__(6);
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


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony export (immutable) */ __webpack_exports__["a"] = AlignmentPatternFinder;
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/


function AlignmentPattern(posX, posY,  estimatedModuleSize) {
  this.x = posX;
  this.y = posY;
  this.count = 1;
  this.estimatedModuleSize = estimatedModuleSize;
}

Object.defineProperty(AlignmentPattern.prototype, "X", {
  get: function() {
    return Math.floor(this.x);
  }
});

Object.defineProperty(AlignmentPattern.prototype, "Y", {
  get: function() {
    return Math.floor(this.y);
  }
});

AlignmentPattern.prototype.incrementCount = function() {
  this.count++;
};

AlignmentPattern.prototype.aboutEquals = function(moduleSize,  i,  j) {
  if (Math.abs(i - this.y) <= moduleSize && Math.abs(j - this.x) <= moduleSize) {
    var moduleSizeDiff = Math.abs(moduleSize - this.estimatedModuleSize);
    return moduleSizeDiff <= 1.0 || moduleSizeDiff / this.estimatedModuleSize <= 1.0;
  }
  return false;
};

function AlignmentPatternFinder(image,  startX,  startY,  width,  height,  moduleSize,  resultPointCallback) {
  this.image = image;
  this.possibleCenters = [];
  this.startX = startX;
  this.startY = startY;
  this.width = width;
  this.height = height;
  this.moduleSize = moduleSize;
  this.crossCheckStateCount = [0, 0, 0];
  this.resultPointCallback = resultPointCallback;
}

AlignmentPatternFinder.prototype.centerFromEnd = function(stateCount,  end) {
  return  (end - stateCount[2]) - stateCount[1] / 2.0;
};

AlignmentPatternFinder.prototype.foundPatternCross = function(stateCount) {
  var moduleSize = this.moduleSize;
  var maxVariance = moduleSize / 2.0;
  for (var i = 0; i < 3; i++) {
    if (Math.abs(moduleSize - stateCount[i]) >= maxVariance) {
      return false;
    }
  }
  return true;
};

AlignmentPatternFinder.prototype.crossCheckVertical = function(startI,  centerJ,  maxCount,  originalStateCountTotal) {
  var image = this.image;

  var maxI = image.height;
  var stateCount = this.crossCheckStateCount;
  stateCount[0] = 0;
  stateCount[1] = 0;
  stateCount[2] = 0;

  // Start counting up from center
  var i = startI;
  while (i >= 0 && image.data[centerJ + i * image.width] && stateCount[1] <= maxCount) {
    stateCount[1]++;
    i--;
  }
  // If already too many modules in this state or ran off the edge:
  if (i < 0 || stateCount[1] > maxCount) {
    return NaN;
  }
  while (i >= 0 && !image.data[centerJ + i * image.width] && stateCount[0] <= maxCount) {
    stateCount[0]++;
    i--;
  }
  if (stateCount[0] > maxCount) {
    return NaN;
  }

  // Now also count down from center
  i = startI + 1;
  while (i < maxI && image.data[centerJ + i * image.width] && stateCount[1] <= maxCount) {
    stateCount[1]++;
    i++;
  }
  if (i == maxI || stateCount[1] > maxCount) {
    return NaN;
  }
  while (i < maxI && !image.data[centerJ + i * image.width] && stateCount[2] <= maxCount) {
    stateCount[2]++;
    i++;
  }
  if (stateCount[2] > maxCount) {
    return NaN;
  }

  var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2];
  if (5 * Math.abs(stateCountTotal - originalStateCountTotal) >= 2 * originalStateCountTotal) {
    return NaN;
  }

  return this.foundPatternCross(stateCount) ? this.centerFromEnd(stateCount, i) : NaN;
};

AlignmentPatternFinder.prototype.handlePossibleCenter = function(stateCount,  i,  j) {
  var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2];
  var centerJ = this.centerFromEnd(stateCount, j);
  var centerI = this.crossCheckVertical(i, Math.floor(centerJ), 2 * stateCount[1], stateCountTotal);
  if (!isNaN(centerI)) {
    var estimatedModuleSize = (stateCount[0] + stateCount[1] + stateCount[2]) / 3.0;
    var max = this.possibleCenters.length;
    for (var index = 0; index < max; index++) {
      var center =  this.possibleCenters[index];
      // Look for about the same center and module size:
      if (center.aboutEquals(estimatedModuleSize, centerI, centerJ)) {
        return new AlignmentPattern(centerJ, centerI, estimatedModuleSize);
      }
    }
    // Hadn't found this before; save it
    var point = new AlignmentPattern(centerJ, centerI, estimatedModuleSize);
    this.possibleCenters.push(point);
    if (this.resultPointCallback != null) {
      this.resultPointCallback.foundPossibleResultPoint(point);
    }
  }
  return null;
};

AlignmentPatternFinder.prototype.find = function() {
  var image = this.image;
  var startX = this.startX;
  var height = this.height;
  var maxJ = startX + this.width;
  var middleI = this.startY + (height >> 1);
  // We are looking for black/white/black modules in 1:1:1 ratio;
  // this tracks the number of black/white/black modules seen so far
  var stateCount = [0, 0, 0];
  for (var iGen = 0; iGen < height; iGen++) {
    // Search from middle outwards
    var i = middleI + ((iGen & 0x01) == 0 ? ((iGen + 1) >> 1) : -((iGen + 1) >> 1));
    stateCount[0] = 0;
    stateCount[1] = 0;
    stateCount[2] = 0;
    var j = startX;
    // Burn off leading white pixels before anything else; if we start in the middle of
    // a white run, it doesn't make sense to count its length, since we don't know if the
    // white run continued to the left of the start point
    while (j < maxJ && !image.data[j + image.width * i]) {
      j++;
    }
    var currentState = 0;
    while (j < maxJ) {
      if (image.data[j + i * image.width]) {
        // Black pixel
        if (currentState == 1) {
          // Counting black pixels
          stateCount[currentState]++;
        } else {
          // Counting white pixels
          if (currentState == 2) {
            // A winner?
            if (this.foundPatternCross(stateCount)) {
              // Yes
              var confirmed = this.handlePossibleCenter(stateCount, i, j);
              if (confirmed != null) {
                return confirmed;
              }
            }
            stateCount[0] = stateCount[2];
            stateCount[1] = 1;
            stateCount[2] = 0;
            currentState = 1;
          } else {
            stateCount[++currentState]++;
          }
        }
      } else {
        // White pixel
        if (currentState == 1) {
          // Counting black pixels
          currentState++;
        }
        stateCount[currentState]++;
      }
      j++;
    }
    if (this.foundPatternCross(stateCount)) {
      var confirmed = this.handlePossibleCenter(stateCount, i, maxJ);
      if (confirmed != null) {
        return confirmed;
      }
    }
  }

  // Hmm, nothing we saw was observed and confirmed twice. If we had
  // any guess at all, return it.
  if (!(this.possibleCenters.length == 0)) {
    return  this.possibleCenters[0];
  }

  throw "Couldn't find enough alignment patterns";
};


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = BitMatrixParser;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__formatinf__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__version__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__datamask__ = __webpack_require__(12);
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/





function BitMatrixParser(bitMatrix) {
  var dimension = bitMatrix.Dimension;
  if (dimension < 21 || (dimension & 0x03) != 1) {
    throw "Error BitMatrixParser";
  }
  this.bitMatrix = bitMatrix;
  this.parsedVersion = null;
  this.parsedFormatInfo = null;
}

BitMatrixParser.prototype.copyBit = function(i,  j,  versionBits) {
  return this.bitMatrix.get_Renamed(i, j) ? (versionBits << 1) | 0x1 : versionBits << 1;
};

BitMatrixParser.prototype.readFormatInformation = function() {
  if (this.parsedFormatInfo != null) {
    return this.parsedFormatInfo;
  }

  // Read top-left format info bits
  var formatInfoBits = 0;
  for (var i = 0; i < 6; i++) {
    formatInfoBits = this.copyBit(i, 8, formatInfoBits);
  }
  // .. and skip a bit in the timing pattern ...
  formatInfoBits = this.copyBit(7, 8, formatInfoBits);
  formatInfoBits = this.copyBit(8, 8, formatInfoBits);
  formatInfoBits = this.copyBit(8, 7, formatInfoBits);
  // .. and skip a bit in the timing pattern ...
  for (var j = 5; j >= 0; j--) {
    formatInfoBits = this.copyBit(8, j, formatInfoBits);
  }

  this.parsedFormatInfo = __WEBPACK_IMPORTED_MODULE_0__formatinf__["a" /* default */].decodeFormatInformation(formatInfoBits);
  if (this.parsedFormatInfo != null) {
    return this.parsedFormatInfo;
  }

  // Hmm, failed. Try the top-right/bottom-left pattern
  var dimension = this.bitMatrix.Dimension;
  formatInfoBits = 0;
  var iMin = dimension - 8;
  for (var i = dimension - 1; i >= iMin; i--) {
    formatInfoBits = this.copyBit(i, 8, formatInfoBits);
  }
  for (var j = dimension - 7; j < dimension; j++) {
    formatInfoBits = this.copyBit(8, j, formatInfoBits);
  }

  this.parsedFormatInfo = __WEBPACK_IMPORTED_MODULE_0__formatinf__["a" /* default */].decodeFormatInformation(formatInfoBits);
  if (this.parsedFormatInfo != null) {
    return this.parsedFormatInfo;
  }
  throw "Error readFormatInformation";
};

BitMatrixParser.prototype.readVersion = function() {
  if (this.parsedVersion != null) {
    return this.parsedVersion;
  }

  var dimension = this.bitMatrix.Dimension;

  var provisionalVersion = (dimension - 17) >> 2;
  if (provisionalVersion <= 6) {
    return __WEBPACK_IMPORTED_MODULE_1__version__["a" /* default */].getVersionForNumber(provisionalVersion);
  }

  // Read top-right version info: 3 wide by 6 tall
  var versionBits = 0;
  var ijMin = dimension - 11;
  for (var j = 5; j >= 0; j--) {
    for (var i = dimension - 9; i >= ijMin; i--) {
      versionBits = this.copyBit(i, j, versionBits);
    }
  }

  this.parsedVersion = __WEBPACK_IMPORTED_MODULE_1__version__["a" /* default */].decodeVersionInformation(versionBits);
  if (this.parsedVersion != null && this.parsedVersion.DimensionForVersion == dimension) {
    return this.parsedVersion;
  }

  // Hmm, failed. Try bottom left: 6 wide by 3 tall
  versionBits = 0;
  for (var i = 5; i >= 0; i--) {
    for (var j = dimension - 9; j >= ijMin; j--) {
      versionBits = this.copyBit(i, j, versionBits);
    }
  }

  this.parsedVersion = __WEBPACK_IMPORTED_MODULE_1__version__["a" /* default */].decodeVersionInformation(versionBits);
  if (this.parsedVersion != null && this.parsedVersion.DimensionForVersion == dimension) {
    return this.parsedVersion;
  }
  throw "Error readVersion";
};

BitMatrixParser.prototype.readCodewords = function() {
  var formatInfo = this.readFormatInformation();
  var version = this.readVersion();

  // Get the data mask for the format used in this QR Code. This will exclude
  // some bits from reading as we wind through the bit matrix.
  var dataMask = __WEBPACK_IMPORTED_MODULE_2__datamask__["a" /* default */].forReference(formatInfo.dataMask);
  var dimension = this.bitMatrix.Dimension;
  dataMask.unmaskBitMatrix(this.bitMatrix, dimension);

  var functionPattern = version.buildFunctionPattern();

  var readingUp = true;
  var result = new Array(version.totalCodewords);
  var resultOffset = 0;
  var currentByte = 0;
  var bitsRead = 0;
  // Read columns in pairs, from right to left
  for (var j = dimension - 1; j > 0; j -= 2) {
    if (j == 6) {
      // Skip whole column with vertical alignment pattern;
      // saves time and makes the other code proceed more cleanly
      j--;
    }
    // Read alternatingly from bottom to top then top to bottom
    for (var count = 0; count < dimension; count++) {
      var i = readingUp ? dimension - 1 - count : count;
      for (var col = 0; col < 2; col++) {
        // Ignore bits covered by the function pattern
        if (!functionPattern.get_Renamed(j - col, i)) {
          // Read a bit
          bitsRead++;
          currentByte <<= 1;
          if (this.bitMatrix.get_Renamed(j - col, i)) {
            currentByte |= 1;
          }
          // If we've made a whole byte, save it off
          if (bitsRead == 8) {
            result[resultOffset++] =  currentByte;
            bitsRead = 0;
            currentByte = 0;
          }
        }
      }
    }
    readingUp ^= true; // readingUp = !readingUp; // switch directions
  }
  if (resultOffset != version.totalCodewords) {
    throw "Error readCodewords";
  }
  return result;
};


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = DataBlock;
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/


function DataBlock(numDataCodewords,  codewords) {
  this.numDataCodewords = numDataCodewords;
  this.codewords = codewords;
}

DataBlock.getDataBlocks = function(rawCodewords,  version,  ecLevel) {

  if (rawCodewords.length != version.totalCodewords) {
    throw "ArgumentException";
  }

  // Figure out the number and size of data blocks used by this version and
  // error correction level
  var ecBlocks = version.getECBlocksForLevel(ecLevel);

  // First count the total number of data blocks
  var totalBlocks = 0;
  var ecBlockArray = ecBlocks.getECBlocks();
  for (var i = 0; i < ecBlockArray.length; i++) {
    totalBlocks += ecBlockArray[i].count;
  }

  // Now establish DataBlocks of the appropriate size and number of data codewords
  var result = new Array(totalBlocks);
  var numResultBlocks = 0;
  for (var j = 0; j < ecBlockArray.length; j++) {
    var ecBlock = ecBlockArray[j];
    for (var i = 0; i < ecBlock.count; i++) {
      var numDataCodewords = ecBlock.dataCodewords;
      var numBlockCodewords = ecBlocks.ecCodewordsPerBlock + numDataCodewords;
      result[numResultBlocks++] = new DataBlock(numDataCodewords, new Array(numBlockCodewords));
    }
  }

  // All blocks have the same amount of data, except that the last n
  // (where n may be 0) have 1 more byte. Figure out where these start.
  var shorterBlocksTotalCodewords = result[0].codewords.length;
  var longerBlocksStartAt = result.length - 1;
  while (longerBlocksStartAt >= 0) {
    var numCodewords = result[longerBlocksStartAt].codewords.length;
    if (numCodewords == shorterBlocksTotalCodewords) {
      break;
    }
    longerBlocksStartAt--;
  }
  longerBlocksStartAt++;

  var shorterBlocksNumDataCodewords = shorterBlocksTotalCodewords - ecBlocks.ecCodewordsPerBlock;
  // The last elements of result may be 1 element longer;
  // first fill out as many elements as all of them have
  var rawCodewordsOffset = 0;
  for (var i = 0; i < shorterBlocksNumDataCodewords; i++) {
    for (var j = 0; j < numResultBlocks; j++) {
      result[j].codewords[i] = rawCodewords[rawCodewordsOffset++];
    }
  }
  // Fill out the last data block in the longer ones
  for (var j = longerBlocksStartAt; j < numResultBlocks; j++) {
    result[j].codewords[shorterBlocksNumDataCodewords] = rawCodewords[rawCodewordsOffset++];
  }
  // Now add in error correction blocks
  var max = result[0].codewords.length;
  for (var i = shorterBlocksNumDataCodewords; i < max; i++) {
    for (var j = 0; j < numResultBlocks; j++) {
      var iOffset = j < longerBlocksStartAt ? i : i + 1;
      result[j].codewords[iOffset] = rawCodewords[rawCodewordsOffset++];
    }
  }
  return result;
};


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = QRCodeDataBlockReader;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__qrcode__ = __webpack_require__(0);
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/



function QRCodeDataBlockReader(blocks,  version,  numErrorCorrectionCode) {
  this.blockPointer = 0;
  this.bitPointer = 7;
  this.dataLength = 0;
  this.blocks = blocks;
  this.numErrorCorrectionCode = numErrorCorrectionCode;
  if (version <= 9)
    this.dataLengthMode = 0;
  else if (version >= 10 && version <= 26)
    this.dataLengthMode = 1;
  else if (version >= 27 && version <= 40)
    this.dataLengthMode = 2;
}

QRCodeDataBlockReader.prototype.getNextBits = function(numBits) {
  var bits = 0;
  if (numBits < this.bitPointer + 1) {
    // next word fits into current data block
    var mask = 0;
    for (var i = 0; i < numBits; i++) {
      mask += (1 << i);
    }
    mask <<= (this.bitPointer - numBits + 1);

    bits = (this.blocks[this.blockPointer] & mask) >> (this.bitPointer - numBits + 1);
    this.bitPointer -= numBits;
    return bits;
  } else if (numBits < this.bitPointer + 1 + 8) {
    // next word crosses 2 data blocks
    var mask1 = 0;
    for (var i = 0; i < this.bitPointer + 1; i++) {
      mask1 += (1 << i);
    }
    bits = (this.blocks[this.blockPointer] & mask1) << (numBits - (this.bitPointer + 1));
    this.blockPointer++;
    bits += ((this.blocks[this.blockPointer]) >> (8 - (numBits - (this.bitPointer + 1))));

    this.bitPointer = this.bitPointer - numBits % 8;
    if (this.bitPointer < 0) {
      this.bitPointer = 8 + this.bitPointer;
    }
    return bits;
  } else if (numBits < this.bitPointer + 1 + 16) {
    // next word crosses 3 data blocks
    var mask1 = 0; // mask of first block
    var mask3 = 0; // mask of 3rd block
    //bitPointer + 1 : number of bits of the 1st block
    //8 : number of the 2nd block (note that use already 8bits because next word uses 3 data blocks)
    //numBits - (bitPointer + 1 + 8) : number of bits of the 3rd block
    for (var i = 0; i < this.bitPointer + 1; i++) {
      mask1 += (1 << i);
    }
    var bitsFirstBlock = (this.blocks[this.blockPointer] & mask1) << (numBits - (this.bitPointer + 1));
    this.blockPointer++;

    var bitsSecondBlock = this.blocks[this.blockPointer] << (numBits - (this.bitPointer + 1 + 8));
    this.blockPointer++;

    for (var i = 0; i < numBits - (this.bitPointer + 1 + 8); i++) {
      mask3 += (1 << i);
    }
    mask3 <<= 8 - (numBits - (this.bitPointer + 1 + 8));
    var bitsThirdBlock = (this.blocks[this.blockPointer] & mask3) >> (8 - (numBits - (this.bitPointer + 1 + 8)));

    bits = bitsFirstBlock + bitsSecondBlock + bitsThirdBlock;
    this.bitPointer = this.bitPointer - (numBits - 8) % 8;
    if (this.bitPointer < 0) {
      this.bitPointer = 8 + this.bitPointer;
    }
    return bits;
  } else {
    return 0;
  }
};

QRCodeDataBlockReader.prototype.NextMode = function() {
  if ((this.blockPointer > this.blocks.length - this.numErrorCorrectionCode - 2))
    return 0;
  else
    return this.getNextBits(4);
};

QRCodeDataBlockReader.prototype.getDataLength = function(modeIndicator) {
  var index = 0;
  while (true) {
    if ((modeIndicator >> index) == 1)
      break;
    index++;
  }

  return this.getNextBits(__WEBPACK_IMPORTED_MODULE_0__qrcode__["b" /* qrcode */].sizeOfDataLengthInfo[this.dataLengthMode][index]);
};

QRCodeDataBlockReader.prototype.getRomanAndFigureString = function(dataLength) {
  var length = dataLength;
  var intData = 0;
  var strData = "";
  var tableRomanAndFigure = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '$', '%', '*', '+', '-', '.', '/', ':'];
  do {
    if (length > 1) {
      intData = this.getNextBits(11);
      var firstLetter = Math.floor(intData / 45);
      var secondLetter = intData % 45;
      strData += tableRomanAndFigure[firstLetter];
      strData += tableRomanAndFigure[secondLetter];
      length -= 2;
    } else if (length == 1) {
      intData = this.getNextBits(6);
      strData += tableRomanAndFigure[intData];
      length -= 1;
    }
  }
  while (length > 0);

  return strData;
};

QRCodeDataBlockReader.prototype.getFigureString = function(dataLength) {
  var length = dataLength;
  var intData = 0;
  var strData = "";
  do {
    if (length >= 3) {
      intData = this.getNextBits(10);
      if (intData < 100)
        strData += "0";
      if (intData < 10)
        strData += "0";
      length -= 3;
    } else if (length == 2) {
      intData = this.getNextBits(7);
      if (intData < 10)
        strData += "0";
      length -= 2;
    } else if (length == 1) {
      intData = this.getNextBits(4);
      length -= 1;
    }
    strData += intData;
  }
  while (length > 0);

  return strData;
};

QRCodeDataBlockReader.prototype.get8bitByteArray = function(dataLength) {
  var length = dataLength;
  var intData = 0;
  var output = [];

  do {
    intData = this.getNextBits(8);
    output.push(intData);
    length--;
  }
  while (length > 0);
  return output;
};

QRCodeDataBlockReader.prototype.getKanjiString = function(dataLength) {
  var length = dataLength;
  var intData = 0;
  var unicodeString = "";
  do {
    intData = this.getNextBits(13);
    var lowerByte = intData % 0xC0;
    var higherByte = intData / 0xC0;

    var tempWord = (higherByte << 8) + lowerByte;
    var shiftjisWord = 0;
    if (tempWord + 0x8140 <= 0x9FFC) {
      // between 8140 - 9FFC on Shift_JIS character set
      shiftjisWord = tempWord + 0x8140;
    } else {
      // between E040 - EBBF on Shift_JIS character set
      shiftjisWord = tempWord + 0xC140;
    }

    unicodeString += String.fromCharCode(shiftjisWord);
    length--;
  }
  while (length > 0);


  return unicodeString;
};

Object.defineProperty(QRCodeDataBlockReader.prototype, "DataByte", {
  get: function() {
    var output = [];
    var MODE_NUMBER = 1;
    var MODE_ROMAN_AND_NUMBER = 2;
    var MODE_8BIT_BYTE = 4;
    var MODE_KANJI = 8;
    do {
      var mode = this.NextMode();
      if (mode == 0) {
        if (output.length > 0)
          break;
        else
          throw "Empty data block";
      }
      //if (mode != 1 && mode != 2 && mode != 4 && mode != 8)
      //}
      if (mode != MODE_NUMBER && mode != MODE_ROMAN_AND_NUMBER && mode != MODE_8BIT_BYTE && mode != MODE_KANJI) {
        /*          canvas.println("Invalid mode: " + mode);
         mode = guessMode(mode);
         canvas.println("Guessed mode: " + mode); */
        throw "Invalid mode: " + mode + " in (block:" + this.blockPointer + " bit:" + this.bitPointer + ")";
      }
      var dataLength = this.getDataLength(mode);
      if (dataLength < 1)
        throw "Invalid data length: " + dataLength;
      switch (mode) {

      case MODE_NUMBER:
        var temp_str = this.getFigureString(dataLength);
        var ta = new Array(temp_str.length);
        for (var j = 0; j < temp_str.length; j++)
          ta[j] = temp_str.charCodeAt(j);
        output.push(ta);
        break;

      case MODE_ROMAN_AND_NUMBER:
        var temp_str = this.getRomanAndFigureString(dataLength);
        var ta = new Array(temp_str.length);
        for (var j = 0; j < temp_str.length; j++)
          ta[j] = temp_str.charCodeAt(j);
        output.push(ta);
        break;

      case MODE_8BIT_BYTE:
        var temp_sbyteArray3 = this.get8bitByteArray(dataLength);
        output.push(temp_sbyteArray3);
        break;

      case MODE_KANJI:
        var temp_str = this.getKanjiString(dataLength);
        output.push(temp_str);
        break;
      }
      //
    }
    while (true);
    return output;
  }
});


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__qrcode__ = __webpack_require__(0);
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/



var DataMask = {};

DataMask.forReference = function(reference) {
  if (reference < 0 || reference > 7) {
    throw "System.ArgumentException";
  }
  return DataMask.DATA_MASKS[reference];
};

function DataMask000() {
  this.unmaskBitMatrix = function(bits,  dimension) {
    for (var i = 0; i < dimension; i++) {
      for (var j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i);
        }
      }
    }
  };
  this.isMasked = function(i,  j) {
    return ((i + j) & 0x01) == 0;
  };
}

function DataMask001() {
  this.unmaskBitMatrix = function(bits,  dimension) {
    for (var i = 0; i < dimension; i++) {
      for (var j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i);
        }
      }
    }
  };
  this.isMasked = function(i,  j) {
    return (i & 0x01) == 0;
  };
}

function DataMask010() {
  this.unmaskBitMatrix = function(bits,  dimension) {
    for (var i = 0; i < dimension; i++) {
      for (var j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i);
        }
      }
    }
  };
  this.isMasked = function(i,  j) {
    return j % 3 == 0;
  };
}

function DataMask011() {
  this.unmaskBitMatrix = function(bits,  dimension) {
    for (var i = 0; i < dimension; i++) {
      for (var j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i);
        }
      }
    }
  };
  this.isMasked = function(i,  j) {
    return (i + j) % 3 == 0;
  };
}

function DataMask100() {
  this.unmaskBitMatrix = function(bits,  dimension) {
    for (var i = 0; i < dimension; i++) {
      for (var j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i);
        }
      }
    }
  };
  this.isMasked = function(i,  j) {
    return (((__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__qrcode__["c" /* URShift */])(i, 1)) + (j / 3)) & 0x01) == 0;
  };
}

function DataMask101() {
  this.unmaskBitMatrix = function(bits,  dimension) {
    for (var i = 0; i < dimension; i++) {
      for (var j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i);
        }
      }
    }
  };
  this.isMasked = function(i,  j) {
    var temp = i * j;
    return (temp & 0x01) + (temp % 3) == 0;
  };
}

function DataMask110() {
  this.unmaskBitMatrix = function(bits,  dimension) {
    for (var i = 0; i < dimension; i++) {
      for (var j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i);
        }
      }
    }
  };
  this.isMasked = function(i,  j) {
    var temp = i * j;
    return (((temp & 0x01) + (temp % 3)) & 0x01) == 0;
  };
}
function DataMask111() {
  this.unmaskBitMatrix = function(bits,  dimension) {
    for (var i = 0; i < dimension; i++) {
      for (var j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i);
        }
      }
    }
  };
  this.isMasked = function(i,  j) {
    return ((((i + j) & 0x01) + ((i * j) % 3)) & 0x01) == 0;
  };
}

DataMask.DATA_MASKS = [new DataMask000(), new DataMask001(), new DataMask010(), new DataMask011(), new DataMask100(), new DataMask101(), new DataMask110(), new DataMask111()];

/* harmony default export */ __webpack_exports__["a"] = (DataMask);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rsdecoder__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gf256__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bmparser__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__datablock__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__databr__ = __webpack_require__(11);
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/







var Decoder = {};
Decoder.rsDecoder = new __WEBPACK_IMPORTED_MODULE_0__rsdecoder__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__gf256__["a" /* default */].QR_CODE_FIELD);

Decoder.correctErrors = function(codewordBytes,  numDataCodewords) {
  var numCodewords = codewordBytes.length;
  // First read into an array of ints
  var codewordsInts = new Array(numCodewords);
  for (var i = 0; i < numCodewords; i++) {
    codewordsInts[i] = codewordBytes[i] & 0xFF;
  }
  var numECCodewords = codewordBytes.length - numDataCodewords;
  try {
    Decoder.rsDecoder.decode(codewordsInts, numECCodewords);
  } catch (rse) {
    throw rse;
  }
  // Copy back into array of bytes -- only need to worry about the bytes that were data
  // We don't care about errors in the error-correction codewords
  for (var i = 0; i < numDataCodewords; i++) {
    codewordBytes[i] =  codewordsInts[i];
  }
};

Decoder.decode = function(bits) {
  var parser = new __WEBPACK_IMPORTED_MODULE_2__bmparser__["a" /* default */](bits);
  var version = parser.readVersion();
  var ecLevel = parser.readFormatInformation().errorCorrectionLevel;

  // Read codewords
  var codewords = parser.readCodewords();

  // Separate into data blocks
  var dataBlocks = __WEBPACK_IMPORTED_MODULE_3__datablock__["a" /* default */].getDataBlocks(codewords, version, ecLevel);

  // Count total number of data bytes
  var totalBytes = 0;
  for (var i = 0; i < dataBlocks.length; i++) {
    totalBytes += dataBlocks[i].numDataCodewords;
  }
  var resultBytes = new Array(totalBytes);
  var resultOffset = 0;

  // Error-correct and copy data blocks together into a stream of bytes
  for (var j = 0; j < dataBlocks.length; j++) {
    var dataBlock = dataBlocks[j];
    var codewordBytes = dataBlock.codewords;
    var numDataCodewords = dataBlock.numDataCodewords;
    Decoder.correctErrors(codewordBytes, numDataCodewords);
    for (var i = 0; i < numDataCodewords; i++) {
      resultBytes[resultOffset++] = codewordBytes[i];
    }
  }

  // Decode the contents of that stream of bytes
  var reader = new __WEBPACK_IMPORTED_MODULE_4__databr__["a" /* default */](resultBytes, version.versionNumber, ecLevel.bits);
  return reader;
};

/* harmony default export */ __webpack_exports__["a"] = (Decoder);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Detector;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__version__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__alignpat__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__grid__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__findpat__ = __webpack_require__(16);
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/






function PerspectiveTransform(a11,  a21,  a31,  a12,  a22,  a32,  a13,  a23,  a33) {
  this.a11 = a11;
  this.a12 = a12;
  this.a13 = a13;
  this.a21 = a21;
  this.a22 = a22;
  this.a23 = a23;
  this.a31 = a31;
  this.a32 = a32;
  this.a33 = a33;
}

PerspectiveTransform.prototype.transformPoints1 = function(points) {
  var max = points.length;
  var a11 = this.a11;
  var a12 = this.a12;
  var a13 = this.a13;
  var a21 = this.a21;
  var a22 = this.a22;
  var a23 = this.a23;
  var a31 = this.a31;
  var a32 = this.a32;
  var a33 = this.a33;
  for (var i = 0; i < max; i += 2) {
    var x = points[i];
    var y = points[i + 1];
    var denominator = a13 * x + a23 * y + a33;
    points[i] = (a11 * x + a21 * y + a31) / denominator;
    points[i + 1] = (a12 * x + a22 * y + a32) / denominator;
  }
};

PerspectiveTransform.prototype.transformPoints2 = function(xValues, yValues) {
  var n = xValues.length;
  for (var i = 0; i < n; i++) {
    var x = xValues[i];
    var y = yValues[i];
    var denominator = this.a13 * x + this.a23 * y + this.a33;
    xValues[i] = (this.a11 * x + this.a21 * y + this.a31) / denominator;
    yValues[i] = (this.a12 * x + this.a22 * y + this.a32) / denominator;
  }
};

PerspectiveTransform.prototype.buildAdjoint = function() {
  // Adjoint is the transpose of the cofactor matrix:
  return new PerspectiveTransform(this.a22 * this.a33 - this.a23 * this.a32, this.a23 * this.a31 - this.a21 * this.a33, this.a21 * this.a32 - this.a22 * this.a31, this.a13 * this.a32 - this.a12 * this.a33, this.a11 * this.a33 - this.a13 * this.a31, this.a12 * this.a31 - this.a11 * this.a32, this.a12 * this.a23 - this.a13 * this.a22, this.a13 * this.a21 - this.a11 * this.a23, this.a11 * this.a22 - this.a12 * this.a21);
};

PerspectiveTransform.prototype.times = function(other) {
  return new PerspectiveTransform(this.a11 * other.a11 + this.a21 * other.a12 + this.a31 * other.a13, this.a11 * other.a21 + this.a21 * other.a22 + this.a31 * other.a23, this.a11 * other.a31 + this.a21 * other.a32 + this.a31 * other.a33, this.a12 * other.a11 + this.a22 * other.a12 + this.a32 * other.a13, this.a12 * other.a21 + this.a22 * other.a22 + this.a32 * other.a23, this.a12 * other.a31 + this.a22 * other.a32 + this.a32 * other.a33, this.a13 * other.a11 + this.a23 * other.a12 + this.a33 * other.a13, this.a13 * other.a21 + this.a23 * other.a22 + this.a33 * other.a23, this.a13 * other.a31 + this.a23 * other.a32 + this.a33 * other.a33);
};

PerspectiveTransform.quadrilateralToQuadrilateral = function(x0,  y0,  x1,  y1,  x2,  y2,  x3,  y3,  x0p,  y0p,  x1p,  y1p,  x2p,  y2p,  x3p,  y3p) {

  var qToS = this.quadrilateralToSquare(x0, y0, x1, y1, x2, y2, x3, y3);
  var sToQ = this.squareToQuadrilateral(x0p, y0p, x1p, y1p, x2p, y2p, x3p, y3p);
  return sToQ.times(qToS);
};

PerspectiveTransform.squareToQuadrilateral = function(x0,  y0,  x1,  y1,  x2,  y2,  x3,  y3) {
  var dy2 = y3 - y2;
  var dy3 = y0 - y1 + y2 - y3;
  if (dy2 == 0.0 && dy3 == 0.0) {
    return new PerspectiveTransform(x1 - x0, x2 - x1, x0, y1 - y0, y2 - y1, y0, 0.0, 0.0, 1.0);
  } else {
    var dx1 = x1 - x2;
    var dx2 = x3 - x2;
    var dx3 = x0 - x1 + x2 - x3;
    var dy1 = y1 - y2;
    var denominator = dx1 * dy2 - dx2 * dy1;
    var a13 = (dx3 * dy2 - dx2 * dy3) / denominator;
    var a23 = (dx1 * dy3 - dx3 * dy1) / denominator;
    return new PerspectiveTransform(x1 - x0 + a13 * x1, x3 - x0 + a23 * x3, x0, y1 - y0 + a13 * y1, y3 - y0 + a23 * y3, y0, a13, a23, 1.0);
  }
};

PerspectiveTransform.quadrilateralToSquare = function(x0,  y0,  x1,  y1,  x2,  y2,  x3,  y3) {
  // Here, the adjoint serves as the inverse:
  return this.squareToQuadrilateral(x0, y0, x1, y1, x2, y2, x3, y3).buildAdjoint();
};

function DetectorResult(bits,  points) {
  this.bits = bits;
  this.points = points;
}

function Detector(image) {
  this.image = image;
  this.resultPointCallback = null;
}

Detector.prototype.sizeOfBlackWhiteBlackRun = function(fromX,  fromY,  toX,  toY) {
  // Mild variant of Bresenham's algorithm;
  // see http://en.wikipedia.org/wiki/Bresenham's_line_algorithm
  var steep = Math.abs(toY - fromY) > Math.abs(toX - fromX);
  if (steep) {
    var temp = fromX;
    fromX = fromY;
    fromY = temp;
    temp = toX;
    toX = toY;
    toY = temp;
  }

  var dx = Math.abs(toX - fromX);
  var dy = Math.abs(toY - fromY);
  var error = -dx >> 1;
  var ystep = fromY < toY ? 1 : -1;
  var xstep = fromX < toX ? 1 : -1;
  var state = 0; // In black pixels, looking for white, first or second time
  for (var x = fromX, y = fromY; x != toX; x += xstep) {

    var realX = steep ? y : x;
    var realY = steep ? x : y;
    if (state == 1) {
      // In white pixels, looking for black
      if (this.image.data[realX + realY * this.image.width]) {
        state++;
      }
    } else {
      if (!this.image.data[realX + realY * this.image.width]) {
        state++;
      }
    }

    if (state == 3) {
      // Found black, white, black, and stumbled back onto white; done
      var diffX = x - fromX;
      var diffY = y - fromY;
      return  Math.sqrt((diffX * diffX + diffY * diffY));
    }
    error += dy;
    if (error > 0) {
      if (y == toY) {
        break;
      }
      y += ystep;
      error -= dx;
    }
  }
  var diffX2 = toX - fromX;
  var diffY2 = toY - fromY;
  return  Math.sqrt((diffX2 * diffX2 + diffY2 * diffY2));
};

Detector.prototype.sizeOfBlackWhiteBlackRunBothWays = function(fromX,  fromY,  toX,  toY) {

  var result = this.sizeOfBlackWhiteBlackRun(fromX, fromY, toX, toY);

  // Now count other way -- don't run off image though of course
  var scale = 1.0;
  var otherToX = fromX - (toX - fromX);
  if (otherToX < 0) {
    scale =  fromX /  (fromX - otherToX);
    otherToX = 0;
  } else if (otherToX >= this.image.width) {
    scale =  (this.image.width - 1 - fromX) /  (otherToX - fromX);
    otherToX = this.image.width - 1;
  }
  var otherToY = Math.floor(fromY - (toY - fromY) * scale);

  scale = 1.0;
  if (otherToY < 0) {
    scale =  fromY /  (fromY - otherToY);
    otherToY = 0;
  } else if (otherToY >= this.image.height) {
    scale =  (this.image.height - 1 - fromY) /  (otherToY - fromY);
    otherToY = this.image.height - 1;
  }
  otherToX = Math.floor(fromX + (otherToX - fromX) * scale);

  result += this.sizeOfBlackWhiteBlackRun(fromX, fromY, otherToX, otherToY);
  return result - 1.0; // -1 because we counted the middle pixel twice
};

Detector.prototype.calculateModuleSizeOneWay = function(pattern,  otherPattern) {
  var moduleSizeEst1 = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(pattern.X), Math.floor(pattern.Y), Math.floor(otherPattern.X), Math.floor(otherPattern.Y));
  var moduleSizeEst2 = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(otherPattern.X), Math.floor(otherPattern.Y), Math.floor(pattern.X), Math.floor(pattern.Y));
  if (isNaN(moduleSizeEst1)) {
    return moduleSizeEst2 / 7.0;
  }
  if (isNaN(moduleSizeEst2)) {
    return moduleSizeEst1 / 7.0;
  }
  // Average them, and divide by 7 since we've counted the width of 3 black modules,
  // and 1 white and 1 black module on either side. Ergo, divide sum by 14.
  return (moduleSizeEst1 + moduleSizeEst2) / 14.0;
};

Detector.prototype.calculateModuleSize = function(topLeft,  topRight,  bottomLeft) {
  // Take the average
  return (this.calculateModuleSizeOneWay(topLeft, topRight) + this.calculateModuleSizeOneWay(topLeft, bottomLeft)) / 2.0;
};

Detector.prototype.distance = function(pattern1,  pattern2) {
  var xDiff = pattern1.X - pattern2.X;
  var yDiff = pattern1.Y - pattern2.Y;
  return  Math.sqrt((xDiff * xDiff + yDiff * yDiff));
};

Detector.prototype.computeDimension = function(topLeft,  topRight,  bottomLeft,  moduleSize) {
  var tltrCentersDimension = Math.round(this.distance(topLeft, topRight) / moduleSize);
  var tlblCentersDimension = Math.round(this.distance(topLeft, bottomLeft) / moduleSize);
  var dimension = ((tltrCentersDimension + tlblCentersDimension) >> 1) + 7;
  switch (dimension & 0x03) {
  // mod 4
  case 0:
    dimension++;
    break;
  // 1? do nothing

  case 2:
    dimension--;
    break;

  case 3:
    throw "Error";
  }
  return dimension;
};

Detector.prototype.findAlignmentInRegion = function(overallEstModuleSize,  estAlignmentX,  estAlignmentY,  allowanceFactor) {
  // Look for an alignment pattern (3 modules in size) around where it
  // should be
  var allowance = Math.floor(allowanceFactor * overallEstModuleSize);
  var alignmentAreaLeftX = Math.max(0, estAlignmentX - allowance);
  var alignmentAreaRightX = Math.min(this.image.width - 1, estAlignmentX + allowance);
  if (alignmentAreaRightX - alignmentAreaLeftX < overallEstModuleSize * 3) {
    throw "Error";
  }

  var alignmentAreaTopY = Math.max(0, estAlignmentY - allowance);
  var alignmentAreaBottomY = Math.min(this.image.height - 1, estAlignmentY + allowance);

  var alignmentFinder = new __WEBPACK_IMPORTED_MODULE_1__alignpat__["a" /* AlignmentPatternFinder */](this.image, alignmentAreaLeftX, alignmentAreaTopY, alignmentAreaRightX - alignmentAreaLeftX, alignmentAreaBottomY - alignmentAreaTopY, overallEstModuleSize, this.resultPointCallback);
  return alignmentFinder.find();
};

Detector.prototype.createTransform = function(topLeft,  topRight,  bottomLeft, alignmentPattern, dimension) {
  var dimMinusThree =  dimension - 3.5;
  var bottomRightX;
  var bottomRightY;
  var sourceBottomRightX;
  var sourceBottomRightY;
  if (alignmentPattern != null) {
    bottomRightX = alignmentPattern.X;
    bottomRightY = alignmentPattern.Y;
    sourceBottomRightX = sourceBottomRightY = dimMinusThree - 3.0;
  } else {
    // Don't have an alignment pattern, just make up the bottom-right point
    bottomRightX = (topRight.X - topLeft.X) + bottomLeft.X;
    bottomRightY = (topRight.Y - topLeft.Y) + bottomLeft.Y;
    sourceBottomRightX = sourceBottomRightY = dimMinusThree;
  }

  var transform = PerspectiveTransform.quadrilateralToQuadrilateral(3.5, 3.5, dimMinusThree, 3.5, sourceBottomRightX, sourceBottomRightY, 3.5, dimMinusThree, topLeft.X, topLeft.Y, topRight.X, topRight.Y, bottomRightX, bottomRightY, bottomLeft.X, bottomLeft.Y);

  return transform;
};

Detector.prototype.sampleGrid = function(image,  transform,  dimension) {

  var sampler = __WEBPACK_IMPORTED_MODULE_2__grid__["a" /* default */];
  return sampler.sampleGrid3(image, dimension, transform);
};

Detector.prototype.processFinderPatternInfo = function(info) {

  var topLeft = info.topLeft;
  var topRight = info.topRight;
  var bottomLeft = info.bottomLeft;

  var moduleSize = this.calculateModuleSize(topLeft, topRight, bottomLeft);
  if (moduleSize < 1.0) {
    throw "Error";
  }
  var dimension = this.computeDimension(topLeft, topRight, bottomLeft, moduleSize);
  var provisionalVersion = __WEBPACK_IMPORTED_MODULE_0__version__["a" /* default */].getProvisionalVersionForDimension(dimension);
  var modulesBetweenFPCenters = provisionalVersion.DimensionForVersion - 7;

  var alignmentPattern = null;
  // Anything above version 1 has an alignment pattern
  if (provisionalVersion.alignmentPatternCenters.length > 0) {

    // Guess where a "bottom right" finder pattern would have been
    var bottomRightX = topRight.X - topLeft.X + bottomLeft.X;
    var bottomRightY = topRight.Y - topLeft.Y + bottomLeft.Y;

    // Estimate that alignment pattern is closer by 3 modules
    // from "bottom right" to known top left location
    var correctionToTopLeft = 1.0 - 3.0 /  modulesBetweenFPCenters;
    var estAlignmentX = Math.floor(topLeft.X + correctionToTopLeft * (bottomRightX - topLeft.X));
    var estAlignmentY = Math.floor(topLeft.Y + correctionToTopLeft * (bottomRightY - topLeft.Y));

    // Kind of arbitrary -- expand search radius before giving up
    for (var i = 4; i <= 16; i <<= 1) {
      //try
      //{
      alignmentPattern = this.findAlignmentInRegion(moduleSize, estAlignmentX, estAlignmentY,  i);
      break;
      //}
      //catch (re)
      //{
      // try next round
      //}
    }
    // If we didn't find alignment pattern... well try anyway without it
  }

  var transform = this.createTransform(topLeft, topRight, bottomLeft, alignmentPattern, dimension);

  var bits = this.sampleGrid(this.image, transform, dimension);

  var points;
  if (alignmentPattern == null) {
    points = [bottomLeft, topLeft, topRight];
  } else {
    points = [bottomLeft, topLeft, topRight, alignmentPattern];
  }
  return new DetectorResult(bits, points);
};

Detector.prototype.detect = function() {
  var info =  new __WEBPACK_IMPORTED_MODULE_3__findpat__["a" /* FinderPatternFinder */]().findFinderPattern(this.image);

  return this.processFinderPatternInfo(info);
};


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ErrorCorrectionLevel;
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/


function ErrorCorrectionLevel(ordinal,  bits, name) {
  this.ordinal_Renamed_Field = ordinal;
  this.bits = bits;
  this.name = name;
}

ErrorCorrectionLevel.prototype.ordinal = function() {
  return this.ordinal_Renamed_Field;
};

ErrorCorrectionLevel.forBits = function(bits) {
  if (bits < 0 || bits >= FOR_BITS.length) {
    throw "ArgumentException";
  }
  return FOR_BITS[bits];
};

var FOR_BITS = [
  new ErrorCorrectionLevel(1, 0x00, "M"),
  new ErrorCorrectionLevel(0, 0x01, "L"),
  new ErrorCorrectionLevel(3, 0x02, "H"),
  new ErrorCorrectionLevel(2, 0x03, "Q"),
];


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = FinderPatternFinder;
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var MIN_SKIP = 3;
var MAX_MODULES = 57;
var INTEGER_MATH_SHIFT = 8;
var CENTER_QUORUM = 2;

function orderBestPatterns(patterns) {

  function distance(pattern1,  pattern2) {
    var xDiff = pattern1.X - pattern2.X;
    var yDiff = pattern1.Y - pattern2.Y;
    return  Math.sqrt((xDiff * xDiff + yDiff * yDiff));
  }

  /// <summary> Returns the z component of the cross product between vectors BC and BA.</summary>
  function crossProductZ(pointA,  pointB,  pointC) {
    var bX = pointB.x;
    var bY = pointB.y;
    return ((pointC.x - bX) * (pointA.y - bY)) - ((pointC.y - bY) * (pointA.x - bX));
  }


  // Find distances between pattern centers
  var zeroOneDistance = distance(patterns[0], patterns[1]);
  var oneTwoDistance = distance(patterns[1], patterns[2]);
  var zeroTwoDistance = distance(patterns[0], patterns[2]);

  var pointA, pointB, pointC;
  // Assume one closest to other two is B; A and C will just be guesses at first
  if (oneTwoDistance >= zeroOneDistance && oneTwoDistance >= zeroTwoDistance) {
    pointB = patterns[0];
    pointA = patterns[1];
    pointC = patterns[2];
  } else if (zeroTwoDistance >= oneTwoDistance && zeroTwoDistance >= zeroOneDistance) {
    pointB = patterns[1];
    pointA = patterns[0];
    pointC = patterns[2];
  } else {
    pointB = patterns[2];
    pointA = patterns[0];
    pointC = patterns[1];
  }

  // Use cross product to figure out whether A and C are correct or flipped.
  // This asks whether BC x BA has a positive z component, which is the arrangement
  // we want for A, B, C. If it's negative, then we've got it flipped around and
  // should swap A and C.
  if (crossProductZ(pointA, pointB, pointC) < 0.0) {
    var temp = pointA;
    pointA = pointC;
    pointC = temp;
  }

  patterns[0] = pointA;
  patterns[1] = pointB;
  patterns[2] = pointC;
}


function FinderPattern(posX, posY,  estimatedModuleSize) {
  this.x = posX;
  this.y = posY;
  this.count = 1;
  this.estimatedModuleSize = estimatedModuleSize;
}

Object.defineProperty(FinderPattern.prototype, "X", {
  get: function() {
    return this.x;
  }
});

Object.defineProperty(FinderPattern.prototype, "Y", {
  get: function() {
    return this.y;
  }
});

FinderPattern.prototype.incrementCount = function() {
  this.count++;
};

FinderPattern.prototype.aboutEquals = function(moduleSize, i, j) {
  if (Math.abs(i - this.y) <= moduleSize && Math.abs(j - this.x) <= moduleSize) {
    var moduleSizeDiff = Math.abs(moduleSize - this.estimatedModuleSize);
    return moduleSizeDiff <= 1.0 || moduleSizeDiff / this.estimatedModuleSize <= 1.0;
  }
  return false;
};

function FinderPatternInfo(patternCenters) {
  this.bottomLeft = patternCenters[0];
  this.topLeft = patternCenters[1];
  this.topRight = patternCenters[2];
}

function FinderPatternFinder() {
  this.image = null;
  this.possibleCenters = [];
  this.hasSkipped = false;
  this.crossCheckStateCount = [0, 0, 0, 0, 0];
  this.resultPointCallback = null;
}

Object.defineProperty(FinderPatternFinder.prototype, "CrossCheckStateCount", {
  get: function() {
    this.crossCheckStateCount[0] = 0;
    this.crossCheckStateCount[1] = 0;
    this.crossCheckStateCount[2] = 0;
    this.crossCheckStateCount[3] = 0;
    this.crossCheckStateCount[4] = 0;
    return this.crossCheckStateCount;
  }
});

FinderPatternFinder.prototype.foundPatternCross = function(stateCount) {
  var totalModuleSize = 0;
  for (var i = 0; i < 5; i++) {
    var count = stateCount[i];
    if (count == 0) {
      return false;
    }
    totalModuleSize += count;
  }
  if (totalModuleSize < 7) {
    return false;
  }
  var moduleSize = Math.floor((totalModuleSize << INTEGER_MATH_SHIFT) / 7);
  var maxVariance = Math.floor(moduleSize / 2);
  // Allow less than 50% variance from 1-1-3-1-1 proportions
  return Math.abs(moduleSize - (stateCount[0] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(moduleSize - (stateCount[1] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(3 * moduleSize - (stateCount[2] << INTEGER_MATH_SHIFT)) < 3 * maxVariance && Math.abs(moduleSize - (stateCount[3] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(moduleSize - (stateCount[4] << INTEGER_MATH_SHIFT)) < maxVariance;
};

FinderPatternFinder.prototype.centerFromEnd = function(stateCount,  end) {
  return  (end - stateCount[4] - stateCount[3]) - stateCount[2] / 2.0;
};

FinderPatternFinder.prototype.crossCheckVertical = function(startI,  centerJ,  maxCount,  originalStateCountTotal) {
  var image = this.image;

  var maxI = image.height;
  var stateCount = this.CrossCheckStateCount;

  // Start counting up from center
  var i = startI;
  while (i >= 0 && image.data[centerJ + i * image.width]) {
    stateCount[2]++;
    i--;
  }
  if (i < 0) {
    return NaN;
  }
  while (i >= 0 && !image.data[centerJ + i * image.width] && stateCount[1] <= maxCount) {
    stateCount[1]++;
    i--;
  }
  // If already too many modules in this state or ran off the edge:
  if (i < 0 || stateCount[1] > maxCount) {
    return NaN;
  }
  while (i >= 0 && image.data[centerJ + i * image.width] && stateCount[0] <= maxCount) {
    stateCount[0]++;
    i--;
  }
  if (stateCount[0] > maxCount) {
    return NaN;
  }

  // Now also count down from center
  i = startI + 1;
  while (i < maxI && image.data[centerJ + i * image.width]) {
    stateCount[2]++;
    i++;
  }
  if (i == maxI) {
    return NaN;
  }
  while (i < maxI && !image.data[centerJ + i * image.width] && stateCount[3] < maxCount) {
    stateCount[3]++;
    i++;
  }
  if (i == maxI || stateCount[3] >= maxCount) {
    return NaN;
  }
  while (i < maxI && image.data[centerJ + i * image.width] && stateCount[4] < maxCount) {
    stateCount[4]++;
    i++;
  }
  if (stateCount[4] >= maxCount) {
    return NaN;
  }

  // If we found a finder-pattern-like section, but its size is more than 40% different than
  // the original, assume it's a false positive
  var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2] + stateCount[3] + stateCount[4];
  if (5 * Math.abs(stateCountTotal - originalStateCountTotal) >= 2 * originalStateCountTotal) {
    return NaN;
  }

  return this.foundPatternCross(stateCount) ? this.centerFromEnd(stateCount, i) : NaN;
};

FinderPatternFinder.prototype.crossCheckHorizontal = function(startJ,  centerI,  maxCount, originalStateCountTotal) {
  var image = this.image;

  var maxJ = image.width;
  var stateCount = this.CrossCheckStateCount;

  var j = startJ;
  while (j >= 0 && image.data[j + centerI * image.width]) {
    stateCount[2]++;
    j--;
  }
  if (j < 0) {
    return NaN;
  }
  while (j >= 0 && !image.data[j + centerI * image.width] && stateCount[1] <= maxCount) {
    stateCount[1]++;
    j--;
  }
  if (j < 0 || stateCount[1] > maxCount) {
    return NaN;
  }
  while (j >= 0 && image.data[j + centerI * image.width] && stateCount[0] <= maxCount) {
    stateCount[0]++;
    j--;
  }
  if (stateCount[0] > maxCount) {
    return NaN;
  }

  j = startJ + 1;
  while (j < maxJ && image.data[j + centerI * image.width]) {
    stateCount[2]++;
    j++;
  }
  if (j == maxJ) {
    return NaN;
  }
  while (j < maxJ && !image.data[j + centerI * image.width] && stateCount[3] < maxCount) {
    stateCount[3]++;
    j++;
  }
  if (j == maxJ || stateCount[3] >= maxCount) {
    return NaN;
  }
  while (j < maxJ && image.data[j + centerI * image.width] && stateCount[4] < maxCount) {
    stateCount[4]++;
    j++;
  }
  if (stateCount[4] >= maxCount) {
    return NaN;
  }

  // If we found a finder-pattern-like section, but its size is significantly different than
  // the original, assume it's a false positive
  var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2] + stateCount[3] + stateCount[4];
  if (5 * Math.abs(stateCountTotal - originalStateCountTotal) >= originalStateCountTotal) {
    return NaN;
  }

  return this.foundPatternCross(stateCount) ? this.centerFromEnd(stateCount, j) : NaN;
};

FinderPatternFinder.prototype.handlePossibleCenter = function(stateCount,  i,  j) {
  var stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2] + stateCount[3] + stateCount[4];
  var centerJ = this.centerFromEnd(stateCount, j); //float
  var centerI = this.crossCheckVertical(i, Math.floor(centerJ), stateCount[2], stateCountTotal); //float
  if (!isNaN(centerI)) {
    // Re-cross check
    centerJ = this.crossCheckHorizontal(Math.floor(centerJ), Math.floor(centerI), stateCount[2], stateCountTotal);
    if (!isNaN(centerJ)) {
      var estimatedModuleSize =   stateCountTotal / 7.0;
      var found = false;
      var max = this.possibleCenters.length;
      for (var index = 0; index < max; index++) {
        var center = this.possibleCenters[index];
        // Look for about the same center and module size:
        if (center.aboutEquals(estimatedModuleSize, centerI, centerJ)) {
          center.incrementCount();
          found = true;
          break;
        }
      }
      if (!found) {
        var point = new FinderPattern(centerJ, centerI, estimatedModuleSize);
        this.possibleCenters.push(point);
        if (this.resultPointCallback != null) {
          this.resultPointCallback.foundPossibleResultPoint(point);
        }
      }
      return true;
    }
  }
  return false;
};

FinderPatternFinder.prototype.selectBestPatterns = function() {

  var startSize = this.possibleCenters.length;
  if (startSize < 3) {
    // Couldn't find enough finder patterns
    throw "Couldn't find enough finder patterns:" + startSize + " patterns found";
  }

  // Filter outlier possibilities whose module size is too different
  if (startSize > 3) {
    // But we can only afford to do so if we have at least 4 possibilities to choose from
    var totalModuleSize = 0.0;
    var square = 0.0;
    for (var i = 0; i < startSize; i++) {
      var  centerValue = this.possibleCenters[i].estimatedModuleSize;
      totalModuleSize += centerValue;
      square += (centerValue * centerValue);
    }
    var average = totalModuleSize /  startSize;
    this.possibleCenters.sort(function(center1, center2) {
      var dA = Math.abs(center2.estimatedModuleSize - average);
      var dB = Math.abs(center1.estimatedModuleSize - average);
      if (dA < dB) {
        return (-1);
      } else if (dA == dB) {
        return 0;
      } else {
        return 1;
      }
    });

    var stdDev = Math.sqrt(square / startSize - average * average);
    var limit = Math.max(0.2 * average, stdDev);
    for (var i = this.possibleCenters - 1; i >= 0; i--) {
      var pattern =  this.possibleCenters[i];
      if (Math.abs(pattern.estimatedModuleSize - average) > limit) {
        this.possibleCenters.splice(i, 1);
      }
    }
  }

  if (this.possibleCenters.length > 3) {
    // Throw away all but those first size candidate points we found.
    this.possibleCenters.sort(function(a, b) {
      if (a.count > b.count) return -1;
      if (a.count < b.count) return 1;
      return 0;
    });
  }

  return [this.possibleCenters[0],  this.possibleCenters[1],  this.possibleCenters[2]];
};

FinderPatternFinder.prototype.findRowSkip = function() {
  var max = this.possibleCenters.length;
  if (max <= 1) {
    return 0;
  }
  var firstConfirmedCenter = null;
  for (var i = 0; i < max; i++) {
    var center =  this.possibleCenters[i];
    if (center.count >= CENTER_QUORUM) {
      if (firstConfirmedCenter == null) {
        firstConfirmedCenter = center;
      } else {
        // We have two confirmed centers
        // How far down can we skip before resuming looking for the next
        // pattern? In the worst case, only the difference between the
        // difference in the x / y coordinates of the two centers.
        // This is the case where you find top left last.
        this.hasSkipped = true;
        return Math.floor((Math.abs(firstConfirmedCenter.X - center.X) - Math.abs(firstConfirmedCenter.Y - center.Y)) / 2);
      }
    }
  }
  return 0;
};

FinderPatternFinder.prototype.haveMultiplyConfirmedCenters = function() {
  var confirmedCount = 0;
  var totalModuleSize = 0.0;
  var max = this.possibleCenters.length;
  for (var i = 0; i < max; i++) {
    var pattern =  this.possibleCenters[i];
    if (pattern.count >= CENTER_QUORUM) {
      confirmedCount++;
      totalModuleSize += pattern.estimatedModuleSize;
    }
  }
  if (confirmedCount < 3) {
    return false;
  }
  // OK, we have at least 3 confirmed centers, but, it's possible that one is a "false positive"
  // and that we need to keep looking. We detect this by asking if the estimated module sizes
  // vary too much. We arbitrarily say that when the total deviation from average exceeds
  // 5% of the total module size estimates, it's too much.
  var average = totalModuleSize / max;
  var totalDeviation = 0.0;
  for (var i = 0; i < max; i++) {
    pattern = this.possibleCenters[i];
    totalDeviation += Math.abs(pattern.estimatedModuleSize - average);
  }
  return totalDeviation <= 0.05 * totalModuleSize;
};

FinderPatternFinder.prototype.findFinderPattern = function(image) {
  var tryHarder = false;
  this.image = image;
  var maxI = image.height;
  var maxJ = image.width;
  var iSkip = Math.floor((3 * maxI) / (4 * MAX_MODULES));
  if (iSkip < MIN_SKIP || tryHarder) {
    iSkip = MIN_SKIP;
  }

  var done = false;
  var stateCount = new Array(5);
  for (var i = iSkip - 1; i < maxI && !done; i += iSkip) {
    // Get a row of black/white values
    stateCount[0] = 0;
    stateCount[1] = 0;
    stateCount[2] = 0;
    stateCount[3] = 0;
    stateCount[4] = 0;
    var currentState = 0;
    for (var j = 0; j < maxJ; j++) {
      if (image.data[j + i * image.width]) {
        // Black pixel
        if ((currentState & 1) == 1) {
          // Counting white pixels
          currentState++;
        }
        stateCount[currentState]++;
      } else {
        // White pixel
        if ((currentState & 1) == 0) {
          // Counting black pixels
          if (currentState == 4) {
            // A winner?
            if (this.foundPatternCross(stateCount)) {
              // Yes
              var confirmed = this.handlePossibleCenter(stateCount, i, j);
              if (confirmed) {
                // Start examining every other line. Checking each line turned out to be too
                // expensive and didn't improve performance.
                iSkip = 2;
                if (this.hasSkipped) {
                  done = this.haveMultiplyConfirmedCenters();
                } else {
                  var rowSkip = this.findRowSkip();
                  if (rowSkip > stateCount[2]) {
                    // Skip rows between row of lower confirmed center
                    // and top of presumed third confirmed center
                    // but back up a bit to get a full chance of detecting
                    // it, entire width of center of finder pattern

                    // Skip by rowSkip, but back off by stateCount[2] (size of last center
                    // of pattern we saw) to be conservative, and also back off by iSkip which
                    // is about to be re-added
                    i += rowSkip - stateCount[2] - iSkip;
                    j = maxJ - 1;
                  }
                }
              } else {
                // Advance to next black pixel
                do {
                  j++;
                } while (j < maxJ && !image.data[j + i * image.width]);
                j--; // back up to that last white pixel
              }
              // Clear state to start looking again
              currentState = 0;
              stateCount[0] = 0;
              stateCount[1] = 0;
              stateCount[2] = 0;
              stateCount[3] = 0;
              stateCount[4] = 0;
            } else {
              // No, shift counts back by two
              stateCount[0] = stateCount[2];
              stateCount[1] = stateCount[3];
              stateCount[2] = stateCount[4];
              stateCount[3] = 1;
              stateCount[4] = 0;
              currentState = 3;
            }
          } else {
            stateCount[++currentState]++;
          }
        } else {
          // Counting white pixels
          stateCount[currentState]++;
        }
      }
    }
    if (this.foundPatternCross(stateCount)) {
      var confirmed = this.handlePossibleCenter(stateCount, i, maxJ);
      if (confirmed) {
        iSkip = stateCount[0];
        if (this.hasSkipped) {
          // Found a third one
          done = this.haveMultiplyConfirmedCenters();
        }
      }
    }
  }

  var patternInfo = this.selectBestPatterns();
  orderBestPatterns(patternInfo);

  return new FinderPatternInfo(patternInfo);
};


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bitmat__ = __webpack_require__(1);
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/



var GridSampler = {};

GridSampler.checkAndNudgePoints = function(image,  points) {
  var width = image.width;
  var height = image.height;
  // Check and nudge points from start until we see some that are OK:
  var nudged = true;
  for (var offset = 0; offset < points.length && nudged; offset += 2) {
    var x = Math.floor(points[offset]);
    var y = Math.floor(points[offset + 1]);
    if (x < -1 || x > width || y < -1 || y > height) {
      throw "Error.checkAndNudgePoints ";
    }
    nudged = false;
    if (x == -1) {
      points[offset] = 0.0;
      nudged = true;
    } else if (x == width) {
      points[offset] = width - 1;
      nudged = true;
    }
    if (y == -1) {
      points[offset + 1] = 0.0;
      nudged = true;
    } else if (y == height) {
      points[offset + 1] = height - 1;
      nudged = true;
    }
  }
  // Check and nudge points from end:
  nudged = true;
  for (var offset = points.length - 2; offset >= 0 && nudged; offset -= 2) {
    var x = Math.floor(points[offset]);
    var y = Math.floor(points[offset + 1]);
    if (x < -1 || x > width || y < -1 || y > height) {
      throw "Error.checkAndNudgePoints ";
    }
    nudged = false;
    if (x == -1) {
      points[offset] = 0.0;
      nudged = true;
    } else if (x == width) {
      points[offset] = width - 1;
      nudged = true;
    }
    if (y == -1) {
      points[offset + 1] = 0.0;
      nudged = true;
    } else if (y == height) {
      points[offset + 1] = height - 1;
      nudged = true;
    }
  }
};



GridSampler.sampleGrid3 = function(image,  dimension,  transform) {
  var bits = new __WEBPACK_IMPORTED_MODULE_0__bitmat__["a" /* default */](dimension);
  var points = new Array(dimension << 1);
  for (var y = 0; y < dimension; y++) {
    var max = points.length;
    var iValue =  y + 0.5;
    for (var x = 0; x < max; x += 2) {
      points[x] =  (x >> 1) + 0.5;
      points[x + 1] = iValue;
    }
    transform.transformPoints1(points);
    // Quick check to see if points transformed to something inside the image
    // sufficient to check the endpoints
    GridSampler.checkAndNudgePoints(image, points);
    try {
      for (var x = 0; x < max; x += 2) {
        var bit = image.data[Math.floor(points[x]) + image.width * Math.floor(points[x + 1])];
        if (bit)
          bits.set_Renamed(x >> 1, y);
      }
    } catch (aioobe) {
      // This feels wrong, but, sometimes if the finder patterns are misidentified, the resulting
      // transform gets "twisted" such that it maps a straight line of points to a set of points
      // whose endpoints are in bounds, but others are not. There is probably some mathematical
      // way to detect this about the transformation that I don't know yet.
      // This results in an ugly runtime exception despite our clever checks above -- can't have
      // that. We could check each point's coordinates but that feels duplicative. We settle for
      // catching and wrapping ArrayIndexOutOfBoundsException.
      throw "Error.checkAndNudgePoints";
    }
  }
  return bits;
};

/* harmony default export */ __webpack_exports__["a"] = (GridSampler);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__qrcode__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0__qrcode__["a" /* default */]);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ReedSolomonDecoder;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gf256__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gf256poly__ = __webpack_require__(4);
/*
  Ported to JavaScript by Lazar Laszlo 2011

  lazarsoft@gmail.com, www.lazarsoft.info

*/

/*
*
* Copyright 2007 ZXing authors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/




function ReedSolomonDecoder(field) {
  this.field = field;
}

ReedSolomonDecoder.prototype.decode = function(received, twoS) {
  var poly = new __WEBPACK_IMPORTED_MODULE_1__gf256poly__["a" /* default */](this.field, received);
  var syndromeCoefficients = new Array(twoS);
  for (var i = 0; i < syndromeCoefficients.length; i++)syndromeCoefficients[i] = 0;
  var dataMatrix = false;//this.field.Equals(GF256.DATA_MATRIX_FIELD);
  var noError = true;
  for (var i = 0; i < twoS; i++) {
    // Thanks to sanfordsquires for this fix:
    var _eval = poly.evaluateAt(this.field.exp(dataMatrix ? i + 1 : i));
    syndromeCoefficients[syndromeCoefficients.length - 1 - i] = _eval;
    if (_eval != 0) {
      noError = false;
    }
  }
  if (noError) {
    return;
  }
  var syndrome = new __WEBPACK_IMPORTED_MODULE_1__gf256poly__["a" /* default */](this.field, syndromeCoefficients);
  var sigmaOmega = this.runEuclideanAlgorithm(this.field.buildMonomial(twoS, 1), syndrome, twoS);
  var sigma = sigmaOmega[0];
  var omega = sigmaOmega[1];
  var errorLocations = this.findErrorLocations(sigma);
  var errorMagnitudes = this.findErrorMagnitudes(omega, errorLocations, dataMatrix);
  for (var i = 0; i < errorLocations.length; i++) {
    var position = received.length - 1 - this.field.log(errorLocations[i]);
    if (position < 0) {
      throw "ReedSolomonException Bad error location";
    }
    received[position] = __WEBPACK_IMPORTED_MODULE_0__gf256__["a" /* default */].addOrSubtract(received[position], errorMagnitudes[i]);
  }
};

ReedSolomonDecoder.prototype.runEuclideanAlgorithm = function(a,  b,  R) {
  // Assume a's degree is >= b's
  if (a.Degree < b.Degree) {
    var temp = a;
    a = b;
    b = temp;
  }

  var rLast = a;
  var r = b;
  var sLast = this.field.One;
  var s = this.field.Zero;
  var tLast = this.field.Zero;
  var t = this.field.One;

  // Run Euclidean algorithm until r's degree is less than R/2
  while (r.Degree >= Math.floor(R / 2)) {
    var rLastLast = rLast;
    var sLastLast = sLast;
    var tLastLast = tLast;
    rLast = r;
    sLast = s;
    tLast = t;

    // Divide rLastLast by rLast, with quotient in q and remainder in r
    if (rLast.Zero) {
      // Oops, Euclidean algorithm already terminated?
      throw "r_{i-1} was zero";
    }
    r = rLastLast;
    var q = this.field.Zero;
    var denominatorLeadingTerm = rLast.getCoefficient(rLast.Degree);
    var dltInverse = this.field.inverse(denominatorLeadingTerm);
    while (r.Degree >= rLast.Degree && !r.Zero) {
      var degreeDiff = r.Degree - rLast.Degree;
      var scale = this.field.multiply(r.getCoefficient(r.Degree), dltInverse);
      q = q.addOrSubtract(this.field.buildMonomial(degreeDiff, scale));
      r = r.addOrSubtract(rLast.multiplyByMonomial(degreeDiff, scale));
    }

    s = q.multiply1(sLast).addOrSubtract(sLastLast);
    t = q.multiply1(tLast).addOrSubtract(tLastLast);
  }

  var sigmaTildeAtZero = t.getCoefficient(0);
  if (sigmaTildeAtZero == 0) {
    throw "ReedSolomonException sigmaTilde(0) was zero";
  }

  var inverse = this.field.inverse(sigmaTildeAtZero);
  var sigma = t.multiply2(inverse);
  var omega = r.multiply2(inverse);
  return [sigma, omega];
};

ReedSolomonDecoder.prototype.findErrorLocations = function(errorLocator) {
  // This is a direct application of Chien's search
  var numErrors = errorLocator.Degree;
  if (numErrors == 1) {
    // shortcut
    return new Array(errorLocator.getCoefficient(1));
  }
  var result = new Array(numErrors);
  var e = 0;
  for (var i = 1; i < 256 && e < numErrors; i++) {
    if (errorLocator.evaluateAt(i) == 0) {
      result[e] = this.field.inverse(i);
      e++;
    }
  }
  if (e != numErrors) {
    throw "Error locator degree does not match number of roots";
  }
  return result;
};

ReedSolomonDecoder.prototype.findErrorMagnitudes = function(errorEvaluator, errorLocations, dataMatrix) {
  // This is directly applying Forney's Formula
  var s = errorLocations.length;
  var result = new Array(s);
  for (var i = 0; i < s; i++) {
    var xiInverse = this.field.inverse(errorLocations[i]);
    var denominator = 1;
    for (var j = 0; j < s; j++) {
      if (i != j) {
        denominator = this.field.multiply(denominator, __WEBPACK_IMPORTED_MODULE_0__gf256__["a" /* default */].addOrSubtract(1, this.field.multiply(errorLocations[j], xiInverse)));
      }
    }
    result[i] = this.field.multiply(errorEvaluator.evaluateAt(xiInverse), this.field.inverse(denominator));
    // Thanks to sanfordsquires for this fix:
    if (dataMatrix) {
      result[i] = this.field.multiply(result[i], xiInverse);
    }
  }
  return result;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t(t.toString()).default:"object"==typeof exports?exports.Quagga=t(t.toString()).default:e.Quagga=t(t.toString()).default}(this,function(e){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/",t(t.s=213)}([function(e,t,n){"use strict";var r=!0,o={disableLog:function(e){return"boolean"!=typeof e?new Error("Argument type: "+typeof e+". Please use a boolean."):(r=e,e?"adapter.js logging disabled":"adapter.js logging enabled")},log:function(){if("object"==typeof window){if(r)return;"undefined"!=typeof console&&"function"==typeof console.log&&console.log.apply(console,arguments)}},extractVersion:function(e,t,n){var r=e.match(t);return r&&r.length>=n&&parseInt(r[n],10)},detectBrowser:function(){var e={};if(e.browser=null,e.version=null,"undefined"==typeof window||!window.navigator)return e.browser="Not a browser.",e;if(navigator.mozGetUserMedia)e.browser="firefox",e.version=this.extractVersion(navigator.userAgent,/Firefox\/([0-9]+)\./,1);else if(navigator.webkitGetUserMedia)if(window.webkitRTCPeerConnection)e.browser="chrome",e.version=this.extractVersion(navigator.userAgent,/Chrom(e|ium)\/([0-9]+)\./,2);else{if(!navigator.userAgent.match(/Version\/(\d+).(\d+)/))return e.browser="Unsupported webkit-based browser with GUM support but no WebRTC support.",e;e.browser="safari",e.version=this.extractVersion(navigator.userAgent,/AppleWebKit\/([0-9]+)\./,1)}else{if(!navigator.mediaDevices||!navigator.userAgent.match(/Edge\/(\d+).(\d+)$/))return e.browser="Not a supported browser.",e;e.browser="edge",e.version=this.extractVersion(navigator.userAgent,/Edge\/(\d+).(\d+)$/,2)}return e}};e.exports={log:o.log,disableLog:o.disableLog,browserDetails:o.detectBrowser(),extractVersion:o.extractVersion}},function(e,t,n){var r=n(58),o="object"==typeof self&&self&&self.Object===Object&&self,i=r||o||Function("return this")();e.exports=i},function(e,t){var n=Array.isArray;e.exports=n},function(e,t){function n(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}e.exports=n},function(e,t,n){function r(e,t){var n=i(e,t);return o(n)?n:void 0}var o=n(124),i=n(154);e.exports=r},function(e,t,n){"use strict";function r(e,t){e=a()(o(),e),c.a.call(this,e,t)}function o(){var e={};return Object.keys(r.CONFIG_KEYS).forEach(function(t){e[t]=r.CONFIG_KEYS[t].default}),e}var i=n(40),a=n.n(i),c=n(10),s=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u={CODE_L_START:{value:0},CODE_G_START:{value:10},START_PATTERN:{value:[1,1,1]},STOP_PATTERN:{value:[1,1,1]},MIDDLE_PATTERN:{value:[1,1,1,1,1]},EXTENSION_START_PATTERN:{value:[1,1,2]},CODE_PATTERN:{value:[[3,2,1,1],[2,2,2,1],[2,1,2,2],[1,4,1,1],[1,1,3,2],[1,2,3,1],[1,1,1,4],[1,3,1,2],[1,2,1,3],[3,1,1,2],[1,1,2,3],[1,2,2,2],[2,2,1,2],[1,1,4,1],[2,3,1,1],[1,3,2,1],[4,1,1,1],[2,1,3,1],[3,1,2,1],[2,1,1,3]]},CODE_FREQUENCY:{value:[0,11,13,14,19,25,28,21,22,26]},SINGLE_CODE_ERROR:{value:.7},AVG_CODE_ERROR:{value:.48},FORMAT:{value:"ean_13",writeable:!1}};r.prototype=Object.create(c.a.prototype,u),r.prototype.constructor=r,r.prototype._decodeCode=function(e,t){var n,r,o,i=[0,0,0,0],a=this,c=e,s=!a._row[c],u=0,f={error:Number.MAX_VALUE,code:-1,start:e,end:e};for(t||(t=a.CODE_PATTERN.length),n=c;n<a._row.length;n++)if(a._row[n]^s)i[u]++;else{if(u===i.length-1){for(r=0;r<t;r++)o=a._matchPattern(i,a.CODE_PATTERN[r]),o<f.error&&(f.code=r,f.error=o);return f.end=n,f.error>a.AVG_CODE_ERROR?null:f}u++,i[u]=1,s=!s}return null},r.prototype._findPattern=function(e,t,n,r,o){var i,a,c,s,u=[],f=this,d=0,l={error:Number.MAX_VALUE,code:-1,start:0,end:0};for(t||(t=f._nextSet(f._row)),void 0===n&&(n=!1),void 0===r&&(r=!0),void 0===o&&(o=f.AVG_CODE_ERROR),i=0;i<e.length;i++)u[i]=0;for(i=t;i<f._row.length;i++)if(f._row[i]^n)u[d]++;else{if(d===u.length-1){for(s=0,c=0;c<u.length;c++)s+=u[c];if(a=f._matchPattern(u,e),a<o)return l.error=a,l.start=i-s,l.end=i,l;if(!r)return null;for(c=0;c<u.length-2;c++)u[c]=u[c+2];u[u.length-2]=0,u[u.length-1]=0,d--}else d++;u[d]=1,n=!n}return null},r.prototype._findStart=function(){for(var e,t,n=this,r=n._nextSet(n._row);!t;){if(t=n._findPattern(n.START_PATTERN,r),!t)return null;if(e=t.start-(t.end-t.start),e>=0&&n._matchRange(e,t.start,0))return t;r=t.end,t=null}},r.prototype._verifyTrailingWhitespace=function(e){var t,n=this;return t=e.end+(e.end-e.start),t<n._row.length&&n._matchRange(e.end,t,0)?e:null},r.prototype._findEnd=function(e,t){var n=this,r=n._findPattern(n.STOP_PATTERN,e,t,!1);return null!==r?n._verifyTrailingWhitespace(r):null},r.prototype._calculateFirstDigit=function(e){var t,n=this;for(t=0;t<n.CODE_FREQUENCY.length;t++)if(e===n.CODE_FREQUENCY[t])return t;return null},r.prototype._decodePayload=function(e,t,n){var r,o,i=this,a=0;for(r=0;r<6;r++){if(e=i._decodeCode(e.end),!e)return null;e.code>=i.CODE_G_START?(e.code=e.code-i.CODE_G_START,a|=1<<5-r):a|=0<<5-r,t.push(e.code),n.push(e)}if(o=i._calculateFirstDigit(a),null===o)return null;if(t.unshift(o),e=i._findPattern(i.MIDDLE_PATTERN,e.end,!0,!1),null===e)return null;for(n.push(e),r=0;r<6;r++){if(e=i._decodeCode(e.end,i.CODE_G_START),!e)return null;n.push(e),t.push(e.code)}return e},r.prototype._decode=function(){var e,t,n=this,r=[],o=[],i={};if(e=n._findStart(),!e)return null;if(t={code:e.code,start:e.start,end:e.end},o.push(t),t=n._decodePayload(t,r,o),!t)return null;if(t=n._findEnd(t.end,!1),!t)return null;if(o.push(t),!n._checksum(r))return null;if(this.supplements.length>0){var a=this._decodeExtensions(t.end);if(!a)return null;var c=a.decodedCodes[a.decodedCodes.length-1],u={start:c.start+((c.end-c.start)/2|0),end:c.end};if(!n._verifyTrailingWhitespace(u))return null;i={supplement:a,code:r.join("")+a.code}}return s({code:r.join(""),start:e.start,end:t.end,codeset:"",startInfo:e,decodedCodes:o},i)},r.prototype._decodeExtensions=function(e){var t,n,r=this._nextSet(this._row,e),o=this._findPattern(this.EXTENSION_START_PATTERN,r,!1,!1);if(null===o)return null;for(t=0;t<this.supplements.length;t++)if(n=this.supplements[t].decode(this._row,o.end),null!==n)return{code:n.code,start:r,startInfo:o,end:n.end,codeset:"",decodedCodes:n.decodedCodes};return null},r.prototype._checksum=function(e){var t,n=0;for(t=e.length-2;t>=0;t-=2)n+=e[t];for(n*=3,t=e.length-1;t>=0;t-=2)n+=e[t];return n%10===0},r.CONFIG_KEYS={supplements:{type:"arrayOf(string)",default:[],description:"Allowed extensions to be decoded (2 and/or 5)"}},t.a=r},function(e,t,n){function r(e){return null==e?void 0===e?s:c:u&&u in Object(e)?i(e):a(e)}var o=n(12),i=n(152),a=n(183),c="[object Null]",s="[object Undefined]",u=o?o.toStringTag:void 0;e.exports=r},function(e,t,n){function r(e,t){return o(e)?e:i(e,t)?[e]:a(c(e))}var o=n(2),i=n(165),a=n(192),c=n(203);e.exports=r},function(e,t,n){function r(e,t,n,r){var a=!n;n||(n={});for(var c=-1,s=t.length;++c<s;){var u=t[c],f=r?r(n[u],e[u],u,n,e):void 0;void 0===f&&(f=e[u]),a?i(n,u,f):o(n,u,f)}return n}var o=n(29),i=n(30);e.exports=r},function(e,t){function n(e){return null!=e&&"object"==typeof e}e.exports=n},function(e,t,n){"use strict";function r(e,t){return this._row=[],this.config=e||{},this.supplements=t,this}r.prototype._nextUnset=function(e,t){var n;for(void 0===t&&(t=0),n=t;n<e.length;n++)if(!e[n])return n;return e.length},r.prototype._matchPattern=function(e,t,n){var r,o,i,a,c=0,s=0,u=0,f=0;for(n=n||this.SINGLE_CODE_ERROR||1,r=0;r<e.length;r++)u+=e[r],f+=t[r];if(u<f)return Number.MAX_VALUE;for(o=u/f,n*=o,r=0;r<e.length;r++){if(i=e[r],a=t[r]*o,s=Math.abs(i-a)/a,s>n)return Number.MAX_VALUE;c+=s}return c/f},r.prototype._nextSet=function(e,t){var n;for(t=t||0,n=t;n<e.length;n++)if(e[n])return n;return e.length},r.prototype._correctBars=function(e,t,n){for(var r=n.length,o=0;r--;)o=e[n[r]]*(1-(1-t)/2),o>1&&(e[n[r]]=o)},r.prototype._matchTrace=function(e,t){var n,r,o=[],i=this,a=i._nextSet(i._row),c=!i._row[a],s=0,u={error:Number.MAX_VALUE,code:-1,start:0};if(e){for(n=0;n<e.length;n++)o.push(0);for(n=a;n<i._row.length;n++)if(i._row[n]^c)o[s]++;else{if(s===o.length-1)return r=i._matchPattern(o,e),r<t?(u.start=n-a,u.end=n,u.counter=o,u):null;s++,o[s]=1,c=!c}}else for(o.push(0),n=a;n<i._row.length;n++)i._row[n]^c?o[s]++:(s++,o.push(0),o[s]=1,c=!c);return u.start=a,u.end=i._row.length-1,u.counter=o,u},r.prototype.decodePattern=function(e){var t,n=this;return n._row=e,t=n._decode(),null===t?(n._row.reverse(),t=n._decode(),t&&(t.direction=r.DIRECTION.REVERSE,t.start=n._row.length-t.start,t.end=n._row.length-t.end)):t.direction=r.DIRECTION.FORWARD,t&&(t.format=n.FORMAT),t},r.prototype._matchRange=function(e,t,n){var r;for(e=e<0?0:e,r=e;r<t;r++)if(this._row[r]!==n)return!1;return!0},r.prototype._fillCounters=function(e,t,n){var r,o=this,i=0,a=[];for(n="undefined"==typeof n||n,e="undefined"!=typeof e?e:o._nextUnset(o._row),t=t||o._row.length,a[i]=0,r=e;r<t;r++)o._row[r]^n?a[i]++:(i++,a[i]=1,n=!n);return a},Object.defineProperty(r.prototype,"FORMAT",{value:"unknown",writeable:!1}),r.DIRECTION={FORWARD:1,REVERSE:-1},r.Exception={StartNotFoundException:"Start-Info was not found!",CodeNotFoundException:"Code could not be found!",PatternNotFoundException:"Pattern could not be found!"},r.CONFIG_KEYS={},t.a=r},function(e,t){function n(e){var t=new Float32Array(2);return t[0]=e[0],t[1]=e[1],t}e.exports=n},function(e,t,n){var r=n(1),o=r.Symbol;e.exports=o},function(e,t,n){"use strict";t.a={init:function(e,t){for(var n=e.length;n--;)e[n]=t},shuffle:function(e){var t,n,r=e.length-1;for(r;r>=0;r--)t=Math.floor(Math.random()*r),n=e[r],e[r]=e[t],e[t]=n;return e},toPointList:function(e){var t,n,r=[],o=[];for(t=0;t<e.length;t++){for(r=[],n=0;n<e[t].length;n++)r[n]=e[t][n];o[t]="["+r.join(",")+"]"}return"["+o.join(",\r\n")+"]"},threshold:function(e,t,n){var r,o=[];for(r=0;r<e.length;r++)n.apply(e,[e[r]])>=t&&o.push(e[r]);return o},maxIndex:function(e){var t,n=0;for(t=0;t<e.length;t++)e[t]>e[n]&&(n=t);return n},max:function e(t){var n,e=0;for(n=0;n<t.length;n++)t[n]>e&&(e=t[n]);return e},sum:function e(t){for(var n=t.length,e=0;n--;)e+=t[n];return e}}},function(e,t,n){"use strict";t.a={drawRect:function(e,t,n,r){n.strokeStyle=r.color,n.fillStyle=r.color,n.lineWidth=1,n.beginPath(),n.strokeRect(e.x,e.y,t.x,t.y)},drawPath:function(e,t,n,r){n.strokeStyle=r.color,n.fillStyle=r.color,n.lineWidth=r.lineWidth,n.beginPath(),n.moveTo(e[0][t.x],e[0][t.y]);for(var o=1;o<e.length;o++)n.lineTo(e[o][t.x],e[o][t.y]);n.closePath(),n.stroke()},drawImage:function(e,t,n){var r,o=n.getImageData(0,0,t.x,t.y),i=o.data,a=e.length,c=i.length;if(c/a!==4)return!1;for(;a--;)r=e[a],i[--c]=255,i[--c]=r,i[--c]=r,i[--c]=r;return n.putImageData(o,0,0),!0}}},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(168),i=n(169),a=n(170),c=n(171),s=n(172);r.prototype.clear=o,r.prototype.delete=i,r.prototype.get=a,r.prototype.has=c,r.prototype.set=s,e.exports=r},function(e,t,n){function r(e,t){for(var n=e.length;n--;)if(o(e[n][0],t))return n;return-1}var o=n(21);e.exports=r},function(e,t,n){function r(e,t){var n=e.__data__;return o(t)?n["string"==typeof t?"string":"hash"]:n.map}var o=n(166);e.exports=r},function(e,t){function n(e,t){return t=null==t?r:t,!!t&&("number"==typeof e||o.test(e))&&e>-1&&e%1==0&&e<t}var r=9007199254740991,o=/^(?:0|[1-9]\d*)$/;e.exports=n},function(e,t,n){var r=n(4),o=r(Object,"create");e.exports=o},function(e,t,n){function r(e){if("string"==typeof e||o(e))return e;var t=e+"";return"0"==t&&1/e==-i?"-0":t}var o=n(38),i=1/0;e.exports=r},function(e,t){function n(e,t){return e===t||e!==e&&t!==t}e.exports=n},function(e,t,n){var r=n(123),o=n(9),i=Object.prototype,a=i.hasOwnProperty,c=i.propertyIsEnumerable,s=r(function(){return arguments}())?r:function(e){return o(e)&&a.call(e,"callee")&&!c.call(e,"callee")};e.exports=s},function(e,t,n){function r(e){return null!=e&&i(e.length)&&!o(e)}var o=n(36),i=n(37);e.exports=r},function(e,t,n){function r(e){return a(e)?o(e,!0):i(e)}var o=n(47),i=n(127),a=n(23);e.exports=r},function(e,t,n){"use strict";function r(e,t){var n={x:e,y:t,toVec2:function(){return w.clone([this.x,this.y])},toVec3:function(){return x.clone([this.x,this.y,1])},round:function(){return this.x=this.x>0?Math.floor(this.x+.5):Math.floor(this.x-.5),this.y=this.y>0?Math.floor(this.y+.5):Math.floor(this.y-.5),this}};return n}function o(e,t,n){n||(n=e);for(var r=e.data,o=r.length,i=n.data;o--;)i[o]=r[o]<t?1:0}function i(e,t){t||(t=8);for(var n=e.data,r=n.length,o=8-t,i=1<<t,a=new Int32Array(i);r--;)a[n[r]>>o]++;return a}function a(e,t){function n(e,t){var n,r=0;for(n=e;n<=t;n++)r+=a[n];return r}function r(e,t){var n,r=0;for(n=e;n<=t;n++)r+=n*a[n];return r}function o(){var o,c,s,u,f,d,l,p=[0],h=(1<<t)-1;for(a=i(e,t),u=1;u<h;u++)o=n(0,u),c=n(u+1,h),s=o*c,0===s&&(s=1),f=r(0,u)*c,d=r(u+1,h)*o,l=f-d,p[u]=l*l/s;return _.a.maxIndex(p)}t||(t=8);var a,c,s=8-t;return c=o(),c<<s}function c(e,t){var n=a(e);return o(e,n,t),n}function s(e,t,n){function r(e){var t=!1;for(i=0;i<s.length;i++)a=s[i],a.fits(e)&&(a.add(e),t=!0);return t}var o,i,a,c,s=[];for(n||(n="rad"),o=0;o<e.length;o++)c=b.a.createPoint(e[o],o,n),r(c)||s.push(b.a.create(c,t));return s}function u(e,t,n){var r,o,i,a,c=0,s=0,u=[];for(r=0;r<t;r++)u[r]={score:0,item:null};for(r=0;r<e.length;r++)if(o=n.apply(this,[e[r]]),o>s)for(i=u[c],i.score=o,i.item=e[r],s=Number.MAX_VALUE,a=0;a<t;a++)u[a].score<s&&(s=u[a].score,c=a);return u}function f(e,t,n){for(var r,o=0,i=t.x,a=Math.floor(e.length/4),c=t.x/2,s=0,u=t.x;i<a;){for(r=0;r<c;r++)n[s]=Math.floor((.299*e[4*o+0]+.587*e[4*o+1]+.114*e[4*o+2]+(.299*e[4*(o+1)+0]+.587*e[4*(o+1)+1]+.114*e[4*(o+1)+2])+(.299*e[4*i+0]+.587*e[4*i+1]+.114*e[4*i+2])+(.299*e[4*(i+1)+0]+.587*e[4*(i+1)+1]+.114*e[4*(i+1)+2]))/4),s++,o+=2,i+=2;o+=u,i+=u}}function d(e,t,n){var r,o=e.length/4|0,i=n&&n.singleChannel===!0;if(i)for(r=0;r<o;r++)t[r]=e[4*r+0];else for(r=0;r<o;r++)t[r]=Math.floor(.299*e[4*r+0]+.587*e[4*r+1]+.114*e[4*r+2])}function l(e,t){for(var n=e.data,r=e.size.x,o=t.data,i=0,a=r,c=n.length,s=r/2,u=0;a<c;){for(var f=0;f<s;f++)o[u]=Math.floor((n[i]+n[i+1]+n[a]+n[a+1])/4),u++,i+=2,a+=2;i+=r,a+=r}}function p(e,t){var n=e[0],r=e[1],o=e[2],i=o*r,a=i*(1-Math.abs(n/60%2-1)),c=o-i,s=0,u=0,f=0;return t=t||[0,0,0],n<60?(s=i,u=a):n<120?(s=a,u=i):n<180?(u=i,f=a):n<240?(u=a,f=i):n<300?(s=a,f=i):n<360&&(s=i,f=a),t[0]=255*(s+c)|0,t[1]=255*(u+c)|0,t[2]=255*(f+c)|0,t}function h(e){var t,n=[],r=[];for(t=1;t<Math.sqrt(e)+1;t++)e%t===0&&(r.push(t),t!==e/t&&n.unshift(Math.floor(e/t)));return r.concat(n)}function v(e,t){for(var n=0,r=0,o=[];n<e.length&&r<t.length;)e[n]===t[r]?(o.push(e[n]),n++,r++):e[n]>t[r]?r++:n++;return o}function g(e,t){function n(e){for(var t=0,n=e[Math.floor(e.length/2)];t<e.length-1&&e[t]<l;)t++;return t>0&&(n=Math.abs(e[t]-l)>Math.abs(e[t-1]-l)?e[t-1]:e[t]),l/n<s[f+1]/s[f]&&l/n>s[f-1]/s[f]?{x:n,y:n}:null}var r,o=h(t.x),i=h(t.y),a=Math.max(t.x,t.y),c=v(o,i),s=[8,10,15,20,32,60,80],u={"x-small":5,small:4,medium:3,large:2,"x-large":1},f=u[e]||u.medium,d=s[f],l=Math.floor(a/d);return r=n(c),r||(r=n(h(a)),r||(r=n(h(l*d)))),r}function m(e){var t={value:parseFloat(e),unit:(e.indexOf("%")===e.length-1,"%")};return t}function y(e,t,n){var r={width:e,height:t},o=Object.keys(n).reduce(function(e,t){var o=n[t],i=m(o),a=C[t](i,r);return e[t]=a,e},{});return{sx:o.left,sy:o.top,sw:o.right-o.left,sh:o.bottom-o.top}}var b=n(73),_=n(13);t.b=r,t.f=c,t.g=s,t.h=u,t.c=f,t.d=d,t.i=l,t.a=p,t.e=g,t.j=y;var w={clone:n(11)},x={clone:n(104)},C={top:function(e,t){if("%"===e.unit)return Math.floor(t.height*(e.value/100))},right:function(e,t){if("%"===e.unit)return Math.floor(t.width-t.width*(e.value/100))},bottom:function(e,t){if("%"===e.unit)return Math.floor(t.height-t.height*(e.value/100))},left:function(e,t){if("%"===e.unit)return Math.floor(t.width*(e.value/100))}}},function(e,t,n){"use strict";function r(e,t,n,r){t?this.data=t:n?(this.data=new n(e.x*e.y),n===Array&&r&&a.a.init(this.data,0)):(this.data=new Uint8Array(e.x*e.y),Uint8Array===Array&&r&&a.a.init(this.data,0)),this.size=e}var o=n(76),i=n(25),a=n(13),c={clone:n(11)};r.prototype.inImageWithBorder=function(e,t){return e.x>=t&&e.y>=t&&e.x<this.size.x-t&&e.y<this.size.y-t},r.sample=function(e,t,n){var r=Math.floor(t),o=Math.floor(n),i=e.size.x,a=o*e.size.x+r,c=e.data[a+0],s=e.data[a+1],u=e.data[a+i],f=e.data[a+i+1],d=c-s;t-=r,n-=o;var l=Math.floor(t*(n*(d-u+f)-d)+n*(u-c)+c);return l},r.clearArray=function(e){for(var t=e.length;t--;)e[t]=0},r.prototype.subImage=function(e,t){return new o.a(e,t,this)},r.prototype.subImageAsCopy=function(e,t){var n,r,o=e.size.y,i=e.size.x;for(n=0;n<i;n++)for(r=0;r<o;r++)e.data[r*i+n]=this.data[(t.y+r)*this.size.x+t.x+n]},r.prototype.copyTo=function(e){for(var t=this.data.length,n=this.data,r=e.data;t--;)r[t]=n[t]},r.prototype.get=function(e,t){return this.data[t*this.size.x+e]},r.prototype.getSafe=function(e,t){var n;if(!this.indexMapping){for(this.indexMapping={x:[],y:[]},n=0;n<this.size.x;n++)this.indexMapping.x[n]=n,this.indexMapping.x[n+this.size.x]=n;for(n=0;n<this.size.y;n++)this.indexMapping.y[n]=n,this.indexMapping.y[n+this.size.y]=n}return this.data[this.indexMapping.y[t+this.size.y]*this.size.x+this.indexMapping.x[e+this.size.x]]},r.prototype.set=function(e,t,n){return this.data[t*this.size.x+e]=n,this},r.prototype.zeroBorder=function(){var e,t=this.size.x,n=this.size.y,r=this.data;for(e=0;e<t;e++)r[e]=r[(n-1)*t+e]=0;for(e=1;e<n-1;e++)r[e*t]=r[e*t+(t-1)]=0},r.prototype.invert=function(){for(var e=this.data,t=e.length;t--;)e[t]=e[t]?0:1},r.prototype.convolve=function(e){var t,n,r,o,i=e.length/2|0,a=0;for(n=0;n<this.size.y;n++)for(t=0;t<this.size.x;t++){for(a=0,o=-i;o<=i;o++)for(r=-i;r<=i;r++)a+=e[o+i][r+i]*this.getSafe(t+r,n+o);this.data[n*this.size.x+t]=a}},r.prototype.moments=function(e){var t,n,r,o,i,a,s,u,f,d,l,p,h=this.data,v=this.size.y,g=this.size.x,m=[],y=[],b=Math.PI,_=b/4;if(e<=0)return y;for(i=0;i<e;i++)m[i]={m00:0,m01:0,m10:0,m11:0,m02:0,m20:0,theta:0,rad:0};for(n=0;n<v;n++)for(o=n*n,t=0;t<g;t++)r=h[n*g+t],r>0&&(a=m[r-1],a.m00+=1,a.m01+=n,a.m10+=t,a.m11+=t*n,a.m02+=o,a.m20+=t*t);for(i=0;i<e;i++)a=m[i],isNaN(a.m00)||0===a.m00||(d=a.m10/a.m00,l=a.m01/a.m00,s=a.m11/a.m00-d*l,u=a.m02/a.m00-l*l,f=a.m20/a.m00-d*d,p=(u-f)/(2*s),p=.5*Math.atan(p)+(s>=0?_:-_)+b,a.theta=(180*p/b+90)%180-90,a.theta<0&&(a.theta+=180),a.rad=p>b?p-b:p,a.vec=c.clone([Math.cos(p),Math.sin(p)]),y.push(a));return y},r.prototype.show=function(e,t){var n,r,o,i,a,c,s;for(t||(t=1),n=e.getContext("2d"),e.width=this.size.x,e.height=this.size.y,r=n.getImageData(0,0,e.width,e.height),o=r.data,i=0,s=0;s<this.size.y;s++)for(c=0;c<this.size.x;c++)a=s*this.size.x+c,i=this.get(c,s)*t,o[4*a+0]=i,o[4*a+1]=i,o[4*a+2]=i,o[4*a+3]=255;n.putImageData(r,0,0)},r.prototype.overlay=function(e,t,r){(!t||t<0||t>360)&&(t=360);for(var o=[0,1,1],a=[0,0,0],c=[255,255,255],s=[0,0,0],u=[],f=e.getContext("2d"),d=f.getImageData(r.x,r.y,this.size.x,this.size.y),l=d.data,p=this.data.length;p--;)o[0]=this.data[p]*t,u=o[0]<=0?c:o[0]>=360?s:n.i(i.a)(o,a),l[4*p+0]=u[0],l[4*p+1]=u[1],l[4*p+2]=u[2],l[4*p+3]=255;f.putImageData(d,r.x,r.y)},t.a=r},function(e,t,n){var r=n(4),o=n(1),i=r(o,"Map");e.exports=i},function(e,t){function n(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}e.exports=n},function(e,t,n){function r(e,t,n){var r=e[t];c.call(e,t)&&i(r,n)&&(void 0!==n||t in e)||o(e,t,n)}var o=n(30),i=n(21),a=Object.prototype,c=a.hasOwnProperty;e.exports=r},function(e,t,n){function r(e,t,n){"__proto__"==t&&o?o(e,t,{configurable:!0,enumerable:!0,value:n,writable:!0}):e[t]=n}var o=n(56);e.exports=r},function(e,t,n){function r(e){var t=new e.constructor(e.byteLength);return new o(t).set(new o(e)),t}var o=n(109);e.exports=r},function(e,t,n){var r=n(62),o=r(Object.getPrototypeOf,Object);e.exports=o},function(e,t,n){var r=n(115),o=n(69),i=Object.prototype,a=i.propertyIsEnumerable,c=Object.getOwnPropertySymbols,s=c?function(e){return null==e?[]:(e=Object(e),r(c(e),function(t){return a.call(e,t)}))}:o;e.exports=s},function(e,t){function n(e){var t=e&&e.constructor,n="function"==typeof t&&t.prototype||r;return e===n}var r=Object.prototype;e.exports=n},function(e,t,n){(function(e){var r=n(1),o=n(201),i="object"==typeof t&&t&&!t.nodeType&&t,a=i&&"object"==typeof e&&e&&!e.nodeType&&e,c=a&&a.exports===i,s=c?r.Buffer:void 0,u=s?s.isBuffer:void 0,f=u||o;e.exports=f}).call(t,n(41)(e))},function(e,t,n){function r(e){if(!i(e))return!1;var t=o(e);return t==c||t==s||t==a||t==u}var o=n(6),i=n(3),a="[object AsyncFunction]",c="[object Function]",s="[object GeneratorFunction]",u="[object Proxy]";e.exports=r},function(e,t){function n(e){return"number"==typeof e&&e>-1&&e%1==0&&e<=r}var r=9007199254740991;e.exports=n},function(e,t,n){function r(e){return"symbol"==typeof e||i(e)&&o(e)==a}var o=n(6),i=n(9),a="[object Symbol]";e.exports=r},function(e,t,n){function r(e){return a(e)?o(e):i(e)}var o=n(47),i=n(126),a=n(23);e.exports=r},function(e,t,n){var r=n(128),o=n(148),i=o(function(e,t,n){r(e,t,n)});e.exports=i},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,configurable:!1,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,configurable:!1,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,n){"use strict";var r={searchDirections:[[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]],create:function(e,t){function n(e,t,n,r){var o,f,d;for(o=0;o<7;o++){if(f=e.cy+s[e.dir][0],d=e.cx+s[e.dir][1],i=f*u+d,a[i]===t&&(0===c[i]||c[i]===n))return c[i]=n,e.cy=f,e.cx=d,!0;0===c[i]&&(c[i]=r),e.dir=(e.dir+1)%8}return!1}function r(e,t,n){return{dir:n,x:e,y:t,next:null,prev:null}}function o(e,t,o,i,a){var c,s,u,f=null,d={cx:t,cy:e,dir:0};if(n(d,i,o,a)){f=r(t,e,d.dir),c=f,u=d.dir,s=r(d.cx,d.cy,0),s.prev=c,c.next=s,s.next=null,c=s;do d.dir=(d.dir+6)%8,n(d,i,o,a),u!==d.dir?(c.dir=d.dir,s=r(d.cx,d.cy,0),s.prev=c,c.next=s,s.next=null,c=s):(c.dir=u,c.x=d.cx,c.y=d.cy),u=d.dir;while(d.cx!==t||d.cy!==e);f.prev=c.prev,c.prev.next=f}return f}var i,a=e.data,c=t.data,s=this.searchDirections,u=e.size.x;return{trace:function(e,t,r,o){return n(e,t,r,o)},contourTracing:function(e,t,n,r,i){return o(e,t,n,r,i)}}}};t.a=r},function(e,t,n){"use strict";function r(){o.a.call(this)}var o=n(10),i=n(13),a={ALPHABETH_STRING:{value:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%"},ALPHABET:{value:[48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,45,46,32,42,36,47,43,37]},CHARACTER_ENCODINGS:{value:[52,289,97,352,49,304,112,37,292,100,265,73,328,25,280,88,13,268,76,28,259,67,322,19,274,82,7,262,70,22,385,193,448,145,400,208,133,388,196,148,168,162,138,42]},ASTERISK:{value:148},FORMAT:{value:"code_39",writeable:!1}};r.prototype=Object.create(o.a.prototype,a),r.prototype.constructor=r,r.prototype._toCounters=function(e,t){var n,r=this,o=t.length,a=r._row.length,c=!r._row[e],s=0;for(i.a.init(t,0),n=e;n<a;n++)if(r._row[n]^c)t[s]++;else{if(s++,s===o)break;t[s]=1,c=!c}return t},r.prototype._decode=function(){var e,t,n,r,o=this,a=[0,0,0,0,0,0,0,0,0],c=[],s=o._findStart();if(!s)return null;r=o._nextSet(o._row,s.end);do{if(a=o._toCounters(r,a),n=o._toPattern(a),n<0)return null;if(e=o._patternToChar(n),e<0)return null;c.push(e),t=r,r+=i.a.sum(a),r=o._nextSet(o._row,r)}while("*"!==e);return c.pop(),c.length&&o._verifyTrailingWhitespace(t,r,a)?{code:c.join(""),start:s.start,end:r,startInfo:s,decodedCodes:c}:null},r.prototype._verifyTrailingWhitespace=function(e,t,n){var r,o=i.a.sum(n);return r=t-e-o,3*r>=o},r.prototype._patternToChar=function(e){var t,n=this;for(t=0;t<n.CHARACTER_ENCODINGS.length;t++)if(n.CHARACTER_ENCODINGS[t]===e)return String.fromCharCode(n.ALPHABET[t]);return-1},r.prototype._findNextWidth=function(e,t){var n,r=Number.MAX_VALUE;for(n=0;n<e.length;n++)e[n]<r&&e[n]>t&&(r=e[n]);return r},r.prototype._toPattern=function(e){for(var t,n,r=e.length,o=0,i=r,a=0,c=this;i>3;){for(o=c._findNextWidth(e,o),i=0,t=0,n=0;n<r;n++)e[n]>o&&(t|=1<<r-1-n,i++,a+=e[n]);if(3===i){for(n=0;n<r&&i>0;n++)if(e[n]>o&&(i--,2*e[n]>=a))return-1;return t}}return-1},r.prototype._findStart=function(){var e,t,n,r=this,o=r._nextSet(r._row),i=o,a=[0,0,0,0,0,0,0,0,0],c=0,s=!1;for(e=o;e<r._row.length;e++)if(r._row[e]^s)a[c]++;else{if(c===a.length-1){if(r._toPattern(a)===r.ASTERISK&&(n=Math.floor(Math.max(0,i-(e-i)/4)),r._matchRange(n,i,0)))return{start:i,end:e};for(i+=a[0]+a[1],t=0;t<7;t++)a[t]=a[t+2];a[7]=0,a[8]=0,c--}else c++;a[c]=1,s=!s}return null},t.a=r},function(e,t){function n(e,t){return e[0]*t[0]+e[1]*t[1]}e.exports=n},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(173),i=n(174),a=n(175),c=n(176),s=n(177);r.prototype.clear=o,r.prototype.delete=i,r.prototype.get=a,r.prototype.has=c,r.prototype.set=s,e.exports=r},function(e,t,n){function r(e){var t=this.__data__=new o(e);this.size=t.size}var o=n(15),i=n(187),a=n(188),c=n(189),s=n(190),u=n(191);r.prototype.clear=i,r.prototype.delete=a,r.prototype.get=c,r.prototype.has=s,r.prototype.set=u,e.exports=r},function(e,t,n){function r(e,t){var n=a(e),r=!n&&i(e),f=!n&&!r&&c(e),l=!n&&!r&&!f&&u(e),p=n||r||f||l,h=p?o(e.length,String):[],v=h.length;for(var g in e)!t&&!d.call(e,g)||p&&("length"==g||f&&("offset"==g||"parent"==g)||l&&("buffer"==g||"byteLength"==g||"byteOffset"==g)||s(g,v))||h.push(g);return h}var o=n(136),i=n(22),a=n(2),c=n(35),s=n(18),u=n(68),f=Object.prototype,d=f.hasOwnProperty;e.exports=r},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}e.exports=n},function(e,t){function n(e,t,n,r){var o=-1,i=null==e?0:e.length;for(r&&i&&(n=e[++o]);++o<i;)n=t(n,e[o],o,e);return n}e.exports=n},function(e,t,n){function r(e,t,n){(void 0===n||i(e[t],n))&&(void 0!==n||t in e)||o(e,t,n)}var o=n(30),i=n(21);e.exports=r},function(e,t,n){function r(e,t){t=o(t,e);for(var n=0,r=t.length;null!=e&&n<r;)e=e[i(t[n++])];return n&&n==r?e:void 0}var o=n(7),i=n(20);e.exports=r},function(e,t,n){function r(e,t,n){var r=t(e);return i(e)?r:o(r,n(e))}var o=n(28),i=n(2);e.exports=r},function(e,t,n){(function(e){function r(e,t){if(t)return e.slice();var n=e.length,r=u?u(n):new e.constructor(n);return e.copy(r),r}var o=n(1),i="object"==typeof t&&t&&!t.nodeType&&t,a=i&&"object"==typeof e&&e&&!e.nodeType&&e,c=a&&a.exports===i,s=c?o.Buffer:void 0,u=s?s.allocUnsafe:void 0;e.exports=r}).call(t,n(41)(e))},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.length)}var o=n(31);e.exports=r},function(e,t){function n(e,t){var n=-1,r=e.length;for(t||(t=Array(r));++n<r;)t[n]=e[n];return t}e.exports=n},function(e,t,n){var r=n(4),o=function(){try{var e=r(Object,"defineProperty");return e({},"",{}),e}catch(e){}}();e.exports=o},function(e,t,n){function r(e){return a(i(e,void 0,o),e+"")}var o=n(194),i=n(63),a=n(64);e.exports=r},function(e,t,n){(function(t){var n="object"==typeof t&&t&&t.Object===Object&&t;e.exports=n}).call(t,n(70))},function(e,t,n){function r(e){return o(e,a,i)}var o=n(52),i=n(60),a=n(24);e.exports=r},function(e,t,n){var r=n(28),o=n(32),i=n(33),a=n(69),c=Object.getOwnPropertySymbols,s=c?function(e){for(var t=[];e;)r(t,i(e)),e=o(e);return t}:a;e.exports=s},function(e,t,n){function r(e){return"function"!=typeof e.constructor||a(e)?{}:o(i(e))}var o=n(119),i=n(32),a=n(34);e.exports=r},function(e,t){function n(e,t){return function(n){return e(t(n))}}e.exports=n},function(e,t,n){function r(e,t,n){return t=i(void 0===t?e.length-1:t,0),function(){for(var r=arguments,a=-1,c=i(r.length-t,0),s=Array(c);++a<c;)s[a]=r[t+a];a=-1;for(var u=Array(t+1);++a<t;)u[a]=r[a];return u[t]=n(s),o(e,this,u)}}var o=n(113),i=Math.max;e.exports=r},function(e,t,n){var r=n(134),o=n(186),i=o(r);e.exports=i},function(e,t){function n(e){if(null!=e){try{return o.call(e)}catch(e){}try{return e+""}catch(e){}}return""}var r=Function.prototype,o=r.toString;e.exports=n},function(e,t){function n(e){return e}e.exports=n},function(e,t,n){function r(e){if(!a(e)||o(e)!=c)return!1;var t=i(e);if(null===t)return!0;var n=d.call(t,"constructor")&&t.constructor;return"function"==typeof n&&n instanceof n&&f.call(n)==l}var o=n(6),i=n(32),a=n(9),c="[object Object]",s=Function.prototype,u=Object.prototype,f=s.toString,d=u.hasOwnProperty,l=f.call(Object);e.exports=r},function(e,t,n){var r=n(125),o=n(138),i=n(182),a=i&&i.isTypedArray,c=a?o(a):r;e.exports=c},function(e,t){function n(){return[]}e.exports=n},function(e,t){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(t,n,r){"use strict";function o(e){f(e),A=U.a.create(K.decoder,P)}function i(e){var t;if("VideoStream"===K.inputStream.type)t=document.createElement("video"),R=H.a.createVideoStream(t);else if("ImageStream"===K.inputStream.type)R=H.a.createImageStream();else if("LiveStream"===K.inputStream.type){var n=a();n&&(t=n.querySelector("video"),t||(t=document.createElement("video"),n.appendChild(t))),R=H.a.createLiveStream(t),G.a.request(t,K.inputStream.constraints).then(function(){R.trigger("canrecord")}).catch(function(t){return e(t)})}R.setAttribute("preload","auto"),R.setInputStream(K.inputStream),R.addEventListener("canrecord",c.bind(void 0,e))}function a(){var e=K.inputStream.target;if(e&&e.nodeName&&1===e.nodeType)return e;var t="string"==typeof e?e:"#interactive.viewport";return document.querySelector(t)}function c(e){L.a.checkImageConstraints(R,K.locator),u(K),O=q.a.create(R,$.dom.image),T(K.numOfWorkers,function(){0===K.numOfWorkers&&o(),s(e)})}function s(e){R.play(),e()}function u(){if("undefined"!=typeof document){var e=a();if($.dom.image=document.querySelector("canvas.imgBuffer"),$.dom.image||($.dom.image=document.createElement("canvas"),$.dom.image.className="imgBuffer",e&&"ImageStream"===K.inputStream.type&&e.appendChild($.dom.image)),$.ctx.image=$.dom.image.getContext("2d"),$.dom.image.width=R.getCanvasSize().x,$.dom.image.height=R.getCanvasSize().y,$.dom.overlay=document.querySelector("canvas.drawingBuffer"),!$.dom.overlay){$.dom.overlay=document.createElement("canvas"),$.dom.overlay.className="drawingBuffer",e&&e.appendChild($.dom.overlay);var t=document.createElement("br");t.setAttribute("clear","all"),e&&e.appendChild(t)}$.ctx.overlay=$.dom.overlay.getContext("2d"),$.dom.overlay.width=R.getCanvasSize().x,$.dom.overlay.height=R.getCanvasSize().y}}function f(e){P=e?e:new z.a({x:R.getWidth(),y:R.getHeight()}),D=[Y.clone([0,0]),Y.clone([0,P.size.y]),Y.clone([P.size.x,P.size.y]),Y.clone([P.size.x,0])],L.a.init(P,K.locator)}function d(){return K.locate?L.a.locate():[[Y.clone(D[0]),Y.clone(D[1]),Y.clone(D[2]),Y.clone(D[3])]]}function l(e){function t(e){for(var t=e.length;t--;)e[t][0]+=i,e[t][1]+=a}function n(e){e[0].x+=i,e[0].y+=a,e[1].x+=i,e[1].y+=a}var r,o=R.getTopRight(),i=o.x,a=o.y;if(0!==i||0!==a){if(e.barcodes)for(r=0;r<e.barcodes.length;r++)l(e.barcodes[r]);if(e.line&&2===e.line.length&&n(e.line),e.box&&t(e.box),e.boxes&&e.boxes.length>0)for(r=0;r<e.boxes.length;r++)t(e.boxes[r])}}function p(e,t){t&&j&&(e.barcodes?e.barcodes.filter(function(e){return e.codeResult}).forEach(function(e){return p(e,t)}):e.codeResult&&j.addResult(t,R.getCanvasSize(),e.codeResult))}function h(e){return e&&(e.barcodes?e.barcodes.some(function(e){return e.codeResult}):e.codeResult)}function v(e,t){var n=e;e&&J&&(l(e),p(e,t),n=e.barcodes||e),F.a.publish("processed",n),h(e)&&F.a.publish("detected",n)}function g(){var e,t;t=d(),t?(e=A.decodeFromBoundingBoxes(t),
e=e||{},e.boxes=t,v(e,P.data)):v()}function m(){var e;if(J){if(Q.length>0){if(e=Q.filter(function(e){return!e.busy})[0],!e)return;O.attachData(e.imageData)}else O.attachData(P.data);O.grab()&&(e?(e.busy=!0,e.worker.postMessage({cmd:"process",imageData:e.imageData},[e.imageData.buffer])):g())}else g()}function y(){var e=null,t=1e3/(K.frequency||60);S=!1,function n(r){e=e||r,S||(r>=e&&(e+=t,m()),window.requestAnimFrame(n))}(performance.now())}function b(){J&&"LiveStream"===K.inputStream.type?y():m()}function _(e){var t,n={worker:void 0,imageData:new Uint8Array(R.getWidth()*R.getHeight()),busy:!0};t=C(),n.worker=new Worker(t),n.worker.onmessage=function(r){return"initialized"===r.data.event?(URL.revokeObjectURL(t),n.busy=!1,n.imageData=new Uint8Array(r.data.imageData),e(n)):void("processed"===r.data.event?(n.imageData=new Uint8Array(r.data.imageData),n.busy=!1,v(r.data.result,n.imageData)):"error"===r.data.event)},n.worker.postMessage({cmd:"init",size:{x:R.getWidth(),y:R.getHeight()},imageData:n.imageData,config:w(K)},[n.imageData.buffer])}function w(e){return X({},e,{inputStream:X({},e.inputStream,{target:null})})}function x(e){function t(e){self.postMessage({event:"processed",imageData:o.data,result:e},[o.data.buffer])}function n(){self.postMessage({event:"initialized",imageData:o.data},[o.data.buffer])}if(e){var r=e().default;if(!r)return void self.postMessage({event:"error",message:"Quagga could not be created"})}var o;self.onmessage=function(e){if("init"===e.data.cmd){var i=e.data.config;i.numOfWorkers=0,o=new r.ImageWrapper({x:e.data.size.x,y:e.data.size.y},new Uint8Array(e.data.imageData)),r.init(i,n,o),r.onProcessed(t)}else"process"===e.data.cmd?(o.data=new Uint8Array(e.data.imageData),r.start()):"setReaders"===e.data.cmd&&r.setReaders(e.data.readers)}}function C(){var t,n;return"undefined"!=typeof e&&(n=e),t=new Blob(["("+x.toString()+")("+n+");"],{type:"text/javascript"}),window.URL.createObjectURL(t)}function E(e){A?A.setReaders(e):J&&Q.length>0&&Q.forEach(function(t){t.worker.postMessage({cmd:"setReaders",readers:e})})}function T(e,t){var n=e-Q.length;if(0===n)return t&&t();if(n<0){var r=Q.slice(n);return r.forEach(function(e){e.worker.terminate()}),Q=Q.slice(0,n),t&&t()}for(var o=function(n){Q.push(n),Q.length>=e&&t&&t()},i=0;i<n;i++)_(o)}Object.defineProperty(n,"__esModule",{value:!0});var R,O,S,P,D,A,j,M=r(40),I=r.n(M),k=r(77),N=(r.n(k),r(205)),z=(r.n(N),r(26)),L=r(87),U=r(80),F=r(74),G=r(82),B=r(14),W=r(72),V=r(78),H=r(86),q=r(84),X=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Y={clone:r(11)},$={ctx:{image:null,overlay:null},dom:{image:null,overlay:null}},Q=[],J=!0,K={};n.default={init:function(e,t,n){return K=I()({},V.a,e),n?(J=!1,o(n),t()):void i(t)},start:function(){b()},stop:function(){S=!0,T(0),"LiveStream"===K.inputStream.type&&(G.a.release(),R.clearEventHandlers())},pause:function(){S=!0},onDetected:function(e){F.a.subscribe("detected",e)},offDetected:function(e){F.a.unsubscribe("detected",e)},onProcessed:function(e){F.a.subscribe("processed",e)},offProcessed:function(e){F.a.unsubscribe("processed",e)},setReaders:function(e){E(e)},registerResultCollector:function(e){e&&"function"==typeof e.addResult&&(j=e)},canvas:$,decodeSingle:function(e,t){var n=this;e=I()({inputStream:{type:"ImageStream",sequence:!1,size:800,src:e.src},numOfWorkers:1,locator:{halfSample:!1}},e),this.init(e,function(){F.a.once("processed",function(e){n.stop(),t.call(null,e)},!0),b()})},ImageWrapper:z.a,ImageDebug:B.a,ResultCollector:W.a,CameraAccess:G.a}},function(e,t,n){"use strict";function r(e,t){return!!t&&t.some(function(t){return Object.keys(t).every(function(n){return t[n]===e[n]})})}function o(e,t){return"function"!=typeof t||t(e)}var i=n(14);t.a={create:function(e){function t(t){return s&&t&&!r(t,e.blacklist)&&o(t,e.filter)}var n=document.createElement("canvas"),a=n.getContext("2d"),c=[],s=e.capacity||20,u=e.capture===!0;return{addResult:function(e,r,o){var f={};t(o)&&(s--,f.codeResult=o,u&&(n.width=r.x,n.height=r.y,i.a.drawImage(e,r,a),f.frame=n.toDataURL()),c.push(f))},getResults:function(){return c}}}}},function(e,t,n){"use strict";var r={clone:n(11),dot:n(44)};t.a={create:function(e,t){function n(){o(e),i()}function o(e){s[e.id]=e,a.push(e)}function i(){var e,t=0;for(e=0;e<a.length;e++)t+=a[e].rad;c.rad=t/a.length,c.vec=r.clone([Math.cos(c.rad),Math.sin(c.rad)])}var a=[],c={rad:0,vec:r.clone([0,0])},s={};return n(),{add:function(e){s[e.id]||(o(e),i())},fits:function(e){var n=Math.abs(r.dot(e.point.vec,c.vec));return n>t},getPoints:function(){return a},getCenter:function(){return c}}},createPoint:function(e,t,n){return{rad:e[n],point:e,id:t}}}},function(e,t,n){"use strict";t.a=function(){function e(e){return o[e]||(o[e]={subscribers:[]}),o[e]}function t(){o={}}function n(e,t){e.async?setTimeout(function(){e.callback(t)},4):e.callback(t)}function r(t,n,r){var o;if("function"==typeof n)o={callback:n,async:r};else if(o=n,!o.callback)throw"Callback was not specified on options";e(t).subscribers.push(o)}var o={};return{subscribe:function(e,t,n){return r(e,t,n)},publish:function(t,r){var o=e(t),i=o.subscribers;i.filter(function(e){return!!e.once}).forEach(function(e){n(e,r)}),o.subscribers=i.filter(function(e){return!e.once}),o.subscribers.forEach(function(e){n(e,r)})},once:function(e,t,n){r(e,{callback:t,async:n,once:!0})},unsubscribe:function(n,r){var o;n?(o=e(n),o&&r?o.subscribers=o.subscribers.filter(function(e){return e.callback!==r}):o.subscribers=[]):t()}}}()},function(e,t,n){"use strict";function r(){return navigator.mediaDevices&&"function"==typeof navigator.mediaDevices.enumerateDevices?navigator.mediaDevices.enumerateDevices():Promise.reject(new Error("enumerateDevices is not defined"))}function o(e){return navigator.mediaDevices&&"function"==typeof navigator.mediaDevices.getUserMedia?navigator.mediaDevices.getUserMedia(e):Promise.reject(new Error("getUserMedia is not defined"))}t.b=r,t.a=o},function(e,t,n){"use strict";function r(e,t,n){n||(n={data:null,size:t}),this.data=n.data,this.originalSize=n.size,this.I=n,this.from=e,this.size=t}r.prototype.show=function(e,t){var n,r,o,i,a,c,s;for(t||(t=1),n=e.getContext("2d"),e.width=this.size.x,e.height=this.size.y,r=n.getImageData(0,0,e.width,e.height),o=r.data,i=0,a=0;a<this.size.y;a++)for(c=0;c<this.size.x;c++)s=a*this.size.x+c,i=this.get(c,a)*t,o[4*s+0]=i,o[4*s+1]=i,o[4*s+2]=i,o[4*s+3]=255;r.data=o,n.putImageData(r,0,0)},r.prototype.get=function(e,t){return this.data[(this.from.y+t)*this.originalSize.x+this.from.x+e]},r.prototype.updateData=function(e){this.originalSize=e.size,this.data=e.data},r.prototype.updateFrom=function(e){return this.from=e,this},t.a=r},function(e,t){"undefined"!=typeof window&&(window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}()),Math.imul=Math.imul||function(e,t){var n=e>>>16&65535,r=65535&e,o=t>>>16&65535,i=65535&t;return r*i+(n*i+r*o<<16>>>0)|0},"function"!=typeof Object.assign&&(Object.assign=function(e){"use strict";if(null===e)throw new TypeError("Cannot convert undefined or null to object");for(var t=Object(e),n=1;n<arguments.length;n++){var r=arguments[n];if(null!==r)for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])}return t})},function(e,t,n){"use strict";var r=void 0;r=n(79),t.a=r},function(e,t){e.exports={inputStream:{name:"Live",type:"LiveStream",constraints:{width:640,height:480,facingMode:"environment"},area:{top:"0%",right:"0%",left:"0%",bottom:"0%"},singleChannel:!1},locate:!0,numOfWorkers:4,decoder:{readers:["code_128_reader"]},locator:{halfSample:!0,patchSize:"medium"}}},function(e,t,n){"use strict";var r=n(81),o=(n(14),n(91)),i=n(5),a=n(43),c=n(92),s=n(90),u=n(98),f=n(95),d=n(93),l=n(94),p=n(97),h=n(96),v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},g={code_128_reader:o.a,ean_reader:i.a,ean_5_reader:l.a,ean_2_reader:d.a,ean_8_reader:f.a,code_39_reader:a.a,code_39_vin_reader:c.a,codabar_reader:s.a,upc_reader:u.a,upc_e_reader:p.a,i2of5_reader:h.a};t.a={create:function(e,t){function n(){}function o(){e.readers.forEach(function(e){var t,n={},r=[];"object"===("undefined"==typeof e?"undefined":v(e))?(t=e.format,n=e.config):"string"==typeof e&&(t=e),n.supplements&&(r=n.supplements.map(function(e){return new g[e]})),p.push(new g[t](n,r))})}function i(){}function a(e,n,r){function o(t){var r={y:t*Math.sin(n),x:t*Math.cos(n)};e[0].y-=r.y,e[0].x-=r.x,e[1].y+=r.y,e[1].x+=r.x}for(o(r);r>1&&(!t.inImageWithBorder(e[0],0)||!t.inImageWithBorder(e[1],0));)r-=Math.ceil(r/2),o(-r);return e}function c(e){return[{x:(e[1][0]-e[0][0])/2+e[0][0],y:(e[1][1]-e[0][1])/2+e[0][1]},{x:(e[3][0]-e[2][0])/2+e[2][0],y:(e[3][1]-e[2][1])/2+e[2][1]}]}function s(e){var n,o=null,i=r.a.getBarcodeLine(t,e[0],e[1]);for(r.a.toBinaryLine(i),n=0;n<p.length&&null===o;n++)o=p[n].decodePattern(i.line);return null===o?null:{codeResult:o,barcodeLine:i}}function u(e,t,n){var r,o,i,a=Math.sqrt(Math.pow(e[1][0]-e[0][0],2)+Math.pow(e[1][1]-e[0][1],2)),c=16,u=null,f=Math.sin(n),d=Math.cos(n);for(r=1;r<c&&null===u;r++)o=a/c*r*(r%2===0?-1:1),i={y:o*f,x:o*d},t[0].y+=i.x,t[0].x-=i.y,t[1].y+=i.x,t[1].x-=i.y,u=s(t);return u}function f(e){return Math.sqrt(Math.pow(Math.abs(e[1].y-e[0].y),2)+Math.pow(Math.abs(e[1].x-e[0].x),2))}function d(e){var t,n,r,o;l.ctx.overlay;return t=c(e),o=f(t),n=Math.atan2(t[1].y-t[0].y,t[1].x-t[0].x),t=a(t,n,Math.floor(.1*o)),null===t?null:(r=s(t),null===r&&(r=u(e,t,n)),null===r?null:{codeResult:r.codeResult,line:t,angle:n,pattern:r.barcodeLine.line,threshold:r.barcodeLine.threshold})}var l={ctx:{frequency:null,pattern:null,overlay:null},dom:{frequency:null,pattern:null,overlay:null}},p=[];return n(),o(),i(),{decodeFromBoundingBox:function(e){return d(e)},decodeFromBoundingBoxes:function(t){var n,r,o=[],i=e.multiple;for(n=0;n<t.length;n++){var a=t[n];if(r=d(a)||{},r.box=a,i)o.push(r);else if(r.codeResult)return r}if(i)return{barcodes:o}},setReaders:function(t){e.readers=t,p.length=0,o()}}}}},function(e,t,n){"use strict";var r=(n(26),{}),o={DIR:{UP:1,DOWN:-1}};r.getBarcodeLine=function(e,t,n){function r(e,t){d=y[t*b+e],_+=d,w=d<w?d:w,x=d>x?d:x,m.push(d)}var o,i,a,c,s,u,f,d,l=0|t.x,p=0|t.y,h=0|n.x,v=0|n.y,g=Math.abs(v-p)>Math.abs(h-l),m=[],y=e.data,b=e.size.x,_=0,w=255,x=0;for(g&&(u=l,l=p,p=u,u=h,h=v,v=u),l>h&&(u=l,l=h,h=u,u=p,p=v,v=u),o=h-l,i=Math.abs(v-p),a=o/2|0,s=p,c=p<v?1:-1,f=l;f<h;f++)g?r(s,f):r(f,s),a-=i,a<0&&(s+=c,a+=o);return{line:m,min:w,max:x}},r.toBinaryLine=function(e){var t,n,r,i,a,c,s=e.min,u=e.max,f=e.line,d=s+(u-s)/2,l=[],p=(u-s)/12,h=-p;for(r=f[0]>d?o.DIR.UP:o.DIR.DOWN,l.push({pos:0,val:f[0]}),a=0;a<f.length-2;a++)t=f[a+1]-f[a],n=f[a+2]-f[a+1],i=t+n<h&&f[a+1]<1.5*d?o.DIR.DOWN:t+n>p&&f[a+1]>.5*d?o.DIR.UP:r,r!==i&&(l.push({pos:a,val:f[a]}),r=i);for(l.push({pos:f.length,val:f[f.length-1]}),c=l[0].pos;c<l[1].pos;c++)f[c]=f[c]>d?0:1;for(a=1;a<l.length-1;a++)for(p=l[a+1].val>l[a].val?l[a].val+(l[a+1].val-l[a].val)/3*2|0:l[a+1].val+(l[a].val-l[a+1].val)/3|0,c=l[a].pos;c<l[a+1].pos;c++)f[c]=f[c]>p?0:1;return{line:f,threshold:p}},r.debug={printFrequency:function(e,t){var n,r=t.getContext("2d");for(t.width=e.length,t.height=256,r.beginPath(),r.strokeStyle="blue",n=0;n<e.length;n++)r.moveTo(n,255),r.lineTo(n,255-e[n]);r.stroke(),r.closePath()},printPattern:function(e,t){var n,r=t.getContext("2d");for(t.width=e.length,r.fillColor="black",n=0;n<e.length;n++)1===e[n]&&r.fillRect(n,0,1,100)}},t.a=r},function(e,t,n){"use strict";function r(e){return new Promise(function(t,n){function r(){o>0?e.videoWidth>0&&e.videoHeight>0?t():window.setTimeout(r,500):n("Unable to play video stream. Is webcam working?"),o--}var o=10;r()})}function o(e,t){return n.i(h.a)(t).then(function(t){return new Promise(function(n){u=t,e.setAttribute("autoplay","true"),e.srcObject=t,e.addEventListener("loadedmetadata",function(){e.play(),n()})})}).then(r.bind(null,e))}function i(e){var t=d()(e,["width","height","facingMode","aspectRatio","deviceId"]);return"undefined"!=typeof e.minAspectRatio&&e.minAspectRatio>0&&(t.aspectRatio=e.minAspectRatio,console.log("WARNING: Constraint 'minAspectRatio' is deprecated; Use 'aspectRatio' instead")),"undefined"!=typeof e.facing&&(t.facingMode=e.facing,console.log("WARNING: Constraint 'facing' is deprecated. Use 'facingMode' instead'")),t}function a(e){var t=e.video.facingMode,r=g[t];return r?n.i(h.b)().then(function(t){var n=t.filter(function(e){return"videoinput"===e.kind&&r.test(e.label)}).map(function(e){return e.deviceId})[0];return n&&(e=v({},e,{video:v({},p()(e.video,["facingMode"]),{deviceId:n})})),Promise.resolve(e)}):Promise.resolve(e)}function c(e){var t={audio:!1,video:i(e)};return!t.video.deviceId&&"string"==typeof t.video.facingMode&&t.video.facingMode.length>0?a(t):Promise.resolve(t)}function s(){return n.i(h.b)().then(function(e){return e.filter(function(e){return"videoinput"===e.kind})})}var u,f=n(200),d=n.n(f),l=n(199),p=n.n(l),h=n(75),v=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},g={user:/front/i,environment:/back/i};t.a={request:function(e,t){return c(t).then(o.bind(null,e))},release:function(){var e=u&&u.getVideoTracks();e&&e.length&&e[0].stop(),u=null},enumerateVideoDevices:s,getActiveStreamLabel:function(){if(u){var e=u.getVideoTracks();if(e&&e.length)return e[0].label}}}},function(e,t,n){"use strict";function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:l;return/^blob\:/i.test(e)?i(e).then(o).then(function(e){return a(e,t)}):Promise.resolve(null)}function o(e){return new Promise(function(t){var n=new FileReader;n.onload=function(e){return t(e.target.result)},n.readAsArrayBuffer(e)})}function i(e){return new Promise(function(t,n){var r=new XMLHttpRequest;r.open("GET",e,!0),r.responseType="blob",r.onreadystatechange=function(){r.readyState!==XMLHttpRequest.DONE||200!==r.status&&0!==r.status||t(this.response)},r.onerror=n,r.send()})}function a(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:l,n=new DataView(e),r=e.byteLength,o=t.reduce(function(e,t){var n=Object.keys(d).filter(function(e){return d[e]===t})[0];return n&&(e[n]=t),e},{}),i=2,a=void 0;if(255!==n.getUint8(0)||216!==n.getUint8(1))return!1;for(;i<r;){if(255!==n.getUint8(i))return!1;if(a=n.getUint8(i+1),225===a)return c(n,i+4,o);i+=2+n.getUint16(i+2)}}function c(e,t,n){if("Exif"!==f(e,t,4))return!1;var r=t+6,o=void 0,i=void 0;if(18761===e.getUint16(r))o=!1;else{if(19789!==e.getUint16(r))return!1;o=!0}if(42!==e.getUint16(r+2,!o))return!1;var a=e.getUint32(r+4,!o);return!(a<8)&&(i=s(e,r,r+a,n,o))}function s(e,t,n,r,o){for(var i=e.getUint16(n,!o),a={},c=0;c<i;c++){var s=n+12*c+2,f=r[e.getUint16(s,!o)];f&&(a[f]=u(e,s,t,n,o))}return a}function u(e,t,n,r,o){var i=e.getUint16(t+2,!o),a=e.getUint32(t+4,!o);switch(i){case 3:if(1===a)return e.getUint16(t+8,!o)}}function f(e,t,n){for(var r="",o=t;o<t+n;o++)r+=String.fromCharCode(e.getUint8(o));return r}t.a=r;var d={274:"orientation"},l=Object.keys(d).map(function(e){return d[e]})},function(e,t,n){"use strict";function r(e,t){e.width!==t.x&&(e.width=t.x),e.height!==t.y&&(e.height=t.y)}var o=n(25),i=Math.PI/180,a={};a.create=function(e,t){var a,c={},s=e.getConfig(),u=(n.i(o.b)(e.getRealWidth(),e.getRealHeight()),e.getCanvasSize()),f=n.i(o.b)(e.getWidth(),e.getHeight()),d=e.getTopRight(),l=d.x,p=d.y,h=null,v=null;return a=t?t:document.createElement("canvas"),a.width=u.x,a.height=u.y,h=a.getContext("2d"),v=new Uint8Array(f.x*f.y),c.attachData=function(e){v=e},c.getData=function(){return v},c.grab=function(){var t,c=s.halfSample,d=e.getFrame(),g=d,m=0;if(g){if(r(a,u),"ImageStream"===s.type&&(g=d.img,d.tags&&d.tags.orientation))switch(d.tags.orientation){case 6:m=90*i;break;case 8:m=-90*i}return 0!==m?(h.translate(u.x/2,u.y/2),h.rotate(m),h.drawImage(g,-u.y/2,-u.x/2,u.y,u.x),h.rotate(-m),h.translate(-u.x/2,-u.y/2)):h.drawImage(g,0,0,u.x,u.y),t=h.getImageData(l,p,f.x,f.y).data,c?n.i(o.c)(t,f,v):n.i(o.d)(t,v,s),!0}return!1},c.getSize=function(){return f},c},t.a=a},function(e,t,n){"use strict";function r(e,t){e.onload=function(){t.loaded(this)}}var o=n(83),i={};i.load=function(e,t,i,a,c){var s,u,f,d=new Array(a),l=new Array(d.length);if(c===!1)d[0]=e;else for(s=0;s<d.length;s++)f=i+s,d[s]=e+"image-"+("00"+f).slice(-3)+".jpg";for(l.notLoaded=[],l.addImage=function(e){l.notLoaded.push(e)},l.loaded=function(r){for(var i=l.notLoaded,a=0;a<i.length;a++)if(i[a]===r){i.splice(a,1);for(var s=0;s<d.length;s++){var u=d[s].substr(d[s].lastIndexOf("/"));if(r.src.lastIndexOf(u)!==-1){l[s]={img:r};break}}break}0===i.length&&(c===!1?n.i(o.a)(e,["orientation"]).then(function(e){l[0].tags=e,t(l)}).catch(function(e){console.log(e),t(l)}):t(l))},s=0;s<d.length;s++)u=new Image,l.addImage(u),r(u,l),u.src=d[s]},t.a=i},function(e,t,n){"use strict";var r=n(85),o={};o.createVideoStream=function(e){function t(){var t=e.videoWidth,o=e.videoHeight;n=i.size?t/o>1?i.size:Math.floor(t/o*i.size):t,r=i.size?t/o>1?Math.floor(o/t*i.size):i.size:o,u.x=n,u.y=r}var n,r,o={},i=null,a=["canrecord","ended"],c={},s={x:0,y:0},u={x:0,y:0};return o.getRealWidth=function(){return e.videoWidth},o.getRealHeight=function(){return e.videoHeight},o.getWidth=function(){return n},o.getHeight=function(){return r},o.setWidth=function(e){n=e},o.setHeight=function(e){r=e},o.setInputStream=function(t){i=t,e.src="undefined"!=typeof t.src?t.src:""},o.ended=function(){return e.ended},o.getConfig=function(){return i},o.setAttribute=function(t,n){e.setAttribute(t,n)},o.pause=function(){e.pause()},o.play=function(){e.play()},o.setCurrentTime=function(t){"LiveStream"!==i.type&&(e.currentTime=t)},o.addEventListener=function(t,n,r){a.indexOf(t)!==-1?(c[t]||(c[t]=[]),c[t].push(n)):e.addEventListener(t,n,r)},o.clearEventHandlers=function(){a.forEach(function(t){var n=c[t];n&&n.length>0&&n.forEach(function(n){e.removeEventListener(t,n)})})},o.trigger=function(e,n){var r,i=c[e];if("canrecord"===e&&t(),i&&i.length>0)for(r=0;r<i.length;r++)i[r].apply(o,n)},o.setTopRight=function(e){s.x=e.x,s.y=e.y},o.getTopRight=function(){return s},o.setCanvasSize=function(e){u.x=e.x,u.y=e.y},o.getCanvasSize=function(){return u},o.getFrame=function(){return e},o},o.createLiveStream=function(e){e.setAttribute("autoplay",!0);var t=o.createVideoStream(e);return t.ended=function(){return!1},t},o.createImageStream=function(){function e(){d=!1,r.a.load(v,function(e){if(l=e,e[0].tags&&e[0].tags.orientation)switch(e[0].tags.orientation){case 6:case 8:c=e[0].img.height,s=e[0].img.width;break;default:c=e[0].img.width,s=e[0].img.height}else c=e[0].img.width,s=e[0].img.height;n=a.size?c/s>1?a.size:Math.floor(c/s*a.size):c,o=a.size?c/s>1?Math.floor(s/c*a.size):a.size:s,_.x=n,_.y=o,d=!0,u=0,setTimeout(function(){t("canrecord",[])},0)},h,p,a.sequence)}function t(e,t){var n,r=y[e];if(r&&r.length>0)for(n=0;n<r.length;n++)r[n].apply(i,t)}var n,o,i={},a=null,c=0,s=0,u=0,f=!0,d=!1,l=null,p=0,h=1,v=null,g=!1,m=["canrecord","ended"],y={},b={x:0,y:0},_={x:0,y:0};return i.trigger=t,i.getWidth=function(){return n},i.getHeight=function(){return o},i.setWidth=function(e){n=e},i.setHeight=function(e){o=e},i.getRealWidth=function(){return c},i.getRealHeight=function(){return s},i.setInputStream=function(t){a=t,t.sequence===!1?(v=t.src,p=1):(v=t.src,p=t.length),e()},i.ended=function(){return g},i.setAttribute=function(){},i.getConfig=function(){return a},i.pause=function(){f=!0},i.play=function(){f=!1},i.setCurrentTime=function(e){u=e},i.addEventListener=function(e,t){m.indexOf(e)!==-1&&(y[e]||(y[e]=[]),y[e].push(t))},i.setTopRight=function(e){b.x=e.x,b.y=e.y},i.getTopRight=function(){return b},i.setCanvasSize=function(e){_.x=e.x,_.y=e.y},i.getCanvasSize=function(){return _},i.getFrame=function(){var e;return d?(f||(e=l[u],u<p-1?u++:setTimeout(function(){g=!0,t("ended",[])},0)),e):null},i},t.a=o},function(e,t,n){"use strict";(function(e){function r(){var t;v=h.halfSample?new R.a({x:E.size.x/2|0,y:E.size.y/2|0}):E,C=n.i(O.e)(h.patchSize,v.size),k.x=v.size.x/C.x|0,k.y=v.size.y/C.y|0,x=new R.a(v.size,void 0,Uint8Array,!1),y=new R.a(C,void 0,Array,!0),t=new ArrayBuffer(65536),m=new R.a(C,new Uint8Array(t,0,C.x*C.y)),g=new R.a(C,new Uint8Array(t,C.x*C.y*3,C.x*C.y),void 0,!0),T=n.i(A.a)("undefined"!=typeof window?window:"undefined"!=typeof self?self:e,{size:C.x},t),w=new R.a({x:v.size.x/m.size.x|0,y:v.size.y/m.size.y|0},void 0,Array,!0),b=new R.a(w.size,void 0,void 0,!0),_=new R.a(w.size,void 0,Int32Array,!0)}function o(){h.useWorker||"undefined"==typeof document||(I.dom.binary=document.createElement("canvas"),I.dom.binary.className="binaryBuffer",I.ctx.binary=I.dom.binary.getContext("2d"),I.dom.binary.width=x.size.x,I.dom.binary.height=x.size.y)}function i(e){var t,n,r,o,i,a,c,s=x.size.x,u=x.size.y,f=-x.size.x,d=-x.size.y;for(t=0,n=0;n<e.length;n++)o=e[n],t+=o.rad;for(t/=e.length,t=(180*t/Math.PI+90)%180-90,t<0&&(t+=180),t=(180-t)*Math.PI/180,i=M.copy(M.create(),[Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t)]),n=0;n<e.length;n++)for(o=e[n],r=0;r<4;r++)j.transformMat2(o.box[r],o.box[r],i);for(n=0;n<e.length;n++)for(o=e[n],r=0;r<4;r++)o.box[r][0]<s&&(s=o.box[r][0]),o.box[r][0]>f&&(f=o.box[r][0]),o.box[r][1]<u&&(u=o.box[r][1]),o.box[r][1]>d&&(d=o.box[r][1]);for(a=[[s,u],[f,u],[f,d],[s,d]],c=h.halfSample?2:1,i=M.invert(i,i),r=0;r<4;r++)j.transformMat2(a[r],a[r],i);for(r=0;r<4;r++)j.scale(a[r],a[r],c);return a}function a(){n.i(O.f)(v,x),x.zeroBorder()}function c(){var e,t,n,r,o,i,a,c=[];for(e=0;e<k.x;e++)for(t=0;t<k.y;t++)n=m.size.x*e,r=m.size.y*t,d(n,r),g.zeroBorder(),S.a.init(y.data,0),i=P.a.create(g,y),a=i.rasterize(0),o=y.moments(a.count),c=c.concat(l(o,[e,t],n,r));return c}function s(e){var t,n,r=[],o=[];for(t=0;t<e;t++)r.push(0);for(n=_.data.length;n--;)_.data[n]>0&&r[_.data[n]-1]++;return r=r.map(function(e,t){return{val:e,label:t+1}}),r.sort(function(e,t){return t.val-e.val}),o=r.filter(function(e){return e.val>=5})}function u(e,t){var n,r,o,a,c=[],s=[];for(n=0;n<e.length;n++){for(r=_.data.length,c.length=0;r--;)_.data[r]===e[n].label&&(o=w.data[r],c.push(o));a=i(c),a&&s.push(a)}return s}function f(e){var t=n.i(O.g)(e,.9),r=n.i(O.h)(t,1,function(e){return e.getPoints().length}),o=[],i=[];if(1===r.length){o=r[0].item.getPoints();for(var a=0;a<o.length;a++)i.push(o[a].point)}return i}function d(e,t){x.subImageAsCopy(m,n.i(O.b)(e,t)),T.skeletonize()}function l(e,t,n,r){var o,i,a,c,s=[],u=[],d=Math.ceil(C.x/3);if(e.length>=2){for(o=0;o<e.length;o++)e[o].m00>d&&s.push(e[o]);if(s.length>=2){for(a=f(s),i=0,o=0;o<a.length;o++)i+=a[o].rad;a.length>1&&a.length>=s.length/4*3&&a.length>e.length/4&&(i/=a.length,c={index:t[1]*k.x+t[0],pos:{x:n,y:r},box:[j.clone([n,r]),j.clone([n+m.size.x,r]),j.clone([n+m.size.x,r+m.size.y]),j.clone([n,r+m.size.y])],moments:a,rad:i,vec:j.clone([Math.cos(i),Math.sin(i)])},u.push(c))}}return u}function p(e){function t(){var e;for(e=0;e<_.data.length;e++)if(0===_.data[e]&&1===b.data[e])return e;return _.length}function n(e){var t,r,o,c,s,u,f={x:e%_.size.x,y:e/_.size.x|0};if(e<_.data.length)for(o=w.data[e],_.data[e]=i,s=0;s<D.a.searchDirections.length;s++)r=f.y+D.a.searchDirections[s][0],t=f.x+D.a.searchDirections[s][1],c=r*_.size.x+t,0!==b.data[c]?0===_.data[c]&&(u=Math.abs(j.dot(w.data[c].vec,o.vec)),u>a&&n(c)):_.data[c]=Number.MAX_VALUE}var r,o,i=0,a=.95,c=0;for(S.a.init(b.data,0),S.a.init(_.data,0),S.a.init(w.data,null),r=0;r<e.length;r++)o=e[r],w.data[o.index]=o,b.data[o.index]=1;for(b.zeroBorder();(c=t())<_.data.length;)i++,n(c);return i}var h,v,g,m,y,b,_,w,x,C,E,T,R=n(26),O=n(25),S=n(13),P=(n(14),n(88)),D=n(42),A=n(89),j={clone:n(11),dot:n(44),scale:n(102),transformMat2:n(103)},M={copy:n(99),create:n(100),invert:n(101)},I={ctx:{binary:null},dom:{binary:null}},k={x:0,y:0};t.a={init:function(e,t){h=t,E=e,r(),o()},locate:function(){var e,t,r;if(h.halfSample&&n.i(O.i)(E,v),a(),e=c(),e.length<k.x*k.y*.05)return null;var o=p(e);return o<1?null:(t=s(o),0===t.length?null:r=u(t,o))},checkImageConstraints:function(e,t){var r,o,i,a=e.getWidth(),c=e.getHeight(),s=t.halfSample?.5:1;if(e.getConfig().area&&(i=n.i(O.j)(a,c,e.getConfig().area),e.setTopRight({x:i.sx,y:i.sy}),e.setCanvasSize({x:a,y:c}),a=i.sw,c=i.sh),o={x:Math.floor(a*s),y:Math.floor(c*s)},r=n.i(O.e)(t.patchSize,o),e.setWidth(Math.floor(Math.floor(o.x/r.x)*(1/s)*r.x)),e.setHeight(Math.floor(Math.floor(o.y/r.y)*(1/s)*r.y)),e.getWidth()%r.x===0&&e.getHeight()%r.y===0)return!0;throw new Error("Image dimensions do not comply with the current settings: Width ("+a+" )and height ("+c+") must a multiple of "+r.x)}}}).call(t,n(70))},function(e,t,n){"use strict";var r=n(42),o={createContour2D:function(){return{dir:null,index:null,firstVertex:null,insideContours:null,nextpeer:null,prevpeer:null}},CONTOUR_DIR:{CW_DIR:0,CCW_DIR:1,UNKNOWN_DIR:2},DIR:{OUTSIDE_EDGE:-32767,INSIDE_EDGE:-32766},create:function(e,t){var n=e.data,i=t.data,a=e.size.x,c=e.size.y,s=r.a.create(e,t);return{rasterize:function(e){var t,r,u,f,d,l,p,h,v,g,m,y,b=[],_=0;for(y=0;y<400;y++)b[y]=0;for(b[0]=n[0],v=null,l=1;l<c-1;l++)for(f=0,r=b[0],d=1;d<a-1;d++)if(m=l*a+d,0===i[m])if(t=n[m],t!==r){if(0===f)u=_+1,b[u]=t,r=t,p=s.contourTracing(l,d,u,t,o.DIR.OUTSIDE_EDGE),null!==p&&(_++,f=u,h=o.createContour2D(),h.dir=o.CONTOUR_DIR.CW_DIR,h.index=f,h.firstVertex=p,h.nextpeer=v,h.insideContours=null,null!==v&&(v.prevpeer=h),v=h);else if(p=s.contourTracing(l,d,o.DIR.INSIDE_EDGE,t,f),null!==p){for(h=o.createContour2D(),h.firstVertex=p,h.insideContours=null,0===e?h.dir=o.CONTOUR_DIR.CCW_DIR:h.dir=o.CONTOUR_DIR.CW_DIR,h.index=e,g=v;null!==g&&g.index!==f;)g=g.nextpeer;null!==g&&(h.nextpeer=g.insideContours,null!==g.insideContours&&(g.insideContours.prevpeer=h),g.insideContours=h)}}else i[m]=f;else i[m]===o.DIR.OUTSIDE_EDGE||i[m]===o.DIR.INSIDE_EDGE?(f=0,r=i[m]===o.DIR.INSIDE_EDGE?n[m]:b[0]):(f=i[m],r=b[f]);for(g=v;null!==g;)g.index=e,g=g.nextpeer;return{cc:v,count:_}},debug:{drawContour:function(e,t){var n,r,i,a=e.getContext("2d"),c=t;for(a.strokeStyle="red",a.fillStyle="red",a.lineWidth=1,n=null!==c?c.insideContours:null;null!==c;){switch(null!==n?(r=n,n=n.nextpeer):(r=c,c=c.nextpeer,n=null!==c?c.insideContours:null),r.dir){case o.CONTOUR_DIR.CW_DIR:a.strokeStyle="red";break;case o.CONTOUR_DIR.CCW_DIR:a.strokeStyle="blue";break;case o.CONTOUR_DIR.UNKNOWN_DIR:a.strokeStyle="green"}i=r.firstVertex,a.beginPath(),a.moveTo(i.x,i.y);do i=i.next,a.lineTo(i.x,i.y);while(i!==r.firstVertex);a.stroke()}}}}}};t.a=o},function(module, exports, __webpack_require__) {"use strict";function Skeletonizer(stdlib, foreign, buffer) {"use asm";var images=new stdlib.Uint8Array(buffer),size=foreign.size|0,imul=stdlib.Math.imul;function erode(inImagePtr, outImagePtr) {inImagePtr=inImagePtr|0;outImagePtr=outImagePtr|0;var v=0,u=0,sum=0,yStart1=0,yStart2=0,xStart1=0,xStart2=0,offset=0;for (v=1; (v|0)<(size - 1|0); v=v+1|0) {offset=offset+size|0;for (u=1; (u|0)<(size - 1|0); u=u+1|0) {yStart1=offset - size|0;yStart2=offset+size|0;xStart1=u - 1|0;xStart2=u+1|0;sum=(images[inImagePtr+yStart1+xStart1|0]|0)+(images[inImagePtr+yStart1+xStart2|0]|0)+(images[inImagePtr+offset+u|0]|0)+(images[inImagePtr+yStart2+xStart1|0]|0)+(images[inImagePtr+yStart2+xStart2|0]|0)|0;if ((sum|0) == (5|0)) {images[outImagePtr+offset+u|0]=1;} else {images[outImagePtr+offset+u|0]=0;}}}return;}function subtract(aImagePtr, bImagePtr, outImagePtr) {aImagePtr=aImagePtr|0;bImagePtr=bImagePtr|0;outImagePtr=outImagePtr|0;var length=0;length=imul(size, size)|0;while ((length|0)>0) {length=length - 1|0;images[outImagePtr+length|0]=(images[aImagePtr+length|0]|0) - (images[bImagePtr+length|0]|0)|0;}}function bitwiseOr(aImagePtr, bImagePtr, outImagePtr) {aImagePtr=aImagePtr|0;bImagePtr=bImagePtr|0;outImagePtr=outImagePtr|0;var length=0;length=imul(size, size)|0;while ((length|0)>0) {length=length - 1|0;images[outImagePtr+length|0]=images[aImagePtr+length|0]|0|(images[bImagePtr+length|0]|0)|0;}}function countNonZero(imagePtr) {imagePtr=imagePtr|0;var sum=0,length=0;length=imul(size, size)|0;while ((length|0)>0) {length=length - 1|0;sum=(sum|0)+(images[imagePtr+length|0]|0)|0;}return sum|0;}function init(imagePtr, value) {imagePtr=imagePtr|0;value=value|0;var length=0;length=imul(size, size)|0;while ((length|0)>0) {length=length - 1|0;images[imagePtr+length|0]=value;}}function dilate(inImagePtr, outImagePtr) {inImagePtr=inImagePtr|0;outImagePtr=outImagePtr|0;var v=0,u=0,sum=0,yStart1=0,yStart2=0,xStart1=0,xStart2=0,offset=0;for (v=1; (v|0)<(size - 1|0); v=v+1|0) {offset=offset+size|0;for (u=1; (u|0)<(size - 1|0); u=u+1|0) {yStart1=offset - size|0;yStart2=offset+size|0;xStart1=u - 1|0;xStart2=u+1|0;sum=(images[inImagePtr+yStart1+xStart1|0]|0)+(images[inImagePtr+yStart1+xStart2|0]|0)+(images[inImagePtr+offset+u|0]|0)+(images[inImagePtr+yStart2+xStart1|0]|0)+(images[inImagePtr+yStart2+xStart2|0]|0)|0;if ((sum|0)>(0|0)) {images[outImagePtr+offset+u|0]=1;} else {images[outImagePtr+offset+u|0]=0;}}}return;}function memcpy(srcImagePtr, dstImagePtr) {srcImagePtr=srcImagePtr|0;dstImagePtr=dstImagePtr|0;var length=0;length=imul(size, size)|0;while ((length|0)>0) {length=length - 1|0;images[dstImagePtr+length|0]=images[srcImagePtr+length|0]|0;}}function zeroBorder(imagePtr) {imagePtr=imagePtr|0;var x=0,y=0;for (x=0; (x|0)<(size - 1|0); x=x+1|0) {images[imagePtr+x|0]=0;images[imagePtr+y|0]=0;y=y+size - 1|0;images[imagePtr+y|0]=0;y=y+1|0;}for (x=0; (x|0)<(size|0); x=x+1|0) {images[imagePtr+y|0]=0;y=y+1|0;}}function skeletonize() {var subImagePtr=0,erodedImagePtr=0,tempImagePtr=0,skelImagePtr=0,sum=0,done=0;erodedImagePtr=imul(size, size)|0;tempImagePtr=erodedImagePtr+erodedImagePtr|0;skelImagePtr=tempImagePtr+erodedImagePtr|0;init(skelImagePtr, 0);zeroBorder(subImagePtr);do {erode(subImagePtr, erodedImagePtr);dilate(erodedImagePtr, tempImagePtr);subtract(subImagePtr, tempImagePtr, tempImagePtr);bitwiseOr(skelImagePtr, tempImagePtr, skelImagePtr);memcpy(erodedImagePtr, subImagePtr);sum=countNonZero(subImagePtr)|0;done=(sum|0) == 0|0;} while (!done);}return {skeletonize: skeletonize};} exports["a"]=Skeletonizer; },function(e,t,n){"use strict";function r(){o.a.call(this),this._counters=[]}var o=n(10),i={ALPHABETH_STRING:{value:"0123456789-$:/.+ABCD"},ALPHABET:{value:[48,49,50,51,52,53,54,55,56,57,45,36,58,47,46,43,65,66,67,68]},CHARACTER_ENCODINGS:{value:[3,6,9,96,18,66,33,36,48,72,12,24,69,81,84,21,26,41,11,14]},START_END:{value:[26,41,11,14]},MIN_ENCODED_CHARS:{value:4},MAX_ACCEPTABLE:{value:2},PADDING:{value:1.5},FORMAT:{value:"codabar",writeable:!1}};r.prototype=Object.create(o.a.prototype,i),r.prototype.constructor=r,r.prototype._decode=function(){var e,t,n,r,o,i=this,a=[];if(this._counters=i._fillCounters(),e=i._findStart(),!e)return null;r=e.startCounter;do{if(n=i._toPattern(r),n<0)return null;if(t=i._patternToChar(n),t<0)return null;if(a.push(t),r+=8,a.length>1&&i._isStartEnd(n))break}while(r<i._counters.length);return a.length-2<i.MIN_ENCODED_CHARS||!i._isStartEnd(n)?null:i._verifyWhitespace(e.startCounter,r-8)&&i._validateResult(a,e.startCounter)?(r=r>i._counters.length?i._counters.length:r,o=e.start+i._sumCounters(e.startCounter,r-8),{code:a.join(""),start:e.start,end:o,startInfo:e,decodedCodes:a}):null},r.prototype._verifyWhitespace=function(e,t){return(e-1<=0||this._counters[e-1]>=this._calculatePatternLength(e)/2)&&(t+8>=this._counters.length||this._counters[t+7]>=this._calculatePatternLength(t)/2)},r.prototype._calculatePatternLength=function(e){var t,n=0;for(t=e;t<e+7;t++)n+=this._counters[t];return n},r.prototype._thresholdResultPattern=function(e,t){var n,r,o,i,a,c=this,s={space:{narrow:{size:0,counts:0,min:0,max:Number.MAX_VALUE},wide:{size:0,counts:0,min:0,max:Number.MAX_VALUE}},bar:{narrow:{size:0,counts:0,min:0,max:Number.MAX_VALUE},wide:{size:0,counts:0,min:0,max:Number.MAX_VALUE}}},u=t;for(o=0;o<e.length;o++){for(a=c._charToPattern(e[o]),i=6;i>=0;i--)n=2===(1&i)?s.bar:s.space,r=1===(1&a)?n.wide:n.narrow,r.size+=c._counters[u+i],r.counts++,a>>=1;u+=8}return["space","bar"].forEach(function(e){var t=s[e];t.wide.min=Math.floor((t.narrow.size/t.narrow.counts+t.wide.size/t.wide.counts)/2),t.narrow.max=Math.ceil(t.wide.min),t.wide.max=Math.ceil((t.wide.size*c.MAX_ACCEPTABLE+c.PADDING)/t.wide.counts)}),s},r.prototype._charToPattern=function(e){var t,n=this,r=e.charCodeAt(0);for(t=0;t<n.ALPHABET.length;t++)if(n.ALPHABET[t]===r)return n.CHARACTER_ENCODINGS[t];return 0},r.prototype._validateResult=function(e,t){var n,r,o,i,a,c,s=this,u=s._thresholdResultPattern(e,t),f=t;for(n=0;n<e.length;n++){for(c=s._charToPattern(e[n]),r=6;r>=0;r--){if(o=0===(1&r)?u.bar:u.space,i=1===(1&c)?o.wide:o.narrow,a=s._counters[f+r],a<i.min||a>i.max)return!1;c>>=1}f+=8}return!0},r.prototype._patternToChar=function(e){var t,n=this;for(t=0;t<n.CHARACTER_ENCODINGS.length;t++)if(n.CHARACTER_ENCODINGS[t]===e)return String.fromCharCode(n.ALPHABET[t]);return-1},r.prototype._computeAlternatingThreshold=function(e,t){var n,r,o=Number.MAX_VALUE,i=0;for(n=e;n<t;n+=2)r=this._counters[n],r>i&&(i=r),r<o&&(o=r);return(o+i)/2|0},r.prototype._toPattern=function(e){var t,n,r,o,i=7,a=e+i,c=1<<i-1,s=0;if(a>this._counters.length)return-1;for(t=this._computeAlternatingThreshold(e,a),n=this._computeAlternatingThreshold(e+1,a),r=0;r<i;r++)o=0===(1&r)?t:n,this._counters[e+r]>o&&(s|=c),c>>=1;return s},r.prototype._isStartEnd=function(e){var t;for(t=0;t<this.START_END.length;t++)if(this.START_END[t]===e)return!0;return!1},r.prototype._sumCounters=function(e,t){var n,r=0;for(n=e;n<t;n++)r+=this._counters[n];return r},r.prototype._findStart=function(){var e,t,n,r=this,o=r._nextUnset(r._row);for(e=1;e<this._counters.length;e++)if(t=r._toPattern(e),t!==-1&&r._isStartEnd(t))return o+=r._sumCounters(0,e),n=o+r._sumCounters(e,e+8),{start:o,end:n,startCounter:e,endCounter:e+8}},t.a=r},function(e,t,n){"use strict";function r(){i.a.call(this)}function o(e,t,n){for(var r=n.length,o=0,i=0;r--;)i+=e[n[r]],o+=t[n[r]];return i/o}var i=n(10),a={CODE_SHIFT:{value:98},CODE_C:{value:99},CODE_B:{value:100},CODE_A:{value:101},START_CODE_A:{value:103},START_CODE_B:{value:104},START_CODE_C:{value:105},STOP_CODE:{value:106},CODE_PATTERN:{value:[[2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],[1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],[2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],[1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],[2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],[3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],[2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],[1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],[2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1],[1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1],[2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3],[3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1],[3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2],[1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4],[1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1],[2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1],[1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2],[1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1],[2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1],[1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1],[1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4],[2,1,1,2,3,2],[2,3,3,1,1,1,2]]},SINGLE_CODE_ERROR:{value:.64},AVG_CODE_ERROR:{value:.3},FORMAT:{value:"code_128",writeable:!1},MODULE_INDICES:{value:{bar:[0,2,4],space:[1,3,5]}}};r.prototype=Object.create(i.a.prototype,a),r.prototype.constructor=r,r.prototype._decodeCode=function(e,t){var n,r,i,a=[0,0,0,0,0,0],c=this,s=e,u=!c._row[s],f=0,d={error:Number.MAX_VALUE,code:-1,start:e,end:e,correction:{bar:1,space:1}};for(n=s;n<c._row.length;n++)if(c._row[n]^u)a[f]++;else{if(f===a.length-1){for(t&&c._correct(a,t),r=0;r<c.CODE_PATTERN.length;r++)i=c._matchPattern(a,c.CODE_PATTERN[r]),i<d.error&&(d.code=r,d.error=i);return d.end=n,d.code===-1||d.error>c.AVG_CODE_ERROR?null:(c.CODE_PATTERN[d.code]&&(d.correction.bar=o(c.CODE_PATTERN[d.code],a,this.MODULE_INDICES.bar),d.correction.space=o(c.CODE_PATTERN[d.code],a,this.MODULE_INDICES.space)),d)}f++,a[f]=1,u=!u}return null},r.prototype._correct=function(e,t){this._correctBars(e,t.bar,this.MODULE_INDICES.bar),this._correctBars(e,t.space,this.MODULE_INDICES.space)},r.prototype._findStart=function(){var e,t,n,r,i,a=[0,0,0,0,0,0],c=this,s=c._nextSet(c._row),u=!1,f=0,d={error:Number.MAX_VALUE,code:-1,start:0,end:0,correction:{bar:1,space:1}};for(e=s;e<c._row.length;e++)if(c._row[e]^u)a[f]++;else{if(f===a.length-1){for(i=0,r=0;r<a.length;r++)i+=a[r];for(t=c.START_CODE_A;t<=c.START_CODE_C;t++)n=c._matchPattern(a,c.CODE_PATTERN[t]),n<d.error&&(d.code=t,d.error=n);if(d.error<c.AVG_CODE_ERROR)return d.start=e-i,d.end=e,d.correction.bar=o(c.CODE_PATTERN[d.code],a,this.MODULE_INDICES.bar),d.correction.space=o(c.CODE_PATTERN[d.code],a,this.MODULE_INDICES.space),d;for(r=0;r<4;r++)a[r]=a[r+2];a[4]=0,a[5]=0,f--}else f++;a[f]=1,u=!u}return null},r.prototype._decode=function(){var e,t,n=this,r=n._findStart(),o=null,i=!1,a=[],c=0,s=0,u=[],f=[],d=!1,l=!0;if(null===r)return null;switch(o={code:r.code,start:r.start,end:r.end,correction:{bar:r.correction.bar,space:r.correction.space}},f.push(o),s=o.code,o.code){case n.START_CODE_A:e=n.CODE_A;break;case n.START_CODE_B:e=n.CODE_B;break;case n.START_CODE_C:e=n.CODE_C;break;default:return null}for(;!i;){if(t=d,d=!1,o=n._decodeCode(o.end,o.correction),null!==o)switch(o.code!==n.STOP_CODE&&(l=!0),o.code!==n.STOP_CODE&&(u.push(o.code),c++,s+=c*o.code),f.push(o),e){case n.CODE_A:if(o.code<64)a.push(String.fromCharCode(32+o.code));else if(o.code<96)a.push(String.fromCharCode(o.code-64));else switch(o.code!==n.STOP_CODE&&(l=!1),o.code){case n.CODE_SHIFT:d=!0,e=n.CODE_B;break;case n.CODE_B:e=n.CODE_B;break;case n.CODE_C:e=n.CODE_C;break;case n.STOP_CODE:i=!0}break;case n.CODE_B:if(o.code<96)a.push(String.fromCharCode(32+o.code));else switch(o.code!==n.STOP_CODE&&(l=!1),o.code){case n.CODE_SHIFT:d=!0,e=n.CODE_A;break;case n.CODE_A:e=n.CODE_A;break;case n.CODE_C:e=n.CODE_C;break;case n.STOP_CODE:i=!0}break;case n.CODE_C:if(o.code<100)a.push(o.code<10?"0"+o.code:o.code);else switch(o.code!==n.STOP_CODE&&(l=!1),o.code){case n.CODE_A:e=n.CODE_A;break;case n.CODE_B:e=n.CODE_B;break;case n.STOP_CODE:i=!0}}else i=!0;t&&(e=e===n.CODE_A?n.CODE_B:n.CODE_A)}return null===o?null:(o.end=n._nextUnset(n._row,o.end),n._verifyTrailingWhitespace(o)?(s-=c*u[u.length-1],s%103!==u[u.length-1]?null:a.length?(l&&a.splice(a.length-1,1),{code:a.join(""),start:r.start,end:o.end,codeset:e,startInfo:r,decodedCodes:f,endInfo:o}):null):null)},i.a.prototype._verifyTrailingWhitespace=function(e){var t,n=this;return t=e.end+(e.end-e.start)/2,t<n._row.length&&n._matchRange(e.end,t,0)?e:null},t.a=r},function(e,t,n){"use strict";function r(){o.a.call(this)}var o=n(43),i={IOQ:/[IOQ]/g,AZ09:/[A-Z0-9]{17}/};r.prototype=Object.create(o.a.prototype),r.prototype.constructor=r,r.prototype._decode=function(){var e=o.a.prototype._decode.apply(this);if(!e)return null;var t=e.code;return t?(t=t.replace(i.IOQ,""),t.match(i.AZ09)&&this._checkChecksum(t)?(e.code=t,e):null):null},r.prototype._checkChecksum=function(e){return!!e},t.a=r},function(e,t,n){"use strict";function r(){o.a.call(this)}var o=n(5),i={FORMAT:{value:"ean_2",writeable:!1}};r.prototype=Object.create(o.a.prototype,i),r.prototype.constructor=r,r.prototype.decode=function(e,t){this._row=e;var n,r=0,o=0,i=t,a=this._row.length,c=[],s=[];for(o=0;o<2&&i<a;o++){if(n=this._decodeCode(i),!n)return null;s.push(n),c.push(n.code%10),n.code>=this.CODE_G_START&&(r|=1<<1-o),1!=o&&(i=this._nextSet(this._row,n.end),i=this._nextUnset(this._row,i))}return 2!=c.length||parseInt(c.join(""))%4!==r?null:{code:c.join(""),decodedCodes:s,end:n.end}},t.a=r},function(e,t,n){"use strict";function r(){a.a.call(this)}function o(e){var t;for(t=0;t<10;t++)if(e===s[t])return t;return null}function i(e){var t,n=e.length,r=0;for(t=n-2;t>=0;t-=2)r+=e[t];for(r*=3,t=n-1;t>=0;t-=2)r+=e[t];return r*=3,r%10}var a=n(5),c={FORMAT:{value:"ean_5",writeable:!1}},s=[24,20,18,17,12,6,3,10,9,5];r.prototype=Object.create(a.a.prototype,c),r.prototype.constructor=r,r.prototype.decode=function(e,t){this._row=e;var n,r=0,a=0,c=t,s=this._row.length,u=[],f=[];for(a=0;a<5&&c<s;a++){if(n=this._decodeCode(c),!n)return null;f.push(n),u.push(n.code%10),n.code>=this.CODE_G_START&&(r|=1<<4-a),4!=a&&(c=this._nextSet(this._row,n.end),c=this._nextUnset(this._row,c))}return 5!=u.length?null:i(u)!==o(r)?null:{code:u.join(""),decodedCodes:f,end:n.end}},t.a=r},function(e,t,n){"use strict";function r(e,t){o.a.call(this,e,t)}var o=n(5),i={FORMAT:{value:"ean_8",writeable:!1}};r.prototype=Object.create(o.a.prototype,i),r.prototype.constructor=r,r.prototype._decodePayload=function(e,t,n){var r,o=this;for(r=0;r<4;r++){if(e=o._decodeCode(e.end,o.CODE_G_START),!e)return null;t.push(e.code),n.push(e)}if(e=o._findPattern(o.MIDDLE_PATTERN,e.end,!0,!1),null===e)return null;for(n.push(e),r=0;r<4;r++){if(e=o._decodeCode(e.end,o.CODE_G_START),!e)return null;n.push(e),t.push(e.code)}return e},t.a=r},function(e,t,n){"use strict";function r(e){e=a()(o(),e),c.a.call(this,e),this.barSpaceRatio=[1,1],e.normalizeBarSpaceWidth&&(this.SINGLE_CODE_ERROR=.38,this.AVG_CODE_ERROR=.09)}function o(){var e={};return Object.keys(r.CONFIG_KEYS).forEach(function(t){e[t]=r.CONFIG_KEYS[t].default}),e}var i=n(40),a=n.n(i),c=n(10),s=1,u=3,f={START_PATTERN:{value:[s,s,s,s]},STOP_PATTERN:{value:[s,s,u]},CODE_PATTERN:{value:[[s,s,u,u,s],[u,s,s,s,u],[s,u,s,s,u],[u,u,s,s,s],[s,s,u,s,u],[u,s,u,s,s],[s,u,u,s,s],[s,s,s,u,u],[u,s,s,u,s],[s,u,s,u,s]]},SINGLE_CODE_ERROR:{value:.78,writable:!0},AVG_CODE_ERROR:{value:.38,writable:!0},MAX_CORRECTION_FACTOR:{value:5},FORMAT:{value:"i2of5"}};r.prototype=Object.create(c.a.prototype,f),r.prototype.constructor=r,r.prototype._matchPattern=function(e,t){if(this.config.normalizeBarSpaceWidth){var n,r=[0,0],o=[0,0],i=[0,0],a=this.MAX_CORRECTION_FACTOR,s=1/a;for(n=0;n<e.length;n++)r[n%2]+=e[n],o[n%2]+=t[n];for(i[0]=o[0]/r[0],i[1]=o[1]/r[1],i[0]=Math.max(Math.min(i[0],a),s),i[1]=Math.max(Math.min(i[1],a),s),this.barSpaceRatio=i,n=0;n<e.length;n++)e[n]*=this.barSpaceRatio[n%2]}return c.a.prototype._matchPattern.call(this,e,t)},r.prototype._findPattern=function(e,t,n,r){var o,i,a,c,s=[],u=this,f=0,d={error:Number.MAX_VALUE,code:-1,start:0,end:0},l=u.AVG_CODE_ERROR;for(n=n||!1,r=r||!1,t||(t=u._nextSet(u._row)),o=0;o<e.length;o++)s[o]=0;for(o=t;o<u._row.length;o++)if(u._row[o]^n)s[f]++;else{if(f===s.length-1){for(c=0,a=0;a<s.length;a++)c+=s[a];if(i=u._matchPattern(s,e),i<l)return d.error=i,d.start=o-c,d.end=o,d;if(!r)return null;for(a=0;a<s.length-2;a++)s[a]=s[a+2];s[s.length-2]=0,s[s.length-1]=0,f--}else f++;s[f]=1,n=!n}return null},r.prototype._findStart=function(){for(var e,t,n=this,r=n._nextSet(n._row),o=1;!t;){if(t=n._findPattern(n.START_PATTERN,r,!1,!0),!t)return null;if(o=Math.floor((t.end-t.start)/4),e=t.start-10*o,e>=0&&n._matchRange(e,t.start,0))return t;r=t.end,t=null}},r.prototype._verifyTrailingWhitespace=function(e){var t,n=this;return t=e.end+(e.end-e.start)/2,t<n._row.length&&n._matchRange(e.end,t,0)?e:null},r.prototype._findEnd=function(){var e,t,n=this;return n._row.reverse(),e=n._findPattern(n.STOP_PATTERN),n._row.reverse(),null===e?null:(t=e.start,e.start=n._row.length-e.end,e.end=n._row.length-t,null!==e?n._verifyTrailingWhitespace(e):null)},r.prototype._decodePair=function(e){var t,n,r=[],o=this;for(t=0;t<e.length;t++){if(n=o._decodeCode(e[t]),!n)return null;r.push(n)}return r},r.prototype._decodeCode=function(e){var t,n,r,o=this,i=0,a=o.AVG_CODE_ERROR,c={error:Number.MAX_VALUE,code:-1,start:0,end:0};for(t=0;t<e.length;t++)i+=e[t];for(r=0;r<o.CODE_PATTERN.length;r++)n=o._matchPattern(e,o.CODE_PATTERN[r]),n<c.error&&(c.code=r,c.error=n);if(c.error<a)return c},r.prototype._decodePayload=function(e,t,n){for(var r,o,i=this,a=0,c=e.length,s=[[0,0,0,0,0],[0,0,0,0,0]];a<c;){for(r=0;r<5;r++)s[0][r]=e[a]*this.barSpaceRatio[0],s[1][r]=e[a+1]*this.barSpaceRatio[1],a+=2;if(o=i._decodePair(s),!o)return null;for(r=0;r<o.length;r++)t.push(o[r].code+""),n.push(o[r])}return o},r.prototype._verifyCounterLength=function(e){return e.length%10===0},r.prototype._decode=function(){var e,t,n,r,o=this,i=[],a=[];return(e=o._findStart())?(a.push(e),(t=o._findEnd())?(r=o._fillCounters(e.end,t.start,!1),o._verifyCounterLength(r)&&(n=o._decodePayload(r,i,a))?i.length%2!==0||i.length<6?null:(a.push(t),{code:i.join(""),start:e.start,end:t.end,startInfo:e,decodedCodes:a}):null):null):null},r.CONFIG_KEYS={normalizeBarSpaceWidth:{type:"boolean",default:!1,description:"If true, the reader tries to normalize thewidth-difference between bars and spaces"}},t.a=r},function(e,t,n){"use strict";function r(e,t){o.a.call(this,e,t)}var o=n(5),i={CODE_FREQUENCY:{value:[[56,52,50,49,44,38,35,42,41,37],[7,11,13,14,19,25,28,21,22,26]]},STOP_PATTERN:{value:[1/6*7,1/6*7,1/6*7,1/6*7,1/6*7,1/6*7]},FORMAT:{value:"upc_e",writeable:!1}};r.prototype=Object.create(o.a.prototype,i),r.prototype.constructor=r,r.prototype._decodePayload=function(e,t,n){var r,o=this,i=0;for(r=0;r<6;r++){if(e=o._decodeCode(e.end),!e)return null;e.code>=o.CODE_G_START&&(e.code=e.code-o.CODE_G_START,i|=1<<5-r),t.push(e.code),n.push(e)}return o._determineParity(i,t)?e:null},r.prototype._determineParity=function(e,t){var n,r;for(r=0;r<this.CODE_FREQUENCY.length;r++)for(n=0;n<this.CODE_FREQUENCY[r].length;n++)if(e===this.CODE_FREQUENCY[r][n])return t.unshift(r),t.push(n),!0;return!1},r.prototype._convertToUPCA=function(e){var t=[e[0]],n=e[e.length-2];return t=n<=2?t.concat(e.slice(1,3)).concat([n,0,0,0,0]).concat(e.slice(3,6)):3===n?t.concat(e.slice(1,4)).concat([0,0,0,0,0]).concat(e.slice(4,6)):4===n?t.concat(e.slice(1,5)).concat([0,0,0,0,0,e[5]]):t.concat(e.slice(1,6)).concat([0,0,0,0,n]),t.push(e[e.length-1]),t},r.prototype._checksum=function(e){return o.a.prototype._checksum.call(this,this._convertToUPCA(e))},r.prototype._findEnd=function(e,t){return t=!0,o.a.prototype._findEnd.call(this,e,t)},r.prototype._verifyTrailingWhitespace=function(e){var t,n=this;if(t=e.end+(e.end-e.start)/2,t<n._row.length&&n._matchRange(e.end,t,0))return e},t.a=r},function(e,t,n){"use strict";function r(e,t){o.a.call(this,e,t)}var o=n(5),i={FORMAT:{value:"upc_a",writeable:!1}};r.prototype=Object.create(o.a.prototype,i),r.prototype.constructor=r,r.prototype._decode=function(){var e=o.a.prototype._decode.call(this);return e&&e.code&&13===e.code.length&&"0"===e.code.charAt(0)?(e.code=e.code.substring(1),e):null},t.a=r},function(e,t){function n(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}e.exports=n},function(e,t){function n(){var e=new Float32Array(4);return e[0]=1,e[1]=0,e[2]=0,e[3]=1,e}e.exports=n},function(e,t){function n(e,t){var n=t[0],r=t[1],o=t[2],i=t[3],a=n*i-o*r;return a?(a=1/a,e[0]=i*a,e[1]=-r*a,e[2]=-o*a,e[3]=n*a,e):null}e.exports=n},function(e,t){function n(e,t,n){return e[0]=t[0]*n,e[1]=t[1]*n,e}e.exports=n},function(e,t){function n(e,t,n){var r=t[0],o=t[1];return e[0]=n[0]*r+n[2]*o,e[1]=n[1]*r+n[3]*o,e}e.exports=n},function(e,t){function n(e){var t=new Float32Array(3);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}e.exports=n},function(e,t,n){var r=n(4),o=n(1),i=r(o,"DataView");e.exports=i},function(e,t,n){function r(e){var t=-1,n=null==e?0:e.length;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(156),i=n(157),a=n(158),c=n(159),s=n(160);r.prototype.clear=o,r.prototype.delete=i,r.prototype.get=a,r.prototype.has=c,r.prototype.set=s,e.exports=r},function(e,t,n){var r=n(4),o=n(1),i=r(o,"Promise");e.exports=i},function(e,t,n){var r=n(4),o=n(1),i=r(o,"Set");e.exports=i},function(e,t,n){var r=n(1),o=r.Uint8Array;e.exports=o},function(e,t,n){var r=n(4),o=n(1),i=r(o,"WeakMap");e.exports=i},function(e,t){function n(e,t){return e.set(t[0],t[1]),e}e.exports=n},function(e,t){function n(e,t){return e.add(t),e}e.exports=n},function(e,t){function n(e,t,n){switch(n.length){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}e.exports=n},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length;++n<r&&t(e[n],n,e)!==!1;);return e}e.exports=n},function(e,t){function n(e,t){for(var n=-1,r=null==e?0:e.length,o=0,i=[];++n<r;){var a=e[n];t(a,n,e)&&(i[o++]=a)}return i}e.exports=n},function(e,t,n){function r(e,t){return e&&o(t,i(t),e)}var o=n(8),i=n(39);e.exports=r},function(e,t,n){function r(e,t){return e&&o(t,i(t),e)}var o=n(8),i=n(24);e.exports=r},function(e,t,n){function r(e,t,n,O,S,P){var D,M=t&C,I=t&E,N=t&T;if(n&&(D=S?n(e,O,S,P):n(e)),void 0!==D)return D;if(!w(e))return e;var z=b(e);if(z){if(D=g(e),!M)return f(e,D)}else{var L=v(e),U=L==A||L==j;if(_(e))return u(e,M);if(L==k||L==R||U&&!S){if(D=I||U?{}:y(e),!M)return I?l(e,s(D,e)):d(e,c(D,e))}else{if(!K[L])return S?e:{};D=m(e,L,r,M)}}P||(P=new o);var F=P.get(e);if(F)return F;P.set(e,D);var G=N?I?h:p:I?keysIn:x,B=z?void 0:G(e);return i(B||e,function(o,i){B&&(i=o,o=e[i]),a(D,i,r(o,t,n,i,e,P))}),D}var o=n(46),i=n(114),a=n(29),c=n(116),s=n(117),u=n(53),f=n(55),d=n(145),l=n(146),p=n(151),h=n(59),v=n(153),g=n(161),m=n(162),y=n(61),b=n(2),_=n(35),w=n(3),x=n(39),C=1,E=2,T=4,R="[object Arguments]",O="[object Array]",S="[object Boolean]",P="[object Date]",D="[object Error]",A="[object Function]",j="[object GeneratorFunction]",M="[object Map]",I="[object Number]",k="[object Object]",N="[object RegExp]",z="[object Set]",L="[object String]",U="[object Symbol]",F="[object WeakMap]",G="[object ArrayBuffer]",B="[object DataView]",W="[object Float32Array]",V="[object Float64Array]",H="[object Int8Array]",q="[object Int16Array]",X="[object Int32Array]",Y="[object Uint8Array]",$="[object Uint8ClampedArray]",Q="[object Uint16Array]",J="[object Uint32Array]",K={};K[R]=K[O]=K[G]=K[B]=K[S]=K[P]=K[W]=K[V]=K[H]=K[q]=K[X]=K[M]=K[I]=K[k]=K[N]=K[z]=K[L]=K[U]=K[Y]=K[$]=K[Q]=K[J]=!0,K[D]=K[A]=K[F]=!1,e.exports=r},function(e,t,n){var r=n(3),o=Object.create,i=function(){function e(){}return function(t){if(!r(t))return{};if(o)return o(t);e.prototype=t;var n=new e;return e.prototype=void 0,n}}();e.exports=i},function(e,t,n){function r(e,t,n,a,c){var s=-1,u=e.length;for(n||(n=i),c||(c=[]);++s<u;){var f=e[s];t>0&&n(f)?t>1?r(f,t-1,n,a,c):o(c,f):a||(c[c.length]=f)}return c}var o=n(28),i=n(163);e.exports=r},function(e,t,n){var r=n(149),o=r();e.exports=o},function(e,t){function n(e,t){return null!=e&&t in Object(e)}e.exports=n},function(e,t,n){function r(e){return i(e)&&o(e)==a}var o=n(6),i=n(9),a="[object Arguments]";e.exports=r},function(e,t,n){function r(e){if(!a(e)||i(e))return!1;var t=o(e)?h:u;return t.test(c(e))}var o=n(36),i=n(167),a=n(3),c=n(65),s=/[\\^$.*+?()[\]{}|]/g,u=/^\[object .+?Constructor\]$/,f=Function.prototype,d=Object.prototype,l=f.toString,p=d.hasOwnProperty,h=RegExp("^"+l.call(p).replace(s,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=r},function(e,t,n){function r(e){return a(e)&&i(e.length)&&!!A[o(e)]}var o=n(6),i=n(37),a=n(9),c="[object Arguments]",s="[object Array]",u="[object Boolean]",f="[object Date]",d="[object Error]",l="[object Function]",p="[object Map]",h="[object Number]",v="[object Object]",g="[object RegExp]",m="[object Set]",y="[object String]",b="[object WeakMap]",_="[object ArrayBuffer]",w="[object DataView]",x="[object Float32Array]",C="[object Float64Array]",E="[object Int8Array]",T="[object Int16Array]",R="[object Int32Array]",O="[object Uint8Array]",S="[object Uint8ClampedArray]",P="[object Uint16Array]",D="[object Uint32Array]",A={};A[x]=A[C]=A[E]=A[T]=A[R]=A[O]=A[S]=A[P]=A[D]=!0,A[c]=A[s]=A[_]=A[u]=A[w]=A[f]=A[d]=A[l]=A[p]=A[h]=A[v]=A[g]=A[m]=A[y]=A[b]=!1,e.exports=r},function(e,t,n){function r(e){if(!o(e))return i(e);var t=[];for(var n in Object(e))c.call(e,n)&&"constructor"!=n&&t.push(n);return t}var o=n(34),i=n(180),a=Object.prototype,c=a.hasOwnProperty;e.exports=r},function(e,t,n){function r(e){if(!o(e))return a(e);var t=i(e),n=[];for(var r in e)("constructor"!=r||!t&&s.call(e,r))&&n.push(r);return n}var o=n(3),i=n(34),a=n(181),c=Object.prototype,s=c.hasOwnProperty;e.exports=r},function(e,t,n){function r(e,t,n,f,d){e!==t&&a(t,function(a,u){if(s(a))d||(d=new o),c(e,t,u,n,r,f,d);else{var l=f?f(e[u],a,u+"",e,t,d):void 0;void 0===l&&(l=a),i(e,u,l)}},u)}var o=n(46),i=n(50),a=n(121),c=n(129),s=n(3),u=n(24);e.exports=r},function(e,t,n){function r(e,t,n,r,y,b,_){var w=e[n],x=t[n],C=_.get(x);if(C)return void o(e,n,C);var E=b?b(w,x,n+"",e,t,_):void 0,T=void 0===E;if(T){var R=f(x),O=!R&&l(x),S=!R&&!O&&g(x);E=x,R||O||S?f(w)?E=w:d(w)?E=c(w):O?(T=!1,E=i(x,!0)):S?(T=!1,E=a(x,!0)):E=[]:v(x)||u(x)?(E=w,u(w)?E=m(w):(!h(w)||r&&p(w))&&(E=s(x))):T=!1}T&&(_.set(x,E),y(E,x,r,b,_),_.delete(x)),o(e,n,E)}var o=n(50),i=n(53),a=n(54),c=n(55),s=n(61),u=n(22),f=n(2),d=n(196),l=n(35),p=n(36),h=n(3),v=n(67),g=n(68),m=n(202);e.exports=r},function(e,t,n){function r(e,t){return o(e,t,function(t,n){return i(e,n)})}var o=n(131),i=n(195);e.exports=r},function(e,t,n){function r(e,t,n){for(var r=-1,c=t.length,s={};++r<c;){var u=t[r],f=o(e,u);n(f,u)&&i(s,a(u,e),f)}return s}var o=n(51),i=n(133),a=n(7);e.exports=r},function(e,t,n){function r(e,t){return a(i(e,t,o),e+"")}var o=n(66),i=n(63),a=n(64);e.exports=r},function(e,t,n){function r(e,t,n,r){if(!c(e))return e;t=i(t,e);for(var u=-1,f=t.length,d=f-1,l=e;null!=l&&++u<f;){var p=s(t[u]),h=n;if(u!=d){var v=l[p];h=r?r(v,p,l):void 0,void 0===h&&(h=c(v)?v:a(t[u+1])?[]:{})}o(l,p,h),l=l[p]}return e}var o=n(29),i=n(7),a=n(18),c=n(3),s=n(20);e.exports=r},function(e,t,n){var r=n(193),o=n(56),i=n(66),a=o?function(e,t){return o(e,"toString",{configurable:!0,enumerable:!1,value:r(t),writable:!0})}:i;e.exports=a},function(e,t){function n(e,t,n){var r=-1,o=e.length;t<0&&(t=-t>o?0:o+t),n=n>o?o:n,n<0&&(n+=o),o=t>n?0:n-t>>>0,t>>>=0;for(var i=Array(o);++r<o;)i[r]=e[r+t];return i}e.exports=n},function(e,t){function n(e,t){for(var n=-1,r=Array(e);++n<e;)r[n]=t(n);return r}e.exports=n},function(e,t,n){function r(e){if("string"==typeof e)return e;if(a(e))return i(e,r)+"";if(c(e))return f?f.call(e):"";var t=e+"";return"0"==t&&1/e==-s?"-0":t}var o=n(12),i=n(48),a=n(2),c=n(38),s=1/0,u=o?o.prototype:void 0,f=u?u.toString:void 0;e.exports=r},function(e,t){function n(e){return function(t){return e(t)}}e.exports=n},function(e,t,n){function r(e,t){return t=o(t,e),e=a(e,t),null==e||delete e[c(i(t))]}var o=n(7),i=n(197),a=n(184),c=n(20);e.exports=r},function(e,t,n){function r(e,t){var n=t?o(e.buffer):e.buffer;return new e.constructor(n,e.byteOffset,e.byteLength)}var o=n(31);e.exports=r},function(e,t,n){function r(e,t,n){var r=t?n(a(e),c):a(e);return i(r,o,new e.constructor)}var o=n(111),i=n(49),a=n(178),c=1;e.exports=r},function(e,t){function n(e){var t=new e.constructor(e.source,r.exec(e));return t.lastIndex=e.lastIndex,t}var r=/\w*$/;e.exports=n},function(e,t,n){function r(e,t,n){var r=t?n(a(e),c):a(e);return i(r,o,new e.constructor)}var o=n(112),i=n(49),a=n(185),c=1;e.exports=r},function(e,t,n){function r(e){return a?Object(a.call(e)):{}}var o=n(12),i=o?o.prototype:void 0,a=i?i.valueOf:void 0;e.exports=r},function(e,t,n){function r(e,t){return o(e,i(e),t)}var o=n(8),i=n(33);e.exports=r},function(e,t,n){function r(e,t){return o(e,i(e),t)}var o=n(8),i=n(60);e.exports=r},function(e,t,n){var r=n(1),o=r["__core-js_shared__"];e.exports=o},function(e,t,n){function r(e){return o(function(t,n){var r=-1,o=n.length,a=o>1?n[o-1]:void 0,c=o>2?n[2]:void 0;for(a=e.length>3&&"function"==typeof a?(o--,a):void 0,c&&i(n[0],n[1],c)&&(a=o<3?void 0:a,o=1),t=Object(t);++r<o;){var s=n[r];s&&e(t,s,r,a)}return t})}var o=n(132),i=n(164);e.exports=r},function(e,t){function n(e){return function(t,n,r){for(var o=-1,i=Object(t),a=r(t),c=a.length;c--;){var s=a[e?c:++o];if(n(i[s],s,i)===!1)break}return t}}e.exports=n},function(e,t,n){function r(e){return o(e)?void 0:e}var o=n(67);e.exports=r},function(e,t,n){function r(e){return o(e,a,i)}var o=n(52),i=n(33),a=n(39);e.exports=r},function(e,t,n){function r(e){var t=a.call(e,s),n=e[s];try{e[s]=void 0;var r=!0}catch(e){}var o=c.call(e);return r&&(t?e[s]=n:delete e[s]),o}var o=n(12),i=Object.prototype,a=i.hasOwnProperty,c=i.toString,s=o?o.toStringTag:void 0;e.exports=r},function(e,t,n){var r=n(105),o=n(27),i=n(107),a=n(108),c=n(110),s=n(6),u=n(65),f="[object Map]",d="[object Object]",l="[object Promise]",p="[object Set]",h="[object WeakMap]",v="[object DataView]",g=u(r),m=u(o),y=u(i),b=u(a),_=u(c),w=s;(r&&w(new r(new ArrayBuffer(1)))!=v||o&&w(new o)!=f||i&&w(i.resolve())!=l||a&&w(new a)!=p||c&&w(new c)!=h)&&(w=function(e){var t=s(e),n=t==d?e.constructor:void 0,r=n?u(n):"";if(r)switch(r){case g:return v;case m:return f;case y:return l;case b:return p;case _:return h}return t}),e.exports=w},function(e,t){function n(e,t){return null==e?void 0:e[t]}e.exports=n},function(e,t,n){function r(e,t,n){t=o(t,e);for(var r=-1,f=t.length,d=!1;++r<f;){var l=u(t[r]);if(!(d=null!=e&&n(e,l)))break;e=e[l]}return d||++r!=f?d:(f=null==e?0:e.length,!!f&&s(f)&&c(l,f)&&(a(e)||i(e)))}var o=n(7),i=n(22),a=n(2),c=n(18),s=n(37),u=n(20);e.exports=r},function(e,t,n){function r(){this.__data__=o?o(null):{},this.size=0}var o=n(19);e.exports=r},function(e,t){function n(e){var t=this.has(e)&&delete this.__data__[e];return this.size-=t?1:0,t}e.exports=n},function(e,t,n){function r(e){var t=this.__data__;if(o){var n=t[e];return n===i?void 0:n}return c.call(t,e)?t[e]:void 0}var o=n(19),i="__lodash_hash_undefined__",a=Object.prototype,c=a.hasOwnProperty;e.exports=r},function(e,t,n){function r(e){var t=this.__data__;return o?void 0!==t[e]:a.call(t,e)}var o=n(19),i=Object.prototype,a=i.hasOwnProperty;e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__;return this.size+=this.has(e)?0:1,n[e]=o&&void 0===t?i:t,this}var o=n(19),i="__lodash_hash_undefined__";e.exports=r},function(e,t){function n(e){var t=e.length,n=e.constructor(t);return t&&"string"==typeof e[0]&&o.call(e,"index")&&(n.index=e.index,n.input=e.input),n}var r=Object.prototype,o=r.hasOwnProperty;e.exports=n},function(e,t,n){function r(e,t,n,r){var D=e.constructor;switch(t){case b:return o(e);case d:case l:return new D(+e);case _:return i(e,r);case w:case x:case C:case E:case T:case R:case O:case S:case P:return f(e,r);case p:return a(e,r,n);case h:case m:return new D(e);case v:return c(e);case g:return s(e,r,n);case y:return u(e)}}var o=n(31),i=n(140),a=n(141),c=n(142),s=n(143),u=n(144),f=n(54),d="[object Boolean]",l="[object Date]",p="[object Map]",h="[object Number]",v="[object RegExp]",g="[object Set]",m="[object String]",y="[object Symbol]",b="[object ArrayBuffer]",_="[object DataView]",w="[object Float32Array]",x="[object Float64Array]",C="[object Int8Array]",E="[object Int16Array]",T="[object Int32Array]",R="[object Uint8Array]",O="[object Uint8ClampedArray]",S="[object Uint16Array]",P="[object Uint32Array]";e.exports=r},function(e,t,n){function r(e){return a(e)||i(e)||!!(c&&e&&e[c])}var o=n(12),i=n(22),a=n(2),c=o?o.isConcatSpreadable:void 0;e.exports=r},function(e,t,n){function r(e,t,n){if(!c(n))return!1;var r=typeof t;return!!("number"==r?i(n)&&a(t,n.length):"string"==r&&t in n)&&o(n[t],e)}var o=n(21),i=n(23),a=n(18),c=n(3);e.exports=r},function(e,t,n){function r(e,t){if(o(e))return!1;var n=typeof e;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!i(e))||(c.test(e)||!a.test(e)||null!=t&&e in Object(t))}var o=n(2),i=n(38),a=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,c=/^\w*$/;e.exports=r},function(e,t){function n(e){var t=typeof e;return"string"==t||"number"==t||"symbol"==t||"boolean"==t?"__proto__"!==e:null===e}e.exports=n},function(e,t,n){function r(e){return!!i&&i in e}var o=n(147),i=function(){var e=/[^.]+$/.exec(o&&o.keys&&o.keys.IE_PROTO||"");return e?"Symbol(src)_1."+e:""}();e.exports=r},function(e,t){function n(){this.__data__=[],this.size=0}e.exports=n},function(e,t,n){function r(e){var t=this.__data__,n=o(t,e);if(n<0)return!1;var r=t.length-1;return n==r?t.pop():a.call(t,n,1),--this.size,!0}var o=n(16),i=Array.prototype,a=i.splice;e.exports=r},function(e,t,n){function r(e){var t=this.__data__,n=o(t,e);return n<0?void 0:t[n][1]}var o=n(16);e.exports=r},function(e,t,n){function r(e){return o(this.__data__,e)>-1}var o=n(16);e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__,r=o(n,e);return r<0?(++this.size,n.push([e,t])):n[r][1]=t,this}var o=n(16);e.exports=r},function(e,t,n){function r(){this.size=0,this.__data__={hash:new o,map:new(a||i),string:new o}}var o=n(106),i=n(15),a=n(27);e.exports=r},function(e,t,n){function r(e){var t=o(this,e).delete(e);return this.size-=t?1:0,t}var o=n(17);e.exports=r},function(e,t,n){function r(e){return o(this,e).get(e)}var o=n(17);e.exports=r},function(e,t,n){function r(e){return o(this,e).has(e)}var o=n(17);e.exports=r},function(e,t,n){function r(e,t){var n=o(this,e),r=n.size;return n.set(e,t),this.size+=n.size==r?0:1,this}var o=n(17);e.exports=r},function(e,t){function n(e){var t=-1,n=Array(e.size);return e.forEach(function(e,r){n[++t]=[r,e]}),n}e.exports=n},function(e,t,n){function r(e){var t=o(e,function(e){return n.size===i&&n.clear(),e}),n=t.cache;return t}var o=n(198),i=500;e.exports=r},function(e,t,n){var r=n(62),o=r(Object.keys,Object);e.exports=o},function(e,t){function n(e){var t=[];if(null!=e)for(var n in Object(e))t.push(n);return t}e.exports=n},function(e,t,n){(function(e){var r=n(58),o="object"==typeof t&&t&&!t.nodeType&&t,i=o&&"object"==typeof e&&e&&!e.nodeType&&e,a=i&&i.exports===o,c=a&&r.process,s=function(){try{return c&&c.binding&&c.binding("util")}catch(e){}}();e.exports=s}).call(t,n(41)(e))},function(e,t){function n(e){return o.call(e)}var r=Object.prototype,o=r.toString;e.exports=n},function(e,t,n){function r(e,t){return t.length<2?e:o(e,i(t,0,-1))}var o=n(51),i=n(135);e.exports=r},function(e,t){function n(e){var t=-1,n=Array(e.size);
return e.forEach(function(e){n[++t]=e}),n}e.exports=n},function(e,t){function n(e){var t=0,n=0;return function(){var a=i(),c=o-(a-n);if(n=a,c>0){if(++t>=r)return arguments[0]}else t=0;return e.apply(void 0,arguments)}}var r=800,o=16,i=Date.now;e.exports=n},function(e,t,n){function r(){this.__data__=new o,this.size=0}var o=n(15);e.exports=r},function(e,t){function n(e){var t=this.__data__,n=t.delete(e);return this.size=t.size,n}e.exports=n},function(e,t){function n(e){return this.__data__.get(e)}e.exports=n},function(e,t){function n(e){return this.__data__.has(e)}e.exports=n},function(e,t,n){function r(e,t){var n=this.__data__;if(n instanceof o){var r=n.__data__;if(!i||r.length<c-1)return r.push([e,t]),this.size=++n.size,this;n=this.__data__=new a(r)}return n.set(e,t),this.size=n.size,this}var o=n(15),i=n(27),a=n(45),c=200;e.exports=r},function(e,t,n){var r=n(179),o=/^\./,i=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,a=/\\(\\)?/g,c=r(function(e){var t=[];return o.test(e)&&t.push(""),e.replace(i,function(e,n,r,o){t.push(r?o.replace(a,"$1"):n||e)}),t});e.exports=c},function(e,t){function n(e){return function(){return e}}e.exports=n},function(e,t,n){function r(e){var t=null==e?0:e.length;return t?o(e,1):[]}var o=n(120);e.exports=r},function(e,t,n){function r(e,t){return null!=e&&i(e,t,o)}var o=n(122),i=n(155);e.exports=r},function(e,t,n){function r(e){return i(e)&&o(e)}var o=n(23),i=n(9);e.exports=r},function(e,t){function n(e){var t=null==e?0:e.length;return t?e[t-1]:void 0}e.exports=n},function(e,t,n){function r(e,t){if("function"!=typeof e||null!=t&&"function"!=typeof t)throw new TypeError(i);var n=function(){var r=arguments,o=t?t.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var a=e.apply(this,r);return n.cache=i.set(o,a)||i,a};return n.cache=new(r.Cache||o),n}var o=n(45),i="Expected a function";r.Cache=o,e.exports=r},function(e,t,n){var r=n(48),o=n(118),i=n(139),a=n(7),c=n(8),s=n(150),u=n(57),f=n(59),d=1,l=2,p=4,h=u(function(e,t){var n={};if(null==e)return n;var u=!1;t=r(t,function(t){return t=a(t,e),u||(u=t.length>1),t}),c(e,f(e),n),u&&(n=o(n,d|l|p,s));for(var h=t.length;h--;)i(n,t[h]);return n});e.exports=h},function(e,t,n){var r=n(130),o=n(57),i=o(function(e,t){return null==e?{}:r(e,t)});e.exports=i},function(e,t){function n(){return!1}e.exports=n},function(e,t,n){function r(e){return o(e,i(e))}var o=n(8),i=n(24);e.exports=r},function(e,t,n){function r(e){return null==e?"":o(e)}var o=n(137);e.exports=r},function(e,t,n){"use strict";var r={};r.generateIdentifier=function(){return Math.random().toString(36).substr(2,10)},r.localCName=r.generateIdentifier(),r.splitLines=function(e){return e.trim().split("\n").map(function(e){return e.trim()})},r.splitSections=function(e){var t=e.split("\nm=");return t.map(function(e,t){return(t>0?"m="+e:e).trim()+"\r\n"})},r.matchPrefix=function(e,t){return r.splitLines(e).filter(function(e){return 0===e.indexOf(t)})},r.parseCandidate=function(e){var t;t=0===e.indexOf("a=candidate:")?e.substring(12).split(" "):e.substring(10).split(" ");for(var n={foundation:t[0],component:t[1],protocol:t[2].toLowerCase(),priority:parseInt(t[3],10),ip:t[4],port:parseInt(t[5],10),type:t[7]},r=8;r<t.length;r+=2)switch(t[r]){case"raddr":n.relatedAddress=t[r+1];break;case"rport":n.relatedPort=parseInt(t[r+1],10);break;case"tcptype":n.tcpType=t[r+1]}return n},r.writeCandidate=function(e){var t=[];t.push(e.foundation),t.push(e.component),t.push(e.protocol.toUpperCase()),t.push(e.priority),t.push(e.ip),t.push(e.port);var n=e.type;return t.push("typ"),t.push(n),"host"!==n&&e.relatedAddress&&e.relatedPort&&(t.push("raddr"),t.push(e.relatedAddress),t.push("rport"),t.push(e.relatedPort)),e.tcpType&&"tcp"===e.protocol.toLowerCase()&&(t.push("tcptype"),t.push(e.tcpType)),"candidate:"+t.join(" ")},r.parseRtpMap=function(e){var t=e.substr(9).split(" "),n={payloadType:parseInt(t.shift(),10)};return t=t[0].split("/"),n.name=t[0],n.clockRate=parseInt(t[1],10),n.numChannels=3===t.length?parseInt(t[2],10):1,n},r.writeRtpMap=function(e){var t=e.payloadType;return void 0!==e.preferredPayloadType&&(t=e.preferredPayloadType),"a=rtpmap:"+t+" "+e.name+"/"+e.clockRate+(1!==e.numChannels?"/"+e.numChannels:"")+"\r\n"},r.parseExtmap=function(e){var t=e.substr(9).split(" ");return{id:parseInt(t[0],10),uri:t[1]}},r.writeExtmap=function(e){return"a=extmap:"+(e.id||e.preferredId)+" "+e.uri+"\r\n"},r.parseFmtp=function(e){for(var t,n={},r=e.substr(e.indexOf(" ")+1).split(";"),o=0;o<r.length;o++)t=r[o].trim().split("="),n[t[0].trim()]=t[1];return n},r.writeFmtp=function(e){var t="",n=e.payloadType;if(void 0!==e.preferredPayloadType&&(n=e.preferredPayloadType),e.parameters&&Object.keys(e.parameters).length){var r=[];Object.keys(e.parameters).forEach(function(t){r.push(t+"="+e.parameters[t])}),t+="a=fmtp:"+n+" "+r.join(";")+"\r\n"}return t},r.parseRtcpFb=function(e){var t=e.substr(e.indexOf(" ")+1).split(" ");return{type:t.shift(),parameter:t.join(" ")}},r.writeRtcpFb=function(e){var t="",n=e.payloadType;return void 0!==e.preferredPayloadType&&(n=e.preferredPayloadType),e.rtcpFeedback&&e.rtcpFeedback.length&&e.rtcpFeedback.forEach(function(e){t+="a=rtcp-fb:"+n+" "+e.type+(e.parameter&&e.parameter.length?" "+e.parameter:"")+"\r\n"}),t},r.parseSsrcMedia=function(e){var t=e.indexOf(" "),n={ssrc:parseInt(e.substr(7,t-7),10)},r=e.indexOf(":",t);return r>-1?(n.attribute=e.substr(t+1,r-t-1),n.value=e.substr(r+1)):n.attribute=e.substr(t+1),n},r.getDtlsParameters=function(e,t){var n=r.splitLines(e);n=n.concat(r.splitLines(t));var o=n.filter(function(e){return 0===e.indexOf("a=fingerprint:")})[0].substr(14),i={role:"auto",fingerprints:[{algorithm:o.split(" ")[0],value:o.split(" ")[1]}]};return i},r.writeDtlsParameters=function(e,t){var n="a=setup:"+t+"\r\n";return e.fingerprints.forEach(function(e){n+="a=fingerprint:"+e.algorithm+" "+e.value+"\r\n"}),n},r.getIceParameters=function(e,t){var n=r.splitLines(e);n=n.concat(r.splitLines(t));var o={usernameFragment:n.filter(function(e){return 0===e.indexOf("a=ice-ufrag:")})[0].substr(12),password:n.filter(function(e){return 0===e.indexOf("a=ice-pwd:")})[0].substr(10)};return o},r.writeIceParameters=function(e){return"a=ice-ufrag:"+e.usernameFragment+"\r\na=ice-pwd:"+e.password+"\r\n"},r.parseRtpParameters=function(e){for(var t={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},n=r.splitLines(e),o=n[0].split(" "),i=3;i<o.length;i++){var a=o[i],c=r.matchPrefix(e,"a=rtpmap:"+a+" ")[0];if(c){var s=r.parseRtpMap(c),u=r.matchPrefix(e,"a=fmtp:"+a+" ");switch(s.parameters=u.length?r.parseFmtp(u[0]):{},s.rtcpFeedback=r.matchPrefix(e,"a=rtcp-fb:"+a+" ").map(r.parseRtcpFb),t.codecs.push(s),s.name.toUpperCase()){case"RED":case"ULPFEC":t.fecMechanisms.push(s.name.toUpperCase())}}}return r.matchPrefix(e,"a=extmap:").forEach(function(e){t.headerExtensions.push(r.parseExtmap(e))}),t},r.writeRtpDescription=function(e,t){var n="";return n+="m="+e+" ",n+=t.codecs.length>0?"9":"0",n+=" UDP/TLS/RTP/SAVPF ",n+=t.codecs.map(function(e){return void 0!==e.preferredPayloadType?e.preferredPayloadType:e.payloadType}).join(" ")+"\r\n",n+="c=IN IP4 0.0.0.0\r\n",n+="a=rtcp:9 IN IP4 0.0.0.0\r\n",t.codecs.forEach(function(e){n+=r.writeRtpMap(e),n+=r.writeFmtp(e),n+=r.writeRtcpFb(e)}),n+="a=rtcp-mux\r\n",t.headerExtensions.forEach(function(e){n+=r.writeExtmap(e)}),n},r.parseRtpEncodingParameters=function(e){var t,n=[],o=r.parseRtpParameters(e),i=o.fecMechanisms.indexOf("RED")!==-1,a=o.fecMechanisms.indexOf("ULPFEC")!==-1,c=r.matchPrefix(e,"a=ssrc:").map(function(e){return r.parseSsrcMedia(e)}).filter(function(e){return"cname"===e.attribute}),s=c.length>0&&c[0].ssrc,u=r.matchPrefix(e,"a=ssrc-group:FID").map(function(e){var t=e.split(" ");return t.shift(),t.map(function(e){return parseInt(e,10)})});u.length>0&&u[0].length>1&&u[0][0]===s&&(t=u[0][1]),o.codecs.forEach(function(e){if("RTX"===e.name.toUpperCase()&&e.parameters.apt){var r={ssrc:s,codecPayloadType:parseInt(e.parameters.apt,10),rtx:{payloadType:e.payloadType,ssrc:t}};n.push(r),i&&(r=JSON.parse(JSON.stringify(r)),r.fec={ssrc:t,mechanism:a?"red+ulpfec":"red"},n.push(r))}}),0===n.length&&s&&n.push({ssrc:s});var f=r.matchPrefix(e,"b=");return f.length&&(0===f[0].indexOf("b=TIAS:")?f=parseInt(f[0].substr(7),10):0===f[0].indexOf("b=AS:")&&(f=parseInt(f[0].substr(5),10)),n.forEach(function(e){e.maxBitrate=f})),n},r.writeSessionBoilerplate=function(){return"v=0\r\no=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n"},r.writeMediaSection=function(e,t,n,o){var i=r.writeRtpDescription(e.kind,t);if(i+=r.writeIceParameters(e.iceGatherer.getLocalParameters()),i+=r.writeDtlsParameters(e.dtlsTransport.getLocalParameters(),"offer"===n?"actpass":"active"),i+="a=mid:"+e.mid+"\r\n",i+=e.rtpSender&&e.rtpReceiver?"a=sendrecv\r\n":e.rtpSender?"a=sendonly\r\n":e.rtpReceiver?"a=recvonly\r\n":"a=inactive\r\n",e.rtpSender){var a="msid:"+o.id+" "+e.rtpSender.track.id+"\r\n";i+="a="+a,i+="a=ssrc:"+e.sendEncodingParameters[0].ssrc+" "+a}return i+="a=ssrc:"+e.sendEncodingParameters[0].ssrc+" cname:"+r.localCName+"\r\n"},r.getDirection=function(e,t){for(var n=r.splitLines(e),o=0;o<n.length;o++)switch(n[o]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return n[o].substr(2)}return t?r.getDirection(t):"sendrecv"},e.exports=r},function(e,t,n){"use strict";!function(){var t=n(0).log,r=n(0).browserDetails;e.exports.browserDetails=r,e.exports.extractVersion=n(0).extractVersion,e.exports.disableLog=n(0).disableLog;var o=n(206)||null,i=n(208)||null,a=n(210)||null,c=n(212)||null;switch(r.browser){case"opera":case"chrome":if(!o||!o.shimPeerConnection)return void t("Chrome shim is not included in this adapter release.");t("adapter.js shimming chrome."),e.exports.browserShim=o,o.shimGetUserMedia(),o.shimMediaStream(),o.shimSourceObject(),o.shimPeerConnection(),o.shimOnTrack();break;case"firefox":if(!a||!a.shimPeerConnection)return void t("Firefox shim is not included in this adapter release.");t("adapter.js shimming firefox."),e.exports.browserShim=a,a.shimGetUserMedia(),a.shimSourceObject(),a.shimPeerConnection(),a.shimOnTrack();break;case"edge":if(!i||!i.shimPeerConnection)return void t("MS edge shim is not included in this adapter release.");t("adapter.js shimming edge."),e.exports.browserShim=i,i.shimGetUserMedia(),i.shimPeerConnection();break;case"safari":if(!c)return void t("Safari shim is not included in this adapter release.");t("adapter.js shimming safari."),e.exports.browserShim=c,c.shimGetUserMedia();break;default:t("Unsupported browser!")}}()},function(e,t,n){"use strict";var r=n(0).log,o=n(0).browserDetails,i={shimMediaStream:function(){window.MediaStream=window.MediaStream||window.webkitMediaStream},shimOnTrack:function(){"object"!=typeof window||!window.RTCPeerConnection||"ontrack"in window.RTCPeerConnection.prototype||Object.defineProperty(window.RTCPeerConnection.prototype,"ontrack",{get:function(){return this._ontrack},set:function(e){var t=this;this._ontrack&&(this.removeEventListener("track",this._ontrack),this.removeEventListener("addstream",this._ontrackpoly)),this.addEventListener("track",this._ontrack=e),this.addEventListener("addstream",this._ontrackpoly=function(e){e.stream.addEventListener("addtrack",function(n){var r=new Event("track");r.track=n.track,r.receiver={track:n.track},r.streams=[e.stream],t.dispatchEvent(r)}),e.stream.getTracks().forEach(function(t){var n=new Event("track");n.track=t,n.receiver={track:t},n.streams=[e.stream],this.dispatchEvent(n)}.bind(this))}.bind(this))}})},shimSourceObject:function(){"object"==typeof window&&(!window.HTMLMediaElement||"srcObject"in window.HTMLMediaElement.prototype||Object.defineProperty(window.HTMLMediaElement.prototype,"srcObject",{get:function(){return this._srcObject},set:function(e){var t=this;return this._srcObject=e,this.src&&URL.revokeObjectURL(this.src),e?(this.src=URL.createObjectURL(e),e.addEventListener("addtrack",function(){t.src&&URL.revokeObjectURL(t.src),t.src=URL.createObjectURL(e)}),void e.addEventListener("removetrack",function(){t.src&&URL.revokeObjectURL(t.src),t.src=URL.createObjectURL(e)})):void(this.src="")}}))},shimPeerConnection:function(){window.RTCPeerConnection=function(e,t){r("PeerConnection"),e&&e.iceTransportPolicy&&(e.iceTransports=e.iceTransportPolicy);var n=new webkitRTCPeerConnection(e,t),o=n.getStats.bind(n);return n.getStats=function(e,t,n){var r=this,i=arguments;if(arguments.length>0&&"function"==typeof e)return o(e,t);var a=function(e){var t={},n=e.result();return n.forEach(function(e){var n={id:e.id,timestamp:e.timestamp,type:e.type};e.names().forEach(function(t){n[t]=e.stat(t)}),t[n.id]=n}),t},c=function(e,t){var n=new Map(Object.keys(e).map(function(t){return[t,e[t]]}));return t=t||e,Object.keys(t).forEach(function(e){n[e]=t[e]}),n};if(arguments.length>=2){var s=function(e){i[1](c(a(e)))};return o.apply(this,[s,arguments[0]])}return new Promise(function(t,n){1===i.length&&"object"==typeof e?o.apply(r,[function(e){t(c(a(e)))},n]):o.apply(r,[function(e){t(c(a(e),e.result()))},n])}).then(t,n)},n},window.RTCPeerConnection.prototype=webkitRTCPeerConnection.prototype,webkitRTCPeerConnection.generateCertificate&&Object.defineProperty(window.RTCPeerConnection,"generateCertificate",{get:function(){return webkitRTCPeerConnection.generateCertificate}}),["createOffer","createAnswer"].forEach(function(e){var t=webkitRTCPeerConnection.prototype[e];webkitRTCPeerConnection.prototype[e]=function(){var e=this;if(arguments.length<1||1===arguments.length&&"object"==typeof arguments[0]){var n=1===arguments.length?arguments[0]:void 0;return new Promise(function(r,o){t.apply(e,[r,o,n])})}return t.apply(this,arguments)}}),o.version<51&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(e){var t=webkitRTCPeerConnection.prototype[e];webkitRTCPeerConnection.prototype[e]=function(){var e=arguments,n=this,r=new Promise(function(r,o){t.apply(n,[e[0],r,o])});return e.length<2?r:r.then(function(){e[1].apply(null,[])},function(t){e.length>=3&&e[2].apply(null,[t])})}}),["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(e){var t=webkitRTCPeerConnection.prototype[e];webkitRTCPeerConnection.prototype[e]=function(){return arguments[0]=new("addIceCandidate"===e?RTCIceCandidate:RTCSessionDescription)(arguments[0]),t.apply(this,arguments)}});var e=RTCPeerConnection.prototype.addIceCandidate;RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?e.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())}}};e.exports={shimMediaStream:i.shimMediaStream,shimOnTrack:i.shimOnTrack,shimSourceObject:i.shimSourceObject,shimPeerConnection:i.shimPeerConnection,shimGetUserMedia:n(207)}},function(e,t,n){"use strict";var r=n(0).log;e.exports=function(){var e=function(e){if("object"!=typeof e||e.mandatory||e.optional)return e;var t={};return Object.keys(e).forEach(function(n){if("require"!==n&&"advanced"!==n&&"mediaSource"!==n){var r="object"==typeof e[n]?e[n]:{ideal:e[n]};void 0!==r.exact&&"number"==typeof r.exact&&(r.min=r.max=r.exact);var o=function(e,t){return e?e+t.charAt(0).toUpperCase()+t.slice(1):"deviceId"===t?"sourceId":t};if(void 0!==r.ideal){t.optional=t.optional||[];var i={};"number"==typeof r.ideal?(i[o("min",n)]=r.ideal,t.optional.push(i),i={},i[o("max",n)]=r.ideal,t.optional.push(i)):(i[o("",n)]=r.ideal,t.optional.push(i))}void 0!==r.exact&&"number"!=typeof r.exact?(t.mandatory=t.mandatory||{},t.mandatory[o("",n)]=r.exact):["min","max"].forEach(function(e){void 0!==r[e]&&(t.mandatory=t.mandatory||{},t.mandatory[o(e,n)]=r[e])})}}),e.advanced&&(t.optional=(t.optional||[]).concat(e.advanced)),t},t=function(t,n){if(t=JSON.parse(JSON.stringify(t)),t&&t.audio&&(t.audio=e(t.audio)),t&&"object"==typeof t.video){var o=t.video.facingMode;if(o=o&&("object"==typeof o?o:{ideal:o}),o&&("user"===o.exact||"environment"===o.exact||"user"===o.ideal||"environment"===o.ideal)&&(!navigator.mediaDevices.getSupportedConstraints||!navigator.mediaDevices.getSupportedConstraints().facingMode)&&(delete t.video.facingMode,"environment"===o.exact||"environment"===o.ideal))return navigator.mediaDevices.enumerateDevices().then(function(i){i=i.filter(function(e){return"videoinput"===e.kind});var a=i.find(function(e){return e.label.toLowerCase().indexOf("back")!==-1})||i.length&&i[i.length-1];return a&&(t.video.deviceId=o.exact?{exact:a.deviceId}:{ideal:a.deviceId}),t.video=e(t.video),r("chrome: "+JSON.stringify(t)),n(t)});t.video=e(t.video)}return r("chrome: "+JSON.stringify(t)),n(t)},n=function(e){return{name:{PermissionDeniedError:"NotAllowedError",ConstraintNotSatisfiedError:"OverconstrainedError"}[e.name]||e.name,message:e.message,constraint:e.constraintName,toString:function(){return this.name+(this.message&&": ")+this.message}}},o=function(e,r,o){t(e,function(e){navigator.webkitGetUserMedia(e,r,function(e){o(n(e))})})};navigator.getUserMedia=o;var i=function(e){return new Promise(function(t,n){navigator.getUserMedia(e,t,n)})};if(navigator.mediaDevices||(navigator.mediaDevices={getUserMedia:i,enumerateDevices:function(){return new Promise(function(e){var t={audio:"audioinput",video:"videoinput"};return MediaStreamTrack.getSources(function(n){e(n.map(function(e){return{label:e.label,kind:t[e.kind],deviceId:e.id,groupId:""}}))})})}}),navigator.mediaDevices.getUserMedia){var a=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=function(e){return t(e,function(e){return a(e).then(function(t){if(e.audio&&!t.getAudioTracks().length||e.video&&!t.getVideoTracks().length)throw t.getTracks().forEach(function(e){e.stop()}),new DOMException("","NotFoundError");return t},function(e){return Promise.reject(n(e))})})}}else navigator.mediaDevices.getUserMedia=function(e){return i(e)};"undefined"==typeof navigator.mediaDevices.addEventListener&&(navigator.mediaDevices.addEventListener=function(){r("Dummy mediaDevices.addEventListener called.")}),"undefined"==typeof navigator.mediaDevices.removeEventListener&&(navigator.mediaDevices.removeEventListener=function(){r("Dummy mediaDevices.removeEventListener called.")})}},function(e,t,n){"use strict";var r=n(204),o=n(0).browserDetails,i={shimPeerConnection:function(){if(window.RTCIceGatherer){window.RTCIceCandidate||(window.RTCIceCandidate=function(e){return e}),window.RTCSessionDescription||(window.RTCSessionDescription=function(e){return e});var e=Object.getOwnPropertyDescriptor(MediaStreamTrack.prototype,"enabled");Object.defineProperty(MediaStreamTrack.prototype,"enabled",{set:function(t){e.set.call(this,t);var n=new Event("enabled");n.enabled=t,this.dispatchEvent(n)}})}window.RTCPeerConnection=function(e){var t=this,n=document.createDocumentFragment();if(["addEventListener","removeEventListener","dispatchEvent"].forEach(function(e){t[e]=n[e].bind(n)}),this.onicecandidate=null,this.onaddstream=null,this.ontrack=null,this.onremovestream=null,this.onsignalingstatechange=null,this.oniceconnectionstatechange=null,this.onnegotiationneeded=null,this.ondatachannel=null,this.localStreams=[],this.remoteStreams=[],this.getLocalStreams=function(){return t.localStreams},this.getRemoteStreams=function(){return t.remoteStreams},this.localDescription=new RTCSessionDescription({type:"",sdp:""}),this.remoteDescription=new RTCSessionDescription({type:"",sdp:""}),this.signalingState="stable",this.iceConnectionState="new",this.iceGatheringState="new",this.iceOptions={gatherPolicy:"all",iceServers:[]},e&&e.iceTransportPolicy)switch(e.iceTransportPolicy){case"all":case"relay":this.iceOptions.gatherPolicy=e.iceTransportPolicy;break;case"none":throw new TypeError('iceTransportPolicy "none" not supported')}if(this.usingBundle=e&&"max-bundle"===e.bundlePolicy,e&&e.iceServers){var r=JSON.parse(JSON.stringify(e.iceServers));this.iceOptions.iceServers=r.filter(function(e){if(e&&e.urls){var t=e.urls;return"string"==typeof t&&(t=[t]),t=t.filter(function(e){return 0===e.indexOf("turn:")&&e.indexOf("transport=udp")!==-1&&e.indexOf("turn:[")===-1||0===e.indexOf("stun:")&&o.version>=14393})[0],!!t}return!1})}this._config=e,this.transceivers=[],this._localIceCandidatesBuffer=[]},window.RTCPeerConnection.prototype._emitBufferedCandidates=function(){var e=this,t=r.splitSections(e.localDescription.sdp);this._localIceCandidatesBuffer.forEach(function(n){var r=!n.candidate||0===Object.keys(n.candidate).length;if(r)for(var o=1;o<t.length;o++)t[o].indexOf("\r\na=end-of-candidates\r\n")===-1&&(t[o]+="a=end-of-candidates\r\n");else n.candidate.candidate.indexOf("typ endOfCandidates")===-1&&(t[n.candidate.sdpMLineIndex+1]+="a="+n.candidate.candidate+"\r\n");if(e.localDescription.sdp=t.join(""),e.dispatchEvent(n),null!==e.onicecandidate&&e.onicecandidate(n),!n.candidate&&"complete"!==e.iceGatheringState){var i=e.transceivers.every(function(e){return e.iceGatherer&&"completed"===e.iceGatherer.state});i&&(e.iceGatheringState="complete")}}),this._localIceCandidatesBuffer=[]},window.RTCPeerConnection.prototype.getConfiguration=function(){return this._config},window.RTCPeerConnection.prototype.addStream=function(e){var t=e.clone();e.getTracks().forEach(function(e,n){var r=t.getTracks()[n];e.addEventListener("enabled",function(e){r.enabled=e.enabled})}),this.localStreams.push(t),this._maybeFireNegotiationNeeded()},window.RTCPeerConnection.prototype.removeStream=function(e){var t=this.localStreams.indexOf(e);t>-1&&(this.localStreams.splice(t,1),this._maybeFireNegotiationNeeded())},window.RTCPeerConnection.prototype.getSenders=function(){return this.transceivers.filter(function(e){return!!e.rtpSender}).map(function(e){return e.rtpSender})},window.RTCPeerConnection.prototype.getReceivers=function(){return this.transceivers.filter(function(e){return!!e.rtpReceiver}).map(function(e){return e.rtpReceiver})},window.RTCPeerConnection.prototype._getCommonCapabilities=function(e,t){var n={codecs:[],headerExtensions:[],fecMechanisms:[]};return e.codecs.forEach(function(e){for(var r=0;r<t.codecs.length;r++){var o=t.codecs[r];if(e.name.toLowerCase()===o.name.toLowerCase()&&e.clockRate===o.clockRate){o.numChannels=Math.min(e.numChannels,o.numChannels),n.codecs.push(o),o.rtcpFeedback=o.rtcpFeedback.filter(function(t){for(var n=0;n<e.rtcpFeedback.length;n++)if(e.rtcpFeedback[n].type===t.type&&e.rtcpFeedback[n].parameter===t.parameter)return!0;return!1});break}}}),e.headerExtensions.forEach(function(e){for(var r=0;r<t.headerExtensions.length;r++){var o=t.headerExtensions[r];if(e.uri===o.uri){n.headerExtensions.push(o);break}}}),n},window.RTCPeerConnection.prototype._createIceAndDtlsTransports=function(e,t){var n=this,o=new RTCIceGatherer(n.iceOptions),i=new RTCIceTransport(o);o.onlocalcandidate=function(a){var c=new Event("icecandidate");c.candidate={sdpMid:e,sdpMLineIndex:t};var s=a.candidate,u=!s||0===Object.keys(s).length;u?(void 0===o.state&&(o.state="completed"),c.candidate.candidate="candidate:1 1 udp 1 0.0.0.0 9 typ endOfCandidates"):(s.component="RTCP"===i.component?2:1,c.candidate.candidate=r.writeCandidate(s));var f=r.splitSections(n.localDescription.sdp);c.candidate.candidate.indexOf("typ endOfCandidates")===-1?f[c.candidate.sdpMLineIndex+1]+="a="+c.candidate.candidate+"\r\n":f[c.candidate.sdpMLineIndex+1]+="a=end-of-candidates\r\n",n.localDescription.sdp=f.join("");var d=n.transceivers.every(function(e){return e.iceGatherer&&"completed"===e.iceGatherer.state});switch(n.iceGatheringState){case"new":n._localIceCandidatesBuffer.push(c),u&&d&&n._localIceCandidatesBuffer.push(new Event("icecandidate"));break;case"gathering":n._emitBufferedCandidates(),n.dispatchEvent(c),null!==n.onicecandidate&&n.onicecandidate(c),d&&(n.dispatchEvent(new Event("icecandidate")),null!==n.onicecandidate&&n.onicecandidate(new Event("icecandidate")),n.iceGatheringState="complete");break;case"complete":}},i.onicestatechange=function(){n._updateConnectionState()};var a=new RTCDtlsTransport(i);return a.ondtlsstatechange=function(){n._updateConnectionState()},a.onerror=function(){a.state="failed",n._updateConnectionState()},{iceGatherer:o,iceTransport:i,dtlsTransport:a}},window.RTCPeerConnection.prototype._transceive=function(e,t,n){var o=this._getCommonCapabilities(e.localCapabilities,e.remoteCapabilities);t&&e.rtpSender&&(o.encodings=e.sendEncodingParameters,o.rtcp={cname:r.localCName},e.recvEncodingParameters.length&&(o.rtcp.ssrc=e.recvEncodingParameters[0].ssrc),e.rtpSender.send(o)),n&&e.rtpReceiver&&("video"===e.kind&&e.recvEncodingParameters&&e.recvEncodingParameters.forEach(function(e){delete e.rtx}),o.encodings=e.recvEncodingParameters,o.rtcp={cname:e.cname},e.sendEncodingParameters.length&&(o.rtcp.ssrc=e.sendEncodingParameters[0].ssrc),e.rtpReceiver.receive(o))},window.RTCPeerConnection.prototype.setLocalDescription=function(e){var t,n,o=this;if("offer"===e.type)this._pendingOffer&&(t=r.splitSections(e.sdp),n=t.shift(),t.forEach(function(e,t){var n=r.parseRtpParameters(e);o._pendingOffer[t].localCapabilities=n}),this.transceivers=this._pendingOffer,delete this._pendingOffer);else if("answer"===e.type){t=r.splitSections(o.remoteDescription.sdp),n=t.shift();var i=r.matchPrefix(n,"a=ice-lite").length>0;t.forEach(function(e,t){var a=o.transceivers[t],c=a.iceGatherer,s=a.iceTransport,u=a.dtlsTransport,f=a.localCapabilities,d=a.remoteCapabilities,l="0"===e.split("\n",1)[0].split(" ",2)[1];if(!l&&!a.isDatachannel){var p=r.getIceParameters(e,n);if(i){var h=r.matchPrefix(e,"a=candidate:").map(function(e){return r.parseCandidate(e)}).filter(function(e){return"1"===e.component});h.length&&s.setRemoteCandidates(h)}var v=r.getDtlsParameters(e,n);i&&(v.role="server"),o.usingBundle&&0!==t||(s.start(c,p,i?"controlling":"controlled"),u.start(v));var g=o._getCommonCapabilities(f,d);o._transceive(a,g.codecs.length>0,!1)}})}switch(this.localDescription={type:e.type,sdp:e.sdp},e.type){case"offer":this._updateSignalingState("have-local-offer");break;case"answer":this._updateSignalingState("stable");break;default:throw new TypeError('unsupported type "'+e.type+'"')}var a=arguments.length>1&&"function"==typeof arguments[1];if(a){var c=arguments[1];window.setTimeout(function(){c(),"new"===o.iceGatheringState&&(o.iceGatheringState="gathering"),o._emitBufferedCandidates()},0)}var s=Promise.resolve();return s.then(function(){a||("new"===o.iceGatheringState&&(o.iceGatheringState="gathering"),window.setTimeout(o._emitBufferedCandidates.bind(o),500))}),s},window.RTCPeerConnection.prototype.setRemoteDescription=function(e){var t=this,n=new MediaStream,o=[],i=r.splitSections(e.sdp),a=i.shift(),c=r.matchPrefix(a,"a=ice-lite").length>0;switch(this.usingBundle=r.matchPrefix(a,"a=group:BUNDLE ").length>0,i.forEach(function(i,s){var u=r.splitLines(i),f=u[0].substr(2).split(" "),d=f[0],l="0"===f[1],p=r.getDirection(i,a),h=r.matchPrefix(i,"a=mid:");if(h=h.length?h[0].substr(6):r.generateIdentifier(),"application"===d&&"DTLS/SCTP"===f[2])return void(t.transceivers[s]={mid:h,isDatachannel:!0});var v,g,m,y,b,_,w,x,C,E,T,R,O=r.parseRtpParameters(i);l||(T=r.getIceParameters(i,a),R=r.getDtlsParameters(i,a),R.role="client"),x=r.parseRtpEncodingParameters(i);var S,P=r.matchPrefix(i,"a=ssrc:").map(function(e){return r.parseSsrcMedia(e)}).filter(function(e){return"cname"===e.attribute})[0];P&&(S=P.value);var D=r.matchPrefix(i,"a=end-of-candidates",a).length>0,A=r.matchPrefix(i,"a=candidate:").map(function(e){return r.parseCandidate(e)}).filter(function(e){return"1"===e.component});if("offer"!==e.type||l)"answer"!==e.type||l||(v=t.transceivers[s],g=v.iceGatherer,m=v.iceTransport,y=v.dtlsTransport,b=v.rtpSender,_=v.rtpReceiver,w=v.sendEncodingParameters,C=v.localCapabilities,t.transceivers[s].recvEncodingParameters=x,t.transceivers[s].remoteCapabilities=O,t.transceivers[s].cname=S,(c||D)&&A.length&&m.setRemoteCandidates(A),t.usingBundle&&0!==s||(m.start(g,T,"controlling"),y.start(R)),t._transceive(v,"sendrecv"===p||"recvonly"===p,"sendrecv"===p||"sendonly"===p),!_||"sendrecv"!==p&&"sendonly"!==p?delete v.rtpReceiver:(E=_.track,o.push([E,_]),n.addTrack(E)));else{var j=t.usingBundle&&s>0?{iceGatherer:t.transceivers[0].iceGatherer,iceTransport:t.transceivers[0].iceTransport,dtlsTransport:t.transceivers[0].dtlsTransport}:t._createIceAndDtlsTransports(h,s);if(D&&j.iceTransport.setRemoteCandidates(A),C=RTCRtpReceiver.getCapabilities(d),C.codecs=C.codecs.filter(function(e){return"rtx"!==e.name}),w=[{ssrc:1001*(2*s+2)}],_=new RTCRtpReceiver(j.dtlsTransport,d),E=_.track,o.push([E,_]),n.addTrack(E),t.localStreams.length>0&&t.localStreams[0].getTracks().length>=s){var M;"audio"===d?M=t.localStreams[0].getAudioTracks()[0]:"video"===d&&(M=t.localStreams[0].getVideoTracks()[0]),M&&(b=new RTCRtpSender(M,j.dtlsTransport))}t.transceivers[s]={iceGatherer:j.iceGatherer,iceTransport:j.iceTransport,dtlsTransport:j.dtlsTransport,localCapabilities:C,remoteCapabilities:O,rtpSender:b,rtpReceiver:_,kind:d,mid:h,cname:S,sendEncodingParameters:w,recvEncodingParameters:x},t._transceive(t.transceivers[s],!1,"sendrecv"===p||"sendonly"===p)}}),this.remoteDescription={type:e.type,sdp:e.sdp},e.type){case"offer":this._updateSignalingState("have-remote-offer");break;case"answer":this._updateSignalingState("stable");break;default:throw new TypeError('unsupported type "'+e.type+'"')}return n.getTracks().length&&(t.remoteStreams.push(n),window.setTimeout(function(){var e=new Event("addstream");e.stream=n,t.dispatchEvent(e),null!==t.onaddstream&&window.setTimeout(function(){t.onaddstream(e)},0),o.forEach(function(r){var o=r[0],i=r[1],a=new Event("track");a.track=o,a.receiver=i,a.streams=[n],t.dispatchEvent(e),null!==t.ontrack&&window.setTimeout(function(){t.ontrack(a)},0)})},0)),arguments.length>1&&"function"==typeof arguments[1]&&window.setTimeout(arguments[1],0),Promise.resolve()},window.RTCPeerConnection.prototype.close=function(){this.transceivers.forEach(function(e){e.iceTransport&&e.iceTransport.stop(),e.dtlsTransport&&e.dtlsTransport.stop(),e.rtpSender&&e.rtpSender.stop(),e.rtpReceiver&&e.rtpReceiver.stop()}),this._updateSignalingState("closed")},window.RTCPeerConnection.prototype._updateSignalingState=function(e){this.signalingState=e;var t=new Event("signalingstatechange");this.dispatchEvent(t),null!==this.onsignalingstatechange&&this.onsignalingstatechange(t)},window.RTCPeerConnection.prototype._maybeFireNegotiationNeeded=function(){var e=new Event("negotiationneeded");this.dispatchEvent(e),null!==this.onnegotiationneeded&&this.onnegotiationneeded(e)},window.RTCPeerConnection.prototype._updateConnectionState=function(){var e,t=this,n={new:0,closed:0,connecting:0,checking:0,connected:0,completed:0,failed:0};if(this.transceivers.forEach(function(e){n[e.iceTransport.state]++,n[e.dtlsTransport.state]++}),n.connected+=n.completed,e="new",n.failed>0?e="failed":n.connecting>0||n.checking>0?e="connecting":n.disconnected>0?e="disconnected":n.new>0?e="new":(n.connected>0||n.completed>0)&&(e="connected"),e!==t.iceConnectionState){t.iceConnectionState=e;var r=new Event("iceconnectionstatechange");this.dispatchEvent(r),null!==this.oniceconnectionstatechange&&this.oniceconnectionstatechange(r)}},window.RTCPeerConnection.prototype.createOffer=function(){var e=this;if(this._pendingOffer)throw new Error("createOffer called while there is a pending offer.");var t;1===arguments.length&&"function"!=typeof arguments[0]?t=arguments[0]:3===arguments.length&&(t=arguments[2]);var n=[],o=0,i=0;if(this.localStreams.length&&(o=this.localStreams[0].getAudioTracks().length,i=this.localStreams[0].getVideoTracks().length),t){if(t.mandatory||t.optional)throw new TypeError("Legacy mandatory/optional constraints not supported.");void 0!==t.offerToReceiveAudio&&(o=t.offerToReceiveAudio),void 0!==t.offerToReceiveVideo&&(i=t.offerToReceiveVideo)}for(this.localStreams.length&&this.localStreams[0].getTracks().forEach(function(e){n.push({kind:e.kind,track:e,wantReceive:"audio"===e.kind?o>0:i>0}),"audio"===e.kind?o--:"video"===e.kind&&i--});o>0||i>0;)o>0&&(n.push({kind:"audio",wantReceive:!0}),o--),i>0&&(n.push({kind:"video",wantReceive:!0
}),i--);var a=r.writeSessionBoilerplate(),c=[];n.forEach(function(t,n){var o=t.track,i=t.kind,a=r.generateIdentifier(),s=e.usingBundle&&n>0?{iceGatherer:c[0].iceGatherer,iceTransport:c[0].iceTransport,dtlsTransport:c[0].dtlsTransport}:e._createIceAndDtlsTransports(a,n),u=RTCRtpSender.getCapabilities(i);u.codecs=u.codecs.filter(function(e){return"rtx"!==e.name}),u.codecs.forEach(function(e){"H264"===e.name&&void 0===e.parameters["level-asymmetry-allowed"]&&(e.parameters["level-asymmetry-allowed"]="1")});var f,d,l=[{ssrc:1001*(2*n+1)}];o&&(f=new RTCRtpSender(o,s.dtlsTransport)),t.wantReceive&&(d=new RTCRtpReceiver(s.dtlsTransport,i)),c[n]={iceGatherer:s.iceGatherer,iceTransport:s.iceTransport,dtlsTransport:s.dtlsTransport,localCapabilities:u,remoteCapabilities:null,rtpSender:f,rtpReceiver:d,kind:i,mid:a,sendEncodingParameters:l,recvEncodingParameters:null}}),this.usingBundle&&(a+="a=group:BUNDLE "+c.map(function(e){return e.mid}).join(" ")+"\r\n"),n.forEach(function(t,n){var o=c[n];a+=r.writeMediaSection(o,o.localCapabilities,"offer",e.localStreams[0])}),this._pendingOffer=c;var s=new RTCSessionDescription({type:"offer",sdp:a});return arguments.length&&"function"==typeof arguments[0]&&window.setTimeout(arguments[0],0,s),Promise.resolve(s)},window.RTCPeerConnection.prototype.createAnswer=function(){var e=this,t=r.writeSessionBoilerplate();this.usingBundle&&(t+="a=group:BUNDLE "+this.transceivers.map(function(e){return e.mid}).join(" ")+"\r\n"),this.transceivers.forEach(function(n){if(n.isDatachannel)return void(t+="m=application 0 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=mid:"+n.mid+"\r\n");var o=e._getCommonCapabilities(n.localCapabilities,n.remoteCapabilities);t+=r.writeMediaSection(n,o,"answer",e.localStreams[0])});var n=new RTCSessionDescription({type:"answer",sdp:t});return arguments.length&&"function"==typeof arguments[0]&&window.setTimeout(arguments[0],0,n),Promise.resolve(n)},window.RTCPeerConnection.prototype.addIceCandidate=function(e){if(e){var t=e.sdpMLineIndex;if(e.sdpMid)for(var n=0;n<this.transceivers.length;n++)if(this.transceivers[n].mid===e.sdpMid){t=n;break}var o=this.transceivers[t];if(o){var i=Object.keys(e.candidate).length>0?r.parseCandidate(e.candidate):{};if("tcp"===i.protocol&&(0===i.port||9===i.port))return;if("1"!==i.component)return;"endOfCandidates"===i.type&&(i={}),o.iceTransport.addRemoteCandidate(i);var a=r.splitSections(this.remoteDescription.sdp);a[t+1]+=(i.type?e.candidate.trim():"a=end-of-candidates")+"\r\n",this.remoteDescription.sdp=a.join("")}}else this.transceivers.forEach(function(e){e.iceTransport.addRemoteCandidate({})});return arguments.length>1&&"function"==typeof arguments[1]&&window.setTimeout(arguments[1],0),Promise.resolve()},window.RTCPeerConnection.prototype.getStats=function(){var e=[];this.transceivers.forEach(function(t){["rtpSender","rtpReceiver","iceGatherer","iceTransport","dtlsTransport"].forEach(function(n){t[n]&&e.push(t[n].getStats())})});var t=arguments.length>1&&"function"==typeof arguments[1]&&arguments[1];return new Promise(function(n){var r=new Map;Promise.all(e).then(function(e){e.forEach(function(e){Object.keys(e).forEach(function(t){r.set(t,e[t]),r[t]=e[t]})}),t&&window.setTimeout(t,0,r),n(r)})})}}};e.exports={shimPeerConnection:i.shimPeerConnection,shimGetUserMedia:n(209)}},function(e,t,n){"use strict";e.exports=function(){var e=function(e){return{name:{PermissionDeniedError:"NotAllowedError"}[e.name]||e.name,message:e.message,constraint:e.constraint,toString:function(){return this.name}}},t=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=function(n){return t(n).catch(function(t){return Promise.reject(e(t))})}}},function(e,t,n){"use strict";var r=n(0).browserDetails,o={shimOnTrack:function(){"object"!=typeof window||!window.RTCPeerConnection||"ontrack"in window.RTCPeerConnection.prototype||Object.defineProperty(window.RTCPeerConnection.prototype,"ontrack",{get:function(){return this._ontrack},set:function(e){this._ontrack&&(this.removeEventListener("track",this._ontrack),this.removeEventListener("addstream",this._ontrackpoly)),this.addEventListener("track",this._ontrack=e),this.addEventListener("addstream",this._ontrackpoly=function(e){e.stream.getTracks().forEach(function(t){var n=new Event("track");n.track=t,n.receiver={track:t},n.streams=[e.stream],this.dispatchEvent(n)}.bind(this))}.bind(this))}})},shimSourceObject:function(){"object"==typeof window&&(!window.HTMLMediaElement||"srcObject"in window.HTMLMediaElement.prototype||Object.defineProperty(window.HTMLMediaElement.prototype,"srcObject",{get:function(){return this.mozSrcObject},set:function(e){this.mozSrcObject=e}}))},shimPeerConnection:function(){if("object"==typeof window&&(window.RTCPeerConnection||window.mozRTCPeerConnection)){window.RTCPeerConnection||(window.RTCPeerConnection=function(e,t){if(r.version<38&&e&&e.iceServers){for(var n=[],o=0;o<e.iceServers.length;o++){var i=e.iceServers[o];if(i.hasOwnProperty("urls"))for(var a=0;a<i.urls.length;a++){var c={url:i.urls[a]};0===i.urls[a].indexOf("turn")&&(c.username=i.username,c.credential=i.credential),n.push(c)}else n.push(e.iceServers[o])}e.iceServers=n}return new mozRTCPeerConnection(e,t)},window.RTCPeerConnection.prototype=mozRTCPeerConnection.prototype,mozRTCPeerConnection.generateCertificate&&Object.defineProperty(window.RTCPeerConnection,"generateCertificate",{get:function(){return mozRTCPeerConnection.generateCertificate}}),window.RTCSessionDescription=mozRTCSessionDescription,window.RTCIceCandidate=mozRTCIceCandidate),["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(e){var t=RTCPeerConnection.prototype[e];RTCPeerConnection.prototype[e]=function(){return arguments[0]=new("addIceCandidate"===e?RTCIceCandidate:RTCSessionDescription)(arguments[0]),t.apply(this,arguments)}});var e=RTCPeerConnection.prototype.addIceCandidate;if(RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?e.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())},r.version<48){var t=function(e){var t=new Map;return Object.keys(e).forEach(function(n){t.set(n,e[n]),t[n]=e[n]}),t},n=RTCPeerConnection.prototype.getStats;RTCPeerConnection.prototype.getStats=function(e,r,o){return n.apply(this,[e||null]).then(function(e){return t(e)}).then(r,o)}}}}};e.exports={shimOnTrack:o.shimOnTrack,shimSourceObject:o.shimSourceObject,shimPeerConnection:o.shimPeerConnection,shimGetUserMedia:n(211)}},function(e,t,n){"use strict";var r=n(0).log,o=n(0).browserDetails;e.exports=function(){var e=function(e){return{name:{SecurityError:"NotAllowedError",PermissionDeniedError:"NotAllowedError"}[e.name]||e.name,message:{"The operation is insecure.":"The request is not allowed by the user agent or the platform in the current context."}[e.message]||e.message,constraint:e.constraint,toString:function(){return this.name+(this.message&&": ")+this.message}}},t=function(t,n,i){var a=function(e){if("object"!=typeof e||e.require)return e;var t=[];return Object.keys(e).forEach(function(n){if("require"!==n&&"advanced"!==n&&"mediaSource"!==n){var r=e[n]="object"==typeof e[n]?e[n]:{ideal:e[n]};if(void 0===r.min&&void 0===r.max&&void 0===r.exact||t.push(n),void 0!==r.exact&&("number"==typeof r.exact?r.min=r.max=r.exact:e[n]=r.exact,delete r.exact),void 0!==r.ideal){e.advanced=e.advanced||[];var o={};"number"==typeof r.ideal?o[n]={min:r.ideal,max:r.ideal}:o[n]=r.ideal,e.advanced.push(o),delete r.ideal,Object.keys(r).length||delete e[n]}}}),t.length&&(e.require=t),e};return t=JSON.parse(JSON.stringify(t)),o.version<38&&(r("spec: "+JSON.stringify(t)),t.audio&&(t.audio=a(t.audio)),t.video&&(t.video=a(t.video)),r("ff37: "+JSON.stringify(t))),navigator.mozGetUserMedia(t,n,function(t){i(e(t))})},n=function(e){return new Promise(function(n,r){t(e,n,r)})};if(navigator.mediaDevices||(navigator.mediaDevices={getUserMedia:n,addEventListener:function(){},removeEventListener:function(){}}),navigator.mediaDevices.enumerateDevices=navigator.mediaDevices.enumerateDevices||function(){return new Promise(function(e){var t=[{kind:"audioinput",deviceId:"default",label:"",groupId:""},{kind:"videoinput",deviceId:"default",label:"",groupId:""}];e(t)})},o.version<41){var i=navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);navigator.mediaDevices.enumerateDevices=function(){return i().then(void 0,function(e){if("NotFoundError"===e.name)return[];throw e})}}if(o.version<49){var a=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=function(t){return a(t).then(function(e){if(t.audio&&!e.getAudioTracks().length||t.video&&!e.getVideoTracks().length)throw e.getTracks().forEach(function(e){e.stop()}),new DOMException("The object can not be found here.","NotFoundError");return e},function(t){return Promise.reject(e(t))})}}navigator.getUserMedia=function(e,n,r){return o.version<44?t(e,n,r):(console.warn("navigator.getUserMedia has been replaced by navigator.mediaDevices.getUserMedia"),void navigator.mediaDevices.getUserMedia(e).then(n,r))}}},function(e,t,n){"use strict";var r={shimGetUserMedia:function(){navigator.getUserMedia=navigator.webkitGetUserMedia}};e.exports={shimGetUserMedia:r.shimGetUserMedia}},function(e,t,n){e.exports=n(71)}])});

/***/ })
/******/ ]);