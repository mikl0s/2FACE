/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
*/
var CryptoJS =
  CryptoJS ||
  (function (e, m) {
    var p = {},
      j = (p.lib = {}),
      l = function () {},
      f = (j.Base = {
        extend: function (a) {
          l.prototype = this;
          var c = new l();
          a && c.mixIn(a);
          c.hasOwnProperty('init') ||
            (c.init = function () {
              c.$super.init.apply(this, arguments);
            });
          c.init.prototype = c;
          c.$super = this;
          return c;
        },
        create: function () {
          var a = this.extend();
          a.init.apply(a, arguments);
          return a;
        },
        init: function () {},
        mixIn: function (a) {
          for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
          a.hasOwnProperty('toString') && (this.toString = a.toString);
        },
        clone: function () {
          return this.init.prototype.extend(this);
        },
      }),
      n = (j.WordArray = f.extend({
        init: function (a, c) {
          a = this.words = a || [];
          this.sigBytes = c != m ? c : 4 * a.length;
        },
        toString: function (a) {
          return (a || h).stringify(this);
        },
        concat: function (a) {
          var c = this.words,
            q = a.words,
            d = this.sigBytes;
          a = a.sigBytes;
          this.clamp();
          if (d % 4)
            for (var b = 0; b < a; b++)
              c[(d + b) >>> 2] |=
                ((q[b >>> 2] >>> (24 - 8 * (b % 4))) & 255) << (24 - 8 * ((d + b) % 4));
          else if (65535 < q.length) for (b = 0; b < a; b += 4) c[(d + b) >>> 2] = q[b >>> 2];
          else c.push.apply(c, q);
          this.sigBytes += a;
          return this;
        },
        clamp: function () {
          var a = this.words,
            c = this.sigBytes;
          a[c >>> 2] &= 4294967295 << (32 - 8 * (c % 4));
          a.length = e.ceil(c / 4);
        },
        clone: function () {
          var a = f.clone.call(this);
          a.words = this.words.slice(0);
          return a;
        },
        random: function (a) {
          for (var c = [], b = 0; b < a; b += 4) c.push((4294967296 * e.random()) | 0);
          return new n.init(c, a);
        },
      })),
      b = (p.enc = {}),
      h = (b.Hex = {
        stringify: function (a) {
          var c = a.words;
          a = a.sigBytes;
          for (var b = [], d = 0; d < a; d++) {
            var f = (c[d >>> 2] >>> (24 - 8 * (d % 4))) & 255;
            b.push((f >>> 4).toString(16));
            b.push((f & 15).toString(16));
          }
          return b.join('');
        },
        parse: function (a) {
          for (var c = a.length, b = [], d = 0; d < c; d += 2)
            b[d >>> 3] |= parseInt(a.substr(d, 2), 16) << (24 - 4 * (d % 8));
          return new n.init(b, c / 2);
        },
      }),
      g = (b.Latin1 = {
        stringify: function (a) {
          var c = a.words;
          a = a.sigBytes;
          for (var b = [], d = 0; d < a; d++)
            b.push(String.fromCharCode((c[d >>> 2] >>> (24 - 8 * (d % 4))) & 255));
          return b.join('');
        },
        parse: function (a) {
          for (var c = a.length, b = [], d = 0; d < c; d++)
            b[d >>> 2] |= (a.charCodeAt(d) & 255) << (24 - 8 * (d % 4));
          return new n.init(b, c);
        },
      }),
      r = (b.Utf8 = {
        stringify: function (a) {
          try {
            return decodeURIComponent(escape(g.stringify(a)));
          } catch (c) {
            throw Error('Malformed UTF-8 data');
          }
        },
        parse: function (a) {
          return g.parse(unescape(encodeURIComponent(a)));
        },
      }),
      k = (j.BufferedBlockAlgorithm = f.extend({
        reset: function () {
          this._data = new n.init();
          this._nDataBytes = 0;
        },
        _append: function (a) {
          'string' == typeof a && (a = r.parse(a));
          this._data.concat(a);
          this._nDataBytes += a.sigBytes;
        },
        _process: function (a) {
          var c = this._data,
            b = c.words,
            d = c.sigBytes,
            f = this.blockSize,
            h = d / (4 * f),
            h = a ? e.ceil(h) : e.max((h | 0) - this._minBufferSize, 0);
          a = h * f;
          d = e.min(4 * a, d);
          if (a) {
            for (var g = 0; g < a; g += f) this._doProcessBlock(b, g);
            g = b.splice(0, a);
            c.sigBytes -= d;
          }
          return new n.init(g, d);
        },
        clone: function () {
          var a = f.clone.call(this);
          a._data = this._data.clone();
          return a;
        },
        _minBufferSize: 0,
      }));
    j.Hasher = k.extend({
      cfg: f.extend(),
      init: function (a) {
        this.cfg = this.cfg.extend(a);
        this.reset();
      },
      reset: function () {
        k.reset.call(this);
        this._doReset();
      },
      update: function (a) {
        this._append(a);
        this._process();
        return this;
      },
      finalize: function (a) {
        a && this._append(a);
        return this._doFinalize();
      },
      blockSize: 16,
      _createHelper: function (a) {
        return function (c, b) {
          return new a.init(b).finalize(c);
        };
      },
      _createHmacHelper: function (a) {
        return function (b, f) {
          return new s.HMAC.init(a, f).finalize(b);
        };
      },
    });
    var s = (p.algo = {});
    return p;
  })(Math);
