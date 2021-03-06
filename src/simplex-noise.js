/*! simplex-noise.js: copyright 2012 Jonas Wagner, licensed under a MIT license. See https://github.com/jwagner/simplex-noise.js for details */
(function () {
    function o(e) {
        e || (e = Math.random), this.p = new Uint8Array(256), this.perm = new Uint8Array(512), this.permMod12 = new Uint8Array(512);
        for (var t = 0; t < 256; t++)this.p[t] = e() * 256;
        for (t = 0; t < 512; t++)this.perm[t] = this.p[t & 255], this.permMod12[t] = this.perm[t] % 12
    }

    var e = .5 * (Math.sqrt(3) - 1), t = (3 - Math.sqrt(3)) / 6, n = 1 / 3, r = 1 / 6, i = (Math.sqrt(5) - 1) / 4, s = (5 - Math.sqrt(5)) / 20;
    o.prototype = {grad3: new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1]), grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1, -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1, 1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1, -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]), noise2D: function (n, r) {
        var i = this.permMod12, s = this.perm, o = this.grad3, u, a, f, l = (n + r) * e, c = Math.floor(n + l), h = Math.floor(r + l), p = (c + h) * t, d = c - p, v = h - p, m = n - d, g = r - v, y, b;
        m > g ? (y = 1, b = 0) : (y = 0, b = 1);
        var w = m - y + t, E = g - b + t, S = m - 1 + 2 * t, x = g - 1 + 2 * t, T = c & 255, N = h & 255, C = .5 - m * m - g * g;
        if (C < 0)u = 0; else {
            var k = i[T + s[N]] * 3;
            C *= C, u = C * C * (o[k] * m + o[k + 1] * g)
        }
        var L = .5 - w * w - E * E;
        if (L < 0)a = 0; else {
            var A = i[T + y + s[N + b]] * 3;
            L *= L, a = L * L * (o[A] * w + o[A + 1] * E)
        }
        var O = .5 - S * S - x * x;
        if (O < 0)f = 0; else {
            var M = i[T + 1 + s[N + 1]] * 3;
            O *= O, f = O * O * (o[M] * S + o[M + 1] * x)
        }
        return 70 * (u + a + f)
    }, noise3D: function (e, t, i) {
        var s = this.permMod12, o = this.perm, u = this.grad3, a, f, l, c, h = (e + t + i) * n, p = Math.floor(e + h), d = Math.floor(t + h), v = Math.floor(i + h), m = (p + d + v) * r, g = p - m, y = d - m, b = v - m, w = e - g, E = t - y, S = i - b, x, T, N, C, k, L;
        w < E ? E < S ? (x = 0, T = 0, N = 1, C = 0, k = 1, L = 1) : w < S ? (x = 0, T = 1, N = 0, C = 0, k = 1, L = 1) : (x = 0, T = 1, N = 0, C = 1, k = 1, L = 0) : E < S ? w < S ? (x = 0, T = 0, N = 1, C = 1, k = 0, L = 1) : (x = 1, T = 0, N = 0, C = 1, k = 0, L = 1) : (x = 1, T = 0, N = 0, C = 1, k = 1, L = 0);
        var A = w - x + r, O = E - T + r, M = S - N + r, _ = w - C + 2 * r, D = E - k + 2 * r, P = S - L + 2 * r, H = w - 1 + 3 * r, B = E - 1 + 3 * r, j = S - 1 + 3 * r, F = p & 255, I = d & 255, q = v & 255, R = .6 - w * w - E * E - S * S;
        if (R < 0)a = 0; else {
            var U = s[F + o[I + o[q]]] * 3;
            R *= R, a = R * R * (u[U] * w + u[U + 1] * E + u[U + 2] * S)
        }
        var z = .6 - A * A - O * O - M * M;
        if (z < 0)f = 0; else {
            var W = s[F + x + o[I + T + o[q + N]]] * 3;
            z *= z, f = z * z * (u[W] * A + u[W + 1] * O + u[W + 2] * M)
        }
        var X = .6 - _ * _ - D * D - P * P;
        if (X < 0)l = 0; else {
            var V = s[F + C + o[I + k + o[q + L]]] * 3;
            X *= X, l = X * X * (u[V] * _ + u[V + 1] * D + u[V + 2] * P)
        }
        var $ = .6 - H * H - B * B - j * j;
        if ($ < 0)c = 0; else {
            var J = s[F + 1 + o[I + 1 + o[q + 1]]] * 3;
            $ *= $, c = $ * $ * (u[J] * H + u[J + 1] * B + u[J + 2] * j)
        }
        return 32 * (a + f + l + c)
    }, noise4D: function (e, t, n, r) {
        var o = this.permMod12, u = this.perm, a = this.grad4, f, l, c, h, p, d = (e + t + n + r) * i, v = Math.floor(e + d), m = Math.floor(t + d), g = Math.floor(n + d), y = Math.floor(r + d), b = (v + m + g + y) * s, w = v - b, E = m - b, S = g - b, x = y - b, T = e - w, N = t - E, C = n - S, k = r - x, L = 0, A = 0, O = 0, M = 0;
        T > N ? L++ : A++, T > C ? L++ : O++, T > k ? L++ : M++, N > C ? A++ : O++, N > k ? A++ : M++, C > k ? O++ : M++;
        var _, D, P, H, B, j, F, I, q, R, U, z;
        _ = L < 3 ? 0 : 1, D = A < 3 ? 0 : 1, P = O < 3 ? 0 : 1, H = M < 3 ? 0 : 1, B = L < 2 ? 0 : 1, j = A < 2 ? 0 : 1, F = O < 2 ? 0 : 1, I = M < 2 ? 0 : 1, q = L < 1 ? 0 : 1, R = A < 1 ? 0 : 1, U = O < 1 ? 0 : 1, z = M < 1 ? 0 : 1;
        var W = T - _ + s, X = N - D + s, V = C - P + s, $ = k - H + s, J = T - B + 2 * s, K = N - j + 2 * s, Q = C - F + 2 * s, G = k - I + 2 * s, Y = T - q + 3 * s, Z = N - R + 3 * s, et = C - U + 3 * s, tt = k - z + 3 * s, nt = T - 1 + 4 * s, rt = N - 1 + 4 * s, it = C - 1 + 4 * s, st = k - 1 + 4 * s, ot = v & 255, ut = m & 255, at = g & 255, ft = y & 255, lt = .6 - T * T - N * N - C * C - k * k;
        if (lt < 0)f = 0; else {
            var ct = u[ot + u[ut + u[at + u[ft]]]] % 32 * 4;
            lt *= lt, f = lt * lt * (a[ct] * T + a[ct + 1] * N + a[ct + 2] * C + a[ct + 3] * k)
        }
        var ht = .6 - W * W - X * X - V * V - $ * $;
        if (ht < 0)l = 0; else {
            var pt = u[ot + _ + u[ut + D + u[at + P + u[ft + H]]]] % 32 * 4;
            ht *= ht, l = ht * ht * (a[pt] * W + a[pt + 1] * X + a[pt + 2] * V + a[pt + 3] * $)
        }
        var dt = .6 - J * J - K * K - Q * Q - G * G;
        if (dt < 0)c = 0; else {
            var vt = u[ot + B + u[ut + j + u[at + F + u[ft + I]]]] % 32 * 4;
            dt *= dt, c = dt * dt * (a[vt] * J + a[vt + 1] * K + a[vt + 2] * Q + a[vt + 3] * G)
        }
        var mt = .6 - Y * Y - Z * Z - et * et - tt * tt;
        if (mt < 0)h = 0; else {
            var gt = u[ot + q + u[ut + R + u[at + U + u[ft + z]]]] % 32 * 4;
            mt *= mt, h = mt * mt * (a[gt] * Y + a[gt + 1] * Z + a[gt + 2] * et + a[gt + 3] * tt)
        }
        var yt = .6 - nt * nt - rt * rt - it * it - st * st;
        if (yt < 0)p = 0; else {
            var bt = u[ot + 1 + u[ut + 1 + u[at + 1 + u[ft + 1]]]] % 32 * 4;
            yt *= yt, p = yt * yt * (a[bt] * nt + a[bt + 1] * rt + a[bt + 2] * it + a[bt + 3] * st)
        }
        return 27 * (f + l + c + h + p)
    }}, typeof define != "undefined" && define.amd ? define(function () {
        return o
    }) : typeof window != "undefined" && (window.SimplexNoise = o), typeof exports != "undefined" && (exports.SimplexNoise = o), typeof module != "undefined" && (module.exports = o)
})();