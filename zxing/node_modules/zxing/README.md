# JavaScript QRCode reader for HTML5 enabled browser

2011 Lazar Laszlo  http://lazarsoft.info
2014 Jess Telford  http://jes.st

Try it online: [http://webqr.com](http://webqr.com)

This is a port to npm of Lazar Laszlo's port of ZXing qrcode scanner, [http://code.google.com/p/zxing](http://code.google.com/p/zxing).

## Usage

```javascript
qrcode = require('zxing');
qrcode.decode([uri, ]function(err, result) {
  if (err != null) {
    console.log(err); // Will output any errors found
    return;
  }
  console.log(result); // Will output the decoded information
});
```

If `uri` is not passed, will instead extract image data from a `canvas` element
with `id="qr-canvas"`

[new from 2014.01.09]
For webcam qrcode decoding (included in the test.html) you will need a browser with getUserMedia (WebRTC) capability.