(function () {
  var e = CryptoJS,
    m = e.lib,
    p = m.WordArray,
    j = m.Hasher,
    l = [],
    m = (e.algo.SHA1 = j.extend({
      _doReset: function () {
        this._hash = new p.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
      },
      _doProcessBlock: function (f, n) {
        for (
          var b = this._hash.words, h = b[0], g = b[1], e = b[2], k = b[3], j = b[4], a = 0;
          80 > a;
          a++
        ) {
          if (16 > a) l[a] = f[n + a] | 0;
          else {
            var c = l[a - 3] ^ l[a - 8] ^ l[a - 14] ^ l[a - 16];
            l[a] = (c << 1) | (c >>> 31);
          }
          c = ((h << 5) | (h >>> 27)) + j + l[a];
          c =
            20 > a
              ? c + (((g & e) | (~g & k)) + 1518500249)
              : 40 > a
                ? c + ((g ^ e ^ k) + 1859775393)
                : 60 > a
                  ? c + (((g & e) | (g & k) | (e & k)) - 1894007588)
                  : c + ((g ^ e ^ k) - 899497514);
          j = k;
          k = e;
          e = (g << 30) | (g >>> 2);
          g = h;
          h = c;
        }
        b[0] = (b[0] + h) | 0;
        b[1] = (b[1] + g) | 0;
        b[2] = (b[2] + e) | 0;
        b[3] = (b[3] + k) | 0;
        b[4] = (b[4] + j) | 0;
      },
      _doFinalize: function () {
        var f = this._data,
          e = f.words,
          b = 8 * this._nDataBytes,
          h = 8 * f.sigBytes;
        e[h >>> 5] |= 128 << (24 - (h % 32));
        e[(((h + 64) >>> 9) << 4) + 14] = Math.floor(b / 4294967296);
        e[(((h + 64) >>> 9) << 4) + 15] = b;
        f.sigBytes = 4 * e.length;
        this._process();
        return this._hash;
      },
      clone: function () {
        var e = j.clone.call(this);
        e._hash = this._hash.clone();
        return e;
      },
    }));
  e.SHA1 = j._createHelper(m);
  e.HmacSHA1 = j._createHmacHelper(m);
})();
(function () {
  var h = CryptoJS,
    j = h.lib.WordArray;
  h.enc.Base64 = {
    stringify: function (b) {
      var e = b.words,
        f = b.sigBytes,
        c = this._map;
      b.clamp();
      b = [];
      for (var a = 0; a < f; a += 3)
        for (
          var d =
              (((e[a >>> 2] >>> (24 - 8 * (a % 4))) & 255) << 16) |
              (((e[(a + 1) >>> 2] >>> (24 - 8 * ((a + 1) % 4))) & 255) << 8) |
              ((e[(a + 2) >>> 2] >>> (24 - 8 * ((a + 2) % 4))) & 255),
            g = 0;
          4 > g && a + 0.75 * g < f;
          g++
        )
          b.push(c.charAt((d >>> (6 * (3 - g))) & 63));
      if ((e = c.charAt(64))) for (; b.length % 4; ) b.push(e);
      return b.join('');
    },
    parse: function (b) {
      var e = b.length,
        f = this._map,
        c = f.charAt(64);
      c && ((c = b.indexOf(c)), -1 != c && (e = c));
      for (var c = [], a = 0, d = 0; d < e; d++)
        if (d % 4) {
          var g = f.indexOf(b.charAt(d - 1)) << (2 * (d % 4)),
            h = f.indexOf(b.charAt(d)) >>> (6 - 2 * (d % 4));
          c[a >>> 2] |= (g | h) << (24 - 8 * (a % 4));
          a++;
        }
      return j.create(c, a);
    },
    _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  };
})();
(function () {
  if ('function' == typeof ArrayBuffer) {
    var b = CryptoJS.lib.WordArray,
      e = b.init;
    (b.init = function (a) {
      a instanceof ArrayBuffer && (a = new Uint8Array(a));
      if (
        a instanceof Int8Array ||
        a instanceof Uint8ClampedArray ||
        a instanceof Int16Array ||
        a instanceof Uint16Array ||
        a instanceof Int32Array ||
        a instanceof Uint32Array ||
        a instanceof Float32Array ||
        a instanceof Float64Array
      )
        a = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
      if (a instanceof Uint8Array) {
        for (var b = a.byteLength, d = [], c = 0; c < b; c++)
          d[c >>> 2] |= a[c] << (24 - 8 * (c % 4));
        e.call(this, d, b);
      } else e.apply(this, arguments);
    }).prototype = b;
  }
})();
(function () {
  var u = CryptoJS,
    p = u.lib.WordArray;
  u.enc.Base64url = {
    stringify: function (d, z) {
      var q = d.words,
        r = d.sigBytes,
        w = z ? this._safe_map : this._map;
      d.clamp();
      d = [];
      for (var v = 0; v < r; v += 3)
        for (
          var x =
              (((q[v >>> 2] >>> (24 - 8 * (v % 4))) & 255) << 16) |
              (((q[(v + 1) >>> 2] >>> (24 - 8 * ((v + 1) % 4))) & 255) << 8) |
              ((q[(v + 2) >>> 2] >>> (24 - 8 * ((v + 2) % 4))) & 255),
            y = 0;
          4 > y && v + 0.75 * y < r;
          y++
        )
          d.push(w.charAt((x >>> (6 * (3 - y))) & 63));
      if ((q = w.charAt(64))) for (; d.length % 4; ) d.push(q);
      return d.join('');
    },
    parse: function (d, z) {
      var q = d.length,
        r = z ? this._safe_map : this._map,
        w = this._reverseMap;
      if (!w) {
        w = this._reverseMap = [];
        for (var v = 0; v < r.length; v++) w[r.charCodeAt(v)] = v;
      }
      z = r.charAt(64);
      z && ((z = d.indexOf(z)), -1 !== z && (q = z));
      for (var z = [], x = 0, y = 0; y < q; y++)
        if (y % 4) {
          var t = w[d.charCodeAt(y - 1)] << (2 * (y % 4)),
            s = w[d.charCodeAt(y)] >>> (6 - 2 * (y % 4));
          z[x >>> 2] |= (t | s) << (24 - 8 * (x % 4));
          x++;
        }
      return p.create(z, x);
    },
    _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    _safe_map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
  };
})();

