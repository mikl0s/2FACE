/*
CryptoJS v3.1.2 - HMAC-SHA1
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
*/
(function () {
    var k = CryptoJS,
        b = k.lib,
        m = b.Base,
        c = b.WordArray,
        l = k.algo,
        s = l.HMAC = m.extend({
            init: function (a, b) {
                a = this._hasher = new a.init;
                "string" == typeof b && (b = c.create(c.parse(b)));
                var e = a.blockSize,
                    f = 4 * e;
                b.sigBytes > f && (b = a.finalize(b));
                b.clamp();
                for (var d = this._oKey = b.clone(), g = this._iKey = b.clone(), h = d.words, i = g.words, j = 0; j < e; j++) h[j] ^= 1549556828, i[j] ^= 909522486;
                d.sigBytes = g.sigBytes = f;
                this.reset()
            },
            reset: function () {
                var a = this._hasher;
                a.reset();
                a.update(this._iKey)
            },
            update: function (a) {
                this._hasher.update(a);
                return this
            },
            finalize: function (a) {
                var b = this._hasher;
                a = b.finalize(a);
                b.reset();
                return b.finalize(this._oKey.clone().concat(a))
            }
        });
    k.HMAC = function (a, b, c) {
        return new s.init(a, b).finalize(c)
    }
})();