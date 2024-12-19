/**
 * @otplib/preset-browser
 *
 * @author Gerald Yeo <contact@fusedthought.com>
 * @version: 12.0.1
 * @license: MIT
 **/
!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
      ? define([], t)
      : 'object' == typeof exports
        ? (exports.otplib = t())
        : (e.otplib = t());
})(window, function () {
  return (function (e) {
    var t = {};
    function n(r) {
      if (t[r]) return t[r].exports;
      var o = (t[r] = { i: r, l: !1, exports: {} });
      return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
    }
    return (
      (n.m = e),
      (n.c = t),
      (n.d = function (e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
      }),
      (n.r = function (e) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(e, '__esModule', { value: !0 });
      }),
      (n.t = function (e, t) {
        if ((1 & t && (e = n(e)), 8 & t)) return e;
        if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (
          (n.r(r),
          Object.defineProperty(r, 'default', { enumerable: !0, value: e }),
          2 & t && 'string' != typeof e)
        )
          for (var o in e)
            n.d(
              r,
              o,
              function (t) {
                return e[t];
              }.bind(null, o)
            );
        return r;
      }),
      (n.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return n.d(t, 'a', t), t;
      }),
      (n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (n.p = ''),
      n((n.s = 12))
    );
  })([
    function (e, t, n) {
      var r;
      e.exports =
        ((r =
          r ||
          (function (e, t) {
            var n =
                Object.create ||
                (function () {
                  function e() {}
                  return function (t) {
                    var n;
                    return (e.prototype = t), (n = new e()), (e.prototype = null), n;
                  };
                })(),
              r = {},
              o = (r.lib = {}),
              i = (o.Base = {
                extend: function (e) {
                  var t = n(this);
                  return (
                    e && t.mixIn(e),
                    (t.hasOwnProperty('init') && this.init !== t.init) ||
                      (t.init = function () {
                        t.$super.init.apply(this, arguments);
                      }),
                    (t.init.prototype = t),
                    (t.$super = this),
                    t
                  );
                },
                create: function () {
                  var e = this.extend();
                  return e.init.apply(e, arguments), e;
                },
                init: function () {},
                mixIn: function (e) {
                  for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
                  e.hasOwnProperty('toString') && (this.toString = e.toString);
                },
                clone: function () {
                  return this.init.prototype.extend(this);
                },
              }),
              c = (o.WordArray = i.extend({
                init: function (e, t) {
                  (e = this.words = e || []), (this.sigBytes = null != t ? t : 4 * e.length);
                },
                toString: function (e) {
                  return (e || a).stringify(this);
                },
                concat: function (e) {
                  var t = this.words,
                    n = e.words,
                    r = this.sigBytes,
                    o = e.sigBytes;
                  if ((this.clamp(), r % 4))
                    for (var i = 0; i < o; i++) {
                      var c = (n[i >>> 2] >>> (24 - (i % 4) * 8)) & 255;
                      t[(r + i) >>> 2] |= c << (24 - ((r + i) % 4) * 8);
                    }
                  else for (i = 0; i < o; i += 4) t[(r + i) >>> 2] = n[i >>> 2];
                  return (this.sigBytes += o), this;
                },
                clamp: function () {
                  var t = this.words,
                    n = this.sigBytes;
                  (t[n >>> 2] &= 4294967295 << (32 - (n % 4) * 8)), (t.length = e.ceil(n / 4));
                },
                clone: function () {
                  var e = i.clone.call(this);
                  return (e.words = this.words.slice(0)), e;
                },
                random: function (t) {
                  for (
                    var n,
                      r = [],
                      o = function (t) {
                        t = t;
                        var n = 987654321,
                          r = 4294967295;
                        return function () {
                          var o =
                            (((n = (36969 * (65535 & n) + (n >> 16)) & r) << 16) +
                              (t = (18e3 * (65535 & t) + (t >> 16)) & r)) &
                            r;
                          return (o /= 4294967296), (o += 0.5) * (e.random() > 0.5 ? 1 : -1);
                        };
                      },
                      i = 0;
                    i < t;
                    i += 4
                  ) {
                    var u = o(4294967296 * (n || e.random()));
                    (n = 987654071 * u()), r.push((4294967296 * u()) | 0);
                  }
                  return new c.init(r, t);
                },
              })),
              u = (r.enc = {}),
              a = (u.Hex = {
                stringify: function (e) {
                  for (var t = e.words, n = e.sigBytes, r = [], o = 0; o < n; o++) {
                    var i = (t[o >>> 2] >>> (24 - (o % 4) * 8)) & 255;
                    r.push((i >>> 4).toString(16)), r.push((15 & i).toString(16));
                  }
                  return r.join('');
                },
                parse: function (e) {
                  for (var t = e.length, n = [], r = 0; r < t; r += 2)
                    n[r >>> 3] |= parseInt(e.substr(r, 2), 16) << (24 - (r % 8) * 4);
                  return new c.init(n, t / 2);
                },
              }),
              s = (u.Latin1 = {
                stringify: function (e) {
                  for (var t = e.words, n = e.sigBytes, r = [], o = 0; o < n; o++) {
                    var i = (t[o >>> 2] >>> (24 - (o % 4) * 8)) & 255;
                    r.push(String.fromCharCode(i));
                  }
                  return r.join('');
                },
                parse: function (e) {
                  for (var t = e.length, n = [], r = 0; r < t; r++)
                    n[r >>> 2] |= (255 & e.charCodeAt(r)) << (24 - (r % 4) * 8);
                  return new c.init(n, t);
                },
              }),
              f = (u.Utf8 = {
                stringify: function (e) {
                  try {
                    return decodeURIComponent(escape(s.stringify(e)));
                  } catch (e) {
                    throw new Error('Malformed UTF-8 data');
                  }
                },
                parse: function (e) {
                  return s.parse(unescape(encodeURIComponent(e)));
                },
              }),
              l = (o.BufferedBlockAlgorithm = i.extend({
                reset: function () {
                  (this._data = new c.init()), (this._nDataBytes = 0);
                },
                _append: function (e) {
                  'string' == typeof e && (e = f.parse(e)),
                    this._data.concat(e),
                    (this._nDataBytes += e.sigBytes);
                },
                _process: function (t) {
                  var n = this._data,
                    r = n.words,
                    o = n.sigBytes,
                    i = this.blockSize,
                    u = o / (4 * i),
                    a = (u = t ? e.ceil(u) : e.max((0 | u) - this._minBufferSize, 0)) * i,
                    s = e.min(4 * a, o);
                  if (a) {
                    for (var f = 0; f < a; f += i) this._doProcessBlock(r, f);
                    var l = r.splice(0, a);
                    n.sigBytes -= s;
                  }
                  return new c.init(l, s);
                },
                clone: function () {
                  var e = i.clone.call(this);
                  return (e._data = this._data.clone()), e;
                },
                _minBufferSize: 0,
              })),
              p =
                ((o.Hasher = l.extend({
                  cfg: i.extend(),
                  init: function (e) {
                    (this.cfg = this.cfg.extend(e)), this.reset();
                  },
                  reset: function () {
                    l.reset.call(this), this._doReset();
                  },
                  update: function (e) {
                    return this._append(e), this._process(), this;
                  },
                  finalize: function (e) {
                    return e && this._append(e), this._doFinalize();
                  },
                  blockSize: 16,
                  _createHelper: function (e) {
                    return function (t, n) {
                      return new e.init(n).finalize(t);
                    };
                  },
                  _createHmacHelper: function (e) {
                    return function (t, n) {
                      return new p.HMAC.init(e, n).finalize(t);
                    };
                  },
                })),
                (r.algo = {}));
            return r;
          })(Math)),
        r);
    },
    function (e, t, n) {
      var r, o, i, c;
      e.exports =
        ((r = n(0)),
        (i = (o = r).lib.Base),
        (c = o.enc.Utf8),
        void (o.algo.HMAC = i.extend({
          init: function (e, t) {
            (e = this._hasher = new e.init()), 'string' == typeof t && (t = c.parse(t));
            var n = e.blockSize,
              r = 4 * n;
            t.sigBytes > r && (t = e.finalize(t)), t.clamp();
            for (
              var o = (this._oKey = t.clone()),
                i = (this._iKey = t.clone()),
                u = o.words,
                a = i.words,
                s = 0;
              s < n;
              s++
            )
              (u[s] ^= 1549556828), (a[s] ^= 909522486);
            (o.sigBytes = i.sigBytes = r), this.reset();
          },
          reset: function () {
            var e = this._hasher;
            e.reset(), e.update(this._iKey);
          },
          update: function (e) {
            return this._hasher.update(e), this;
          },
          finalize: function (e) {
            var t = this._hasher,
              n = t.finalize(e);
            return t.reset(), t.finalize(this._oKey.clone().concat(n));
          },
        })));
    },
    function (e, t, n) {
      var r;
      e.exports = ((r = n(0)), r.enc.Hex);
    },
    function (e, t, n) {
      var r, o, i, c, u, a;
      e.exports =
        ((a = n(0)),
        (o = (r = a).lib),
        (i = o.Base),
        (c = o.WordArray),
        ((u = r.x64 = {}).Word = i.extend({
          init: function (e, t) {
            (this.high = e), (this.low = t);
          },
        })),
        (u.WordArray = i.extend({
          init: function (e, t) {
            (e = this.words = e || []), (this.sigBytes = null != t ? t : 8 * e.length);
          },
          toX32: function () {
            for (var e = this.words, t = e.length, n = [], r = 0; r < t; r++) {
              var o = e[r];
              n.push(o.high), n.push(o.low);
            }
            return c.create(n, this.sigBytes);
          },
          clone: function () {
            for (
              var e = i.clone.call(this), t = (e.words = this.words.slice(0)), n = t.length, r = 0;
              r < n;
              r++
            )
              t[r] = t[r].clone();
            return e;
          },
        })),
        a);
    },
    function (e, t, n) {
      var r;
      e.exports = ((r = n(0)), n(9), n(1), r.HmacSHA1);
    },
    function (e, t, n) {
      var r;
      e.exports = ((r = n(0)), n(10), n(1), r.HmacSHA256);
    },
    function (e, t, n) {
      var r;
      e.exports = ((r = n(0)), n(3), n(11), n(1), r.HmacSHA512);
    },
    function (e, t) {
      function n(e, t) {
        var n = e.indexOf(t);
        if (-1 === n) throw new Error('Invalid character found: ' + t);
        return n;
      }
      e.exports = function (e, t) {
        var r;
        switch (t) {
          case 'RFC3548':
          case 'RFC4648':
            (r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), (e = e.replace(/=+$/, ''));
            break;
          case 'RFC4648-HEX':
            (r = '0123456789ABCDEFGHIJKLMNOPQRSTUV'), (e = e.replace(/=+$/, ''));
            break;
          case 'Crockford':
            (r = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'),
              (e = e.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1'));
            break;
          default:
            throw new Error('Unknown base32 variant: ' + t);
        }
        for (
          var o = e.length, i = 0, c = 0, u = 0, a = new Uint8Array(((5 * o) / 8) | 0), s = 0;
          s < o;
          s++
        )
          (c = (c << 5) | n(r, e[s])),
            (i += 5) >= 8 && ((a[u++] = (c >>> (i - 8)) & 255), (i -= 8));
        return a.buffer;
      };
    },
    function (e, t) {
      e.exports = function (e, t, n) {
        var r, o;
        switch (((n = n || {}), t)) {
          case 'RFC3548':
          case 'RFC4648':
            (r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), (o = !0);
            break;
          case 'RFC4648-HEX':
            (r = '0123456789ABCDEFGHIJKLMNOPQRSTUV'), (o = !0);
            break;
          case 'Crockford':
            (r = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'), (o = !1);
            break;
          default:
            throw new Error('Unknown base32 variant: ' + t);
        }
        for (
          var i = void 0 !== n.padding ? n.padding : o,
            c = e.byteLength,
            u = new Uint8Array(e),
            a = 0,
            s = 0,
            f = '',
            l = 0;
          l < c;
          l++
        )
          for (s = (s << 8) | u[l], a += 8; a >= 5; ) (f += r[(s >>> (a - 5)) & 31]), (a -= 5);
        if ((a > 0 && (f += r[(s << (5 - a)) & 31]), i)) for (; f.length % 8 != 0; ) f += '=';
        return f;
      };
    },
    function (e, t, n) {
      var r, o, i, c, u, a, s, f;
      e.exports =
        ((f = n(0)),
        (o = (r = f).lib),
        (i = o.WordArray),
        (c = o.Hasher),
        (u = r.algo),
        (a = []),
        (s = u.SHA1 =
          c.extend({
            _doReset: function () {
              this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
            },
            _doProcessBlock: function (e, t) {
              for (
                var n = this._hash.words, r = n[0], o = n[1], i = n[2], c = n[3], u = n[4], s = 0;
                s < 80;
                s++
              ) {
                if (s < 16) a[s] = 0 | e[t + s];
                else {
                  var f = a[s - 3] ^ a[s - 8] ^ a[s - 14] ^ a[s - 16];
                  a[s] = (f << 1) | (f >>> 31);
                }
                var l = ((r << 5) | (r >>> 27)) + u + a[s];
                (l +=
                  s < 20
                    ? 1518500249 + ((o & i) | (~o & c))
                    : s < 40
                      ? 1859775393 + (o ^ i ^ c)
                      : s < 60
                        ? ((o & i) | (o & c) | (i & c)) - 1894007588
                        : (o ^ i ^ c) - 899497514),
                  (u = c),
                  (c = i),
                  (i = (o << 30) | (o >>> 2)),
                  (o = r),
                  (r = l);
              }
              (n[0] = (n[0] + r) | 0),
                (n[1] = (n[1] + o) | 0),
                (n[2] = (n[2] + i) | 0),
                (n[3] = (n[3] + c) | 0),
                (n[4] = (n[4] + u) | 0);
            },
            _doFinalize: function () {
              var e = this._data,
                t = e.words,
                n = 8 * this._nDataBytes,
                r = 8 * e.sigBytes;
              return (
                (t[r >>> 5] |= 128 << (24 - (r % 32))),
                (t[14 + (((r + 64) >>> 9) << 4)] = Math.floor(n / 4294967296)),
                (t[15 + (((r + 64) >>> 9) << 4)] = n),
                (e.sigBytes = 4 * t.length),
                this._process(),
                this._hash
              );
            },
            clone: function () {
              var e = c.clone.call(this);
              return (e._hash = this._hash.clone()), e;
            },
          })),
        (r.SHA1 = c._createHelper(s)),
        (r.HmacSHA1 = c._createHmacHelper(s)),
        f.SHA1);
    },
    function (e, t, n) {
      var r;
      e.exports =
        ((r = n(0)),
        (function (e) {
          var t = r,
            n = t.lib,
            o = n.WordArray,
            i = n.Hasher,
            c = t.algo,
            u = [],
            a = [];
          !(function () {
            function t(t) {
              for (var n = e.sqrt(t), r = 2; r <= n; r++) if (!(t % r)) return !1;
              return !0;
            }
            function n(e) {
              return (4294967296 * (e - (0 | e))) | 0;
            }
            for (var r = 2, o = 0; o < 64; )
              t(r) && (o < 8 && (u[o] = n(e.pow(r, 0.5))), (a[o] = n(e.pow(r, 1 / 3))), o++), r++;
          })();
          var s = [],
            f = (c.SHA256 = i.extend({
              _doReset: function () {
                this._hash = new o.init(u.slice(0));
              },
              _doProcessBlock: function (e, t) {
                for (
                  var n = this._hash.words,
                    r = n[0],
                    o = n[1],
                    i = n[2],
                    c = n[3],
                    u = n[4],
                    f = n[5],
                    l = n[6],
                    p = n[7],
                    h = 0;
                  h < 64;
                  h++
                ) {
                  if (h < 16) s[h] = 0 | e[t + h];
                  else {
                    var y = s[h - 15],
                      b = ((y << 25) | (y >>> 7)) ^ ((y << 14) | (y >>> 18)) ^ (y >>> 3),
                      g = s[h - 2],
                      d = ((g << 15) | (g >>> 17)) ^ ((g << 13) | (g >>> 19)) ^ (g >>> 10);
                    s[h] = b + s[h - 7] + d + s[h - 16];
                  }
                  var v = (r & o) ^ (r & i) ^ (o & i),
                    w =
                      ((r << 30) | (r >>> 2)) ^ ((r << 19) | (r >>> 13)) ^ ((r << 10) | (r >>> 22)),
                    m =
                      p +
                      (((u << 26) | (u >>> 6)) ^
                        ((u << 21) | (u >>> 11)) ^
                        ((u << 7) | (u >>> 25))) +
                      ((u & f) ^ (~u & l)) +
                      a[h] +
                      s[h];
                  (p = l),
                    (l = f),
                    (f = u),
                    (u = (c + m) | 0),
                    (c = i),
                    (i = o),
                    (o = r),
                    (r = (m + (w + v)) | 0);
                }
                (n[0] = (n[0] + r) | 0),
                  (n[1] = (n[1] + o) | 0),
                  (n[2] = (n[2] + i) | 0),
                  (n[3] = (n[3] + c) | 0),
                  (n[4] = (n[4] + u) | 0),
                  (n[5] = (n[5] + f) | 0),
                  (n[6] = (n[6] + l) | 0),
                  (n[7] = (n[7] + p) | 0);
              },
              _doFinalize: function () {
                var t = this._data,
                  n = t.words,
                  r = 8 * this._nDataBytes,
                  o = 8 * t.sigBytes;
                return (
                  (n[o >>> 5] |= 128 << (24 - (o % 32))),
                  (n[14 + (((o + 64) >>> 9) << 4)] = e.floor(r / 4294967296)),
                  (n[15 + (((o + 64) >>> 9) << 4)] = r),
                  (t.sigBytes = 4 * n.length),
                  this._process(),
                  this._hash
                );
              },
              clone: function () {
                var e = i.clone.call(this);
                return (e._hash = this._hash.clone()), e;
              },
            }));
          (t.SHA256 = i._createHelper(f)), (t.HmacSHA256 = i._createHmacHelper(f));
        })(Math),
        r.SHA256);
    },
    function (e, t, n) {
      var r;
      e.exports =
        ((r = n(0)),
        n(3),
        (function () {
          var e = r,
            t = e.lib.Hasher,
            n = e.x64,
            o = n.Word,
            i = n.WordArray,
            c = e.algo;
          function u() {
            return o.create.apply(o, arguments);
          }
          var a = [
              u(1116352408, 3609767458),
              u(1899447441, 602891725),
              u(3049323471, 3964484399),
              u(3921009573, 2173295548),
              u(961987163, 4081628472),
              u(1508970993, 3053834265),
              u(2453635748, 2937671579),
              u(2870763221, 3664609560),
              u(3624381080, 2734883394),
              u(310598401, 1164996542),
              u(607225278, 1323610764),
              u(1426881987, 3590304994),
              u(1925078388, 4068182383),
              u(2162078206, 991336113),
              u(2614888103, 633803317),
              u(3248222580, 3479774868),
              u(3835390401, 2666613458),
              u(4022224774, 944711139),
              u(264347078, 2341262773),
              u(604807628, 2007800933),
              u(770255983, 1495990901),
              u(1249150122, 1856431235),
              u(1555081692, 3175218132),
              u(1996064986, 2198950837),
              u(2554220882, 3999719339),
              u(2821834349, 766784016),
              u(2952996808, 2566594879),
              u(3210313671, 3203337956),
              u(3336571891, 1034457026),
              u(3584528711, 2466948901),
              u(113926993, 3758326383),
              u(338241895, 168717936),
              u(666307205, 1188179964),
              u(773529912, 1546045734),
              u(1294757372, 1522805485),
              u(1396182291, 2643833823),
              u(1695183700, 2343527390),
              u(1986661051, 1014477480),
              u(2177026350, 1206759142),
              u(2456956037, 344077627),
              u(2730485921, 1290863460),
              u(2820302411, 3158454273),
              u(3259730800, 3505952657),
              u(3345764771, 106217008),
              u(3516065817, 3606008344),
              u(3600352804, 1432725776),
              u(4094571909, 1467031594),
              u(275423344, 851169720),
              u(430227734, 3100823752),
              u(506948616, 1363258195),
              u(659060556, 3750685593),
              u(883997877, 3785050280),
              u(958139571, 3318307427),
              u(1322822218, 3812723403),
              u(1537002063, 2003034995),
              u(1747873779, 3602036899),
              u(1955562222, 1575990012),
              u(2024104815, 1125592928),
              u(2227730452, 2716904306),
              u(2361852424, 442776044),
              u(2428436474, 593698344),
              u(2756734187, 3733110249),
              u(3204031479, 2999351573),
              u(3329325298, 3815920427),
              u(3391569614, 3928383900),
              u(3515267271, 566280711),
              u(3940187606, 3454069534),
              u(4118630271, 4000239992),
              u(116418474, 1914138554),
              u(174292421, 2731055270),
              u(289380356, 3203993006),
              u(460393269, 320620315),
              u(685471733, 587496836),
              u(852142971, 1086792851),
              u(1017036298, 365543100),
              u(1126000580, 2618297676),
              u(1288033470, 3409855158),
              u(1501505948, 4234509866),
              u(1607167915, 987167468),
              u(1816402316, 1246189591),
            ],
            s = [];
          !(function () {
            for (var e = 0; e < 80; e++) s[e] = u();
          })();
          var f = (c.SHA512 = t.extend({
            _doReset: function () {
              this._hash = new i.init([
                new o.init(1779033703, 4089235720),
                new o.init(3144134277, 2227873595),
                new o.init(1013904242, 4271175723),
                new o.init(2773480762, 1595750129),
                new o.init(1359893119, 2917565137),
                new o.init(2600822924, 725511199),
                new o.init(528734635, 4215389547),
                new o.init(1541459225, 327033209),
              ]);
            },
            _doProcessBlock: function (e, t) {
              for (
                var n = this._hash.words,
                  r = n[0],
                  o = n[1],
                  i = n[2],
                  c = n[3],
                  u = n[4],
                  f = n[5],
                  l = n[6],
                  p = n[7],
                  h = r.high,
                  y = r.low,
                  b = o.high,
                  g = o.low,
                  d = i.high,
                  v = i.low,
                  w = c.high,
                  m = c.low,
                  O = u.high,
                  j = u.low,
                  _ = f.high,
                  S = f.low,
                  P = l.high,
                  k = l.low,
                  x = p.high,
                  E = p.low,
                  H = h,
                  A = y,
                  B = b,
                  D = g,
                  C = d,
                  R = v,
                  z = w,
                  T = m,
                  M = O,
                  I = j,
                  U = _,
                  F = S,
                  K = P,
                  N = k,
                  W = x,
                  X = E,
                  L = 0;
                L < 80;
                L++
              ) {
                var G = s[L];
                if (L < 16)
                  var J = (G.high = 0 | e[t + 2 * L]),
                    Q = (G.low = 0 | e[t + 2 * L + 1]);
                else {
                  var V = s[L - 15],
                    $ = V.high,
                    Y = V.low,
                    Z = (($ >>> 1) | (Y << 31)) ^ (($ >>> 8) | (Y << 24)) ^ ($ >>> 7),
                    q = ((Y >>> 1) | ($ << 31)) ^ ((Y >>> 8) | ($ << 24)) ^ ((Y >>> 7) | ($ << 25)),
                    ee = s[L - 2],
                    te = ee.high,
                    ne = ee.low,
                    re = ((te >>> 19) | (ne << 13)) ^ ((te << 3) | (ne >>> 29)) ^ (te >>> 6),
                    oe =
                      ((ne >>> 19) | (te << 13)) ^
                      ((ne << 3) | (te >>> 29)) ^
                      ((ne >>> 6) | (te << 26)),
                    ie = s[L - 7],
                    ce = ie.high,
                    ue = ie.low,
                    ae = s[L - 16],
                    se = ae.high,
                    fe = ae.low;
                  (J =
                    (J =
                      (J = Z + ce + ((Q = q + ue) >>> 0 < q >>> 0 ? 1 : 0)) +
                      re +
                      ((Q += oe) >>> 0 < oe >>> 0 ? 1 : 0)) +
                    se +
                    ((Q += fe) >>> 0 < fe >>> 0 ? 1 : 0)),
                    (G.high = J),
                    (G.low = Q);
                }
                var le,
                  pe = (M & U) ^ (~M & K),
                  he = (I & F) ^ (~I & N),
                  ye = (H & B) ^ (H & C) ^ (B & C),
                  be = (A & D) ^ (A & R) ^ (D & R),
                  ge = ((H >>> 28) | (A << 4)) ^ ((H << 30) | (A >>> 2)) ^ ((H << 25) | (A >>> 7)),
                  de = ((A >>> 28) | (H << 4)) ^ ((A << 30) | (H >>> 2)) ^ ((A << 25) | (H >>> 7)),
                  ve =
                    ((M >>> 14) | (I << 18)) ^ ((M >>> 18) | (I << 14)) ^ ((M << 23) | (I >>> 9)),
                  we =
                    ((I >>> 14) | (M << 18)) ^ ((I >>> 18) | (M << 14)) ^ ((I << 23) | (M >>> 9)),
                  me = a[L],
                  Oe = me.high,
                  je = me.low,
                  _e = W + ve + ((le = X + we) >>> 0 < X >>> 0 ? 1 : 0),
                  Se = de + be;
                (W = K),
                  (X = N),
                  (K = U),
                  (N = F),
                  (U = M),
                  (F = I),
                  (M =
                    (z +
                      (_e =
                        (_e =
                          (_e = _e + pe + ((le += he) >>> 0 < he >>> 0 ? 1 : 0)) +
                          Oe +
                          ((le += je) >>> 0 < je >>> 0 ? 1 : 0)) +
                        J +
                        ((le += Q) >>> 0 < Q >>> 0 ? 1 : 0)) +
                      ((I = (T + le) | 0) >>> 0 < T >>> 0 ? 1 : 0)) |
                    0),
                  (z = C),
                  (T = R),
                  (C = B),
                  (R = D),
                  (B = H),
                  (D = A),
                  (H =
                    (_e +
                      (ge + ye + (Se >>> 0 < de >>> 0 ? 1 : 0)) +
                      ((A = (le + Se) | 0) >>> 0 < le >>> 0 ? 1 : 0)) |
                    0);
              }
              (y = r.low = y + A),
                (r.high = h + H + (y >>> 0 < A >>> 0 ? 1 : 0)),
                (g = o.low = g + D),
                (o.high = b + B + (g >>> 0 < D >>> 0 ? 1 : 0)),
                (v = i.low = v + R),
                (i.high = d + C + (v >>> 0 < R >>> 0 ? 1 : 0)),
                (m = c.low = m + T),
                (c.high = w + z + (m >>> 0 < T >>> 0 ? 1 : 0)),
                (j = u.low = j + I),
                (u.high = O + M + (j >>> 0 < I >>> 0 ? 1 : 0)),
                (S = f.low = S + F),
                (f.high = _ + U + (S >>> 0 < F >>> 0 ? 1 : 0)),
                (k = l.low = k + N),
                (l.high = P + K + (k >>> 0 < N >>> 0 ? 1 : 0)),
                (E = p.low = E + X),
                (p.high = x + W + (E >>> 0 < X >>> 0 ? 1 : 0));
            },
            _doFinalize: function () {
              var e = this._data,
                t = e.words,
                n = 8 * this._nDataBytes,
                r = 8 * e.sigBytes;
              return (
                (t[r >>> 5] |= 128 << (24 - (r % 32))),
                (t[30 + (((r + 128) >>> 10) << 5)] = Math.floor(n / 4294967296)),
                (t[31 + (((r + 128) >>> 10) << 5)] = n),
                (e.sigBytes = 4 * t.length),
                this._process(),
                this._hash.toX32()
              );
            },
            clone: function () {
              var e = t.clone.call(this);
              return (e._hash = this._hash.clone()), e;
            },
            blockSize: 32,
          }));
          (e.SHA512 = t._createHelper(f)), (e.HmacSHA512 = t._createHmacHelper(f));
        })(),
        r.SHA512);
    },
    function (e, t, n) {
      'use strict';
      n.r(t);
      var r,
        o = n(0),
        i = n.n(o),
        c = n(4),
        u = n.n(c),
        a = n(5),
        s = n.n(a),
        f = n(6),
        l = n.n(f),
        p = n(2),
        h = n.n(p);
      function y(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r);
        }
        return n;
      }
      function b(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? y(Object(n), !0).forEach(function (t) {
                g(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : y(Object(n)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                });
        }
        return e;
      }
      function g(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function d(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          (r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            'value' in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r);
        }
      }
      function v(e) {
        return Object.keys(e).map(function (t) {
          return e[t];
        });
      }
      !(function (e) {
        (e.SHA1 = 'sha1'), (e.SHA256 = 'sha256'), (e.SHA512 = 'sha512');
      })(r || (r = {}));
      var w,
        m = v(r);
      !(function (e) {
        (e.ASCII = 'ascii'),
          (e.BASE64 = 'base64'),
          (e.HEX = 'hex'),
          (e.LATIN1 = 'latin1'),
          (e.UTF8 = 'utf8');
      })(w || (w = {}));
      var O,
        j = v(w);
      !(function (e) {
        (e.HOTP = 'hotp'), (e.TOTP = 'totp');
      })(O || (O = {}));
      var _ = v(O),
        S = function () {
          throw new Error('Please provide an options.createDigest implementation.');
        };
      function P(e) {
        return /^(\d+)$/.test(e);
      }
      function k(e, t, n) {
        if (e.length >= t) return e;
        var r = Array(t + 1).join(n);
        return ''
          .concat(r)
          .concat(e)
          .slice(-1 * t);
      }
      function x(e) {
        var t = 'otpauth://'.concat(e.type, '/{labelPrefix}:{accountName}?secret={secret}{query}'),
          n = [];
        if (_.indexOf(e.type) < 0)
          throw new Error(
            'Expecting options.type to be one of '
              .concat(_.join(', '), '. Received ')
              .concat(e.type, '.')
          );
        if ('hotp' === e.type) {
          if (null == e.counter || 'number' != typeof e.counter)
            throw new Error(
              'Expecting options.counter to be a number when options.type is "hotp".'
            );
          n.push('&counter='.concat(e.counter));
        }
        return (
          'totp' === e.type && e.step && n.push('&period='.concat(e.step)),
          e.digits && n.push('&digits='.concat(e.digits)),
          e.algorithm && n.push('&algorithm='.concat(e.algorithm.toUpperCase())),
          e.issuer && n.push('&issuer='.concat(encodeURIComponent(e.issuer))),
          t
            .replace('{labelPrefix}', encodeURIComponent(e.issuer || e.accountName))
            .replace('{accountName}', encodeURIComponent(e.accountName))
            .replace('{secret}', e.secret)
            .replace('{query}', n.join(''))
        );
      }
      function E(e) {
        return (E =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (e) {
                return typeof e;
              }
            : function (e) {
                return e &&
                  'function' == typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? 'symbol'
                  : typeof e;
              })(e);
      }
      function H(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          (r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            'value' in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r);
        }
      }
      function A(e, t) {
        return !t || ('object' !== E(t) && 'function' != typeof t)
          ? (function (e) {
              if (void 0 === e)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return e;
            })(e)
          : t;
      }
      function B(e) {
        return (B = Object.setPrototypeOf
          ? Object.getPrototypeOf
          : function (e) {
              return e.__proto__ || Object.getPrototypeOf(e);
            })(e);
      }
      function D(e, t) {
        return (D =
          Object.setPrototypeOf ||
          function (e, t) {
            return (e.__proto__ = t), e;
          })(e, t);
      }
      function C(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r);
        }
        return n;
      }
      function R(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function z(e) {
        if ('function' != typeof e.createDigest)
          throw new Error('Expecting options.createDigest to be a function.');
        if ('function' != typeof e.createHmacKey)
          throw new Error('Expecting options.createHmacKey to be a function.');
        if ('number' != typeof e.digits)
          throw new Error('Expecting options.digits to be a number.');
        if (!e.algorithm || m.indexOf(e.algorithm) < 0)
          throw new Error(
            'Expecting options.algorithm to be one of '
              .concat(m.join(', '), '. Received ')
              .concat(e.algorithm, '.')
          );
        if (!e.encoding || j.indexOf(e.encoding) < 0)
          throw new Error(
            'Expecting options.encoding to be one of '
              .concat(j.join(', '), '. Received ')
              .concat(e.encoding, '.')
          );
      }
      var T = function (e, t, n) {
        return Buffer.from(t, n).toString('hex');
      };
      function M(e) {
        var t = (function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? C(Object(n), !0).forEach(function (t) {
                  R(e, t, n[t]);
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : C(Object(n)).forEach(function (t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                  });
          }
          return e;
        })(
          {},
          { algorithm: r.SHA1, createHmacKey: T, createDigest: S, digits: 6, encoding: w.ASCII },
          {},
          e
        );
        return z(t), Object.freeze(t);
      }
      function I(e, t, n) {
        var r = (function (e) {
            return k(e.toString(16), 16, '0');
          })(t),
          o = n.createHmacKey(n.algorithm, e, n.encoding);
        return n.createDigest(n.algorithm, o, r);
      }
      function U(e, t, n) {
        return (function (e, t) {
          var n = Buffer.from(e, 'hex'),
            r = 15 & n[n.length - 1],
            o =
              (((127 & n[r]) << 24) |
                ((255 & n[r + 1]) << 16) |
                ((255 & n[r + 2]) << 8) |
                (255 & n[r + 3])) %
              Math.pow(10, t);
          return k(String(o), t, '0');
        })(n.digest || I(e, t, n), n.digits);
      }
      function F(e, t, n, r, o) {
        return x({
          algorithm: o.algorithm,
          digits: o.digits,
          type: O.HOTP,
          accountName: e,
          counter: r,
          issuer: t,
          secret: n,
        });
      }
      var K = (function (e) {
        function t() {
          return (
            (function (e, t) {
              if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            })(this, t),
            A(this, B(t).apply(this, arguments))
          );
        }
        var n, r, o;
        return (
          (function (e, t) {
            if ('function' != typeof t && null !== t)
              throw new TypeError('Super expression must either be null or a function');
            (e.prototype = Object.create(t && t.prototype, {
              constructor: { value: e, writable: !0, configurable: !0 },
            })),
              t && D(e, t);
          })(t, e),
          (n = t),
          (r = [
            {
              key: 'create',
              value: function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                return new t(e);
              },
            },
            {
              key: 'allOptions',
              value: function () {
                return M(this.options);
              },
            },
            {
              key: 'generate',
              value: function (e, t) {
                return U(e, t, this.allOptions());
              },
            },
            {
              key: 'check',
              value: function (e, t, n) {
                return (function (e, t, n, r) {
                  return !!P(e) && e === U(t, n, r);
                })(e, t, n, this.allOptions());
              },
            },
            {
              key: 'verify',
              value: function (e) {
                if ('object' !== E(e))
                  throw new Error('Expecting argument 0 of verify to be an object');
                return this.check(e.token, e.secret, e.counter);
              },
            },
            {
              key: 'keyuri',
              value: function (e, t, n, r) {
                return F(e, t, n, r, this.allOptions());
              },
            },
          ]) && H(n.prototype, r),
          o && H(n, o),
          t
        );
      })(
        (function () {
          function e() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            !(function (e, t) {
              if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            })(this, e),
              (this._defaultOptions = Object.freeze(b({}, t))),
              (this._options = Object.freeze({}));
          }
          var t, n, r;
          return (
            (t = e),
            (n = [
              {
                key: 'create',
                value: function () {
                  var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                  return new e(t);
                },
              },
              {
                key: 'clone',
                value: function () {
                  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                    t = this.create(b({}, this._defaultOptions, {}, e));
                  return (t.options = this._options), t;
                },
              },
              {
                key: 'allOptions',
                value: function () {
                  return this.options;
                },
              },
              {
                key: 'resetOptions',
                value: function () {
                  this._options = Object.freeze({});
                },
              },
              {
                key: 'options',
                get: function () {
                  return Object.freeze(b({}, this._defaultOptions, {}, this._options));
                },
                set: function (e) {
                  this._options = Object.freeze(b({}, this._options, {}, e));
                },
              },
            ]) && d(t.prototype, n),
            r && d(t, r),
            e
          );
        })()
      );
      function N(e) {
        return (N =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (e) {
                return typeof e;
              }
            : function (e) {
                return e &&
                  'function' == typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? 'symbol'
                  : typeof e;
              })(e);
      }
      function W(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          (r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            'value' in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r);
        }
      }
      function X(e, t) {
        return !t || ('object' !== N(t) && 'function' != typeof t)
          ? (function (e) {
              if (void 0 === e)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return e;
            })(e)
          : t;
      }
      function L(e) {
        return (L = Object.setPrototypeOf
          ? Object.getPrototypeOf
          : function (e) {
              return e.__proto__ || Object.getPrototypeOf(e);
            })(e);
      }
      function G(e, t) {
        return (G =
          Object.setPrototypeOf ||
          function (e, t) {
            return (e.__proto__ = t), e;
          })(e, t);
      }
      function J(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r);
        }
        return n;
      }
      function Q(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? J(Object(n), !0).forEach(function (t) {
                V(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : J(Object(n)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                });
        }
        return e;
      }
      function V(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function $(e, t) {
        return (
          (function (e) {
            if (Array.isArray(e)) return e;
          })(e) ||
          (function (e, t) {
            if (
              !(
                Symbol.iterator in Object(e) ||
                '[object Arguments]' === Object.prototype.toString.call(e)
              )
            )
              return;
            var n = [],
              r = !0,
              o = !1,
              i = void 0;
            try {
              for (
                var c, u = e[Symbol.iterator]();
                !(r = (c = u.next()).done) && (n.push(c.value), !t || n.length !== t);
                r = !0
              );
            } catch (e) {
              (o = !0), (i = e);
            } finally {
              try {
                r || null == u.return || u.return();
              } finally {
                if (o) throw i;
              }
            }
            return n;
          })(e, t) ||
          (function () {
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
          })()
        );
      }
      function Y(e) {
        if ('number' == typeof e) return [Math.abs(e), Math.abs(e)];
        if (Array.isArray(e)) {
          var t = $(e, 2),
            n = t[0],
            r = t[1];
          if ('number' == typeof n && 'number' == typeof r) return [Math.abs(n), Math.abs(r)];
        }
        throw new Error('Expecting options.window to be an number or [number, number].');
      }
      function Z(e) {
        if ((z(e), Y(e.window), 'number' != typeof e.epoch))
          throw new Error('Expecting options.epoch to be a number.');
        if ('number' != typeof e.step) throw new Error('Expecting options.step to be a number.');
      }
      var q = function (e, t, n) {
          var r = e.length,
            o = Buffer.from(e, t).toString('hex');
          if (r < n) {
            var i = new Array(n - r + 1).join(o);
            return Buffer.from(i, 'hex').slice(0, n).toString('hex');
          }
          return o;
        },
        ee = function (e, t, n) {
          switch (e) {
            case r.SHA1:
              return q(t, n, 20);
            case r.SHA256:
              return q(t, n, 32);
            case r.SHA512:
              return q(t, n, 64);
            default:
              throw new Error(
                'Expecting algorithm to be one of '
                  .concat(m.join(', '), '. Received ')
                  .concat(e, '.')
              );
          }
        };
      function te(e) {
        var t = Q(
          {},
          {
            algorithm: r.SHA1,
            createDigest: S,
            createHmacKey: ee,
            digits: 6,
            encoding: w.ASCII,
            epoch: Date.now(),
            step: 30,
            window: 0,
          },
          {},
          e
        );
        return Z(t), Object.freeze(t);
      }
      function ne(e, t) {
        var n, r;
        return U(e, ((n = t.epoch), (r = t.step), Math.floor(n / r / 1e3)), t);
      }
      function re(e, t, n, r) {
        var o = [];
        if (0 === r) return o;
        for (var i = 1; i <= r; i++) {
          var c = t * i * n;
          o.push(e + c);
        }
        return o;
      }
      function oe(e, t, n) {
        return !!P(e) && e === ne(t, n);
      }
      function ie(e, t, n, r) {
        var o = null;
        return (
          e.some(function (e, i) {
            return !!oe(t, n, Q({}, r, { epoch: e })) && ((o = i + 1), !0);
          }),
          o
        );
      }
      function ce(e, t, n) {
        if (oe(e, t, n)) return 0;
        var r,
          o,
          i,
          c,
          u,
          a =
            ((r = n.epoch),
            (o = n.step),
            (i = n.window),
            (c = Y(i)),
            { current: r, past: re(r, -1, (u = 1e3 * o), c[0]), future: re(r, 1, u, c[1]) }),
          s = ie(a.past, e, t, n);
        return null !== s ? -1 * s : ie(a.future, e, t, n);
      }
      function ue(e, t) {
        return Math.floor(e / 1e3) % t;
      }
      function ae(e, t, n, r) {
        return x({
          algorithm: r.algorithm,
          digits: r.digits,
          step: r.step,
          type: O.TOTP,
          accountName: e,
          issuer: t,
          secret: n,
        });
      }
      var se = (function (e) {
        function t() {
          return (
            (function (e, t) {
              if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
            })(this, t),
            X(this, L(t).apply(this, arguments))
          );
        }
        var n, r, o;
        return (
          (function (e, t) {
            if ('function' != typeof t && null !== t)
              throw new TypeError('Super expression must either be null or a function');
            (e.prototype = Object.create(t && t.prototype, {
              constructor: { value: e, writable: !0, configurable: !0 },
            })),
              t && G(e, t);
          })(t, e),
          (n = t),
          (r = [
            {
              key: 'create',
              value: function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                return new t(e);
              },
            },
            {
              key: 'allOptions',
              value: function () {
                return te(this.options);
              },
            },
            {
              key: 'generate',
              value: function (e) {
                return ne(e, this.allOptions());
              },
            },
            {
              key: 'checkDelta',
              value: function (e, t) {
                return ce(e, t, this.allOptions());
              },
            },
            {
              key: 'check',
              value: function (e, t) {
                return 'number' == typeof this.checkDelta(e, t);
              },
            },
            {
              key: 'verify',
              value: function (e) {
                if ('object' !== N(e))
                  throw new Error('Expecting argument 0 of verify to be an object');
                return this.check(e.token, e.secret);
              },
            },
            {
              key: 'timeRemaining',
              value: function () {
                var e,
                  t,
                  n = this.allOptions();
                return (e = n.epoch), (t = n.step) - ue(e, t);
              },
            },
            {
              key: 'timeUsed',
              value: function () {
                var e = this.allOptions();
                return ue(e.epoch, e.step);
              },
            },
            {
              key: 'keyuri',
              value: function (e, t, n) {
                return ae(e, t, n, this.allOptions());
              },
            },
          ]) && W(n.prototype, r),
          o && W(n, o),
          t
        );
      })(K);
      function fe(e) {
        return (fe =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (e) {
                return typeof e;
              }
            : function (e) {
                return e &&
                  'function' == typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? 'symbol'
                  : typeof e;
              })(e);
      }
      function le(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          (r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            'value' in r && (r.writable = !0),
            Object.defineProperty(e, r.key, r);
        }
      }
      function pe(e, t) {
        return !t || ('object' !== fe(t) && 'function' != typeof t)
          ? (function (e) {
              if (void 0 === e)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return e;
            })(e)
          : t;
      }
      function he(e) {
        return (he = Object.setPrototypeOf
          ? Object.getPrototypeOf
          : function (e) {
              return e.__proto__ || Object.getPrototypeOf(e);
            })(e);
      }
      function ye(e, t) {
        return (ye =
          Object.setPrototypeOf ||
          function (e, t) {
            return (e.__proto__ = t), e;
          })(e, t);
      }
      function be(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r);
        }
        return n;
      }
      function ge(e, t, n) {
        return (
          t in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      function de(e) {
        var t = (function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? be(Object(n), !0).forEach(function (t) {
                  ge(e, t, n[t]);
                })
              : Object.getOwnPropertyDescriptors
                ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
                : be(Object(n)).forEach(function (t) {
                    Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                  });
          }
          return e;
        })(
          {},
          {
            algorithm: r.SHA1,
            createDigest: S,
            createHmacKey: ee,
            digits: 6,
            encoding: w.HEX,
            epoch: Date.now(),
            step: 30,
            window: 0,
          },
          {},
          e
        );
        return (
          (function (e) {
            if ((Z(e), 'function' != typeof e.keyDecoder))
              throw new Error('Expecting options.keyDecoder to be a function.');
            if (e.keyEncoder && 'function' != typeof e.keyEncoder)
              throw new Error('Expecting options.keyEncoder to be a function.');
          })(t),
          Object.freeze(t)
        );
      }
      function ve(e, t) {
        return t.keyEncoder(e, t.encoding);
      }
      function we(e, t) {
        return t.keyDecoder(e, t.encoding);
      }
      function me(e, t) {
        return ve(t.createRandomBytes(e, t.encoding), t);
      }
      var Oe = (function (e) {
          function t() {
            return (
              (function (e, t) {
                if (!(e instanceof t)) throw new TypeError('Cannot call a class as a function');
              })(this, t),
              pe(this, he(t).apply(this, arguments))
            );
          }
          var n, r, o;
          return (
            (function (e, t) {
              if ('function' != typeof t && null !== t)
                throw new TypeError('Super expression must either be null or a function');
              (e.prototype = Object.create(t && t.prototype, {
                constructor: { value: e, writable: !0, configurable: !0 },
              })),
                t && ye(e, t);
            })(t, e),
            (n = t),
            (r = [
              {
                key: 'create',
                value: function () {
                  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                  return new t(e);
                },
              },
              {
                key: 'allOptions',
                value: function () {
                  return de(this.options);
                },
              },
              {
                key: 'generate',
                value: function (e) {
                  return (function (e, t) {
                    return ne(we(e, t), t);
                  })(e, this.allOptions());
                },
              },
              {
                key: 'checkDelta',
                value: function (e, t) {
                  return (function (e, t, n) {
                    return ce(e, we(t, n), n);
                  })(e, t, this.allOptions());
                },
              },
              {
                key: 'encode',
                value: function (e) {
                  return ve(e, this.allOptions());
                },
              },
              {
                key: 'decode',
                value: function (e) {
                  return we(e, this.allOptions());
                },
              },
              {
                key: 'generateSecret',
                value: function () {
                  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 10;
                  return me(e, this.allOptions());
                },
              },
            ]) && le(n.prototype, r),
            o && le(n, o),
            t
          );
        })(se),
        je = i.a.lib.WordArray;
      var _e = function (e, t, n) {
          var o = (function (e) {
              switch (e) {
                case r.SHA1:
                  return u.a;
                case r.SHA256:
                  return s.a;
                case r.SHA512:
                  return l.a;
                default:
                  throw new Error(
                    'Expecting argument 0 to be one of '
                      .concat(m.join(', '), '. Received ')
                      .concat(e, '.')
                  );
              }
            })(e),
            i = h.a.parse(n),
            c = h.a.parse(t);
          return String(o(i, c));
        },
        Se = n(7),
        Pe = n.n(Se),
        ke = n(8),
        xe = n.n(ke);
      function Ee(e) {
        return (Ee =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (e) {
                return typeof e;
              }
            : function (e) {
                return e &&
                  'function' == typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? 'symbol'
                  : typeof e;
              })(e);
      }
      n.d(t, 'hotp', function () {
        return He;
      }),
        n.d(t, 'totp', function () {
          return Ae;
        }),
        n.d(t, 'authenticator', function () {
          return Be;
        }),
        'object' === ('undefined' == typeof window ? 'undefined' : Ee(window)) &&
          void 0 === window.Buffer &&
          (window.Buffer = buffer.Buffer);
      var He = new K({ createDigest: _e }),
        Ae = new se({ createDigest: _e }),
        Be = new Oe({
          createDigest: _e,
          createRandomBytes: function (e, t) {
            var n = je.random(e);
            return Buffer.from(n.toString(), 'hex').toString(t);
          },
          keyDecoder: function (e, t) {
            var n = Pe()(e.toUpperCase(), 'RFC4648');
            return Buffer.from(n).toString(t);
          },
          keyEncoder: function (e, t) {
            return xe()(Buffer.from(e, t), 'RFC4648', { padding: !1 });
          },
        });
    },
  ]);
});
//# sourceMappingURL=index.js.map