/*
CryptoJS v3.1.2 SHA256
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
*/
(function (Math) {
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    var H = [];
    var K = [];

    (function () {
        function isPrime(n) {
            var sqrtN = Math.sqrt(n);
            for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n % factor)) {
                    return false;
                }
            }

            return true;
        }

        function getFractionalBits(n) {
            return ((n - (n | 0)) * 0x100000000) | 0;
        }

        var n = 2;
        var nPrime = 0;
        while (nPrime < 64) {
            if (isPrime(n)) {
                if (nPrime < 8) {
                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                }
                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

                nPrime++;
            }

            n++;
        }
    }());

    var W = [];

    var SHA256 = C_algo.SHA256 = Hasher.extend({
        _doReset: function () {
            this._hash = new WordArray.init(H.slice(0));
        },

        _doProcessBlock: function (M, offset) {
            var H = this._hash.words;

            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            var f = H[5];
            var g = H[6];
            var h = H[7];

            for (var i = 0; i < 64; i++) {
                if (i < 16) {
                    W[i] = M[offset + i] | 0;
                } else {
                    var gamma0x = W[i - 15];
                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
                                ((gamma0x << 14) | (gamma0x >>> 18)) ^
                                 (gamma0x >>> 3);

                    var gamma1x = W[i - 2];
                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                                ((gamma1x << 13) | (gamma1x >>> 19)) ^
                                 (gamma1x >>> 10);

                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                }

                var ch  = (e & f) ^ (~e & g);
                var maj = (a & b) ^ (a & c) ^ (b & c);

                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

                var t1 = h + sigma1 + ch + K[i] + W[i];
                var t2 = sigma0 + maj;

                h = g;
                g = f;
                f = e;
                e = (d + t1) | 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) | 0;
            }

            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
            H[5] = (H[5] + f) | 0;
            H[6] = (H[6] + g) | 0;
            H[7] = (H[7] + h) | 0;
        },

        _doFinalize: function () {
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            this._process();

            return this._hash;
        },

        clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        }
    });

    C.SHA256 = Hasher._createHelper(SHA256);
    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
}(Math));
