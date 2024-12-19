(function(exports) {
  var jsOTP = {};

  jsOTP.totp = function() {
    this.expiry = 30;
    this.length = 6;
    this.timeStep = 30;

    this.getOtp = function(secret) {
      if (!secret) {
        throw 'Secret cannot be empty';
      }

      var epoch = Math.floor(Date.now() / 1000);
      var time = this.timeStep ? Math.floor(epoch / this.timeStep) : epoch;
      var hmac = this.getHMAC(secret, time);
      return this.generateOTP(hmac);
    };

    this.getHMAC = function(secret, time) {
      var wordArray = CryptoJS.enc.Base32.parse(secret.toUpperCase());
      var timeHex = this.leftpad(time.toString(16), 16, '0');
      var timeWordArray = CryptoJS.enc.Hex.parse(timeHex);
      return CryptoJS.HmacSHA1(timeWordArray, wordArray);
    };

    this.generateOTP = function(hmac) {
      var hex = CryptoJS.enc.Hex.stringify(hmac);
      var offset = parseInt(hex.slice(-1), 16);
      var otp = (parseInt(hex.substr(offset * 2, 8), 16) & 0x7fffffff) + '';
      return otp.slice(-this.length);
    };

    this.leftpad = function(str, len, pad) {
      if (len + 1 >= str.length) {
        str = Array(len + 1 - str.length).join(pad) + str;
      }
      return str;
    };
  };

  // CryptoJS Base32 encoding
  (function() {
    var Base32 = CryptoJS.enc.Base32 = {
      stringify: function(wordArray) {
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;
        var map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

        var base32Chars = [];
        for (var i = 0; i < sigBytes; i += 5) {
          var byte1 = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
          var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
          var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;
          var byte4 = (words[(i + 3) >>> 2] >>> (24 - ((i + 3) % 4) * 8)) & 0xff;
          var byte5 = (words[(i + 4) >>> 2] >>> (24 - ((i + 4) % 4) * 8)) & 0xff;

          base32Chars.push(map.charAt((byte1 >>> 3) & 0x1f));
          base32Chars.push(map.charAt(((byte1 << 2) | (byte2 >>> 6)) & 0x1f));
          base32Chars.push(map.charAt((byte2 >>> 1) & 0x1f));
          base32Chars.push(map.charAt(((byte2 << 4) | (byte3 >>> 4)) & 0x1f));
          base32Chars.push(map.charAt(((byte3 << 1) | (byte4 >>> 7)) & 0x1f));
          base32Chars.push(map.charAt((byte4 >>> 2) & 0x1f));
          base32Chars.push(map.charAt(((byte4 << 3) | (byte5 >>> 5)) & 0x1f));
          base32Chars.push(map.charAt(byte5 & 0x1f));
        }

        var excess = base32Chars.length % 8;
        if (excess > 0) {
          base32Chars.splice(base32Chars.length - excess, excess);
        }

        return base32Chars.join('');
      },

      parse: function(base32Str) {
        var base32StrLength = base32Str.length;
        var map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        var reverseMap = {};

        for (var i = 0; i < map.length; i++) {
          reverseMap[map.charAt(i)] = i;
        }

        var words = [];
        var nBytes = 0;

        for (var i = 0; i < base32StrLength; i += 8) {
          var bits = 0;
          var bitsLength = 0;

          for (var j = 0; j < 8 && i + j < base32StrLength; j++) {
            var value = reverseMap[base32Str.charAt(i + j)];
            if (value === undefined) {
              throw new Error('Invalid character in base32 string');
            }

            bits = (bits << 5) | value;
            bitsLength += 5;
          }

          var bitMask = 0xff;
          while (bitsLength >= 8) {
            words[nBytes >>> 2] |= ((bits >>> (bitsLength - 8)) & bitMask) << (24 - (nBytes % 4) * 8);
            nBytes++;
            bitsLength -= 8;
          }
        }

        return CryptoJS.lib.WordArray.create(words, nBytes);
      }
    };
  })();

  exports.jsOTP = jsOTP;
})(window);